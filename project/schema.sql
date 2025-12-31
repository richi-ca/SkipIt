-- SkipIT Database Schema (MySQL)
-- Generated based on mockData.ts structure
-- Date: 2025-12-08

-- ==========================================
-- Database Initialization
-- ==========================================
DROP DATABASE IF EXISTS `skipit_db`;
CREATE DATABASE `skipit_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skipit_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================
-- 1. Users Table
-- ==========================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) DEFAULT NULL, -- Nullable for OAuth users initially
  `has_priority_access` BOOLEAN DEFAULT FALSE,
  `role` ENUM('admin', 'user-cli', 'scanner', 'user') DEFAULT 'user-cli',
  `phone` VARCHAR(50) DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `gender` ENUM('M', 'F', 'Otro') DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 2. Menus & Catalog Structure
-- ==========================================
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `menu_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `display_order` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_category_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(2048),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_variations`;
CREATE TABLE `product_variations` (
  `id` INT AUTO_INCREMENT NOT NULL, -- This will correspond to the variationId (e.g., 101, 102)
  `product_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL, -- e.g., "330ml", "Vaso"
  `price` DECIMAL(10, 2) NOT NULL,
  `stock` INT DEFAULT NULL, -- Null means unlimited
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_variation_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 3. Events Table
-- ==========================================
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `overlay_title` VARCHAR(255),
  `iso_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(2048),
  `price` DECIMAL(10, 2) NOT NULL,
  `rating` DECIMAL(3, 1) DEFAULT 5.0,
  `type` VARCHAR(50),
  `is_featured` BOOLEAN DEFAULT FALSE,
  `carousel_order` INT DEFAULT 0,
  `menu_id` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_event_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 4. Marketing (Promotions & Contests)
-- ==========================================
DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `discount_text` VARCHAR(100),
  `style_variant` ENUM('orange-red', 'blue-purple', 'green-emerald') DEFAULT 'orange-red',
  `icon_name` VARCHAR(50),
  `image_url` VARCHAR(2048),
  `active` BOOLEAN DEFAULT TRUE,
  `action_type` ENUM('LINK', 'ADD_TO_CART', 'NONE') DEFAULT 'NONE',
  `linked_variation_id` INT,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_promo_variation` FOREIGN KEY (`linked_variation_id`) REFERENCES `product_variations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `contests`;
CREATE TABLE `contests` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(255),
  `description` TEXT,
  `prize_text` VARCHAR(255),
  `end_date` VARCHAR(50), -- Keeping as string for "31 Dic" format initially, or use DATE
  `image_url` VARCHAR(2048),
  `active` BOOLEAN DEFAULT TRUE,
  `action_type` ENUM('LINK', 'ADD_TO_CART', 'NONE') DEFAULT 'NONE',
  `action_url` VARCHAR(2048),
  `linked_variation_id` INT,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_contest_variation` FOREIGN KEY (`linked_variation_id`) REFERENCES `product_variations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 5. Orders & Transactions
-- ==========================================
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `order_id` VARCHAR(255) NOT NULL, -- e.g., "ORD-001"
  `user_id` VARCHAR(255) NOT NULL,
  `event_id` INT NOT NULL,
  `iso_date` DATE NOT NULL,
  `purchase_time` TIME DEFAULT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('COMPLETED', 'PARTIALLY_CLAIMED', 'FULLY_CLAIMED', 'CANCELLED') DEFAULT 'COMPLETED',
  `qr_code_data` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_order_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `order_id` VARCHAR(255) NOT NULL,
  `variation_id` INT NOT NULL,
  `product_name` VARCHAR(255) NOT NULL, -- Snapshot
  `variation_name` VARCHAR(255) NOT NULL, -- Snapshot
  `quantity` INT NOT NULL,
  `claimed` INT DEFAULT 0,
  `price_at_purchase` DECIMAL(10, 2) NOT NULL, -- Snapshot
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_variation` FOREIGN KEY (`variation_id`) REFERENCES `product_variations` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- 6. Site Configuration (Admin Content)
-- ==========================================
DROP TABLE IF EXISTS `site_configuration`;
CREATE TABLE `site_configuration` (
  `section_key` VARCHAR(50) NOT NULL, -- e.g., 'hero', 'about', 'footer'
  `content_json` JSON NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED DATA (from mockData.ts)
-- ==========================================

-- 1. Users
INSERT INTO `users` (`id`, `name`, `email`, `has_priority_access`, `role`) VALUES
('1', 'Juan Perez', 'juan.perez@example.com', 0, 'user-cli'),
('2', 'Ana Garcia', 'ana.garcia@example.com', 0, 'user-cli'),
('3', 'Carlos Sanchez', 'carlos.sanchez@example.com', 0, 'user-cli'),
('1759105113010', 'Ricardo Castillo Avalos', 'ricardo@correo.com', 1, 'user-cli'),
('admin-1', 'Ricardo Admin', 'ricardo@admin.cl', 1, 'admin'),
('admin-2', 'Cristian Gomez', 'cri.gomezv@profesor.duoc.cl', 1, 'admin'),
('admin-3', 'Andres Gomez', 'andres.gomez.vega@gmail.com', 1, 'admin'),
('scanner-1', 'Scanner Staff', 'scanner@skipit.cl', 0, 'scanner');

-- 2. Menus
INSERT INTO `menus` (`id`, `name`) VALUES (1, 'Menú General 2025');

-- 3. Categories
INSERT INTO `categories` (`id`, `menu_id`, `name`, `display_order`) VALUES
(1, 1, 'Cervezas', 1),
(2, 1, 'Tragos', 2),
(3, 1, 'Shots', 3),
(4, 1, 'Sin Alcohol', 4);

-- 4. Products & Variations
-- Cervezas
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `image_url`) VALUES
(1, 1, 'Corona Extra', 'Cerveza mexicana refrescante con limón', 'https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg'),
(2, 1, 'Heineken', 'Cerveza premium holandesa', 'https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg'),
(3, 1, 'Stella Artois', 'Cerveza belga de alta calidad', 'https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg');

INSERT INTO `product_variations` (`id`, `product_id`, `name`, `price`) VALUES
(101, 1, '330ml', 4500),
(102, 2, '330ml', 5000),
(103, 3, '330ml', 5500);

-- Tragos
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `image_url`) VALUES
(4, 2, 'Pisco Sour', 'El clásico chileno con pisco, limón y clara de huevo', 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'),
(5, 2, 'Mojito', 'Ron blanco, menta fresca, azúcar y limón', 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'),
(6, 2, 'Caipirinha', 'Cachaça brasileña con limón y azúcar', 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg'),
(7, 2, 'Sex on the Beach', 'Vodka, ron, durazno, piña y arándanos', 'https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg');

INSERT INTO `product_variations` (`id`, `product_id`, `name`, `price`) VALUES
(104, 4, 'Tradicional', 7000),
(105, 5, 'Tradicional', 6500),
(106, 6, 'Tradicional', 6000),
(107, 7, 'Tradicional', 7500);

-- Shots
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `image_url`) VALUES
(8, 3, 'Tequila Shot', 'Tequila premium con sal y limón', 'https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg'),
(9, 3, 'Jägermeister', 'Licor de hierbas alemán bien frío', 'https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg'),
(10, 3, 'B-52', 'Kahlúa, Bailey\'s y Grand Marnier en capas', 'https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg');

INSERT INTO `product_variations` (`id`, `product_id`, `name`, `price`) VALUES
(108, 8, 'Caballito', 3500),
(109, 9, 'Shot', 4000),
(110, 10, 'Shot', 5000);

-- Sin Alcohol
INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `image_url`) VALUES
(11, 4, 'Virgin Mojito', 'Menta fresca, limón y soda sin alcohol', 'https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg'),
(12, 4, 'Jugo Natural', 'Jugos frescos de frutas de temporada', 'https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg');

INSERT INTO `product_variations` (`id`, `product_id`, `name`, `price`) VALUES
(111, 11, 'Vaso', 3000),
(112, 12, 'Vaso', 2500);

-- 5. Events
INSERT INTO `events` (`id`, `name`, `overlay_title`, `iso_date`, `start_time`, `end_time`, `location`, `image_url`, `price`, `rating`, `type`, `is_featured`, `carousel_order`, `menu_id`) VALUES
(1, 'Ultra Music Festival', 'Ultra Music Festival', '2025-12-15', '20:00:00', '06:00:00', 'Parque O\'Higgins, Santiago', 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg', 15000, 4.8, 'Festival', 1, 1, 1),
(2, 'Noche de Reggaeton', 'Noche de Reggaeton', '2025-12-18', '22:00:00', '04:00:00', 'Club The One, Las Condes', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg', 8000, 4.6, 'Club', 1, 2, 1),
(3, 'Rock en Español', 'Rock en Español', '2025-12-22', '19:00:00', '02:00:00', 'Teatro Cariola, Santiago', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 12000, 4.9, 'Concierto', 1, 3, 1),
(4, 'Summer Beach Party', 'Summer Beach Party', '2025-12-25', '16:00:00', '01:00:00', 'Playa Reñaca, Viña del Mar', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg', 10000, 4.7, 'Playa', 1, 4, 1);

-- 6. Promotions
INSERT INTO `promotions` (`id`, `title`, `description`, `discount_text`, `style_variant`, `icon_name`, `active`, `action_type`, `linked_variation_id`) VALUES
(1, 'Happy Hour Digital', '2x1 en cervezas precompradas hasta las 11 PM', '50% OFF', 'orange-red', 'Clock', 1, 'ADD_TO_CART', 101),
(2, 'Grupo Premiado', 'Compra para 4+ personas y obtén tragos gratis', 'GRATIS', 'blue-purple', 'Users', 1, 'NONE', NULL),
(3, 'Weekend Vibes', 'Descuentos especiales en fines de semana', '30% OFF', 'green-emerald', 'Gift', 1, 'NONE', NULL);

-- 7. Contests
INSERT INTO `contests` (`id`, `title`, `description`, `brand`, `prize_text`, `end_date`, `active`, `action_type`, `linked_variation_id`) VALUES
(1, 'Corona Extra Challenge', 'Compra 3 cervezas Corona y participa por entradas VIP', 'Corona', 'Entradas VIP', '31 Dic', 1, 'ADD_TO_CART', 101),
(2, 'Pisco Sour Festival', 'Gana un viaje a Perú comprando Pisco Sour', 'Capel', 'Viaje a Perú', '15 Ene', 1, 'ADD_TO_CART', 104);

-- 8. Orders (Historical Data)
-- Order 1
INSERT INTO `orders` (`order_id`, `user_id`, `event_id`, `iso_date`, `purchase_time`, `total`, `status`) VALUES
('ORD-001', '1', 1, '2025-11-15', '14:32:10', 18500, 'COMPLETED');

INSERT INTO `order_items` (`order_id`, `variation_id`, `product_name`, `variation_name`, `quantity`, `claimed`, `price_at_purchase`) VALUES
('ORD-001', 104, 'Pisco Sour', 'Tradicional', 2, 0, 7000),
('ORD-001', 101, 'Corona Extra', '330ml', 1, 0, 4500);

-- Order 2
INSERT INTO `orders` (`order_id`, `user_id`, `event_id`, `iso_date`, `purchase_time`, `total`, `status`) VALUES
('ORD-002', '1', 2, '2025-11-20', '19:45:55', 12500, 'PARTIALLY_CLAIMED');

INSERT INTO `order_items` (`order_id`, `variation_id`, `product_name`, `variation_name`, `quantity`, `claimed`, `price_at_purchase`) VALUES
('ORD-002', 105, 'Mojito', 'Tradicional', 1, 1, 6500),
('ORD-002', 106, 'Caipirinha', 'Tradicional', 1, 0, 6000);

-- Order 3
INSERT INTO `orders` (`order_id`, `user_id`, `event_id`, `iso_date`, `purchase_time`, `total`, `status`) VALUES
('ORD-003', '1', 3, '2025-12-05', '10:15:30', 12000, 'FULLY_CLAIMED');

INSERT INTO `order_items` (`order_id`, `variation_id`, `product_name`, `variation_name`, `quantity`, `claimed`, `price_at_purchase`) VALUES
('ORD-003', 109, 'Jägermeister', 'Shot', 3, 3, 4000);

-- Order 4
INSERT INTO `orders` (`order_id`, `user_id`, `event_id`, `iso_date`, `purchase_time`, `total`, `status`) VALUES
('ORD-004', '1', 4, '2025-12-05', '10:39:33', 12000, 'FULLY_CLAIMED');

INSERT INTO `order_items` (`order_id`, `variation_id`, `product_name`, `variation_name`, `quantity`, `claimed`, `price_at_purchase`) VALUES
('ORD-004', 109, 'Jägermeister', 'Shot', 3, 3, 4000);

-- 9. Site Content (JSON Seed)
-- Insertando el JSON de Site Content tal como está en mockData
-- Usando CAST para asegurar que MySQL interprete correctamente el string como JSON
INSERT INTO `site_configuration` (`section_key`, `content_json`) VALUES
('hero', CAST('{ "title": "¡Sáltate la fila,", "subtitle": "y dedícate a disfrutar!", "description": "Precompra tus tragos favoritos y canjéalos al instante con tu código QR.\\nPara nosotros tu tiempo es oro…¡Gástalo bailando con SkipIT!", "ctaButtonText": "Buscar Eventos", "secondaryButtonText": "Ver Promociones", "contestButtonText": "Ver Concursos", "features": [ {"icon": "Clock", "title": "Ahorra Tiempo", "description": "No más espera en la caja.\\nCanjea tu trago directo en la barra."}, {"icon": "Zap", "title": "Súper Fácil", "description": "Compra, recibe tu QR y canjea. ¡Así de simple!"}, {"icon": "Users", "title": "Más Diversión", "description": "Dedica tu tiempo a lo que realmente importa: ¡pasarlo bien!"} ] }' AS JSON)),
('about', CAST('{ "mission": { "text": "Transformar la experiencia de los eventos masivos, eliminando las largas filas en las cajas y barras mediante tecnología simple y eficiente.", "highlight": "cajas y barras" }, "vision": { "text": "Ser la plataforma estándar para la compra de bebestibles en eventos de todo Chile, reconocida por su rapidez y confiabilidad." }, "steps": [ {"stepNumber": 1, "title": "Precompra", "description": "Elige tu evento y tus tragos favoritos desde tu celular."}, {"stepNumber": 2, "title": "Recibe tu QR", "description": "Obtén un código único por cada compra realizada."}, {"stepNumber": 3, "title": "Canjea", "description": "Muestra tu QR en la barra y recibe tu pedido al instante."} ] }' AS JSON));

SET FOREIGN_KEY_CHECKS = 1;
