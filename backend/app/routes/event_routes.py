from flask import Blueprint, request, jsonify
from app import db
from app.models import Event
from datetime import datetime, date, time, timedelta
from sqlalchemy import or_

event_bp = Blueprint('events', __name__)

@event_bp.route('', methods=['GET'])
def get_events():
    today = date.today()
    query = Event.query

    # Public check
    if request.args.get('public', '').lower() == 'true':
        query = query.filter(
            Event.is_active == True,
            # valid_from/until filtering removed, relies on is_active for logical elimination
            # or_(Event.valid_from == None, Event.valid_from <= today),
            # or_(Event.valid_until == None, Event.valid_until >= today)
        )

    # Type Filter
    filter_type = request.args.get('filter_type') # 'featured', 'normal'
    if filter_type == 'featured':
        query = query.filter(Event.is_featured == True)
    elif filter_type == 'normal':
        query = query.filter(Event.is_featured == False)

    # Date Range (Explicit)
    date_from_str = request.args.get('date_from')
    date_to_str = request.args.get('date_to')
    
    has_explicit_dates = False
    if date_from_str:
        try:
            d_from = datetime.fromisoformat(date_from_str).date()
            query = query.filter(Event.iso_date >= d_from)
            has_explicit_dates = True
        except ValueError:
            pass # Ignore invalid dates
        
    if date_to_str:
        try:
            d_to = datetime.fromisoformat(date_to_str).date()
            query = query.filter(Event.iso_date <= d_to)
            has_explicit_dates = True
        except ValueError:
            pass

    # Time Filter (Buckets) - Apply only if no specific date range provided
    if not has_explicit_dates:
        time_filter = request.args.get('time_filter')
        
        if time_filter == 'day':
            query = query.filter(Event.iso_date == today)
        elif time_filter == 'week':
            start_week = today - timedelta(days=today.weekday())
            end_week = start_week + timedelta(days=6)
            query = query.filter(Event.iso_date >= start_week, Event.iso_date <= end_week)
        elif time_filter == 'year':
            start_year = date(today.year, 1, 1)
            end_year = date(today.year, 12, 31)
            query = query.filter(Event.iso_date >= start_year, Event.iso_date <= end_year)

    # Ordering: Featured first, then date
    query = query.order_by(Event.is_featured.desc(), Event.iso_date.asc())

    events = query.all()
    return jsonify([e.to_dict() for e in events])

@event_bp.route('/featured', methods=['GET'])
def get_featured_events():
    today = date.today()
    events = Event.query.filter(
        Event.is_featured == True,
        Event.is_active == True
    ).all()
    return jsonify([e.to_dict() for e in events])

@event_bp.route('/<int:id>', methods=['GET'])
def get_event(id):
    event = Event.query.get_or_404(id)
    return jsonify(event.to_dict())

@event_bp.route('/<int:id>/menu', methods=['GET'])
def get_event_menu(id):
    event = Event.query.get_or_404(id)
    if not event.menu:
        return jsonify({'message': 'Menu not found for this event'}), 404
    return jsonify(event.menu.to_dict())


@event_bp.route('', methods=['POST'])
def create_event():
    data = request.get_json()
    required = ('name', 'iso_date', 'start_time', 'end_time', 'location')
    
    if not all(k in data for k in required):
        return jsonify({'message': f'Missing fields: {required}'}), 400

    try:
        iso_date = datetime.fromisoformat(data['iso_date'].split('T')[0]).date() if 'iso_date' in data else None
        
        start_t_str = data['start_time'].split('T')[-1]
        start_time = time.fromisoformat(start_t_str)
        end_t_str = data['end_time'].split('T')[-1]
        end_time = time.fromisoformat(end_t_str)

        # valid_from and valid_until removed parsing

        new_event = Event(
            menu_id=data.get('menu_id'),
            name=data['name'],
            overlay_title=data.get('overlay_title'),
            iso_date=iso_date,
            start_time=start_time,
            end_time=end_time,
            location=data['location'],
            image_url=data.get('image_url'),
            # price removed
            rating=data.get('rating'),
            type=data.get('type'),
            is_featured=data.get('is_featured', False),
            is_active=data.get('is_active', True),
            carousel_order=data.get('carousel_order'),
            # valid_from and valid_until removed
        )
        
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_dict()), 201

    except ValueError as e:
        return jsonify({'message': f'Invalid date/time format: {str(e)}'}), 400
    except Exception as e:
         db.session.rollback()
         return jsonify({'message': str(e)}), 500

@event_bp.route('/<int:id>', methods=['PUT'])
def update_event(id):
    event = Event.query.get_or_404(id)
    data = request.get_json()

    try:
        if 'name' in data: event.name = data['name']
        if 'overlay_title' in data: event.overlay_title = data['overlay_title']
        if 'location' in data: event.location = data['location']
        if 'image_url' in data: event.image_url = data['image_url']
        # price removed
        if 'rating' in data: event.rating = data['rating']
        if 'type' in data: event.type = data['type']
        if 'is_featured' in data: event.is_featured = bool(data['is_featured'])
        if 'is_active' in data: event.is_active = bool(data['is_active'])
        if 'carousel_order' in data: event.carousel_order = data['carousel_order']
        
        # Dates and Times parsing
        if 'iso_date' in data and data['iso_date']:
            # Puede venir como full datetime string o date string
             event.iso_date = datetime.fromisoformat(data['iso_date'].split('T')[0]).date()
        
        if 'start_time' in data and data['start_time']:
             # Puede venir como 'HH:MM:SS' o con T
             t_str = data['start_time'].split('T')[-1]
             event.start_time = time.fromisoformat(t_str)

        if 'end_time' in data and data['end_time']:
             t_str = data['end_time'].split('T')[-1]
             event.end_time = time.fromisoformat(t_str)
             
        # valid_from and valid_until updates removed

        db.session.commit()
        return jsonify(event.to_dict()), 200

    except ValueError as e:
        return jsonify({'message': f'Invalid format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@event_bp.route('/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.get_or_404(id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted'})
