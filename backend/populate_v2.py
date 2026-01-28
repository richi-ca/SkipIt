from app import create_app, db
from app.models import User, Role, Gender, Menu, Category, Product, ProductVariation, Event, ContentBlock
from datetime import datetime, date, time, timedelta
import os
import random

def populate_db():
    app = create_app()
    with app.app_context():
        # Reiniciar base de datos
        db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sqlite.db')
        if os.path.exists(db_path):
            os.remove(db_path)
            print("Base de datos anterior eliminada.")
        
        db.create_all()
        print("Tablas creadas exitosamente.")

        # --- 0. Crear Bloques de Contenido (CMS) ---
        print("Creando contenidos CMS...")
        cms_blocks = [
            ContentBlock(key='quienes_somos', content='Somos SkipIT, la plataforma que revoluciona la forma de disfrutar eventos. Creamos la solución perfecta para que pases más tiempo bailando y menos tiempo haciendo fila.'),
            ContentBlock(key='mision', content='Nuestra misión es eliminar las filas y maximizar la diversión, ofreciendo una experiencia fluida y rápida.'),
            ContentBlock(key='vision', content='Ser la plataforma líder global en gestión de experiencia en eventos, reconocida por nuestra innovación y servicio.')
        ]
        db.session.add_all(cms_blocks)

        # --- 1. Crear Usuarios (Perfiles) ---
        print("Creando usuarios...")
        
        # Cliente
        cliente = User(
            id="cliente1",
            name="Usuario Cliente",
            email="cliente@skipit.com",
            password="password123", # En un caso real, esto debería estar hasheado
            has_priority_access=False,
            role=Role.user_cli,
            dob=date(2000, 1, 1),
            gender=Gender.M
        )

        # Administrador
        admin = User(
            id="admin1",
            name="Super Admin",
            email="admin@skipit.com",
            password="adminpassword",
            has_priority_access=True,
            role=Role.admin
        )

        # Operador de Barra
        operador = User(
            id="operador1",
            name="Barra Operator",
            email="barra@skipit.com",
            password="barrapassword",
            role=Role.scanner
        )

        db.session.add_all([cliente, admin, operador])

        # --- 2. Crear Catálogo Base ---
        print("Creando catálogo...")
        
        # Menú
        menu_principal = Menu(name="Menú Principal")
        db.session.add(menu_principal)
        db.session.flush() # Para obtener el ID del menú

        # Categorías
        cat_tragos = Category(menu_id=menu_principal.id, name="Tragos", display_order=1)
        cat_cervezas = Category(menu_id=menu_principal.id, name="Cervezas", display_order=2)
        db.session.add_all([cat_tragos, cat_cervezas])
        db.session.flush()

        # Productos y Variaciones
        # Pisco
        prod_pisco = Product(category_id=cat_tragos.id, name="Pisco", description="Pisco premium", image_url="pisco.jpg")
        db.session.add(prod_pisco)
        db.session.flush()
        
        var_pisco_vaso = ProductVariation(product_id=prod_pisco.id, name="Vaso", price=5000, stock=100)
        var_pisco_jarrra = ProductVariation(product_id=prod_pisco.id, name="Jarra", price=12000, stock=50)
        db.session.add_all([var_pisco_vaso, var_pisco_jarrra])

        # Cerveza
        prod_cerveza = Product(category_id=cat_cervezas.id, name="Cerveza Artesanal", description="Rubia, Roja o Negra", image_url="cerveza.jpg")
        db.session.add(prod_cerveza)
        db.session.flush()

        var_cerveza_pint = ProductVariation(product_id=prod_cerveza.id, name="Pinta 500cc", price=4500, stock=200)
        db.session.add(var_cerveza_pint)

        # --- 3. Crear Evento de Prueba (Futuro) ---
        print("Creando evento principal...")
        # Evento para el próximo mes (Futuro seguro)
        event_date_ref = date.today() + timedelta(days=20)
        
        evento = Event(
            menu_id=menu_principal.id,
            name="Fiesta de Inauguración",
            overlay_title="Gran Apertura SkipIT",
            iso_date=event_date_ref, 
            start_time=time(22, 0),
            end_time=time(5, 0),
            location="Club SkipIT, Santiago",
            price=15000,
            rating=5.0,
            type="Fiesta",
            is_featured=True,
            is_active=True,
            carousel_order=1,
            # Visible desde hace 5 días hasta 2 días después del evento
            valid_from=date.today() - timedelta(days=5),
            valid_until=event_date_ref + timedelta(days=2),
            image_url="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
        )
        db.session.add(evento)

        # --- 4. Crear 50 Eventos Aleatorios (2025-2027) ---
        print("Generando 50 eventos de ejemplo para 2025-2027...")
        
        event_types = ["Fiesta", "Concierto", "Festival", "Electrónica", "Reggaeton", "Rock", "Jazz", "VIP"]
        locations = ["Club SkipIT", "Estadio Nacional", "Arena Santiago", "Parque O'Higgins", "Teatro Caupolicán", "Sala SCD"]
        adjectives = ["Increíble", "Mágico", "Explosivo", "Noche de", "Sunset", "Amanecer", "Verano", "Invierno"]
        
        start_date = date(2025, 1, 1)
        end_date = date(2027, 12, 31)
        delta_days = (end_date - start_date).days

        for i in range(50):
            # Fecha aleatoria
            random_days = random.randrange(delta_days)
            event_date = start_date + timedelta(days=random_days)
            
            # Datos aleatorios
            evt_type = random.choice(event_types)
            evt_name = f"{random.choice(adjectives)} {evt_type}"
            if random.random() > 0.7: 
                evt_name += f" #{i+1}"
            
            evt_price = random.choice([5000, 10000, 15000, 20000, 25000, 3500, 0])
            evt_rating = round(random.uniform(3.0, 5.0), 1)
            
            # Hora aleatoria (noche)
            hour = random.randint(20, 23)
            start_t = time(hour, 0)
            end_t = time((hour + 6) % 24, 0) # Dura 6 horas aprox

            # Map types to images
            type_images = {
                "Fiesta": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
                "Concierto": "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
                "Festival": "https://images.unsplash.com/photo-1506157786151-b8491531f063",
                "Electrónica": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
                "Reggaeton": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
                "Rock": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Queen_performing_1984.jpg",
                "Jazz": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
                "VIP": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Soda_Stereo_en_vivo_1987.jpg"
            }
            
            img_url = type_images.get(evt_type, f"https://picsum.photos/seed/{i}/800/400")
            
            # Determinar vigencia
            v_from = event_date - timedelta(days=random.randint(10, 30))
            v_until = event_date + timedelta(days=2)

            new_event = Event(
                menu_id=menu_principal.id,
                name=evt_name,
                overlay_title=f"{evt_type} en {event_date.strftime('%B')}",
                iso_date=event_date,
                start_time=start_t,
                end_time=end_t,
                location=random.choice(locations),
                price=evt_price,
                rating=evt_rating,
                type=evt_type,
                is_featured=random.choice([True, False]),
                is_active=True,
                carousel_order=None,
                valid_from=v_from,
                valid_until=v_until,
                image_url=img_url
            )
            db.session.add(new_event)

        # Confirmar cambios
        try:
            db.session.commit()
            print("Datos poblados exitosamente!")
        except Exception as e:
            db.session.rollback()
            print(f"Error al poblar la base de datos: {e}")

if __name__ == '__main__':
    populate_db()
