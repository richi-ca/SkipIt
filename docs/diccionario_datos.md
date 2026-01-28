# Diccionario de Datos - SkipIt

Este documento describe la estructura de la base de datos del proyecto SkipIt, detallando las tablas, sus campos y ejemplos de valores.

## 1. User (Usuarios)

Almacena la información de todos los usuarios del sistema (clientes, administradores, operadores).

| Campo                   | Tipo          | Descripción                                         | Ejemplos                                                              |
| :---------------------- | :------------ | :--------------------------------------------------- | :-------------------------------------------------------------------- |
| `id`                  | String (UUID) | Identificador único del usuario.                    | ("cliente1", "admin1", "uuid-gen-1234")                               |
| `name`                | String        | Nombre completo del usuario.                         | ("Usuario Cliente", "Super Admin", "Barra Operator")                  |
| `email`               | String        | Correo electrónico único del usuario.              | ("cliente@skipit.com", "admin@skipit.com", "barra@skipit.com")        |
| `password`            | String        | Hash de la contraseña del usuario.                  | ("pbkdf2:sha256...", "secret_pass", "123456")                         |
| `has_priority_access` | Boolean       | Indica si el usuario tiene acceso VIP o prioritario. | (True, False, False)                                                  |
| `role`                | Enum          | Rol del usuario en el sistema.                       | ("admin", "user_cli", "scanner")                                      |
| `phone`               | String        | Número de teléfono del usuario.                    | ("+56912345678", "987654321", null)                                   |
| `dob`                 | Date          | Fecha de nacimiento del usuario.                     | ("2000-01-01", "1995-05-20", null)                                    |
| `gender`              | Enum          | Género del usuario.                                 | ("M", "F", "Otro")                                                    |
| `created_at`          | DateTime      | Fecha y hora de creación del registro.              | ("2024-01-01 10:00:00", "2024-02-15 14:30:00", "2024-06-20 09:15:00") |

## 2. Menu (Menús)

Define las cartas o menús disponibles (ej: barra principal, terraza, VIP).

| Campo          | Tipo     | Descripción                         | Ejemplos                                                              |
| :------------- | :------- | :----------------------------------- | :-------------------------------------------------------------------- |
| `id`         | Integer  | Identificador único del menú.      | (1, 2, 3)                                                             |
| `name`       | String   | Nombre descriptivo del menú.        | ("Menú Principal", "Barra VIP", "Terraza")                           |
| `created_at` | DateTime | Fecha y hora de creación del menú. | ("2024-01-01 00:00:00", "2025-01-01 12:00:00", "2024-03-15 18:30:00") |

## 3. Category (Categorías)

Agrupa los productos dentro de un menú (ej: Tragos, Cervezas).

| Campo             | Tipo    | Descripción                                    | Ejemplos                          |
| :---------------- | :------ | :---------------------------------------------- | :-------------------------------- |
| `id`            | Integer | Identificador único de la categoría.          | (1, 2, 3)                         |
| `menu_id`       | Integer | ID del menú al que pertenece la categoría.    | (1, 1, 2)                         |
| `name`          | String  | Nombre de la categoría.                        | ("Tragos", "Cervezas", "Bebidas") |
| `display_order` | Integer | Orden numérico para visualizar en la interfaz. | (1, 2, 3)                         |

## 4. Product (Productos)

Define los productos genéricos disponibles en una categoría.

| Campo           | Tipo    | Descripción                               | Ejemplos                                                        |
| :-------------- | :------ | :----------------------------------------- | :-------------------------------------------------------------- |
| `id`          | Integer | Identificador único del producto.         | (10, 11, 20)                                                    |
| `category_id` | Integer | ID de la categoría a la que pertenece.    | (1, 2, 1)                                                       |
| `name`        | String  | Nombre del producto.                       | ("Pisco", "Cerveza Artesanal", "Ron")                           |
| `description` | Text    | Descripción detallada del producto.       | ("Pisco premium 35°", "Rubia, Roja o Negra", "Añejo 7 años") |
| `image_url`   | String  | URL de la imagen referencial del producto. | ("pisco.jpg", "cerveza.jpg", "https://s3.../ron.png")           |

## 5. ProductVariation (Variaciones de Producto)

Define las variantes específicas vendibles de un producto (ej: Vaso, Jarra) con su precio y stock.

| Campo          | Tipo    | Descripción                             | Ejemplos                         |
| :------------- | :------ | :--------------------------------------- | :------------------------------- |
| `id`         | Integer | Identificador único de la variación.   | (100, 101, 200)                  |
| `product_id` | Integer | ID del producto padre asociado.          | (10, 10, 20)                     |
| `name`       | String  | Nombre de la variación (tamaño, tipo). | ("Vaso", "Jarra", "Pinta 500cc") |
| `price`      | Numeric | Precio de venta de la variación.        | (5000.00, 12000.00, 4500.00)     |
| `stock`      | Integer | Cantidad disponible en inventario.       | (100, 50, 200)                   |

## 6. Event (Eventos)

Información sobre las fiestas, conciertos o eventos disponibles en el local.

| Campo              | Tipo     | Descripción                                               | Ejemplos                                                              |
| :----------------- | :------- | :--------------------------------------------------------- | :-------------------------------------------------------------------- |
| `id`             | Integer  | Identificador único del evento.                           | (1, 2, 15)                                                            |
| `menu_id`        | Integer  | ID del menú que estará activo durante el evento.         | (1, 2, null)                                                          |
| `name`           | String   | Nombre principal del evento.                               | ("Fiesta de Inauguración", "Sunset Electrónica", "Noche de Rock")   |
| `overlay_title`  | String   | Texto promocional corto para destacar en imágenes.        | ("Gran Apertura", "Open Bar hasta 12", "Solo Ellas")                  |
| `iso_date`       | Date     | Fecha calendario del evento.                               | ("2024-12-31", "2024-02-14", "2025-01-20")                            |
| `start_time`     | Time     | Hora de inicio del evento.                                 | ("22:00:00", "20:00:00", "23:30:00")                                  |
| `end_time`       | Time     | Hora de finalización del evento.                          | ("05:00:00", "04:00:00", "06:00:00")                                  |
| `location`       | String   | Lugar físico donde ocurre el evento.                      | ("Club SkipIT, Santiago", "Terraza", "Salón VIP")                    |
| `image_url`      | String   | URL de la imagen promocional del evento.                   | ("fiesta.jpg", "banner_rock.png", "https://picsum.../img.jpg")        |
| `price`          | Numeric  | Precio de la entrada o cover.                              | (15000.00, 5000.00, 0.00)                                             |
| `rating`         | Numeric  | Calificación promedio del evento (1.0 a 5.0).             | (5.0, 4.5, 3.8)                                                       |
| `type`           | String   | Categoría o tipo de evento.                               | ("Fiesta", "Concierto", "Festival")                                   |
| `is_featured`    | Boolean  | Indica si el evento aparece destacado en la home.          | (True, False, False)                                                  |
| `carousel_order` | Integer  | Posición específica en el carrusel de destacados.        | (1, 2, null)                                                          |
| `valid_from`     | Date     | Fecha desde la cual el evento es visible en la plataforma. | ("2024-01-01", "2024-05-15", null)                                    |
| `valid_until`    | Date     | Fecha hasta la cual el evento es visible en la plataforma. | ("2024-02-01", "2024-06-30", null)                                    |
| `created_at`     | DateTime | Fecha de creación del registro.                           | ("2024-01-01 12:00:00", "2024-03-20 15:00:00", "2024-05-10 09:30:00") |

## 7. Order (Órdenes de Compra)

Registro de las compras realizadas por los usuarios.

| Campo             | Tipo     | Descripción                                                  | Ejemplos                                                              |
| :---------------- | :------- | :------------------------------------------------------------ | :-------------------------------------------------------------------- |
| `order_id`      | String   | Identificador único de la orden.                             | ("ord_12345678", "uuid-abc-def", "550e8400-e29b...")                  |
| `user_id`       | String   | ID del usuario que realizó la compra.                        | ("cliente1", "user-uuid-99", "guest-01")                              |
| `event_id`      | Integer  | ID del evento asociado a la compra.                           | (1, 5, 20)                                                            |
| `iso_date`      | Date     | Fecha asociada a la orden.                                    | ("2024-10-31", "2024-05-20", "2025-01-01")                            |
| `purchase_time` | Time     | Hora exacta de la compra.                                     | ("23:45:10", "12:30:05", "01:15:00")                                  |
| `total`         | Numeric  | Monto total pagado en la orden.                               | (25000.00, 50000.00, 12500.50)                                        |
| `status`        | Enum     | Estado actual de la orden.                                    | ("COMPLETED", "PARTIALLY_CLAIMED", "CANCELLED")                       |
| `qr_code_data`  | Text     | Cadena de texto o token para generar el código QR de retiro. | ("qr_token_xvz123", "json_data_auth...", null)                        |
| `created_at`    | DateTime | Fecha y hora de creación del registro.                       | ("2024-10-31 23:45:10", "2024-05-20 12:30:05", "2025-01-01 01:15:00") |

## 8. OrderItem (Items de la Orden)

Detalle de los productos específicos incluidos en una orden.

| Campo                 | Tipo    | Descripción                                                       | Ejemplos                                        |
| :-------------------- | :------ | :----------------------------------------------------------------- | :---------------------------------------------- |
| `id`                | Integer | Identificador único del item de orden.                            | (1, 2, 500)                                     |
| `order_id`          | String  | ID de la orden a la que pertenece este item.                       | ("ord_12345678", "uuid-abc-def", "550e8400...") |
| `variation_id`      | Integer | ID de la variación de producto comprada.                          | (100, 101, 200)                                 |
| `product_name`      | String  | Nombre del producto al momento de la compra (snapshot).            | ("Pisco Mistral", "Cerveza Artesanal", "Ron")   |
| `variation_name`    | String  | Nombre de la variación al momento de la compra (snapshot).        | ("Vaso", "Jarra", "Pinta 500cc")                |
| `quantity`          | Integer | Cantidad de unidades compradas de este item.                       | (1, 2, 4)                                       |
| `claimed`           | Integer | Cantidad de unidades que ya han sido retiradas/canjeadas en barra. | (0, 1, 2)                                       |
| `price_at_purchase` | Numeric | Precio unitario que tenía el producto al momento de comprar.      | (5000.00, 4500.00, 12000.00)                    |
