from flask import Blueprint, request, jsonify
from app import db
from app.models import ContentBlock
from datetime import datetime

cms_bp = Blueprint('cms', __name__)

@cms_bp.route('/', methods=['GET'])
def get_contents():
    blocks = ContentBlock.query.all()
    # Devolver dict key: content
    return jsonify({b.key: b.content for b in blocks})

@cms_bp.route('/', methods=['POST'])
def update_content():
    data = request.get_json()
    # data ejemplo: { "quienes_somos": "html...", "mision": "html..." }
    
    try:
        for key, content in data.items():
            block = ContentBlock.query.get(key)
            if not block:
                block = ContentBlock(key=key)
            block.content = content
            db.session.add(block)
        
        db.session.commit()
        return jsonify({'message': 'Content updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
