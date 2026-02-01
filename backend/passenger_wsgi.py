import sys
import os
import importlib.util

# 1. Definir la ruta base del proyecto
PROJECT_ROOT = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, PROJECT_ROOT)

# 2. Cargar específicamente el archivo app.py raíz ignorando la carpeta app/
def load_app_from_file():
    # Buscamos físicamente el archivo app.py en la raíz
    spec = importlib.util.spec_from_file_location("main_app", os.path.join(PROJECT_ROOT, "app.py"))
    module = importlib.util.module_from_spec(spec)
    # Ejecutamos el módulo para que se cree la variable 'app'
    spec.loader.exec_module(module)
    return module.app

try:
    # 'application' es lo que busca el servidor de cPanel
    application = load_app_from_file()
except Exception as e:
    # Log de emergencia por si algo falla al cargar
    with open(os.path.join(PROJECT_ROOT, 'startup_error.log'), 'a') as f:
        f.write(f"Error cargando la aplicacion: {str(e)}\n")
    raise
