from app import create_app, db
from app.models import User, Role, Gender, Menu, Category, Product, ProductVariation, Event, ContentBlock
from datetime import datetime, date, time, timedelta
import os

def populate_db():
    app = create_app()
    with app.app_context():
        # Reiniciar base de datos
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sqlite.db')
        if os.path.exists(db_path):
            try:
                os.remove(db_path)
                print("Base de datos anterior eliminada.")
            except PermissionError:
                print("No se pudo eliminar la DB (archivo en uso), procediendo a limpiar tablas...")
        
        db.create_all()
        print("Estructura de tablas creada exitosamente.")
        seed_data()

def seed_data():
    # --- 0. Crear Bloques de Contenido (CMS) ---
    print("Creando contenidos CMS...")
    cms_blocks = [
        ContentBlock(key='quienes_somos', content='Somos SkipIT, la plataforma que revoluciona la forma de disfrutar eventos.'),
        ContentBlock(key='mision', content='Nuestra misión es eliminar las filas y maximizar la diversión.'),
        ContentBlock(key='vision', content='Ser la plataforma líder global en gestión de experiencia en eventos.')
    ]
    db.session.add_all(cms_blocks)

    # --- 1. Crear Usuarios ---
    print("Creando usuarios...")
    usuarios = [
        User(id="cliente1", name="Usuario Cliente", email="cliente@skipit.com", password="password123", role=Role.user_cli, dob=date(2000, 1, 1), gender=Gender.M),
        User(id="admin1", name="Super Admin", email="admin@skipit.com", password="adminpassword", role=Role.admin, has_priority_access=True),
        User(id="operador1", name="Barra Operator", email="barra@skipit.com", password="barrapassword", role=Role.scanner)
    ]
    db.session.add_all(usuarios)

    # --- 2. Crear Catálogo Base ---
    print("Creando catálogo y productos...")
    menu_principal = Menu(name="Menú Principal")
    db.session.add(menu_principal)
    db.session.flush()

    cat_tragos = Category(name="Tragos", display_order=1)
    cat_cervezas = Category(name="Cervezas", display_order=2)
    db.session.add_all([cat_tragos, cat_cervezas])
    db.session.flush()

    # --- 3. Definición de los 15 Eventos (Sin el campo price) ---
    print("Procesando lista de 15 eventos...")
    
    events_data = [
        {"id": 1, "menu_id": menu_principal.id, "name": "Stand Up Comedy: Risas Garantizadas", "overlay_title": "¡Noche de Carcajadas!", "iso_date": "2025-07-12", "start_time": "21:00:00", "end_time": "23:00:00", "location": "Teatro Caupolicán", "image_url": "standup_comedy.jpg", "rating": 4.8, "type": "Entretenimiento", "is_featured": True, "carousel_order": 1},
        {"id": 2, "menu_id": menu_principal.id, "name": "Festival de Invierno 2025", "overlay_title": "Música Bajo la Lluvia", "iso_date": "2025-06-15", "start_time": "14:00:00", "end_time": "23:30:00", "location": "Parque Padre Hurtado", "image_url": "festival.jpg", "rating": 4.5, "type": "Festival", "is_featured": True, "carousel_order": 2},
        {"id": 3, "menu_id": menu_principal.id, "name": "Tributo a Queen: Live Forever", "overlay_title": "Leyendas del Rock", "iso_date": "2025-08-05", "start_time": "22:00:00", "end_time": "00:30:00", "location": "Hard Rock Cafe", "image_url": "concierto_rock.jpg", "rating": 4.9, "type": "Rock", "is_featured": False, "carousel_order": None},
        {"id": 4, "menu_id": menu_principal.id, "name": "Noche de Jazz & Blues", "overlay_title": "Melodías de Medianoche", "iso_date": "2025-09-20", "start_time": "20:30:00", "end_time": "23:00:00", "location": "The Jazz Corner", "image_url": "concierto_jazz.jpg", "rating": 4.7, "type": "Jazz", "is_featured": False, "carousel_order": None},
        {"id": 5, "menu_id": menu_principal.id, "name": "Tech House Underground", "overlay_title": "Bajo las Luces Laser", "iso_date": "2025-10-31", "start_time": "23:50:00", "end_time": "05:00:00", "location": "Bunker Club", "image_url": "luces_laser.jpg", "rating": 4.6, "type": "Electrónica", "is_featured": True, "carousel_order": 3},
        {"id": 6, "menu_id": menu_principal.id, "name": "Campeonato de Tenis Senior", "overlay_title": "Pasión en la Cancha", "iso_date": "2025-11-12", "start_time": "09:00:00", "end_time": "18:00:00", "location": "Club de Tenis Santiago", "image_url": "tenis.jpg", "rating": 4.2, "type": "Deporte", "is_featured": False, "carousel_order": None},
        {"id": 7, "menu_id": menu_principal.id, "name": "Gran Final Universitaria", "overlay_title": "Todo por el Balón", "iso_date": "2025-12-05", "start_time": "16:00:00", "end_time": "19:00:00", "location": "Estadio Nacional", "image_url": "futbol.jpg", "rating": 4.4, "type": "Deporte", "is_featured": False, "carousel_order": None},
        {"id": 8, "menu_id": menu_principal.id, "name": "Concierto Año Nuevo", "overlay_title": "Explosión de Luces", "iso_date": "2026-01-01", "start_time": "01:00:00", "end_time": "06:00:00", "location": "Torre Entel", "image_url": "explosion_luces.jpg", "rating": 4.9, "type": "Evento Público", "is_featured": True, "carousel_order": 4},
        {"id": 9, "menu_id": menu_principal.id, "name": "Gala de Música Clásica", "overlay_title": "Elegancia y Armonía", "iso_date": "2026-01-15", "start_time": "19:30:00", "end_time": "22:00:00", "location": "Teatro Municipal", "image_url": "musica_clasica.jpg", "rating": 4.8, "type": "Cultura", "is_featured": False, "carousel_order": None},
        {"id": 10, "menu_id": menu_principal.id, "name": "Show Infantil: Aventuras Mágicas", "overlay_title": "Diversión para Niños", "iso_date": "2026-02-02", "start_time": "11:00:00", "end_time": "13:00:00", "location": "Matucana 100", "image_url": "espectaculo_infantil.jpg", "rating": 4.3, "type": "Infantil", "is_featured": False, "carousel_order": None},
        {"id": 11, "menu_id": menu_principal.id, "name": "Tour de Artista Internacional", "overlay_title": "El Concierto del Año", "iso_date": "2026-02-18", "start_time": "21:00:00", "end_time": "23:45:00", "location": "Movistar Arena", "image_url": "artista_internacional.jpg", "rating": 5.0, "type": "Concierto", "is_featured": True, "carousel_order": 5},
        {"id": 12, "menu_id": menu_principal.id, "name": "Cierre de Verano Electrónico", "overlay_title": "Vibras Tecno", "iso_date": "2026-02-28", "start_time": "22:00:00", "end_time": "05:00:00", "location": "Espacio Riesco", "image_url": "tecno.jpg", "rating": 4.6, "type": "Electrónica", "is_featured": False, "carousel_order": None},
        {"id": 13, "menu_id": menu_principal.id, "name": "Noche de Cantautores", "overlay_title": "Voz y Sentimiento", "iso_date": "2025-08-22", "start_time": "20:00:00", "end_time": "22:30:00", "location": "Teatro Nescafé", "image_url": "cantante.jpg", "rating": 4.7, "type": "Concierto", "is_featured": False, "carousel_order": None},
        {"id": 14, "menu_id": menu_principal.id, "name": "Concierto Láser: Verde y Azul", "overlay_title": "Inmersión Visual", "iso_date": "2025-11-20", "start_time": "21:30:00", "end_time": "23:00:00", "location": "Planetario", "image_url": "laser_verde_y_azul.jpg", "rating": 4.5, "type": "Show Visual", "is_featured": False, "carousel_order": None},
        {"id": 15, "menu_id": menu_principal.id, "name": "Festival de Rock: Cerca de la Reja", "overlay_title": "Energía Pura", "iso_date": "2026-03-01", "start_time": "15:00:00", "end_time": "23:55:00", "location": "Club Hípico", "image_url": "cerca_de_la_reja.jpg", "rating": 4.9, "type": "Rock", "is_featured": True, "carousel_order": 6}
    ]

    for ev in events_data:
        event_date = datetime.strptime(ev["iso_date"], "%Y-%m-%d").date()
        s_time = datetime.strptime(ev["start_time"], "%H:%M:%S").time()
        e_time = datetime.strptime(ev["end_time"], "%H:%M:%S").time()

        nuevo_evento = Event(
            menu_id=ev["menu_id"],
            name=ev["name"],
            overlay_title=ev["overlay_title"],
            iso_date=event_date,
            start_time=s_time,
            end_time=e_time,
            location=ev["location"],
            # price ha sido removido
            rating=ev["rating"],
            type=ev["type"],
            is_featured=ev["is_featured"],
            carousel_order=ev["carousel_order"],
            image_url=ev["image_url"],
            valid_from=event_date - timedelta(days=30),
            valid_until=event_date + timedelta(days=1),
            created_at=datetime.now()
        )
        db.session.add(nuevo_evento)

    try:
        db.session.commit()
        print(f"Poblamiento finalizado. Se crearon {len(events_data)} eventos sin campo de precio.")
    except Exception as e:
        db.session.rollback()
        print(f"Error al poblar eventos: {e}")

if __name__ == '__main__':
    populate_db()