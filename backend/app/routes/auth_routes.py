from flask import Blueprint, request, jsonify
from app import db
from app.models import User, Role, Gender
import jwt
import datetime
import os
import uuid

auth_bp = Blueprint('auth', __name__)

# Clave secreta para JWT (debería estar en .env)
SECRET_KEY = os.getenv('SECRET_KEY', 'super_secret_key')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user:
         return jsonify({'error': 'User not found'}), 404

    # En una app real, aquí se compararía el hash de la contraseña.
    # Ahora usamos werkzeug para validar el hash
    from werkzeug.security import check_password_hash
    if not user.password or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Check if user is active
    if not user.is_active:
        return jsonify({'error': 'La cuenta está desactivada. Contacte al administrador.'}), 403

    # Generar Token (Dummy o JWT simple)
    token = "dummy-jwt-token-for-" + user.id # Simplificación para prototipo
    
    # Respuesta con formato esperado por el frontend
    return jsonify({
        'token': token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    required_fields = ['name', 'email', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'El email ya está registrado'}), 400

    # Parse Dob
    dob_val = None
    if data.get('dob'):
        try:
            # Frontend sends 'yyyy-MM-dd'
            dob_val = datetime.datetime.strptime(data['dob'], '%Y-%m-%d').date()
        except ValueError:
            pass

    # Parse Gender
    gender_val = None
    if data.get('gender'):
        try:
            # Assuming frontend sends values matching Enum (M, F, Otro)
            gender_val = Gender(data['gender'])
        except ValueError:
            # Fallback or ignore
            pass

    from werkzeug.security import generate_password_hash
    hashed_password = generate_password_hash(data['password'])

    new_user = User(
        # id handled by model default
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        phone=data.get('phone'),
        dob=dob_val,
        gender=gender_val,
        role=Role.user_cli,
        is_active=True
    )

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Error creating user: ' + str(e)}), 500

    token = "dummy-jwt-token-for-" + new_user.id
    
    return jsonify({
        'token': token,
        'user': new_user.to_dict()
    }), 201
