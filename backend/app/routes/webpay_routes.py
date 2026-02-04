from flask import Blueprint, request, jsonify, redirect
from app import db
from app.models import Order, OrderStatus
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.options import WebpayOptions
from transbank.common.integration_commerce_codes import IntegrationCommerceCodes
from transbank.common.integration_api_keys import IntegrationApiKeys
from transbank.common.integration_type import IntegrationType
import os

webpay_bp = Blueprint('webpay', __name__)

# Configuración Transbank (Integración por defecto)
# En producción, usar variables de entorno
# Configuración explícita del ejemplo para TEST
CC_TEST = "597055555532"
KEY_TEST = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"

env = os.environ.get('FLASK_ENV', 'development')

def get_transaction():
    if env == 'production':
        cc = os.environ.get('TBK_COMMERCE_CODE')
        key = os.environ.get('TBK_API_KEY')
        integration = IntegrationType.LIVE
        return Transaction(WebpayOptions(cc, key, integration))
    else:
        return Transaction(WebpayOptions(CC_TEST, KEY_TEST, IntegrationType.TEST))

@webpay_bp.route('/create', methods=['POST'])
def create_transaction():
    try:
        data = request.get_json()
        buy_order = str(data.get('buy_order'))
        session_id = str(data.get('session_id'))
        amount = data.get('amount')
        
        # Hardcode dev URL to avoid localhost resolution issues
        if env == 'development':
             return_url = "http://127.0.0.1:5000/backendskipit/api/webpay/return"
        else:
             base_url = request.url_root.rstrip('/')
             return_url = f"{base_url}/backendskipit/api/webpay/return"

        print(f"WEB_PAY INIT: BuyOrder={buy_order}, Amount={amount}, Return={return_url}")
        
        tx = get_transaction()
        response = tx.create(buy_order, session_id, amount, return_url)
        
        print(f"WEB_PAY CREATED: Token={response['token']}")
        return jsonify({
            'token': response['token'],
            'url': response['url']
        })
    except Exception as e:
        print("WEB_PAY ERROR (CREATE):", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@webpay_bp.route('/return', methods=['GET', 'POST'])
def return_transaction():
    # Manejo de ambos metodos y parametros de anulacion
    token = request.args.get('token_ws') or request.form.get('token_ws')
    tbk_token = request.args.get('TBK_TOKEN') or request.form.get('TBK_TOKEN')
    
    # Si viene TBK_TOKEN (y no token_ws) o TBK_ORDEN_COMPRA, es una anulación del usuario
    if not token and tbk_token:
        print("WEB_PAY ABORTED by user (TBK_TOKEN received)")
        # Intentar obtener orden de TBK_ORDEN_COMPRA si viene
        tbk_orden = request.args.get('TBK_ORDEN_COMPRA') or request.form.get('TBK_ORDEN_COMPRA')
        if tbk_orden:
             return redirect(f"http://localhost:5173/payment/failure?orderId={tbk_orden}")
        return redirect("http://localhost:5173/payment/failure?reason=user_aborted")
        
    if not token:
        print("WEB_PAY ERROR: No token received in return")
        return redirect("http://localhost:5173/payment/failure?reason=no_token")
        
    try:
        tx = get_transaction()
        response = tx.commit(token)
        print("WEB_PAY COMMIT:", response)
        
        status = response.get('status')
        # response_code = response.get('response_code') 
        response_code = response.get('response_code')
        buy_order = response.get('buy_order')
        
        order = Order.query.filter_by(order_id=buy_order).first()
        
        if status == 'AUTHORIZED' and response_code == 0:
             if order:
                 order.status = OrderStatus.COMPLETED
                 order.qr_code_data = f"TBK|{token}|{buy_order}"
                 db.session.commit()
                 print(f"Order {buy_order} COMPLETED")
             return redirect(f"http://localhost:5173/payment/success?orderId={buy_order}")
        else:
             if order:
                 order.status = OrderStatus.CANCELLED
                 db.session.commit()
                 print(f"Order {buy_order} FAILED/CANCELLED")
             return redirect(f"http://localhost:5173/payment/failure?orderId={buy_order}")
             
    except Exception as e:
        print("WEB_PAY COMMIT ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return redirect("http://localhost:5173/payment/failure?reason=exception")

