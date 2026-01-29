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
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    # categories relationship removed

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            # 'categories' removed
        }

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    # menu_id relationship removed
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)

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
    price = db.Column(db.Numeric(10, 2), nullable=True)

    # Relationships
    variations = db.relationship('ProductVariation', backref='product', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'name': self.name,
            'description': self.description,
            'image_url': self.image_url,
            'price': float(self.price) if self.price else 0.0,
            'variations': [v.to_dict() for v in self.variations]
        }

class ProductVariation(db.Model):
    __tablename__ = 'product_variations'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.name,
            'price': float(self.price) if self.price else 0.0,
            'stock': self.stock
        }

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, db.ForeignKey('menus.id'), nullable=True)
    name = db.Column(db.String, nullable=False)
    overlay_title = db.Column(db.String, nullable=True)
    iso_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=True)
    # price removed
    rating = db.Column(db.Numeric(2, 1), nullable=True)
    type = db.Column(db.String, nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    carousel_order = db.Column(db.Integer, nullable=True)
    valid_from = db.Column(db.Date, nullable=True)
    valid_until = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    
    # Relationship to Menu (Unidirectional from Event -> Menu as per basic requirements, bidirectional implied by foreign key)
    menu = db.relationship('Menu', backref='events') 

    def to_dict(self):
        return {
            'id': self.id,
            'menu_id': self.menu_id,
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
            'valid_from': self.valid_from.isoformat() if self.valid_from else None,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
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
    variation_id = db.Column(db.Integer, nullable=False) # Simplified relation
    product_name = db.Column(db.String, nullable=False)
    variation_name = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    claimed = db.Column(db.Integer, default=0)
    price_at_purchase = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'variation_id': self.variation_id,
            'product_name': self.product_name,
            'variation_name': self.variation_name,
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
    linked_variation_id = db.Column(db.Integer, db.ForeignKey('product_variations.id'), nullable=True)

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
            'linked_variation_id': self.linked_variation_id
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
    linked_variation_id = db.Column(db.Integer, db.ForeignKey('product_variations.id'), nullable=True)

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
            'linked_variation_id': self.linked_variation_id
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
