from app import create_app, db
from app.models import User, Role, Gender, Menu, MenuProduct, Category, Product, Event, ContentBlock

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

    # --- 2. Crear Catálogo Base (Categorías y Productos) ---
    print("Creando catálogo base...")
    
    categories_data = [
        {'id': 1, 'name': 'Cervezas ', 'description': 'Incluye todo lo derivado de la fermentación de cereales.'},
        {'id': 2, 'name': 'Pisco', 'description': 'Bebidas de alta graduación servidas solas o "on the rocks".'},
        {'id': 3, 'name': 'Vodka', 'description': 'La base de los eventos masivos.'},
        {'id': 4, 'name': 'Gin', 'description': 'Tragos complejos que requieren técnica.'},
        {'id': 5, 'name': 'Whisky', 'description': 'Abarca Vino Tinto, Blanco, Rosado.'},
        {'id': 6, 'name': 'Espumantes y Sidras', 'description': 'Categoría para celebraciones.'},
        {'id': 7, 'name': 'Licores y Digestivos', 'description': 'Bebidas dulces o herbales.'},
    ]

    for cat_data in categories_data:
        cat = Category(id=cat_data.get("id"), name=cat_data["name"], description=cat_data["description"])
        db.session.add(cat)
    
    db.session.flush()

    # --- 3. Definición de Eventos ---
    print("Creando eventos...")
    
    events_data = [
        {"id": 1, "name": "Stand Up Comedy: Risas Garantizadas", "overlay_title": "¡Noche de Carcajadas!", "iso_date": "2025-07-12", "start_time": "21:00:00", "end_time": "23:00:00", "location": "Teatro Caupolicán", "image_url": "standup_comedy.jpg", "rating": 4.8, "type": "Entretenimiento", "is_featured": True, "carousel_order": 1},
        {"id": 2, "name": "Festival de Invierno 2025", "overlay_title": "Música Bajo la Lluvia", "iso_date": "2025-06-15", "start_time": "14:00:00", "end_time": "23:30:00", "location": "Parque Padre Hurtado", "image_url": "festival.jpg", "rating": 4.5, "type": "Festival", "is_featured": True, "carousel_order": 2},
        {"id": 3, "name": "Tributo a Queen: Live Forever", "overlay_title": "Leyendas del Rock", "iso_date": "2025-08-05", "start_time": "22:00:00", "end_time": "00:30:00", "location": "Hard Rock Cafe", "image_url": "concierto_rock.jpg", "rating": 4.9, "type": "Rock", "is_featured": False, "carousel_order": None},
        {"id": 4, "name": "Noche de Jazz & Blues", "overlay_title": "Melodías de Medianoche", "iso_date": "2025-09-20", "start_time": "20:30:00", "end_time": "23:00:00", "location": "The Jazz Corner", "image_url": "concierto_jazz.jpg", "rating": 4.7, "type": "Jazz", "is_featured": False, "carousel_order": None},
        {"id": 5, "name": "Tech House Underground", "overlay_title": "Bajo las Luces Laser", "iso_date": "2025-10-31", "start_time": "23:50:00", "end_time": "05:00:00", "location": "Bunker Club", "image_url": "luces_laser.jpg", "rating": 4.6, "type": "Electrónica", "is_featured": True, "carousel_order": 3},
        {"id": 6, "name": "Campeonato de Tenis Senior", "overlay_title": "Pasión en la Cancha", "iso_date": "2025-11-12", "start_time": "09:00:00", "end_time": "18:00:00", "location": "Club de Tenis Santiago", "image_url": "tenis.jpg", "rating": 4.2, "type": "Deporte", "is_featured": False, "carousel_order": None},
        {"id": 7, "name": "Gran Final Universitaria", "overlay_title": "Todo por el Balón", "iso_date": "2025-12-05", "start_time": "16:00:00", "end_time": "19:00:00", "location": "Estadio Nacional", "image_url": "futbol.jpg", "rating": 4.4, "type": "Deporte", "is_featured": False, "carousel_order": None},
        {"id": 8, "name": "Concierto Año Nuevo", "overlay_title": "Explosión de Luces", "iso_date": "2026-01-01", "start_time": "01:00:00", "end_time": "06:00:00", "location": "Torre Entel", "image_url": "explosion_luces.jpg", "rating": 4.9, "type": "Evento Público", "is_featured": True, "carousel_order": 4},
        {"id": 9, "name": "Gala de Música Clásica", "overlay_title": "Elegancia y Armonía", "iso_date": "2026-01-15", "start_time": "19:30:00", "end_time": "22:00:00", "location": "Teatro Municipal", "image_url": "musica_clasica.jpg", "rating": 4.8, "type": "Cultura", "is_featured": False, "carousel_order": None},
        {"id": 10, "name": "Show Infantil: Aventuras Mágicas", "overlay_title": "Diversión para Niños", "iso_date": "2026-02-02", "start_time": "11:00:00", "end_time": "13:00:00", "location": "Matucana 100", "image_url": "espectaculo_infantil.jpg", "rating": 4.3, "type": "Infantil", "is_featured": False, "carousel_order": None},
        {"id": 11, "name": "Tour de Artista Internacional", "overlay_title": "El Concierto del Año", "iso_date": "2026-02-18", "start_time": "21:00:00", "end_time": "23:45:00", "location": "Movistar Arena", "image_url": "artista_internacional.jpg", "rating": 5.0, "type": "Concierto", "is_featured": True, "carousel_order": 5},
        {"id": 12, "name": "Cierre de Verano Electrónico", "overlay_title": "Vibras Tecno", "iso_date": "2026-02-28", "start_time": "22:00:00", "end_time": "05:00:00", "location": "Espacio Riesco", "image_url": "tecno.jpg", "rating": 4.6, "type": "Electrónica", "is_featured": False, "carousel_order": None},
        {"id": 13, "name": "Noche de Cantautores", "overlay_title": "Voz y Sentimiento", "iso_date": "2025-08-22", "start_time": "20:00:00", "end_time": "22:30:00", "location": "Teatro Nescafé", "image_url": "cantante.jpg", "rating": 4.7, "type": "Concierto", "is_featured": False, "carousel_order": None},
        {"id": 14, "name": "Concierto Láser: Verde y Azul", "overlay_title": "Inmersión Visual", "iso_date": "2025-11-20", "start_time": "21:30:00", "end_time": "23:00:00", "location": "Planetario", "image_url": "laser_verde_y_azul.jpg", "rating": 4.5, "type": "Show Visual", "is_featured": False, "carousel_order": None},
        {"id": 15, "name": "Festival de Rock: Cerca de la Reja", "overlay_title": "Energía Pura", "iso_date": "2026-03-01", "start_time": "15:00:00", "end_time": "23:55:00", "location": "Club Hípico", "image_url": "cerca_de_la_reja.jpg", "rating": 4.9, "type": "Rock", "is_featured": True, "carousel_order": 6}
    ]

    for ev in events_data:
        event_date = datetime.strptime(ev["iso_date"], "%Y-%m-%d").date()
        s_time = datetime.strptime(ev["start_time"], "%H:%M:%S").time()
        e_time = datetime.strptime(ev["end_time"], "%H:%M:%S").time()

        nuevo_evento = Event(
            id=ev["id"],
            name=ev["name"],
            overlay_title=ev["overlay_title"],
            iso_date=event_date,
            start_time=s_time,
            end_time=e_time,
            location=ev["location"],
            rating=ev["rating"],
            type=ev["type"],
            is_featured=ev["is_featured"],
            carousel_order=ev["carousel_order"],
            image_url=ev["image_url"],
            created_at=datetime.now()
        )
        db.session.add(nuevo_evento)
    
    db.session.flush()

    # --- 4. Crear Productos ---
    print("Creando productos...")
    
    products_data = {
        "products": [
            {'id': 1, 'category_id': 1, 'name': 'Heineken', 'description': 'Heineken es una cerveza tipo Lager Premium de estilo Pilsen, originaria de los Países Bajos (Ámsterdam). Se caracteriza por ser una cerveza rubia, elaborada con ingredientes 100% naturales (agua, malta de cebada y lúpulo) y su exclusiva levadura-A, lo que le otorga un sabor suave, equilibrado y toques frutales', 'image_url': 'logo-de-heineken-lager-beer-o-simplemente-es-una-cerveza-palida-con-alcoholes-por-volumen-producida-la-compania-holandesa-204759347-3cad1d8d-6c07-41e1-842a-f5493477d8cc.webp', 'price': 4500},
            {'id': 2, 'category_id': 1, 'name': 'Cristal', 'description': 'La Cerveza Cristal, elaborada por CCU, es una clásica cerveza tipo Lager de origen chileno, conocida por su color dorado brillante, cuerpo balanceado y carácter refrescante. Tiene una graduación alcohólica de 4.6°, elaborada con ingredientes naturales (agua, malta de cebada, lúpulo y levadura), y se caracteriza por tener un amargor suave (16 IBU). ', 'image_url': 'Cerveza_Cristal_28200229-54500484-355a-4a96-913f-595c82d962ca.webp', 'price': 5500},
            {'id': 3, 'category_id': 1, 'name': 'Escudo', 'description': 'La cerveza Escudo es una marca chilena producida por CCU que se clasifica principalmente como una Lager de tipo rubia (dourado intenso). Se caracteriza por tener un sabor intenso, con buen cuerpo y un amargor moderado (aprox. 19 IBU), con una graduación alcohólica común del 5.5%.', 'image_url': 'Cerveza_Escudo_logo_1991-b7588efa-f46a-4cc1-82a3-a17ea864b61d.webp', 'price': 5800},
            {'id': 4, 'category_id': 1, 'name': 'Corona', 'description': 'La cerveza Corona es una lager pálida (Pale Lager) mexicana, de color rubio, sabor ligero y equilibrado, elaborada con malta de cebada, maíz y arroz, y con una graduación alcohólica baja (alrededor del 4.5%), lo que la hace muy refrescante y popular para el consumo casual.', 'image_url': 'logo-Corona-c8c583a8-661f-4093-80f3-f9c673ee1b4d.png', 'price': 5200},
            {'id': 5, 'category_id': 1, 'name': 'Kuntsmann', 'description': 'Kunstmann, cervecería artesanal de Valdivia, Chile, destaca por sus cervezas de estilo alemán, siendo la Torobayo (Amber Ale/Pale Ale) su ícono de color cobrizo, sabor acaramelado y 5% ABV. También producen popularmente Kunstmann Lager (rubia suave, 4,3-5,2% ABV), y variedades como Torobayo, Gran Torobayo, entre otras, elaboradas con agua pura del sur. ', 'image_url': 'brewery-8995_a290e_hd-a575baa7-9711-40f3-a7d3-85ffb1650e16.png', 'price': 4300},
            {'id': 6, 'category_id': 1, 'name': 'Royal', 'description': 'La cerveza Royal Guard (producida por CCU en Chile) es principalmente una cerveza de tipo Lager (específicamente, a menudo etiquetada como Premium Lager o Golden Lager), conocida por ser rubia, de color dorado, cuerpo medio, sabor suave y equilibrado, con una graduación alcohólica generalmente entre \\(4.5\\%\\) y \\(5\\%\\). Se caracteriza por un amargor moderado (aprox. 19 IBU) y un perfil refrescante.\xa0', 'image_url': 'cazabor-royal-acb3c263-859c-48b9-baa2-c6e304873e9b.jpg', 'price': 5600},
            {'id': 7, 'category_id': 1, 'name': 'Cusqueña', 'description': 'Cerveza Cusqueña es una marca de cerveza premium peruana, principalmente de tipo Lager (baja fermentación), caracterizada por el uso de 100% malta y lúpulos nobles. Sus variedades incluyen la clásica Dorada (Golden Lager), Negra (Dark Lager), Roja (Red Lager), Trigo (Weissbier) y Doble Malta, con graduaciones alcohólicas que suelen rondar entre 4.8% y 5.6%. ', 'image_url': 'e2a0559add4fc17ce082aad5ac7615e6-1f0d72eb-bbba-4255-9015-ad84a48ef33f.jpg', 'price': 5700},
            {'id': 8, 'category_id': 1, 'name': 'Austral', 'description': 'Cerveza Austral, originaria de la Patagonia chilena (fundada en 1896 en Punta Arenas), es principalmente de tipo Lager, destacando por su uso de agua pura austral y malta. Su portafolio incluye diversas variedades, siendo las más reconocidas la Austral Lager (dorada), Patagonia Red Lager (roja), Torres del Paine (Helles Bock) y Yagán (Dark Ale). ', 'image_url': 'PR00000093-720ac40d-0382-4ef9-9d18-ae34d78479d0.jpg', 'price': 5400},
            {'id': 9, 'category_id': 1, 'name': 'Stella Artois', 'description': 'La cerveza Stella Artois es una cerveza tipo Pilsner-Lager de origen belga, caracterizada por ser una rubia premium de fermentación baja. Con una graduación alcohólica de \\(5.0\\%\\), ofrece un sabor equilibrado, ligero amargor, final seco y aromas sutiles, siendo reconocida internacionalmente por su calidad y tradición.\xa0', 'image_url': 'png-transparent-beer-logo-stella-artois-lager-brahma-beer-stella-artois-lager-duvel-corporate-identity-f9943139-214e-4cca-833c-efbf3c73748b.png', 'price': 4000},
            {'id': 10, 'category_id': 1, 'name': 'Becker', 'description': 'La cerveza Becker es una cerveza lager rubia de origen chileno, reconocida por ser suave, refrescante y elaborada con ingredientes 100% naturales. Tiene una graduación alcohólica típica de \\(4,5\\%\\) vol., se caracteriza por su color dorado, baja amargura y una espuma cremosa, ideal para un consumo ligero.\xa0', 'image_url': 'CervezaBecker-720d5f8f-6e94-4219-adc8-342c7b678ca6.png', 'price': 5300},
            {'id': 11, 'category_id': 1, 'name': 'Budweiser', 'description': 'La cerveza Budweiser es una cerveza de tipo Lager Americana (American Adjunct Lager), caracterizada por ser una cerveza rubia, ligera, refrescante y de estilo clásico. Se elabora con malta de cebada, lúpulos seleccionados, agua y un porcentaje de arroz, lo que le confiere un sabor suave y un perfil equilibrado. ', 'image_url': 'budweiser-logo-0-64207128-c2b6-4a03-85fe-9544efdec7a4.png', 'price': 6500},
            {'id': 12, 'category_id': 1, 'name': 'Sol', 'description': 'La cerveza Sol es una cerveza mexicana de tipo lager clara, conocida por su sabor ligero, refrescante y bajo amargor. Lanzada originalmente en 1899, se caracteriza por su color dorado, un contenido alcohólico que suele rondar entre el 4,2% y 4,5% Vol., y un perfil ideal para climas cálidos. \n', 'image_url': 'sol_nuevo-7f533493-0a6f-4463-88ac-998413fb2e9d.png', 'price': 8500},
            {'id': 13, 'category_id': 1, 'name': 'Coors', 'description': 'La cerveza Coors, particularmente la Coors Original, es una cerveza de tipo American Lager (o lager americana). Originaria de Estados Unidos, se caracteriza por ser una cerveza rubia, ligera y refrescante, con un sabor suave y un amargor bajo. Tiene una graduación alcohólica de aproximadamente 5%. ', 'image_url': 'eafac719be0e7ce4bea76f9cf424047b-7a3c5ea8-c884-47ed-904b-97f5a17c3ef2.jpg', 'price': 7800},
            {'id': 14, 'category_id': 1, 'name': 'Quilmes', 'description': 'La cerveza Quilmes Clásica es una cerveza argentina del tipo Lager (específicamente American Adjunct Lager), reconocida por ser una cerveza rubia, ligera y refrescante, con un color amarillo dorado brillante y un sabor equilibrado entre el lúpulo y el cereal. Tiene una graduación alcohólica estándar de 4,9% vol.. \n', 'image_url': 'Quilmes_Logo_Nuevo-aac3d3d2-1384-47ca-ae46-ed5da15cb29f.png', 'price': 7200},
            {'id': 15, 'category_id': 1, 'name': 'Patagonia', 'description': 'Cerveza Patagonia se caracteriza principalmente por ser una marca de cervezas estilo Lager (de baja fermentación), elaboradas con materias primas seleccionadas y agua de la Patagonia argentina, ofreciendo variedades como Amber Lager, Bohemian Pilsener, Weisse (trigo) y Hoppy Lager.', 'image_url': 'd872eedb9086c8cb7fb66db39875d292-2e8d4329-d217-4945-a3db-e6b1d778a386.jpg', 'price': 7000},
            {'id': 16, 'category_id': 1, 'name': 'Guinness', 'description': 'La cerveza Guinness es fundamentalmente una stout irlandesa (Irish Stout), un tipo de cerveza ale negra, seca y de alta fermentación, famosa por su intenso sabor a cebada tostada, notas a café/chocolate y su densa espuma cremosa producida por el uso de nitrógeno. Elaborada en Dublín desde 1759, la variante más icónica es la Guinness Draught (4.2% ABV). ', 'image_url': 'guinness-logo-2005-ea2a76a0-e043-41a8-8102-e1150583bf09.png', 'price': 7500},
            {'id': 17, 'category_id': 2, 'name': 'Mistral 35°', 'description': 'Pisco Mistral 35° es un pisco chileno premium y versátil, elaborado en el Valle del Elqui con uvas Pedro Jiménez y Moscatel. Destaca por su añejamiento en barricas de roble americano, lo que le otorga un característico color dorado, suavidad, aroma a madera y notas de vainilla y chocolate. Es ideal para coctelería, especialmente la piscola. \n', 'image_url': 'D_NQ_NP_2X_601938-MLC72799067822_112023-F-16fd7d89-d94b-4a18-95d8-2ea8550b5781.webp', 'price': 8000},
            {'id': 18, 'category_id': 2, 'name': 'Mistral 40°', 'description': 'El Pisco Mistral 40° es un destilado chileno premium, añejado en barricas de roble americano, que destaca por su color dorado, suavidad y notas aromáticas a madera, vainilla y chocolate. Elaborado en el Valle de Elqui con uvas Moscatel y Pedro Jiménez, ofrece un sabor equilibrado y consistente, ideal para cócteles de lujo o disfrutar solo. ', 'image_url': '1741631771_Mistral_40-01820e4c-2e7a-41c4-9b6c-f86ade612525.webp', 'price': 8200},
            {'id': 19, 'category_id': 2, 'name': 'Alto del Carmen 35°', 'description': 'Pisco Alto del Carmen 35° es un destilado chileno premium, elaborado con uvas Moscatel en el Valle del Huasco y reposado al menos 4 meses en barricas de roble americano. Se caracteriza por su color dorado, suavidad, aroma frutal con notas de vainilla y versatilidad para coctelería, siendo ideal para piscolas y pisco sour. ', 'image_url': 'alto-favicon2-0f5dd4de-00da-4aba-aa04-a6293332deb3.png', 'price': 9000},
            {'id': 20, 'category_id': 2, 'name': 'Alto del Carmen 40°', 'description': 'El Pisco Alto del Carmen 40° es un destilado chileno premium, elaborado en el Valle del Huasco con uvas Moscatel de Alejandría y Rosada. Se caracteriza por su doble destilación en alambiques de cobre, resultando en un producto de alta calidad, suave, aromático y con notas florales o cítricas, ideal para coctelería fina.', 'image_url': 'alto-favicon2-0f5dd4de-00da-4aba-aa04-a6293332deb3.png', 'price': 12000},
            {'id': 21, 'category_id': 2, 'name': 'Espíritu de los Andes 40%', 'description': 'El Pisco Espíritu de los Andes es un pisco premium chileno, 100% Moscatel del Valle de Limarí, que destaca por su proceso de doble destilación para lograr aromas frutales y un carácter puro, ideal para disfrutar solo o en cócteles como el Pisco Sour y Piscola, con notas cítricas y herbales. Existe también el Pisco Demonio de los Andes, una marca peruana de la región de Ica, elaborada con uvas aromáticas. ', 'image_url': 'logo-espiritu-de-los-andes_home-cpch-331c248e-0120-4b89-b4d7-7c6327772811.webp', 'price': 6000},
            {'id': 22, 'category_id': 2, 'name': 'Mal Paso 35°', 'description': 'El Pisco Mal Paso 35° es un destilado chileno de alta calidad, elaborado en el Valle de Limarí (Ovalle) con uvas moscatel, caracterizado por un perfil suave, frutal y equilibrado, ideal para piscolas o cócteles. Presenta un color limpio, aromas florales persistentes y un ligero toque maderizado, ofreciendo un sabor con notas afrutadas y a miel. ', 'image_url': '10258797_1-d3996042-932b-43f2-ad64-7edeb48af1d0.png', 'price': 7000},
            {'id': 23, 'category_id': 2, 'name': 'Mal Paso 40°', 'description': 'El Pisco Mal Paso 40° es un destilado chileno premium, producido en el Valle del Limarí, reconocido por su suavidad, calidad artesanal y elaboración con doble destilación en alambiques de cobre. Principalmente elaborado con uvas Pedro Jiménez o Moscatel, destaca por su carácter aromático, notas florales/frutales y un final equilibrado. ', 'image_url': '000000000000194271-UN-01-61aa0556-593a-4bea-9761-802fc2e38dcf.webp', 'price': 6200},
            {'id': 24, 'category_id': 2, 'name': 'Mal Paso 40° Pedro Jimenez', 'description': 'El Pisco Mal Paso Pedro Jiménez 40° es un destilado chileno premium, elaborado 100% con uvas Pedro Jiménez del Valle del Limarí. Se caracteriza por ser transparente, de aroma suave con notas cítricas, frutales y herbales. Ofrece un paladar sedoso, equilibrado y con un final largo. Ideal para tomar solo o en coctelería. ', 'image_url': '5df8fc32a73aa-2b6b2da1-da65-403d-84d4-bfcffefb34c6.jpg', 'price': 6800},
            {'id': 25, 'category_id': 2, 'name': 'El Gobernador 35°', 'description': 'Pisco El Gobernador 35° es un pisco chileno de alta calidad elaborado por Miguel Torres Chile en la región de Coquimbo, caracterizado por su suavidad y versatilidad. Mezcla uvas Moscatel de Alejandría y Rosada, presenta notas cítricas y florales (rosas, jazmín) con un final cremoso, siendo ideal para piscolas o pisco sour. ', 'image_url': 'D_NQ_NP_2X_610686-MLA99898699791_112025-F-c172459e-61fe-41ac-8000-b7a8a87b856e.webp', 'price': 6900},
            {'id': 26, 'category_id': 2, 'name': 'El Gobernador 40°', 'description': 'Pisco El Gobernador 40° es un pisco chileno premium de la bodega Miguel Torres Chile, elaborado en el Valle del Limarí con uvas Moscatel Rosada y de Alejandría. Es un pisco incoloro y brillante de 40° grados alcohólicos, obtenido mediante una sola destilación para preservar sus aromas florales (rosas, jazmín) y cítricos. En boca es suave, goloso y persistente, ideal para cócteles como el pisco sour. ', 'image_url': 'D_Q_NP_647401-MLA92132660738_092025-O-7d237db3-331e-4ae7-aa9b-56c41012830c.webp', 'price': 6500},
            {'id': 27, 'category_id': 2, 'name': 'Horcón Quemado 35°', 'description': 'El Pisco Horcón Quemado 35° es un destilado artesanal chileno premium, producido en el Valle de San Félix, Región de Atacama, con más de 100 años de tradición familia Mulet. Envejecido por un año en roble americano, destaca por sus uvas moscatel, color pajizo brillante, aroma fresco con notas frutales y un sabor ligero. ', 'image_url': 'w800h800fitpad-84ff7e46-36b5-4d3e-9fcb-6c12b328eaa9.webp', 'price': 6300},
            {'id': 28, 'category_id': 2, 'name': 'Horcón Quemado 40°', 'description': 'El Pisco Horcón Quemado 40° es un destilado artesanal de alta calidad, elaborado en el valle de San Félix (región de Atacama, Chile) bajo tradiciones del siglo XIX. Producido con uvas moscatel, se destaca por su reposo en barricas de roble americano, ofreciendo un sabor equilibrado, frutosos y con toques minerales. ', 'image_url': 'image-c9c60144-9a8d-4948-aceb-807caa7fa3c5.png', 'price': 7500},
            {'id': 29, 'category_id': 2, 'name': 'Bauza 35°', 'description': 'Pisco Bauzá 35° es un pisco chileno premium del Valle de Limarí, caracterizado por sus 35 grados de alcohol y doble destilación en alambiques de cobre. Disponible en versiones Especial (con notas de madera por guarda en roble) y Blanco (más cítrico y sin barrica). Destaca por su sabor suave y equilibrio. ', 'image_url': 'Pisco_Bauza_especial_35G_750cc_1024x1024-ec9faaef-562b-4340-8770-c1d2bbfd96e8.webp', 'price': 6700},
            {'id': 30, 'category_id': 2, 'name': 'Bauza 40°', 'description': 'El Pisco Bauzá 40° es un pisco chileno de alta calidad, reconocido por ser doblemente destilado en alambiques de cobre y elaborado en el Valle del Limarí con uvas Moscatel (Rosada y Alejandría). Se caracteriza por no utilizar colorantes ni azúcares añadidos, ofreciendo un sabor intenso, natural y una textura suave, ideal para piscolas o coctelería. ', 'image_url': 'effbb52d1bfdd93a1609d739ca750363-3x-f61765fd-d7d5-46bb-9866-9792b725f440.webp', 'price': 7200},
            {'id': 31, 'category_id': 3, 'name': 'Absolut', 'description': 'Absolut es un vodka sueco premium reconocido mundialmente, producido en Åhus con ingredientes 100% naturales, trigo de invierno y agua de pozo profundo, sin azúcar añadida. Se caracteriza por su sabor rico, con cuerpo y complejo, pero suave y maduro, con notas de cereales y un toque a frutos secos. ', 'image_url': 'fbda26487927ab4b110e61472a44471d-341ca24c-96a4-4a4b-96ee-453de73fb7b5.jpg', 'price': 7500},
            {'id': 32, 'category_id': 3, 'name': 'Stoli', 'description': 'Stoli (anteriormente Stolichnaya) es un vodka premium de origen ruso, reconocido por su suavidad, pureza y elaboración con trigo, centeno y agua de pozo artesiano. Con un contenido alcohólico estándar del 40%, presenta un perfil aromático neutro con sutiles notas de grano y un acabado limpio, siendo ideal para cócteles clásicos como el Moscow Mule. ', 'image_url': '6440_0_stolivodka-1l-219a58af-7dd3-4e1d-9799-f293f6f53d99.jpg', 'price': 7800},
            {'id': 33, 'category_id': 3, 'name': 'Smirnoff', 'description': 'Smirnoff es el vodka premium número 1 del mundo, reconocido por su sabor neutro, suavidad excepcional y versatilidad. Destilado tres veces a partir de granos y filtrado diez veces con carbón activado, ofrece una pureza inigualable. Es ideal para cócteles clásicos, con un contenido alcohólico típico de \\(37.5\\%\\)-\\(40\\%\\), con notas suaves y secas.\xa0', 'image_url': 'c8703b386d3d7ec32bf7abe5757aac2f-88706d55-4899-4faf-a22b-d9bbd67bad7e.jpg', 'price': 8200},
            {'id': 34, 'category_id': 3, 'name': 'Grey Goose', 'description': 'Grey Goose es un vodka francés de lujo, reconocido por su suavidad excepcional y sabor refinado, elaborado en la región de Cognac. Utiliza ingredientes 100% franceses: trigo blando de invierno de Picardía y agua de manantial filtrada con piedra caliza. Destilado una sola vez, ofrece un perfil limpio, ligeramente dulce y con notas de almendra. ', 'image_url': 'mobile-spirits-greygoose-11446e3b-1e90-4679-89d2-c282d556f5e3.jpeg', 'price': 8500},
            {'id': 35, 'category_id': 3, 'name': 'Ciroc', 'description': 'Ciroc Vodka es un vodka ultra-premium de origen francés, destilado 5 veces a partir de uvas finas (Mauzac Blanc y Ugni Blanc) en lugar de grano, ofreciendo un sabor fresco, suave y afrutado con un perfil cítrico. Con 40% vol. alc., es reconocido por su elaboración artesanal en Gaillac y su perfil sofisticado ideal para cócteles y mariscos. ', 'image_url': 'ciroc-a3dfc5ac-5fb4-422f-a72a-a1048389ceef.png', 'price': 7400},
            {'id': 36, 'category_id': 3, 'name': 'Finlandia', 'description': 'Finlandia Vodka es un vodka premium de origen finlandés, reconocido mundialmente por su extrema pureza, suavidad y frescura. Elaborado con cebada de seis hileras (Suomi) y agua de manantial glacial natural, destaca por su destilación continua en más de 200 pasos. Su perfil es nítido, ligero, con sutiles toques cítricos, pimienta y crema, ideal para tomar solo o en coctelería. ', 'image_url': '2021_FV_Logo_Campaign-ba882d42-a76b-4d93-89f8-9ff3b17de292.jpg', 'price': 8800},
            {'id': 37, 'category_id': 3, 'name': 'Eristoff', 'description': 'ristoff es un vodka premium de origen georgiano (receta de 1806) elaborado con 100% grano puro, sometido a triple destilación y filtrado con carbón vegetal para lograr un sabor limpio, suave y vigorizante. Con 37.5% - 40% Alc./Vol., destaca por su versatilidad, ofreciendo notas sutiles de grano, un toque de regaliz y manzana verde, ideal para cócteles como el Moscow Mule o tomar solo con hielo.', 'image_url': '12501013.5482e76f9427b-b2c3abe6-3591-454b-97a0-07acabf6f134.png', 'price': 7600},
            {'id': 38, 'category_id': 3, 'name': 'Skyy', 'description': 'Skyy Vodka es un vodka premium estadounidense (40% alc./vol.), originario de San Francisco, destacado por su cuádruple destilación y triple filtrado, lo que resulta en una bebida de gran pureza, suavidad y sabor neutro. Presentado en una icónica botella azul cobalto, es ideal para cócteles como el Vodka Martini. ', 'image_url': '3830e563735079.Y3JvcCwxMDgyLDg0NywwLDExNw-db2c07e0-f7b7-49c6-9f15-327c45554e1b.png', 'price': 7200},
            {'id': 39, 'category_id': 3, 'name': 'Kawesqar', 'description': 'Vodka Kawesqar es un vodka premium que captura la esencia de la Patagonia Chilena. Elaborado con agua de los glaciares de la región y papas de la Patagonia, este vodka es un verdadero reflejo de la pureza y la singularidad de este lugar mágico.\nVodka Kawesqar es el vodka más austral del mundo, lo que lo convierte en un producto único y exclusivo. Su sabor suave y delicado es el resultado de un proceso de destilación cuidadoso y artesanal.', 'image_url': 'e5a887_399dd7225a3947559f3f92a65f02ff1emv2-d5656996-5ae6-4e3d-88fd-53c2b69232d1.avif', 'price': 7900},
            {'id': 40, 'category_id': 3, 'name': 'Montblanc', 'description': 'Mont Blanc Vodka es un vodka ultra-premium francés, reconocido por su elaboración con trigo de invierno y agua de manantial del Gensac, ofreciendo un perfil suave, aterciopelado y equilibrado con 40% alc. vol. Destilado 5 o 6 veces para lograr máxima pureza, presenta notas minerales, grano fino y toques de vainilla, ideal para tomar solo o en cócteles. ', 'image_url': 'IMAGE_AQUAVITAECATALOGE-25-ebb2fe14-bd12-45a3-924f-fc18d3d8dd29.webp', 'price': 8000},
            {'id': 41, 'category_id': 4, 'name': 'Bulldog', 'description': 'Bulldog Gin es una ginebra premium tipo London Dry, reconocida por su botella negra icónica y un perfil de sabor suave y equilibrado. Elaborada con 12 botánicos exóticos (como ojo de dragón, amapola y hoja de loto) y cuatro destilaciones en alambique de cobre, ofrece una experiencia contemporánea, equilibrando el enebro con notas florales y cítricas. ', 'image_url': 'bulldog-e15216552333218329-39aabf39-a02f-4ead-a693-351547581668.jpg', 'price': 6800},
            {'id': 42, 'category_id': 4, 'name': 'Tanqueray', 'description': 'Tanqueray London Dry Gin es una ginebra premium clásica, reconocida por su equilibrio y marcada presencia de enebro, creada en la década de 1830 por Charles Tanqueray. Elaborada con cuatro botánicos (enebro, cilantro, angélica y regaliz), destaca por su perfil seco, cítrico y limpio, ideal para gin tonics y cócteles sofisticados. ', 'image_url': 'tanqueray-gin-logo-e5eee1f8-bda2-49b0-bd46-a0982ed63c71.jpg', 'price': 6500},
            {'id': 43, 'category_id': 4, 'name': 'Bombay', 'description': 'Bombay Sapphire es una ginebra premium tipo London Dry, reconocida por su botella azul icónica, suavidad y equilibrio aromático, con una graduación alcohólica de 40º. Se distingue por su proceso de infusión al vapor de 10 botánicos exóticos, ofreciendo un sabor fresco, cítrico y ligero, ideal para Gin-Tonics. ', 'image_url': 'bombay-sapphire-logo-c4f09048-a083-4d92-a92a-a18274958ed7.png', 'price': 6900},
            {'id': 44, 'category_id': 4, 'name': 'Hendricks', 'description': "Hendrick's es una ginebra súper premium de Escocia, reconocida por su sabor inusual, fresco y complejo, con una graduación de \\(41,4\\%\\) vol. Destaca por la infusión de pepino y pétalos de rosa búlgaros, combinados con 11 botánicos, creando un perfil floral, cítrico y suave, ideal para gin & tonic con pepino. Se destila artesanalmente en pequeños lotes, combinando dos alambiques distintos.\xa0", 'image_url': 'Hendricks_Gin_Logo-77f1de03-90e7-4cb1-8323-c8eb65cfc5ec.jpg', 'price': 7000},
            {'id': 45, 'category_id': 4, 'name': 'Provincia', 'description': 'Gin Provincia es un destilado premium chileno, nacido en el Valle de Colchagua, que busca rescatar la identidad botánica de la Cordillera de los Andes. Se elabora en pequeños alambiques de cobre utilizando agua de vertiente de montaña y botánicos endémicos, resultando en un producto territorial, aromático y de alta calidad. ', 'image_url': 'gin-provincia-logo-361cbc4f-77c5-4d65-a0e1-5f67f43d56eb.jpg', 'price': 6600},
            {'id': 46, 'category_id': 4, 'name': 'Carpintero Negro', 'description': 'Carpintero Negro es un premium Patagonic Dry Gin chileno, caracterizado por su estilo London Dry con identidad del sur de Chile. Destaca por sus seis destilaciones en alambique de cobre y el uso de 13 botánicos, incluyendo bayas nativas como el calafate y maqui, ofreciendo un sabor fresco, cítrico y frutado. ', 'image_url': '842c2c7f-793b-4075-a618-22e75a3b6a6e-lg-e70210f3-1881-47a0-a48b-a2ad0eabb028.jpg', 'price': 6200},
            {'id': 47, 'category_id': 4, 'name': 'Mombasa', 'description': 'Mombasa Club Gin es una ginebra Premium tipo London Dry (41,5% alc./vol.), caracterizada por su origen histórico a finales del siglo XIX y su cuidada cuádruple destilación. Destaca por un perfil aromático equilibrado con notas cítricas, especiadas y base de enebro, ofreciendo un sabor fresco, ligeramente dulce y complejo, ideal para Gin Tonic. ', 'image_url': 'Mombassa-Show-scaled-a418a2d3-8060-4385-b35a-31eb3172ea69.jpg', 'price': 5500},
            {'id': 48, 'category_id': 5, 'name': 'Johnnie Walker', 'description': 'Johnnie Walker es la marca de whisky escocés mezclado (blended) más distribuida del mundo, originada en Escocia en 1820 por John Walker. Se caracteriza por su icónica botella cuadrada, el logotipo del "caminante" y una amplia gama basada en colores (Red, Black, Blue, etc.), ofreciendo perfiles que van desde ahumados intensos hasta suaves y frutales. ', 'image_url': '17334214751685914522JOHNNIE_WALKER_logo-removebg-preview-0790e68c-53bf-4b61-883a-0d3884af6f5e.png', 'price': 5800},
            {'id': 49, 'category_id': 5, 'name': 'Clery', 'description': 'Vino blanco mezclado con frutillas frescas picadas.', 'image_url': None, 'price': 5600},
            {'id': 50, 'category_id': 5, 'name': 'Vino Navegado', 'description': 'Tinto caliente con naranja, canela y azúcar (ideal para invierno).', 'image_url': None, 'price': 5700},
            {'id': 51, 'category_id': 6, 'name': 'Brut', 'description': 'Espumante seco, el estándar para brindis y celebraciones.', 'image_url': None, 'price': 9000},
            {'id': 52, 'category_id': 6, 'name': 'Extra Brut', 'description': 'Versión aún más seca y elegante que el Brut.', 'image_url': None, 'price': 9500},
            {'id': 53, 'category_id': 6, 'name': 'Demi-Sec', 'description': 'Espumante con un toque de dulzor, ideal para postres.', 'image_url': None, 'price': 8800},
            {'id': 54, 'category_id': 6, 'name': 'Moscato', 'description': 'Espumante dulce y muy aromático, con notas florales.', 'image_url': None, 'price': 8500},
            {'id': 55, 'category_id': 6, 'name': 'Prosseco', 'description': 'Espumante italiano ligero, afrutado y muy refrescante.', 'image_url': None, 'price': 9200},
            {'id': 56, 'category_id': 6, 'name': 'Champagne', 'description': 'Espumante francés auténtico de la región de Champaña.', 'image_url': None, 'price': 14000},
            {'id': 57, 'category_id': 6, 'name': 'Cava', 'description': 'Espumante español elaborado mediante el método tradicional.', 'image_url': None, 'price': 8700},
            {'id': 58, 'category_id': 6, 'name': 'Sidra de Manzana', 'description': 'Bebida fermentada de manzana, dulce y con burbuja fina.', 'image_url': None, 'price': 5000},
            {'id': 59, 'category_id': 6, 'name': 'Sidra de Pera', 'description': 'Alternativa delicada y muy aromática a la sidra tradicional.', 'image_url': None, 'price': 5200},
            {'id': 60, 'category_id': 6, 'name': 'Rosé Sparkling', 'description': 'Espumante rosado, visualmente atractivo y frutal.', 'image_url': None, 'price': 8900},
            {'id': 61, 'category_id': 7, 'name': 'Amaretto', 'description': 'Licor dulce italiano con aroma y sabor a almendras.', 'image_url': None, 'price': 7200},
            {'id': 62, 'category_id': 7, 'name': 'Baileys', 'description': 'Crema de whisky irlandés, suave y muy dulce.', 'image_url': None, 'price': 7500},
            {'id': 63, 'category_id': 7, 'name': 'Limoncello', 'description': 'Licor cítrico italiano elaborado con cáscaras de limón.', 'image_url': None, 'price': 7000},
            {'id': 64, 'category_id': 7, 'name': 'Jägermeister', 'description': 'Licor de hierbas alemán, complejo y muy potente.', 'image_url': None, 'price': 7800},
            {'id': 65, 'category_id': 7, 'name': 'Kahlúa', 'description': 'Licor mexicano a base de granos de café y ron.', 'image_url': None, 'price': 7300},
            {'id': 66, 'category_id': 7, 'name': 'Manzanilla', 'description': 'Destilado de anís, tradicional para después de las comidas.', 'image_url': None, 'price': 6500},
            {'id': 67, 'category_id': 7, 'name': 'Menta', 'description': 'Licor refrescante de color verde brillante, muy digestivo.', 'image_url': None, 'price': 6400},
            {'id': 68, 'category_id': 7, 'name': 'Triple Sec', 'description': 'Licor de naranja esencial para la coctelería clásica.', 'image_url': None, 'price': 7000},
            {'id': 69, 'category_id': 7, 'name': 'Frangelico', 'description': 'Licor de avellanas con notas de vainilla y cacao.', 'image_url': None, 'price': 7600},
            {'id': 70, 'category_id': 7, 'name': 'Licor de Cacao', 'description': 'Dulce y espeso, ideal para tragos tipo postre.', 'image_url': None, 'price': 7100},
        ]
    }


    for prod in products_data["products"]:
        new_prod = Product(
            id=prod.get("id"),
            category_id=prod["category_id"],
            name=prod["name"],
            description=prod["description"],
            image_url=prod["image_url"],
            price=prod["price"]
        )
        db.session.add(new_prod)

    db.session.flush()

    # --- 5. Crear Menús y MenuProducts ---
    print("Creando menús y asignando productos...")
    
    # Crear un menú de ejemplo para el primer evento
    menu_evento_1 = Menu(name="Carta Principal - Stand Up Comedy", event_id=1)
    db.session.add(menu_evento_1)
    db.session.flush()

    # Asignar los primeros 20 productos al menú
    for i, prod in enumerate(products_data["products"][:20]):
        menu_prod = MenuProduct(
            menu_id=menu_evento_1.id,
            product_id=prod["id"],
            price=prod["price"], # Usar precio base
            display_order=i + 1,
            active=True
        )
        db.session.add(menu_prod)

    try:
        db.session.commit()
        print(f"Poblamiento finalizado. Se crearon {len(events_data)} eventos, {len(products_data['products'])} productos y 1 menú con 20 productos.")
    except Exception as e:
        db.session.rollback()
        print(f"Error al poblar eventos: {e}")

if __name__ == '__main__':
    populate_db()