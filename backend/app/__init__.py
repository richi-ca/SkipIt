from flask import Flask
from flask_cors import CORS
from .extensions import db
from werkzeug.middleware.proxy_fix import ProxyFix

import os

def create_app():
    app = Flask(__name__)
    
    # Configuración para manejar despliegue en subcarpeta y headers de proxy
    # Esto es crucial para que url_for genere URLs https y con la ruta correcta en cPanel/Nginx
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    
    # Ruta absoluta a backend/sqlite.db
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    db_path = os.path.join(base_dir, 'sqlite.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # CORS se configura globalmente aquí para la instancia app, 
    # pero la configuración detallada de orígenes se maneja en app.py o aquí si se desea.
    # Dado que app.py maneja la lógica de orígenes según entorno, aquí inicializamos básico.
    # Nota: app.py lo re-inicializa o extiende, pero Flask-CORS soporta múltiples inits.
    # Para ser limpios, dejaremos que app.py (entry point) maneje la restricción fuerte,
    # y aquí habilitamos la extensión.
    CORS(app) 
    
    db.init_app(app)

    # Importación y registro de Blueprints
    from .routes.main import main
    from .routes.user_routes import user_bp
    from .routes.catalog_routes import catalog_bp
    from .routes.event_routes import event_bp
    from .routes.order_routes import order_bp
    from .routes.auth_routes import auth_bp
    from .routes.cms_routes import cms_bp
    from .routes.stats_routes import stats_bp
    from .routes.media_routes import media_bp
    from .routes.admin_routes import admin_bp

    # Los prefijos son RELATIVOS al punto de montaje de la aplicación.
    # Si la app se monta en /backendskipit, entonces /api/users será /backendskipit/api/users
    from .routes.webpay_routes import webpay_bp

    app.register_blueprint(main)
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(catalog_bp, url_prefix='/api/catalog')
    app.register_blueprint(event_bp, url_prefix='/api/catalog/events')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(cms_bp, url_prefix='/api/cms')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(media_bp, url_prefix='/media')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(webpay_bp, url_prefix='/api/webpay')

    return app
