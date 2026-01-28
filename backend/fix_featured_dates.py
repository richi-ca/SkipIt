from app import create_app, db
from app.models import Event
from datetime import date

app = create_app()
with app.app_context():
    # Pick 5 featured events to make active
    events = Event.query.filter(Event.is_featured==True).limit(5).all()
    print(f"Updating {len(events)} events to be valid today...")
    
    start = date(2026, 1, 1)
    end = date(2026, 6, 1)
    
    for e in events:
        e.valid_from = start
        e.valid_until = end
        print(f"Updated {e.name} ({e.id}) to be valid from {start} to {end}")
        
    db.session.commit()
    print("Done.")
