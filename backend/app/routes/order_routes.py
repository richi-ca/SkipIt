from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, OrderItem, OrderStatus
from datetime import datetime, time
import uuid

order_bp = Blueprint('orders', __name__)

@order_bp.route('/', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([o.to_dict() for o in orders])

@order_bp.route('/my-history', methods=['GET'])
def get_my_history():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        token_str = auth_header.split(' ')[1]
        prefix = "dummy-jwt-token-for-"
        if not token_str.startswith(prefix):
             return jsonify({'error': 'Invalid token format'}), 401
        
        user_id = token_str[len(prefix):]
        # Validar si el usuario existe (opcional pero bueno)
        # user = User.query.get(user_id)
        # if not user: ...
        
        orders = Order.query.filter_by(user_id=user_id).all()
        # Idealmente ordenar por fecha
        return jsonify([o.to_dict() for o in orders])
        
    except IndexError:
        return jsonify({'error': 'Invalid token header'}), 401

@order_bp.route('/<string:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify(order.to_dict())

@order_bp.route('/', methods=['POST'])
def create_order():

    #https://www.transbankdevelopers.cl/documentacion/como_empezar#como-empezar
    #https://www.transbankdevelopers.cl/documentacion/como_empezar#codigos-de-comercio
    #https://www.transbankdevelopers.cl/referencia/webpay

    # Tipo de tarjeta   Detalle                        Resultado
    #----------------   -----------------------------  ------------------------------
    # VISA              4051885600446623
    #                   CVV 123
    #                   cualquier fecha de expiración  Genera transacciones aprobadas.
    # AMEX              3700 0000 0002 032
    #                   CVV 1234
    #                   cualquier fecha de expiración  Genera transacciones aprobadas.
    # MASTERCARD        5186 0595 5959 0568
    #                   CVV 123
    #                   cualquier fecha de expiración  Genera transacciones rechazadas.
    # Redcompra         4051 8842 3993 7763            Genera transacciones aprobadas (para operaciones que permiten débito Redcompra y prepago)
    # Redcompra         4511 3466 6003 7060            Genera transacciones aprobadas (para operaciones que permiten débito Redcompra y prepago)
    # Redcompra         5186 0085 4123 3829            Genera transacciones rechazadas (para operaciones que permiten débito Redcompra y prepago)

    data = request.get_json()
    # Required: user_id, event_id, items (list)
    if not all(k in data for k in ('user_id', 'event_id', 'items', 'total')):
         return jsonify({'error': 'Missing required fields'}), 400
    
    # Webpay restriction: buy_order max 26 chars. Using shorter ID.
    order_id = data.get('order_id', f"ORD-{uuid.uuid4().hex[:12]}")
    
    try:
        iso_date = datetime.now().date() # Default current date
        purchase_time = datetime.now().time()
        
        status = OrderStatus(data.get('status', 'COMPLETED'))
        
        new_order = Order(
            order_id=order_id,
            user_id=data['user_id'],
            event_id=data['event_id'],
            iso_date=iso_date,
            purchase_time=purchase_time,
            total=data['total'],
            status=status,
            qr_code_data=data.get('qr_code_data')
        )
        
        db.session.add(new_order)
        
        # Add items
        for item_data in data['items']:
            # Validation for each item could go here
            new_item = OrderItem(
                order_id=order_id,
                # variation_id -> product_id mapping if needed, but for now just storing what frontend sends
                product_id=item_data.get('product_id'), # Assuming refactor
                product_name=item_data['product_name'],
                # variation_name removed or optional
                quantity=item_data['quantity'],
                price_at_purchase=item_data['price']
            )
            db.session.add(new_item)

        db.session.commit()
        return jsonify(new_order.to_dict()), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
