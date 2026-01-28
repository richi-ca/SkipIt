from flask import Flask
from flask_cors import CORS
from .extensions import db

import os

def create_app():
    app = Flask(__name__)
    
    # Ruta absoluta a backend/sqlite.db
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    db_path = os.path.join(base_dir, 'sqlite.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    db.init_app(app)

    from .routes.main import main
    from .routes.user_routes import user_bp
    from .routes.catalog_routes import catalog_bp
    from .routes.event_routes import event_bp
    from .routes.order_routes import order_bp
    from .routes.auth_routes import auth_bp
    from .routes.cms_routes import cms_bp
    from .routes.stats_routes import stats_bp

    app.register_blueprint(main)
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(catalog_bp, url_prefix='/api/catalog')
    app.register_blueprint(event_bp, url_prefix='/api/catalog/events')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cms_bp, url_prefix='/api/cms')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')

    from .routes.media_routes import media_bp
    app.register_blueprint(media_bp, url_prefix='/media')

    from app.routes.admin_routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    return app
