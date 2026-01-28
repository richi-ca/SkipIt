from flask import Blueprint, jsonify, request, send_from_directory, current_app
from werkzeug.utils import secure_filename
from app import db
import sys
import os
import glob

# Add parent directory to path to import script
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# from importlib import import_module # Unused based on implementation below

admin_bp = Blueprint('admin', __name__)

# Configuración de directorio de imágenes
# Asumiendo estructura: backend/app/routes/admin_routes.py -> backend/assets/images
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMAGES_DIR = os.path.join(BASE_DIR, 'assets', 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'avif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@admin_bp.route('/reset-db', methods=['POST'])
def reset_db():
    try:
        # Import seed_data dynamically to avoid circular imports or context issues
        # The file name is 'create-and-populate-db.py', which is not a valid module name directly due to dashes.
        # We need to use importlib
        sys.path.append(os.getcwd()) # Ensure backend dir is in path
        
        # Mapping filename with hyphens to module
        module_name = 'create-and-populate-db'
        if module_name not in sys.modules:
            populate_script = __import__(module_name)
        else:
            populate_script = sys.modules[module_name]

        # Using db.drop_all() and create_all() within current context
        db.drop_all()
        db.create_all()
        
        # Call seed_data
        populate_script.seed_data()
        
        return jsonify({'message': 'Database reset successfully'}), 200
    except Exception as e:
        print(f"Error resetting DB: {e}")
        return jsonify({'message': str(e)}), 500

# --- Rutas de Gestión de Imágenes ---

@admin_bp.route('/images', methods=['GET'])
def list_images():
    """Listar todas las imágenes disponibles en el directorio de assets."""
    files = []
    # Buscar recursivamente o solo nivel superior? Requerimiento dice 'assets/images/'. Asumimos nivel superior.
    for filename in os.listdir(IMAGES_DIR):
        if allowed_file(filename):
             files.append(filename)
    return jsonify(files)

@admin_bp.route('/images/<path:filename>', methods=['GET'])
def get_image(filename):
    """Servir imagen."""
    return send_from_directory(IMAGES_DIR, filename)

@admin_bp.route('/images/upload', methods=['POST'])
def upload_image():
    """Subir una nueva imagen con renombrado si existe."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        
        # Lógica de colisión
        counter = 1
        original_name = name
        while os.path.exists(os.path.join(IMAGES_DIR, filename)):
            name = f"{original_name}-{counter}"
            filename = f"{name}{ext}"
            counter += 1
            
        file.save(os.path.join(IMAGES_DIR, filename))
        
        # Retornar la URL relativa para ser guardada en la DB
        # El frontend decidirá si guardar 'filename' o 'assets/images/filename'
        # Requerimiento dice: "Ruta local (ej: foto.jpg o assets/images/foto.jpg)"
        return jsonify({'message': 'Image uploaded', 'filename': filename}), 201
    
    return jsonify({'error': 'File type not allowed'}), 400
