from flask import Blueprint, request, jsonify
from app import db
from app.models import User, Role, Gender
from datetime import datetime
import uuid

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@user_bp.route('/me', methods=['GET'])
def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'No token provided'}), 401
    
    # Formato esperado: "Bearer dummy-jwt-token-for-<user_id>"
    try:
        if ' ' not in auth_header:
             return jsonify({'error': 'Invalid token format'}), 401
        
        token_str = auth_header.split(' ')[1]
        prefix = "dummy-jwt-token-for-"
        if not token_str.startswith(prefix):
             return jsonify({'error': 'Invalid token format'}), 401
        
        user_id = token_str[len(prefix):]
        # Clean potential whitespace or newlines if any
        user_id = user_id.strip()

        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify(user.to_dict())
    except IndexError:
        return jsonify({'error': 'Invalid token header'}), 401

@user_bp.route('/me', methods=['PUT'])
def update_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'No token provided'}), 401
    
    try:
        if ' ' not in auth_header:
             return jsonify({'error': 'Invalid token format'}), 401

        token_str = auth_header.split(' ')[1]
        prefix = "dummy-jwt-token-for-"
        if not token_str.startswith(prefix):
             return jsonify({'error': 'Invalid token format'}), 401
        
        user_id = token_str[len(prefix):]
        user_id = user_id.strip()

        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()

        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            if data['email'] != user.email and User.query.filter_by(email=data['email']).first():
                 return jsonify({'error': 'Email already registered'}), 409
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']
        if 'gender' in data:
             try:
                user.gender = Gender(data['gender']) if data['gender'] else None
             except ValueError:
                pass # Ignore invalid gender values or handle error
        if 'dob' in data:
            try:
                # Handle YYYY-MM-DD or ISO format
                if len(data['dob']) == 10:
                    user.dob = datetime.strptime(data['dob'], '%Y-%m-%d')
                else:
                    user.dob = datetime.fromisoformat(data['dob'])
            except:
                pass # Ignore date errors for now

        db.session.commit()
        return jsonify(user.to_dict())

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<string:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Validaciones básicas
    # ID is now optional (auto-generated)
    if not data or not all(k in data for k in ('name', 'email')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if ID is provided, if so check existence
    if data.get('id') and User.query.get(data['id']):
        return jsonify({'error': 'User ID already exists'}), 409
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409

    try:
        # Conversión de enums y fechas
        role = Role(data.get('role')) if data.get('role') else None
        gender = Gender(data.get('gender')) if data.get('gender') else None
        
        dob = None
        if data.get('dob'):
             try:
                 # Handle YYYY-MM-DD or ISO format
                 if len(data['dob']) == 10:
                     dob = datetime.strptime(data['dob'], '%Y-%m-%d')
                 else:
                     dob = datetime.fromisoformat(data['dob'])
             except:
                 pass 

        hashed_password = None
        if data.get('password'):
            from werkzeug.security import generate_password_hash
            hashed_password = generate_password_hash(data.get('password'))

        new_user = User(
            # id is handled by default=uuid.uuid4 in model if not provided
            id=data.get('id'), # Optional: allow manually setting ID if needed, otherwise None triggers default
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            has_priority_access=data.get('has_priority_access', False),
            role=role,
            phone=data.get('phone'),
            dob=dob,
            gender=gender,
            is_active=data.get('is_active', True)
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify(new_user.to_dict()), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<string:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    try:
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            # Verificar uniqueness si cambia el email
            if data['email'] != user.email and User.query.filter_by(email=data['email']).first():
                 return jsonify({'error': 'Email already registered'}), 409
            user.email = data['email']
        if 'has_priority_access' in data:
            user.has_priority_access = data['has_priority_access']
        if 'phone' in data:
            user.phone = data['phone']
        if 'role' in data:
            user.role = Role(data['role']) if data['role'] else None
        if 'gender' in data:
            user.gender = Gender(data['gender']) if data['gender'] else None
        if 'dob' in data:
             try:
                # Handle YYYY-MM-DD or ISO format
                if len(data['dob']) == 10:
                    user.dob = datetime.strptime(data['dob'], '%Y-%m-%d')
                else:
                    user.dob = datetime.fromisoformat(data['dob'])
             except:
                pass 
        if 'password' in data and data['password']:
            from werkzeug.security import generate_password_hash
            user.password = generate_password_hash(data['password'])
        if 'is_active' in data:
            user.is_active = data['is_active']

        db.session.commit()
        return jsonify(user.to_dict())

    except ValueError as e:
         return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/<string:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
