from app import create_app, db
from app.models import Event
from datetime import date

app = create_app()
with app.app_context():
    today = date.today()
    print(f"Today: {today}")
    featured = Event.query.filter_by(is_featured=True).all()
    print(f"Total featured: {len(featured)}")
    for e in featured:
        bg = "VALID"
        if e.valid_until and e.valid_until < today: bg = "EXPIRED"
        if e.valid_from and e.valid_from > today: bg = "FUTURE"
        print(f"ID: {e.id}, Name: {e.name}, From: {e.valid_from}, Until: {e.valid_until}, Status: {bg}")
