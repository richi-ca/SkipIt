import os
from flask import Flask
from flask_cors import CORS 
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.exceptions import NotFound
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

from app import create_app

app = create_app()

# Configuración de Entorno
FLASK_ENV = os.getenv('FLASK_ENV', 'production')
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '').split(',')

if FLASK_ENV == 'development':
    # En desarrollo, permitimos todo para facilitar pruebas
    print("Environment: DEVELOPMENT")
    CORS(app, resources={r"/*": {"origins": "*"}})
else:
    # En producción, somos restrictivos
    print("Environment: PRODUCTION")
    # Si ALLOWED_ORIGINS está vacío, permitimos solo el dominio específico
    origins = ALLOWED_ORIGINS if ALLOWED_ORIGINS and ALLOWED_ORIGINS[0] else ["https://www.triskeledu.cl"]
    
    CORS(app,
         resources={r"/*": {"origins": origins}},
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
         supports_credentials=True)

class CORSPreflightFix:
    def __init__(self, app):
        self.app = app
    def __call__(self, environ, start_response):
        if environ.get('REQUEST_METHOD') == 'OPTIONS':
            start_response('200 OK', [
                ('Access-Control-Allow-Origin', environ.get('HTTP_ORIGIN', '*')),
                ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Credentials, ngrok-skip-browser-warning'),
                ('Access-Control-Allow-Credentials', 'true')
            ])
            return [b'']
        return self.app(environ, start_response)

if __name__ == '__main__':
    # Simulación de entorno de hosting en desarrollo
    if FLASK_ENV == 'development':
        # Montamos la app en /backendskipit para simular la estructura de producción
        # La app "dummy" en la raíz devuelve 404 para obligarnos a usar el prefijo correcto
        print("Mounting app at /backendskipit")
        app.wsgi_app = DispatcherMiddleware(NotFound(), {
            '/backendskipit': app.wsgi_app
        })
        # Wrap with CORS fix to handle OPTIONS requests correctly in dev
        app.wsgi_app = CORSPreflightFix(app.wsgi_app)
    
    app.run(debug=(FLASK_ENV == 'development'), port=5000)