from app import create_app, db
from app.models import Event
import datetime
from datetime import time as time_orig

app = create_app()

with app.app_context():
    try:
        data = {
            "name": "test",
            "iso_date": "2026-01-28",
            "start_time": "21:00",
            "end_time": "04:00",
            "valid_from": "2026-01-01",
            "valid_until": "2026-01-28",
            "location": "Movistar arena",
            "price": "100",
            "is_featured": True,
            "is_active": True,
            "image_url": "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
            "overlay_title": "Muy bueno"
        }
        
        print("Starting debug...")
        
        iso_date = datetime.datetime.fromisoformat(data['iso_date'].split('T')[0]).date() if 'iso_date' in data else None
        
        start_t_str = data['start_time'].split('T')[-1]
        print(f"Parsing start_time: '{start_t_str}'")
        start_time = time_orig.fromisoformat(start_t_str)
        
        end_t_str = data['end_time'].split('T')[-1]
        print(f"Parsing end_time: '{end_t_str}'")
        end_time = time_orig.fromisoformat(end_t_str)

        valid_from = None
        if 'valid_from' in data and data['valid_from']:
             valid_from = datetime.datetime.fromisoformat(data['valid_from'].split('T')[0]).date()

        valid_until = None
        if 'valid_until' in data and data['valid_until']:
             valid_until = datetime.datetime.fromisoformat(data['valid_until'].split('T')[0]).date()

        print("Creating Event object...")
        new_event = Event(
            name=data['name'],
            overlay_title=data.get('overlay_title'),
            iso_date=iso_date,
            start_time=start_time,
            end_time=end_time,
            location=data['location'],
            image_url=data.get('image_url'),
            price=data['price'],
            rating=data.get('rating'),
            type=data.get('type'),
            is_featured=data.get('is_featured', False),
            is_active=data.get('is_active', True),
            valid_from=valid_from,
            valid_until=valid_until
        )
        
        print("Adding to session...")
        db.session.add(new_event)
        print("Committing to DB...")
        db.session.commit()
        print("Success! Event created.")
        
    except Exception as e:
        print(f"CAUGHT EXCEPTION: {e}")
        import traceback
        traceback.print_exc()
