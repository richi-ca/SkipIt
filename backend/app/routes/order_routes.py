from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, OrderItem, OrderStatus, ProductVariation
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
    data = request.get_json()
    # Required: user_id, event_id, items (list)
    if not all(k in data for k in ('user_id', 'event_id', 'items', 'total')):
         return jsonify({'error': 'Missing required fields'}), 400
    
    order_id = data.get('order_id', str(uuid.uuid4()))
    
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
                variation_id=item_data['variation_id'],
                product_name=item_data['product_name'],
                variation_name=item_data['variation_name'],
                quantity=item_data['quantity'],
                price_at_purchase=item_data['price']
            )
            db.session.add(new_item)

        db.session.commit()
        return jsonify(new_order.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
