from . import db
from sqlalchemy.sql import func
import enum
from datetime import datetime

# Enums
class Role(enum.Enum):
    admin = "admin"
    user_cli = "user_cli"
    scanner = "scanner"

class Gender(enum.Enum):
    M = "M"
    F = "F"
    Otro = "Otro"

class OrderStatus(enum.Enum):
    COMPLETED = "COMPLETED"
    PARTIALLY_CLAIMED = "PARTIALLY_CLAIMED"
    FULLY_CLAIMED = "FULLY_CLAIMED"
    CANCELLED = "CANCELLED"

# Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String, primary_key=True) # UUID
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=True)
    has_priority_access = db.Column(db.Boolean, default=False)
    role = db.Column(db.Enum(Role), nullable=True)
    phone = db.Column(db.String, nullable=True)
    dob = db.Column(db.Date, nullable=True)
    gender = db.Column(db.Enum(Gender), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'has_priority_access': self.has_priority_access,
            'role': self.role.value if self.role else None,
            'phone': self.phone,
            'dob': self.dob.isoformat() if self.dob else None,
            'gender': self.gender.value if self.gender else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Menu(db.Model):
    __tablename__ = 'menus'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=True) # Optional link to an event, or required? User said "associated to an event". Let's make it nullable to avoid circular issues during creation if needed, but intended to be populated.
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    event = db.relationship('Event', backref='menus')
    menu_products = db.relationship('MenuProduct', backref='menu', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'event_id': self.event_id,
            'event_name': self.event.name if self.event else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'products_count': len(self.menu_products)
        }

class MenuProduct(db.Model):
    __tablename__ = 'menu_products'

    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=True) # Price specific to this menu
    display_order = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)

    # Relationship to Product to get name/image
    product = db.relationship('Product')

    def to_dict(self):
        return {
            'id': self.id,
            'menu_id': self.menu_id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else 'Unknown',
            'category_name': self.product.category.name if self.product and self.product.category else 'Sin Categoría',
            'base_price': float(self.product.price) if self.product and self.product.price else 0,
            'price': float(self.price) if self.price is not None else 0,
            'display_order': self.display_order,
            'active': self.active
        }


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    # menu_id relationship removed from Category as it is now Menu -> MenuProduct -> Product -> Category (indirectly) or just Product -> Category.
    # User didn't explicitly say remove menu_id from Category, but MenuProducts resolves mapping. 
    # However, Products belong to Categories in the base catalog. 
    # The previous instruction added menu_id to Category. This conflicts with new "Menu Product" model if we want categories to be generic. 
    # Usually Categories are generic (Vodka, Beer) and don't belong to a Menu. 
    # IF the user wants a Menu to have specific Categories, we keep it. 
    # But usually "Menu" is just a list of products.
    # Let's REMOVE menu_id from Category to make them global catalog categories again, as implied by "MenuProduct solves M:M between menu and products".

    # Relationships
    products = db.relationship('Product', backref='category', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'products': [p.to_dict() for p in self.products]
        }

class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=True) # Base price

    # menu_products relationship backref is in MenuProduct

    def to_dict(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'name': self.name,
            'description': self.description,
            'image_url': self.image_url,
            'price': float(self.price) if self.price else 0.0
        }

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    # menu_id removed
    name = db.Column(db.String, nullable=False)
    overlay_title = db.Column(db.String, nullable=True)
    iso_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=True)
    rating = db.Column(db.Numeric(2, 1), nullable=True)
    type = db.Column(db.String, nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    carousel_order = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # menus relationship defined in Menu

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'overlay_title': self.overlay_title,
            'iso_date': self.iso_date.isoformat() if self.iso_date else None,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'location': self.location,
            'image_url': self.image_url,
            # 'price' removed
            'rating': float(self.rating) if self.rating else None,
            'type': self.type,
            'is_featured': self.is_featured,
            'is_active': self.is_active,
            'carousel_order': self.carousel_order,
            # 'valid_from' removed
            # 'valid_until' removed
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 

class Order(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.String, primary_key=True)
    user_id = db.Column(db.String, nullable=False) # Simplified relation, keeping as ID string as per entity refactor comment
    event_id = db.Column(db.Integer, nullable=False) # Simplified relation
    iso_date = db.Column(db.Date, nullable=False)
    purchase_time = db.Column(db.Time, nullable=True)
    total = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.Enum(OrderStatus), nullable=True)
    qr_code_data = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    # Relationships
    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'order_id': self.order_id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'iso_date': self.iso_date.isoformat() if self.iso_date else None,
            'purchase_time': self.purchase_time.isoformat() if self.purchase_time else None,
            'total': float(self.total) if self.total else 0.0,
            'status': self.status.value if self.status else None,
            'qr_code_data': self.qr_code_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'items': [i.to_dict() for i in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String, db.ForeignKey('orders.order_id'), nullable=False)
    product_id = db.Column(db.Integer, nullable=False) # Relation to Product ID
    product_name = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    claimed = db.Column(db.Integer, default=0)
    price_at_purchase = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'claimed': self.claimed,
            'price_at_purchase': float(self.price_at_purchase) if self.price_at_purchase else 0.0
        }

class Promotion(db.Model):
    __tablename__ = 'promotions'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    discount_text = db.Column(db.String(100), nullable=True)
    style_variant = db.Column(db.String(50), default='orange-red')
    icon_name = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(2048), nullable=True)
    active = db.Column(db.Boolean, default=True)
    action_type = db.Column(db.String(50), default='NONE')
    linked_product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'discount_text': self.discount_text,
            'style_variant': self.style_variant,
            'icon_name': self.icon_name,
            'image_url': self.image_url,
            'active': self.active,
            'action_type': self.action_type,
            'linked_product_id': self.linked_product_id
        }

class Contest(db.Model):
    __tablename__ = 'contests'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    brand = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    prize_text = db.Column(db.String(255), nullable=True)
    end_date = db.Column(db.String(50), nullable=True)
    image_url = db.Column(db.String(2048), nullable=True)
    active = db.Column(db.Boolean, default=True)
    action_type = db.Column(db.String(50), default='NONE')
    action_url = db.Column(db.String(2048), nullable=True)
    linked_product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'brand': self.brand,
            'description': self.description,
            'prize_text': self.prize_text,
            'end_date': self.end_date,
            'image_url': self.image_url,
            'active': self.active,
            'action_type': self.action_type,
            'action_url': self.action_url,
            'linked_product_id': self.linked_product_id
        }

class SiteConfiguration(db.Model):
    __tablename__ = 'site_configuration'
    section_key = db.Column(db.String(50), primary_key=True)
    content_json = db.Column(db.JSON, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'section_key': self.section_key,
            'content_json': self.content_json,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ContentBlock(db.Model):
    __tablename__ = 'content_blocks'
    key = db.Column(db.String, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'key': self.key,
            'content': self.content,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
