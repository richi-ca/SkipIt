from app import create_app, db
from app.models import Event
from datetime import date
from sqlalchemy import or_

app = create_app()
with app.app_context():
    today = date.today()
    print(f"Today (python date.today): {today}")
    
    # Check simple query
    events = Event.query.all()
    print(f"Total events: {len(events)}")
    for e in events[:5]:
        print(f"ID: {e.id}, Name: {e.name}, Feat: {e.is_featured}, Active: {e.is_active}, From: {e.valid_from}, Until: {e.valid_until}")
        
    # Check featured
    featured = Event.query.filter(Event.is_featured == True).all()
    print(f"Featured unfiltered count: {len(featured)}")
    
    # Check the actual logic
    filtered = Event.query.filter(
        Event.is_featured == True,
        or_(Event.valid_from == None, Event.valid_from <= today),
        or_(Event.valid_until == None, Event.valid_until >= today)
    ).all()
    print(f"Filtered count (logic): {len(filtered)}")
