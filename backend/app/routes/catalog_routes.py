from flask import Blueprint, request, jsonify
from app import db
from app.models import Menu, Category, Product, MenuProduct

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
    
    new_menu = Menu(
        name=data['name'],
        event_id=data.get('event_id')
    )
    db.session.add(new_menu)
    db.session.commit()
    db.session.add(new_menu)
    db.session.commit()
    return jsonify(new_menu.to_dict()), 201

@catalog_bp.route('/events/<int:event_id>/menu', methods=['GET'])
def get_menu_by_event(event_id):
    # Find the menu associated with this event
    # Assuming one menu per event for now, or taking the latest/first
    menu = Menu.query.filter_by(event_id=event_id).first()
    
    if not menu:
        return jsonify({'error': 'Menu not found for this event'}), 404
        
    menu_dict = menu.to_dict()
    
    # Process products into hierarchal structure for DrinkMenu component
    # Structure needed: { id, name, categories: [ { id, name, products: [ { ..., variations: [] } ] } ] }
    # Since we removed variations, each MenuProduct acts as a product variant in the UI or we group them?
    # The Generic Front End 'DrinkMenu' expects categories -> products -> variations.
    # We need to map our flat MenuProducts list to this structure.
    
    # 1. Fetch MenuProducts sorted by category order then product order
    menu_products = sorted(menu.menu_products, key=lambda x: (x.category_display_order, x.product_display_order))
    
    # 2. Group by Category
    categories_map = {}
    
    for mp in menu_products:
        if not mp.active: continue
        
        prod = mp.product
        if not prod: continue
        
        cat = prod.category
        if not cat: 
             # Fallback category
             cat_id = 0
             cat_name = "Otros"
             cat_desc = ""
        else:
             cat_id = cat.id
             cat_name = cat.name
             cat_desc = cat.description
             
        if cat_id not in categories_map:
            categories_map[cat_id] = {
                'id': cat_id,
                'name': cat_name,
                'description': cat_desc,
                'products': []
            }
            
        # 3. Add Product to Category. 
        # Since we removed 'variations' table, and now Product names include variants (e.g. "Cerveza 330ml"),
        # We can simulate the structure: Product -> [Variation(Self)]
        
        product_entry = {
            'id': prod.id,
            'name': prod.name,
            'description': prod.description,
            'image': prod.image_url, 
            'variations': [
                {
                    'id': mp.id, 
                    'name': prod.name, 
                    'price': float(mp.price) if mp.price is not None else float(prod.price)
                }
            ]
        }
        
        categories_map[cat_id]['products'].append(product_entry)

    # Convert map to list - Sorting of categories logic is implicit by the order of insertion if we iterate sorted products
    # But dictionary iteration order is insertion order in py3.7+. Since we sorted menu_products by category_display_order first,
    # the keys in categories_map should be added in that order effectively.
    categories_list = list(categories_map.values())
    
    return jsonify({
        'id': menu.id,
        'name': menu.name,
        'categories': categories_list
    })

@catalog_bp.route('/menus/<int:id>', methods=['GET'])
def get_menu(id):
    menu = Menu.query.get_or_404(id)
    menu_dict = menu.to_dict()
    # Add products explicitly sorted
    products = sorted(menu.menu_products, key=lambda x: (x.category_display_order, x.product_display_order))
    menu_dict['products'] = [mp.to_dict() for mp in products]
    return jsonify(menu_dict)

@catalog_bp.route('/menus/<int:id>', methods=['PUT', 'PATCH'])
def update_menu(id):
    menu = Menu.query.get_or_404(id)
    data = request.get_json()
    
    if 'name' in data: menu.name = data['name']
    if 'event_id' in data: menu.event_id = data['event_id']
    
    db.session.commit()
    return jsonify(menu.to_dict())

@catalog_bp.route('/menus/<int:id>', methods=['DELETE'])
def delete_menu(id):
    menu = Menu.query.get_or_404(id)
    db.session.delete(menu)
    db.session.commit()
    return jsonify({'message': 'Menu deleted'})

# --- Menu Products ---

@catalog_bp.route('/menus/<int:id>/products', methods=['POST'])
def add_product_to_menu(id):
    menu = Menu.query.get_or_404(id)
    data = request.get_json()
    
    if 'product_id' not in data:
        return jsonify({'error': 'product_id is required'}), 400
        
    product = Product.query.get_or_404(data['product_id'])
    
    # Check if already exists
    exists = MenuProduct.query.filter_by(menu_id=menu.id, product_id=product.id).first()
    if exists:
        return jsonify({'error': 'Product already in menu'}), 400

    # Determine sorting
    # We need to find the category order logic. If new products are added, they likely go to the end of their category, 
    # or the category goes to the end if new.
    
    # Determine Category Display Order
    # Find existing products with same category in this menu
    cat_id = product.category_id
    
    existing_in_cat = [mp for mp in menu.menu_products if mp.product and mp.product.category_id == cat_id]
    
    if existing_in_cat:
        # Category already exists in menu, use its order
        cat_order = existing_in_cat[0].category_display_order
        # Find max product order in this category
        max_prod_order = max([mp.product_display_order for mp in existing_in_cat]) if existing_in_cat else 0
        prod_order = max_prod_order + 1
    else:
        # New category for this menu, put at end
        max_cat_order = db.session.query(db.func.max(MenuProduct.category_display_order)).filter_by(menu_id=menu.id).scalar() or 0
        cat_order = max_cat_order + 1
        prod_order = 1
    
    menu_prod = MenuProduct(
        menu_id=menu.id,
        product_id=product.id,
        price=data.get('price', product.price), # Default to base price
        category_display_order=cat_order,
        product_display_order=prod_order,
        active=True
    )
    
    db.session.add(menu_prod)
    db.session.commit()
    return jsonify(menu_prod.to_dict()), 201

@catalog_bp.route('/menu-products/<int:id>', methods=['PUT'])
def update_menu_product(id):
    mp = MenuProduct.query.get_or_404(id)
    data = request.get_json()
    
    if 'price' in data: mp.price = data['price']
    if 'active' in data: mp.active = data['active']
    # Sorting managed via dedicated endpoint usually, but leaving safe update here
    
    db.session.commit()
    return jsonify(mp.to_dict())

@catalog_bp.route('/menu-products/<int:id>', methods=['DELETE'])
def remove_product_from_menu(id):
    mp = MenuProduct.query.get_or_404(id)
    db.session.delete(mp)
    db.session.commit()
    return jsonify({'message': 'Product removed from menu'})

@catalog_bp.route('/menus/<int:id>/reorder', methods=['POST'])
def reorder_menu_products(id):
    menu = Menu.query.get_or_404(id)
    data = request.get_json()
    # Expects list of { id: menu_product_id, product_display_order: int, category_display_order: int }
    # Or simplified logic.
    
    if not isinstance(data, list):
        return jsonify({'error': 'List expected'}), 400
        
    for item in data:
        mp = MenuProduct.query.get(item['id'])
        if mp and mp.menu_id == menu.id:
            if 'product_display_order' in item:
                mp.product_display_order = item['product_display_order']
            if 'category_display_order' in item:
                # Update this product's category order. 
                # CRITICAL: We must update ALL products in this category for this menu to keep them together.
                # However, the frontend might send ALL items updated.
                # Or we logic it here.
                # If the user says "Change Category Order", they imply moving the whole block.
                # If we receive explicit category_display_order for one item, we should probably update peers.
                # BUT, if the frontend sends the whole list with updated values, we just save them.
                # Let's assume frontend sends updates for relevant items.
                mp.category_display_order = item['category_display_order']
            
    db.session.commit()
    return jsonify({'message': 'Order updated'})


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
    
    new_category = Category(
        name=data['name'],
        description=data.get('description')
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.to_dict()), 201

@catalog_bp.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.get_json()

    if 'name' in data: category.name = data['name']
    if 'description' in data: category.description = data['description']

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


