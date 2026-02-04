# Documentación de Interfaces Gráficas y Requerimientos de Usuario - SkipIt

Este documento describe detalladamente las interfaces gráficas del sistema SkipIt, especificando los elementos visuales, las interacciones esperadas y las reglas de negocio asociadas. Está diseñado para servir como referencia para desarrolladores y como base para la creación de pruebas automatizadas (Testing E2E).

---

## 1. Encabezado y Navegación (Global)

**Componente:** `Header.tsx`, `UserMenuDropdown.tsx`, `CartContext.tsx`

### Descripción
La barra de navegación superior está presente en todas las páginas públicas y del área de cliente. Su contenido varía según el estado de autenticación del usuario.

### Elementos
- **Logo**: Enlace a la página de inicio.
- **Menú de Navegación**:
  - "Inicio": Redirige a `/`.
  - "Eventos": Redirige a `/events`.
  - "Quiénes somos": Scroll a sección correspondiente.
  - "Cómo funciona": Scroll a sección correspondiente.
- **Área de Usuario (No Autenticado)**:
  - Botón "Inicia Sesión": Abre `LoginModal`.
  - Botón "Regístrate": Abre `RegisterModal`.
- **Área de Usuario (Autenticado)**:
  - **Nombre de Usuario**: Muestra el primer nombre del usuario.
  - **Menú Desplegable**:
    - "Mis Datos": Redirige a `/profile`.
    - "Mis Pedidos": Redirige a `/history`.
    - "Panel Admin" (Solo rol Admin): Redirige a `/admin`.
    - "Salir": Cierra la sesión.
- **Carrito de Compras**:
  - Icono de carrito con contador (badge) de items.
  - Visible si el usuario está autenticado O si hay items en el carro.

### Reglas de Negocio / Comportamiento Esperado
1.  **Cierre de Sesión con Carrito Lleno**:
    *   **Escenario**: Usuario hace clic en "Salir" y `cartItemCount > 0`.
    *   **Acción**: Mostrar `ConfirmationModal` con mensaje: *"Tienes productos en tu carro de compras. Si cierras sesión, se vaciará el carro. ¿Estás seguro de que quieres cerrar sesión?"*.
    *   **Confirmación**: Si acepta, ejecutar `clearCart()` y luego `logout()`.
    *   **Cancelación**: El usuario permanece logueado y el carro intacto.
2.  **Cierre de Sesión con Carrito Vacío**:
    *   **Escenario**: Usuario hace clic en "Salir" y `cartItemCount == 0`.
    *   **Acción**: Mostrar `ConfirmationModal` con mensaje estándar.
3.  **Persistencia**: El nombre del usuario debe ser siempre visible en el header en pantallas grandes.

---

## 2. Autenticación

**Componentes:** `LoginModal.tsx`, `RegisterModal.tsx`, `AuthContext.tsx`

### 2.1. Inicio de Sesión
- **Modal**: Aparece sobre la interfaz actual.
- **Campos**:
  - Email (Validación de formato).
  - Contraseña.
- **Interacciones**:
  - Botón "Ingresar".
  - Enlace "¿No tienes cuenta?": Cambia a `RegisterModal`.
- **Validaciones Backend**:
  - **Cuenta Desactivada**: Si el usuario tiene `is_active = false`, mostrar error: *"La cuenta está desactivada. Contacte al administrador."*.

### 2.2. Registro
- **Modal**: Aparece sobre la interfaz actual.
- **Campos**:
  - Nombre Completo (Requerido).
  - Email (Requerido, único).
  - Teléfono (Opcional).
  - Fecha de Nacimiento (Selector de fecha, compatible con formato `yyyy-MM-dd`).
  - Género (Selector: M, F, Otro).
  - Contraseña (Hasheada en backend).
- **Reglas**:
  - Todo usuario nuevo nace con `is_active = true`.
  - El rol por defecto es `user_cli`.

---

## 3. Página de Inicio (Home)

**Componente:** `HomePage.tsx`

### Elementos
- **Hero Section**: Imagen principal y llamada a la acción.
- **Carrusel de Eventos Destacados**:
  - Muestra eventos marcados como `is_featured`.
  - Ordenados por `carousel_order`.
- **Bloques CMS**:
  - Secciones "Quiénes Somos", "Cómo Funciona" alimentadas desde la base de datos (`ContentBlock`).

---

## 4. Catálogo de Eventos

**Componente:** `EventsPage.tsx`, `EventCard.tsx`

### Elementos
- **Buscador**: Campo de texto con placeholder "Buscar". Filtra por nombre de evento.
- **Filtros**:
  - **Periodo**: Combobox con opciones:
    - "Todos los eventos vigentes" (Default).
    - "Eventos del año".
    - "Eventos de la semana".
    - "Eventos del día".
    - "Buscar por fechas" (Habilita selectores de fecha).
    - "Todos los eventos".
  - **Tipo de Evento**: Filtrado por categoría de evento (e.g., Música, Teatro).
- **Lista de Eventos**:
  - Tarjetas (`EventCard`) con imagen, nombre, fecha, ubicación.
  - **Eventos Destacados**: Borde amarillo y etiqueta "Destacado".

### Comportamiento Esperado
- Al seleccionar "Buscar por fechas", los inputs "Desde" y "Hasta" se habilitan. En otros casos, se deshabilitan y limpian.

---

## 5. Detalle de Evento y Menú (Carta)

**Componente:** `DrinkMenu.tsx` (integrado en el flujo de compra)

### Descripción
Interfaz donde el usuario selecciona productos asociados a un evento específico.

### Elementos
- **Lista de Categorías**: Acordeón o lista de categorías (Cervezas, Piscos, etc.).
- **Lista de Productos**: Dentro de cada categoría.
- **Ordenamiento**:
  - Las **categorías** aparecen ordenadas por `category_display_order`.
  - Los **productos** dentro de cada categoría aparecen ordenados por `product_display_order`.
- **Item de Producto**:
  - Imagen, Nombre, Descripción.
  - Precio.
  - Botón "Agregar" (+).

---

## 6. Panel de Administración

**Ruta Base:** `/admin`
**Componente:** `AdminDashboard.tsx`, `AdminSidebar.tsx`

### 6.1. Gestión de Eventos
**Componente:** `EventsMaintainer.tsx`
- **Tabla**: Listado de eventos (Nombre, Fecha, Lugar).
- **Formulario (Crear/Editar)**:
  - Campos: Nombre, Título Overlay, Fechas, Ubicación, Tipo, Rating.
  - **Selección de Imagen**: Integración con gestor de medios (Subir o Seleccionar existente).
  - Checkbox `is_featured`.

### 6.2. Gestión de Menús (Cartas)
**Componente:** `MenusMaintainer.tsx`
- **Selección de Menú/Evento**: Dropdown para elegir qué carta editar.
- **Gestión de Productos**:
  - **Tabla Agrupada**: Productos agrupados visualmente por Categoría.
  - **Encabezados de Categoría**:
    - Nombre de la categoría.
    - **Botones de Reordenamiento (Categoría)**: Flechas Arriba/Abajo. Mueven *toda* la categoría y sus productos en bloque.
  - **Filas de Producto**:
    - Nombre, Precio (Editable), Activo (Switch SÍ/NO).
    - **Botones de Reordenamiento (Producto)**: Flechas Arriba/Abajo. Mueven el producto *solo dentro* de su categoría.
- **Agregar Producto**:
  - Buscador de productos disponibles (no en el menú actual).
  - Al agregar, si es una categoría nueva para el menú, se coloca al final. Si la categoría existe, se añade al final de esa categoría.

### 6.3. Gestión de Usuarios
**Componente:** `UsersMaintainer.tsx`
- **Tabla**: ID, Nombre, Email, Rol, Estado.
- **Estado**: Columna que muestra si el usuario está Activo o Inactivo (`is_active`).
- **Acciones**: Editar usuario para activar/desactivar acceso o cambiar rol.

### 6.4. Contenidos (CMS)
- Edición de bloques de texto (Misión, Visión, etc.).

---

## 7. Perfil de Usuario

**Componente:** `ProfilePage.tsx`, `EditProfileModal.tsx`

### Elementos
- **Visualización**: Muestra datos actuales del usuario.
- **Edición**:
  - Botón "Editar Perfil".
  - Formulario en modal con campos validos: Nombre, Teléfono, Fecha de Nacimiento (Selector), Género.
  - Email: Editable con validación de unicidad en backend.
  - Contraseña: No editable aquí (flujo separado o pendiente).
- **Historial**: Enlace a "Mis Pedidos".

---

## 8. Carro de Compras y Checkout

**Componente:** `Cart.tsx`

- **Visualización**: Lista de items seleccionados, cantidades, subtotal.
- **Acciones**:
  - Aumentar/Disminuir cantidad.
  - Eliminar producto.
  - **Vaciar Carro**: Botón explícito.
  - **Pagar**: Inicia flujo de pago (Simulado/Integrado).

---

## Pendientes / Notas para QA
- Verificar que el reordenamiento de categorías en `MenusMaintainer` persista correctamente al refrescar la página.
- Validar que un usuario desactivado (`is_active=false`) no pueda obtener un token de sesión a través de la API `/login`.
- Probar el flujo de "Cerrar sesión con carro lleno" para asegurar que el carro se limpie efectivamente solo tras la confirmación.
