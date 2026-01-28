from flask import Blueprint, request, jsonify, send_from_directory, current_app, url_for
from werkzeug.utils import secure_filename
import os
import uuid

media_bp = Blueprint('media', __name__)

# Configurar en create_app o aquí, pero necesitamos saber la ruta absoluta.
# Usamos os.getcwd() asumiendo que se corre desde backend/
# O mejor, relativo a este archivo.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MEDIA_FOLDER = os.path.join(BASE_DIR, 'media')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif'}

if not os.path.exists(MEDIA_FOLDER):
    os.makedirs(MEDIA_FOLDER)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@media_bp.route('/<path:filename>')
def get_media(filename):
    return send_from_directory(MEDIA_FOLDER, filename)

@media_bp.route('/', methods=['GET'])
def list_media():
    """Listar archivos para la galería"""
    files = []
    if os.path.exists(MEDIA_FOLDER):
        for f in os.listdir(MEDIA_FOLDER):
            if allowed_file(f):
                files.append(f)
    return jsonify(files)

@media_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        name, ext = os.path.splitext(original_filename)
        
        # Generar nombre único: nombre-uuid.ext
        unique_id = str(uuid.uuid4())
        new_filename = f"{name}-{unique_id}{ext}"
        
        file.save(os.path.join(MEDIA_FOLDER, new_filename))
        
        # URL completa
        # request.host_url da http://localhost:5000/
        # url_for('media.get_media', filename=new_filename) da /media/filename
        full_url = f"{request.host_url.rstrip('/')}/media/{new_filename}"
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': new_filename,
            'url': full_url
        }), 201
    
    return jsonify({'error': 'File type not allowed'}), 400
