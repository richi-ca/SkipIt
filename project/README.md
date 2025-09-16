# SkipIT - Plataforma de Precompra de Tragos

## Descripción del Proyecto

SkipIT es una moderna aplicación web diseñada para optimizar la experiencia de compra de bebidas en eventos y establecimientos. Permite a los usuarios pre-comprar tragos de manera rápida y eficiente, evitando filas y mejorando el flujo de servicio. La plataforma se enfoca en la facilidad de uso, la seguridad en las transacciones y una interfaz intuitiva para garantizar una experiencia de usuario superior.

## Características Principales

*   **Verificación de Edad:** Un sistema robusto de verificación de edad asegura el cumplimiento de las regulaciones para la venta de bebidas alcohólicas.
*   **Autenticación de Usuarios:** Registro y login seguros para una gestión personalizada de pedidos y preferencias.
*   **Exploración de Eventos:** Visualización de eventos disponibles con detalles relevantes para que los usuarios puedan elegir dónde y cuándo usar la aplicación.
*   **Menú de Bebidas Interactivo:** Un catálogo completo de bebidas con opciones para añadir y gestionar productos en el carrito de compras.
*   **Carrito de Compras:** Funcionalidad completa de carrito para revisar y modificar pedidos antes de la compra.
*   **Generación de Código QR:** Tras la pre-compra, se genera un código QR único que sirve como comprobante para el retiro de las bebidas, agilizando el proceso en el punto de venta.
*   **Diseño Responsivo:** Interfaz de usuario adaptativa que garantiza una experiencia óptima en dispositivos móviles y de escritorio.
*   **Navegación Intuitiva:** Un encabezado dinámico y un pie de página informativo facilitan la navegación y el acceso a información importante.

## Tecnologías Utilizadas

*   **Frontend:**
    *   **React:** Biblioteca de JavaScript para construir interfaces de usuario interactivas.
    *   **TypeScript:** Superset de JavaScript que añade tipado estático para un código más robusto y mantenible.
    *   **Vite:** Herramienta de construcción rápida para proyectos web modernos.
    *   **Tailwind CSS:** Framework CSS de utilidad para un diseño rápido y altamente personalizable.
    *   **React Router DOM:** Para la gestión de rutas y navegación en la aplicación.
    *   **Lucide React:** Colección de iconos para una interfaz visualmente atractiva.

## Instalación

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/richi-ca/SkipIt.git
    cd SkipIt/project
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Uso

Una vez que la aplicación esté en funcionamiento:

1.  **Verificación de Edad:** Al acceder por primera vez, se solicitará la verificación de edad.
2.  **Registro/Login:** Los usuarios pueden registrarse o iniciar sesión para acceder a todas las funcionalidades.
3.  **Explorar Eventos:** Navega por la página de inicio o la sección de eventos para encontrar tu evento deseado.
4.  **Seleccionar Bebidas:** Elige un evento para ver el menú de bebidas y añade tus selecciones al carrito.
5.  **Generar QR:** Procede al pago (simulado en esta versión) y genera tu código QR para retirar tus bebidas.

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un `issue` para discutir los cambios propuestos o envía un `pull request`.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
