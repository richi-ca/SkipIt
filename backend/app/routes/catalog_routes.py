from flask import Blueprint, request, jsonify
from app import db
from app.models import Menu, Category, Product, ProductVariation

catalog_bp = Blueprint('catalog', __name__)

# --- Menus ---
@catalog_bp.route('/menus', methods=['GET'])
def get_menus():
    menus = Menu.query.all()
    return jsonify([m.to_dict() for m in menus])

@catalog_bp.route('/menus', methods=['POST'])
def create_menu():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    new_menu = Menu(name=data['name'])
    db.session.add(new_menu)
    db.session.commit()
    return jsonify(new_menu.to_dict()), 201

@catalog_bp.route('/menus/<int:id>', methods=['GET'])
def get_menu(id):
    menu = Menu.query.get_or_404(id)
    return jsonify(menu.to_dict())

@catalog_bp.route('/menus/<int:id>', methods=['DELETE'])
def delete_menu(id):
    menu = Menu.query.get_or_404(id)
    db.session.delete(menu)
    db.session.commit()
    return jsonify({'message': 'Menu deleted'})

# --- Categories ---
@catalog_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])

@catalog_bp.route('/categories', methods=['POST'])
def create_category():
    data = request.get_json()
    if not 'name' in data:
        return jsonify({'error': 'name is required'}), 400
    
    display_order_val = data.get('display_order')
    new_category = Category(
        name=data['name'],
        display_order=int(display_order_val) if display_order_val and str(display_order_val).strip() else None
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.to_dict()), 201

@catalog_bp.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.get_json()

    if 'name' in data: category.name = data['name']
    # menu_id logic removed
    if 'display_order' in data: 
        val = data['display_order']
        category.display_order = int(val) if val and str(val).strip() else None

    try:
        db.session.commit()
        return jsonify(category.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@catalog_bp.route('/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return jsonify({'message': 'Category deleted'})

# --- Products ---
@catalog_bp.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@catalog_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    # Basic validation
    if not all(k in data for k in ('category_id', 'name')):
        return jsonify({'message': 'category_id and name are required'}), 400

    if not Category.query.get(data['category_id']):
        return jsonify({'message': 'Category not found'}), 404

    new_product = Product(
        category_id=data['category_id'],
        name=data['name'],
        description=data.get('description'),
        image_url=data.get('image_url'),
        price=data.get('price')
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify(new_product.to_dict()), 201

@catalog_bp.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@catalog_bp.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data: product.name = data['name']
    if 'category_id' in data: product.category_id = data['category_id']
    if 'description' in data: product.description = data['description']
    if 'image_url' in data: product.image_url = data['image_url']
    if 'price' in data: product.price = data['price']
    
    try:
        db.session.commit()
        return jsonify(product.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@catalog_bp.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'})

# --- Variations ---
@catalog_bp.route('/variations', methods=['POST'])
def create_variation():
    data = request.get_json()
    required = ('product_id', 'name', 'price')
    if not all(k in data for k in required):
        return jsonify({'error': f'Missing fields: {required}'}), 400

    if not Product.query.get(data['product_id']):
        return jsonify({'error': 'Product not found'}), 404

    new_variation = ProductVariation(
        product_id=data['product_id'],
        name=data['name'],
        price=data['price'],
        stock=data.get('stock')
    )
    db.session.add(new_variation)
    db.session.commit()
    return jsonify(new_variation.to_dict()), 201
