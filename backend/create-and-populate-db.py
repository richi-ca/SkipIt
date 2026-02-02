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
        ContentBlock(key='quienes_somos', content='Somos SkipIT, la plataforma que revoluciona la forma de disfrutar eventos. Creamos la solución perfecta para que pases más tiempo bailando y menos tiempo haciendo fila.'),
        ContentBlock(key='mision', content='Disminuir el tiempo de espera para canjear tragos en eventos, ofreciendo una experiencia rápida, fluida y segura.'),
        ContentBlock(key='vision', content='Convertirnos en un ícono de la entretención moderna, inspirando una nueva forma de disfrutar los eventos masivos: sin esperas, con menos filas, y creando momentos inolvidables.')
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

    categories_data = [
        {
            "name": "Cervezas (Brewed Beverages)",
            "description": "Incluye todo lo derivado de la fermentación de cereales. Desde las Lager industriales hasta las Artesanales (IPA, Stout, Porter) y versiones sin alcohol."
        },
        {
            "name": "Destilados Puros (Spirits / Neat)",
            "description": "Bebidas de alta graduación servidas solas o \"on the rocks\". Aquí entran el Pisco, Whisky, Tequila, Vodka, Ron y Gin sin mezcla adicional."
        },
        {
            "name": "Combinados Clásicos (Mixers / Highballs)",
            "description": "La base de los eventos masivos. Mezcla directa de un destilado con una bebida carbonatada o jugo. Ejemplos: Piscola, Gin Tonic, Cuba Libre o Fernet con Coca."
        },
        {
            "name": "Coctelería de Autor & Mixología",
            "description": "Tragos complejos que requieren técnica (shaker, refrescado) y ingredientes específicos (bitters, jarabes, botánicos). Aquí clasificarías tus Margaritas, Mojitos, Negronis y creaciones exclusivas del evento."
        },
        {
            "name": "Vinos y Derivados (Viticultura)",
            "description": "Abarca Vino Tinto, Blanco, Rosado y preparados típicos chilenos como el Terremoto o la Sangría."
        },
        {
            "name": "Espumantes y Sidras",
            "description": "Categoría para celebraciones y sectores VIP. Incluye Champagne, Prosecco, Cava y Sidras de manzana o pera."
        },
        {
            "name": "Licores y Digestivos",
            "description": "Bebidas dulces o herbales de menor graduación que suelen servirse al final o como base de otros tragos. Ejemplos: Manzanilla, Amaretto, Baileys o Limoncello."
        },
        {
            "name": "Bebidas Analcohólicas (Soft Drinks)",
            "description": "Todo lo que no contiene alcohol: Gaseosas (bebidas), Aguas minerales, Jugos de fruta y Bebidas Isotónicas."
        },
        {
            "name": "Bebidas Energéticas",
            "description": "Aunque son analcohólicas, en eventos masivos se manejan aparte por su alto costo y uso frecuente para \"bombas\" o mezclas con Vodka y Jägermeister."
        },
        {
            "name": "Mocktails (Coctelería 0%)",
            "description": "Esta categoría es técnica: son tragos que imitan la complejidad de un cóctel (presentación, mezcla de sabores) pero con 0% alcohol, como un Mojito Virgin."
        }
    ]

    for cat_data in categories_data:
        cat = Category(name=cat_data["name"], description=cat_data["description"])
        db.session.add(cat)
    
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
            # valid_from and valid_until removed
            created_at=datetime.now()
        )
        db.session.add(nuevo_evento)

    # --- 4. Crear Productos ---
    print("Creando productos...")
    
    products_data = {
        "products": [
            { "id": 1, "category_id": 1, "name": "Lager Tradicional", "description": "Cerveza rubia, ligera y muy refrescante, ideal para eventos masivos.", "image_url": "Cervezas - Lager Tradicional.jpg", "price": 4500 },
            { "id": 2, "category_id": 1, "name": "IPA (India Pale Ale)", "description": "Intenso amargor con notas cítricas y florales derivadas del lúpulo.", "image_url": "Cervezas - IPA (India Pale Ale).jpg", "price": 5500 },
            { "id": 3, "category_id": 1, "name": "Stout", "description": "Cerveza negra con notas tostadas de café y chocolate amargo.", "image_url": "Cervezas - Stout.jpg", "price": 5800 },
            { "id": 4, "category_id": 1, "name": "Amber Ale", "description": "Equilibrio perfecto entre malta dulce y un amargor moderado.", "image_url": "Cervezas - Amber Ale.jpg", "price": 5200 },
            { "id": 5, "category_id": 1, "name": "Pilsen", "description": "Estilo clásico europeo, cristalina y con final seco.", "image_url": "Cervezas - Pilsen.jpg", "price": 4300 },
            { "id": 6, "category_id": 1, "name": "Hefeweizen", "description": "Cerveza de trigo de estilo alemán, turbia y con notas a banana y clavo.", "image_url": "Cervezas - Hefeweizen.jpg", "price": 5600 },
            { "id": 7, "category_id": 1, "name": "Porter", "description": "Oscura y cremosa, con un perfil de malta más suave que la Stout.", "image_url": "Cervezas - Porter.jpg", "price": 5700 },
            { "id": 8, "category_id": 1, "name": "Honey Beer", "description": "Cerveza rubia con un toque de miel natural para un final dulce.", "image_url": "Cervezas - Honey Beer.jpg", "price": 5400 },
            { "id": 9, "category_id": 1, "name": "Cerveza sin Alcohol", "description": "Todo el sabor del lúpulo pero con 0.0% de graduación.", "image_url": "Cervezas - Cerveza sin Alcohol.jpg", "price": 4000 },
            { "id": 10, "category_id": 1, "name": "Red Ale", "description": "Caracterizada por su color rojizo y sabores a caramelo y bizcocho.", "image_url": "Cervezas - Red Ale.jpg", "price": 5300 },

            { "id": 11, "category_id": 2, "name": "Pisco Chileno", "description": "Destilado de uva transparente, ideal para degustar solo o con hielo.", "image_url": None, "price": 6500 },
            { "id": 12, "category_id": 2, "name": "Whisky Escocés (Scotch)", "description": "Añejado en barricas, con notas ahumadas y de madera.", "image_url": None, "price": 8500 },
            { "id": 13, "category_id": 2, "name": "Tequila Blanco", "description": "Destilado de agave puro, con carácter fuerte y notas terrosas.", "image_url": None, "price": 7800 },
            { "id": 14, "category_id": 2, "name": "Vodka Premium", "description": "Destilado neutro de alta pureza, filtrado múltiples veces.", "image_url": None, "price": 7200 },
            { "id": 15, "category_id": 2, "name": "Ron Añejo", "description": "Ron oscuro con notas de vainilla, roble y frutos secos.", "image_url": None, "price": 7000 },
            { "id": 16, "category_id": 2, "name": "Gin London Dry", "description": "Destilado de grano con marcado aroma a bayas de enebro.", "image_url": None, "price": 7500 },
            { "id": 17, "category_id": 2, "name": "Bourbon", "description": "Whisky americano de maíz con un perfil dulce y avainillado.", "image_url": None, "price": 8000 },
            { "id": 18, "category_id": 2, "name": "Tequila Reposado", "description": "Añejado brevemente en madera para suavizar su potencia.", "image_url": None, "price": 8200 },
            { "id": 19, "category_id": 2, "name": "Grappa", "description": "Destilado italiano de orujo de uva, potente y aromático.", "image_url": None, "price": 9000 },
            { "id": 20, "category_id": 2, "name": "Cognac", "description": "Destilado de vino francés de alta gama, complejo y elegante.", "image_url": None, "price": 12000 },

            { "id": 21, "category_id": 3, "name": "Piscola", "description": "El clásico chileno; Pisco mezclado con bebida de cola y mucho hielo.", "image_url": None, "price": 6000 },
            { "id": 22, "category_id": 3, "name": "Gin Tonic", "description": "Gin mezclado con agua tónica y una rodaja de limón o pepino.", "image_url": None, "price": 7000 },
            { "id": 23, "category_id": 3, "name": "Ron Cola (Cuba Libre)", "description": "Ron blanco con bebida de cola y un toque de limón.", "image_url": None, "price": 6200 },
            { "id": 24, "category_id": 3, "name": "Vodka Tónica", "description": "Mezcla refrescante de vodka con agua tónica premium.", "image_url": None, "price": 6800 },
            { "id": 25, "category_id": 3, "name": "Tequila con Sprite", "description": "Mezcla cítrica de tequila blanco y bebida lima-limón.", "image_url": None, "price": 6900 },
            { "id": 26, "category_id": 3, "name": "Fernet con Coca", "description": "Clásico rioplatense de licor de hierbas con bebida de cola.", "image_url": None, "price": 6500 },
            { "id": 27, "category_id": 3, "name": "Vodka Naranja (Destornillador)", "description": "Combinación simple de vodka con jugo de naranja.", "image_url": None, "price": 6300 },
            { "id": 28, "category_id": 3, "name": "Whisky con Ginger Ale", "description": "El dulzor del jengibre resalta las notas del whisky.", "image_url": None, "price": 7500 },
            { "id": 29, "category_id": 3, "name": "Pisco Ginger", "description": "Pisco con bebida de jengibre y un toque de menta.", "image_url": None, "price": 6700 },
            { "id": 30, "category_id": 3, "name": "Campari Orange", "description": "Amargo italiano mezclado con jugo de naranja natural.", "image_url": None, "price": 7200 },

            { "id": 31, "category_id": 4, "name": "Mojito Tradicional", "description": "Ron, menta fresca, azúcar, limón y un toque de soda.", "image_url": None, "price": 7500 },
            { "id": 32, "category_id": 4, "name": "Margarita", "description": "Tequila, triple sec y jugo de limón con borde de sal.", "image_url": None, "price": 7800 },
            { "id": 33, "category_id": 4, "name": "Negroni", "description": "Partes iguales de Gin, Vermut rojo y Campari.", "image_url": None, "price": 8200 },
            { "id": 34, "category_id": 4, "name": "Old Fashioned", "description": "Whisky, azúcar, amargo de angostura y cáscara de naranja.", "image_url": None, "price": 8500 },
            { "id": 35, "category_id": 4, "name": "Caipirinha", "description": "Cachaça brasileña machacada con trozos de limón de pica y azúcar.", "image_url": None, "price": 7400 },
            { "id": 36, "category_id": 4, "name": "Espresso Martini", "description": "Vodka, licor de café y una carga de café espresso recién hecho.", "image_url": None, "price": 8800 },
            { "id": 37, "category_id": 4, "name": "Aperol Spritz", "description": "Aperol, espumante, un toque de soda y rodaja de naranja.", "image_url": None, "price": 7600 },
            { "id": 38, "category_id": 4, "name": "Pisco Sour", "description": "Pisco, jugo de limón, azúcar flor y clara de huevo.", "image_url": None, "price": 7200 },
            { "id": 39, "category_id": 4, "name": "Cosmopolitan", "description": "Vodka, triple sec, jugo de arándanos y limón.", "image_url": None, "price": 7900 },
            { "id": 40, "category_id": 4, "name": "Moscow Mule", "description": "Vodka, cerveza de jengibre y limón, servido en jarro de cobre.", "image_url": None, "price": 8000 },

            { "id": 41, "category_id": 5, "name": "Cabernet Sauvignon", "description": "Vino tinto con cuerpo, ideal para acompañar carnes.", "image_url": None, "price": 6800 },
            { "id": 42, "category_id": 5, "name": "Sauvignon Blanc", "description": "Vino blanco joven, fresco y con notas cítricas.", "image_url": None, "price": 6500 },
            { "id": 43, "category_id": 5, "name": "Carmenere", "description": "El sello de Chile; tinto suave con notas a pimienta verde.", "image_url": None, "price": 6900 },
            { "id": 44, "category_id": 5, "name": "Chardonnay", "description": "Blanco con cuerpo, a veces con notas a madera y piña.", "image_url": None, "price": 7000 },
            { "id": 45, "category_id": 5, "name": "Merlot", "description": "Tinto delicado y frutoso, fácil de beber.", "image_url": None, "price": 6600 },
            { "id": 46, "category_id": 5, "name": "Rosé", "description": "Vino rosado ligero, perfecto para tardes de verano.", "image_url": None, "price": 6200 },
            { "id": 47, "category_id": 5, "name": "Terremoto", "description": "Pipeño, helado de piña y un toque de granadina o amargo.", "image_url": None, "price": 5500 },
            { "id": 48, "category_id": 5, "name": "Sangría", "description": "Mezcla de vino tinto, frutas picadas y un toque de licor.", "image_url": None, "price": 5800 },
            { "id": 49, "category_id": 5, "name": "Clery", "description": "Vino blanco mezclado con frutillas frescas picadas.", "image_url": None, "price": 5600 },
            { "id": 50, "category_id": 5, "name": "Vino Navegado", "description": "Tinto caliente con naranja, canela y azúcar (ideal para invierno).", "image_url": None, "price": 5700 },

            { "id": 51, "category_id": 6, "name": "Brut", "description": "Espumante seco, el estándar para brindis y celebraciones.", "image_url": None, "price": 9000 },
            { "id": 52, "category_id": 6, "name": "Extra Brut", "description": "Versión aún más seca y elegante que el Brut.", "image_url": None, "price": 9500 },
            { "id": 53, "category_id": 6, "name": "Demi-Sec", "description": "Espumante con un toque de dulzor, ideal para postres.", "image_url": None, "price": 8800 },
            { "id": 54, "category_id": 6, "name": "Moscato", "description": "Espumante dulce y muy aromático, con notas florales.", "image_url": None, "price": 8500 },
            { "id": 55, "category_id": 6, "name": "Prosseco", "description": "Espumante italiano ligero, afrutado y muy refrescante.", "image_url": None, "price": 9200 },
            { "id": 56, "category_id": 6, "name": "Champagne", "description": "Espumante francés auténtico de la región de Champaña.", "image_url": None, "price": 14000 },
            { "id": 57, "category_id": 6, "name": "Cava", "description": "Espumante español elaborado mediante el método tradicional.", "image_url": None, "price": 8700 },
            { "id": 58, "category_id": 6, "name": "Sidra de Manzana", "description": "Bebida fermentada de manzana, dulce y con burbuja fina.", "image_url": None, "price": 5000 },
            { "id": 59, "category_id": 6, "name": "Sidra de Pera", "description": "Alternativa delicada y muy aromática a la sidra tradicional.", "image_url": None, "price": 5200 },
            { "id": 60, "category_id": 6, "name": "Rosé Sparkling", "description": "Espumante rosado, visualmente atractivo y frutal.", "image_url": None, "price": 8900 },

            { "id": 61, "category_id": 7, "name": "Amaretto", "description": "Licor dulce italiano con aroma y sabor a almendras.", "image_url": None, "price": 7200 },
            { "id": 62, "category_id": 7, "name": "Baileys", "description": "Crema de whisky irlandés, suave y muy dulce.", "image_url": None, "price": 7500 },
            { "id": 63, "category_id": 7, "name": "Limoncello", "description": "Licor cítrico italiano elaborado con cáscaras de limón.", "image_url": None, "price": 7000 },
            { "id": 64, "category_id": 7, "name": "Jägermeister", "description": "Licor de hierbas alemán, complejo y muy potente.", "image_url": None, "price": 7800 },
            { "id": 65, "category_id": 7, "name": "Kahlúa", "description": "Licor mexicano a base de granos de café y ron.", "image_url": None, "price": 7300 },
            { "id": 66, "category_id": 7, "name": "Manzanilla", "description": "Destilado de anís, tradicional para después de las comidas.", "image_url": None, "price": 6500 },
            { "id": 67, "category_id": 7, "name": "Menta", "description": "Licor refrescante de color verde brillante, muy digestivo.", "image_url": None, "price": 6400 },
            { "id": 68, "category_id": 7, "name": "Triple Sec", "description": "Licor de naranja esencial para la coctelería clásica.", "image_url": None, "price": 7000 },
            { "id": 69, "category_id": 7, "name": "Frangelico", "description": "Licor de avellanas con notas de vainilla y cacao.", "image_url": None, "price": 7600 },
            { "id": 70, "category_id": 7, "name": "Licor de Cacao", "description": "Dulce y espeso, ideal para tragos tipo postre.", "image_url": None, "price": 7100 },

            { "id": 71, "category_id": 8, "name": "Agua Mineral sin Gas", "description": "Agua pura de vertiente, esencial para la hidratación.", "image_url": None, "price": 2500 },
            { "id": 72, "category_id": 8, "name": "Agua Mineral con Gas", "description": "Agua carbonatada refrescante y digestiva.", "image_url": None, "price": 2700 },
            { "id": 73, "category_id": 8, "name": "Coca-Cola", "description": "La clásica bebida de cola preferida a nivel mundial.", "image_url": None, "price": 3000 },
            { "id": 74, "category_id": 8, "name": "Sprite", "description": "Bebida lima-limón transparente y muy refrescante.", "image_url": None, "price": 3000 },
            { "id": 75, "category_id": 8, "name": "Fanta Naranja", "description": "Bebida carbonatada con intenso sabor a naranja.", "image_url": None, "price": 3000 },
            { "id": 76, "category_id": 8, "name": "Jugo de Naranja Natural", "description": "Exprimido en el momento, rico en Vitamina C.", "image_url": None, "price": 3500 },
            { "id": 77, "category_id": 8, "name": "Jugo de Piña", "description": "Jugo tropical dulce y refrescante.", "image_url": None, "price": 3500 },
            { "id": 78, "category_id": 8, "name": "Ginger Ale", "description": "Bebida de jengibre suave, ideal para mezclas o sola.", "image_url": None, "price": 3200 },
            { "id": 79, "category_id": 8, "name": "Agua Tónica", "description": "Bebida amarga con quinina, compañera del Gin.", "image_url": None, "price": 3200 },
            { "id": 80, "category_id": 8, "name": "Limonada Menta Jengibre", "description": "Jugo de limón natural con toques frescos.", "image_url": None, "price": 3600 },

            { "id": 81, "category_id": 9, "name": "Red Bull", "description": "La energética más famosa, con taurina y cafeína.", "image_url": None, "price": 5000 },
            { "id": 82, "category_id": 9, "name": "Monster Energy", "description": "Sabor intenso y formato grande para máxima energía.", "image_url": None, "price": 5200 },
            { "id": 83, "category_id": 9, "name": "Red Bull Sugarfree", "description": "Versión sin azúcar de la clásica energética.", "image_url": None, "price": 5000 },
            { "id": 84, "category_id": 9, "name": "Monster Ultra", "description": "Línea de energéticas sin calorías y sabores ligeros.", "image_url": None, "price": 5300 },
            { "id": 85, "category_id": 9, "name": "Score", "description": "Alternativa potente para mantenerse despierto en el evento.", "image_url": None, "price": 4500 },
            { "id": 86, "category_id": 9, "name": "Mr. Big", "description": "Energética de gran formato muy común en barras masivas.", "image_url": None, "price": 4800 },
            { "id": 87, "category_id": 9, "name": "Red Bull Tropical", "description": "Versión con sabores de frutas exóticas.", "image_url": None, "price": 5200 },
            { "id": 88, "category_id": 9, "name": "Monster Mango Loco", "description": "Sabor a jugo de mango con el punch de energía.", "image_url": None, "price": 5400 },
            { "id": 89, "category_id": 9, "name": "Energética de Arándano", "description": "Sabor frutal intenso con propiedades estimulantes.", "image_url": None, "price": 4700 },
            { "id": 90, "category_id": 9, "name": "Shot de Energía", "description": "Concentrado de cafeína para un efecto inmediato.", "image_url": None, "price": 4200 },

            { "id": 91, "category_id": 10, "name": "Virgin Mojito", "description": "Menta, limón y soda, sin una gota de ron.", "image_url": None, "price": 4800 },
            { "id": 92, "category_id": 10, "name": "Piña Colada Virgin", "description": "Crema de coco y jugo de piña licuados con hielo.", "image_url": None, "price": 5200 },
            { "id": 93, "category_id": 10, "name": "Shirley Temple", "description": "Ginger ale, un toque de granadina y cerezas.", "image_url": None, "price": 4500 },
            { "id": 94, "category_id": 10, "name": "San Francisco", "description": "Mezcla de jugos de naranja, piña, limón y granadina.", "image_url": None, "price": 5000 },
            { "id": 95, "category_id": 10, "name": "Margarita de Fresa 0%", "description": "Frutillas frescas, limón y hielo frappe.", "image_url": None, "price": 5300 },
            { "id": 96, "category_id": 10, "name": "Caipiriña sin Alcohol", "description": "Limón de pica y azúcar machacados con soda.", "image_url": None, "price": 4700 },
            { "id": 97, "category_id": 10, "name": "Lemon Drop Virgin", "description": "Jugo de limón, almíbar simple y borde de azúcar.", "image_url": None, "price": 4600 },
            { "id": 98, "category_id": 10, "name": "Virgin Mary", "description": "Jugo de tomate, especias y limón, sin vodka.", "image_url": None, "price": 4800 },
            { "id": 99, "category_id": 10, "name": "Apple Fizz", "description": "Jugo de manzana, jugo de limón y agua con gas.", "image_url": None, "price": 4700 },
            { "id": 100, "category_id": 10, "name": "Mocktail de Maracuyá", "description": "Pulpa de maracuyá, tónica y jarabe de goma.", "image_url": None, "price": 5400 }
        ]
    }


    for prod in products_data["products"]:
        new_prod = Product(
            category_id=prod["category_id"],
            name=prod["name"],
            description=prod["description"],
            image_url=prod["image_url"],
            price=prod["price"]
        )
        db.session.add(new_prod)

    try:
        db.session.commit()
        print(f"Poblamiento finalizado. Se crearon {len(events_data)} eventos y {len(products_data['products'])} productos.")
    except Exception as e:
        db.session.rollback()
        print(f"Error al poblar eventos: {e}")

if __name__ == '__main__':
    populate_db()