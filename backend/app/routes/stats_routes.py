from flask import Blueprint, jsonify
from ..models import db, User, Event, Order, OrderItem
from sqlalchemy import func
from datetime import datetime, date, timedelta

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    today = date.today()
    first_day_of_month = today.replace(day=1)
    
    # 1. Usuarios Totales (Total Count)
    total_users = User.query.count()
    
    # 2. Ventas del Mes (Suma de Order.total para orders creadas este mes)
    sales_month_query = db.session.query(func.sum(Order.total)).filter(
        Order.created_at >= first_day_of_month
    ).scalar()
    sales_month = float(sales_month_query) if sales_month_query else 0.0
    
    # 3. Eventos Destacados
    featured_events = Event.query.filter(Event.is_featured == True).count()

    # 4. Eventos Activos
    active_events = Event.query.filter(Event.is_active == True).count()
    
    # 5. Tickets Vendidos Hoy (Suma de cantidad de items en orders de hoy)
    # Nota: Usamos "Vendidos Hoy" porque no tenemos timestamp de "Canjeado Hoy" en el modelo actual.
    start_of_day = datetime.combine(today, datetime.min.time())
    tickets_sold_today_query = db.session.query(func.sum(OrderItem.quantity)).join(Order).filter(
        Order.created_at >= start_of_day
    ).scalar()
    tickets_sold_today = int(tickets_sold_today_query) if tickets_sold_today_query else 0
    
    # 6. Actividad Reciente
    # Uniremos ultimos usuarios y ultimas ordenes
    recent_activity = []
    
    # Ultimos 3 usuarios
    last_users = User.query.order_by(User.created_at.desc()).limit(3).all()
    for u in last_users:
        recent_activity.append({
            'action': 'Nuevo usuario registrado',
            'user': u.name,
            'time': u.created_at, # Enviaremos objeto datetime, luego ordenamos
            'type': 'user'
        })
        
    # Ultimas 3 ordenes
    last_orders = Order.query.order_by(Order.created_at.desc()).limit(3).all()
    for o in last_orders:
        user_name = "Usuario" # Si quisieramos el nombre tendriamos que hacer query al user_id
        # Intentamos obtener nombre del user si es posible, aunque user_id es string en Order
        u = User.query.get(o.user_id)
        if u:
            user_name = u.name
            
        recent_activity.append({
            'action': f'Compra ticket #{o.order_id[:8]}...',
            'user': user_name,
            'time': o.created_at,
            'type': 'order'
        })

    # Ordenar por tiempo descendente y tomar los top 5
    recent_activity.sort(key=lambda x: x['time'], reverse=True)
    recent_activity = recent_activity[:5]
    
    # Formatear fecha para JSON
    for item in recent_activity:
        # Calculo simple de "hace X tiempo" podria hacerse en frontend, aqui mandamos ISO string
        item['time'] = item['time'].isoformat() if item['time'] else datetime.now().isoformat()

    return jsonify({
        'stats': [
            { 'label': 'Usuarios Totales', 'value': str(total_users), 'icon': 'Users', 'change': '---', 'color': 'blue' },
            { 'label': 'Ventas del Mes', 'value': f"${sales_month:,.0f}", 'icon': 'DollarSign', 'change': '---', 'color': 'green' },
            { 'label': 'Eventos Destacados', 'value': str(featured_events), 'icon': 'Target', 'change': '---', 'color': 'yellow' },
            { 'label': 'Eventos Activos', 'value': str(active_events), 'icon': 'Calendar', 'change': '---', 'color': 'purple' },
            { 'label': 'Tickets Vendidos Hoy', 'value': str(tickets_sold_today), 'icon': 'ShoppingBag', 'change': '---', 'color': 'pink' },
        ],
        'recentActivity': recent_activity
    })
