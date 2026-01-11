-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: skipit_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_category_menu` (`menu_id`),
  CONSTRAINT `fk_category_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,'Cervezas',1,'2025-12-21 17:46:53'),(2,1,'Tragos',2,'2025-12-21 17:46:53'),(3,1,'Shots',3,'2025-12-21 17:46:53'),(4,1,'Sin Alcohol',4,'2025-12-21 17:46:53');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contests`
--

DROP TABLE IF EXISTS `contests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `prize_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_date` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `action_type` enum('LINK','ADD_TO_CART','NONE') COLLATE utf8mb4_unicode_ci DEFAULT 'NONE',
  `action_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linked_variation_id` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contest_variation` (`linked_variation_id`),
  CONSTRAINT `fk_contest_variation` FOREIGN KEY (`linked_variation_id`) REFERENCES `product_variations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contests`
--

LOCK TABLES `contests` WRITE;
/*!40000 ALTER TABLE `contests` DISABLE KEYS */;
INSERT INTO `contests` VALUES (1,'Corona Extra Challenge','Corona','Compra 3 cervezas Corona y participa por entradas VIP','Entradas VIP','31 Dic',NULL,1,'ADD_TO_CART',NULL,101,'2025-12-21 17:46:58'),(2,'Pisco Sour Festival','Capel','Gana un viaje a Perú comprando Pisco Sour','Viaje a Perú','15 Ene',NULL,1,'ADD_TO_CART',NULL,104,'2025-12-21 17:46:58');
/*!40000 ALTER TABLE `contests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `overlay_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iso_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `rating` decimal(3,1) DEFAULT '5.0',
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `carousel_order` int DEFAULT '0',
  `menu_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_event_menu` (`menu_id`),
  CONSTRAINT `fk_event_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Ultra Music Festival','Ultra Music Festival','2025-12-15','20:00:00','06:00:00','Parque O\'Higgins, Santiago','https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',15000.00,4.8,'Festival',1,1,1,'2025-12-08 15:23:28','2025-12-21 17:47:03'),(2,'Noche de Reggaeton','Noche de Reggaeton','2025-12-18','22:00:00','04:00:00','Club The One, Las Condes','https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',8000.00,4.6,'Club',1,2,1,'2025-12-08 15:23:28','2025-12-21 17:47:03'),(3,'Rock en Español','Rock en Español','2025-12-22','19:00:00','02:00:00','Teatro Cariola, Santiago','https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',12000.00,4.9,'Concierto',1,3,1,'2025-12-08 15:23:28','2025-12-21 17:47:03'),(4,'Summer Beach Party','Summer Beach Party','2025-12-25','16:00:00','01:00:00','Playa Reñaca, Viña del Mar','https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg',10000.00,4.7,'Playa',1,4,1,'2025-12-08 15:23:28','2025-12-21 17:47:03');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,'Menú General 2025','2025-12-08 15:23:28','2025-12-21 17:47:07');
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variation_id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variation_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `claimed` int DEFAULT '0',
  `price_at_purchase` decimal(10,2) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_item_order` (`order_id`),
  KEY `fk_item_variation` (`variation_id`),
  CONSTRAINT `fk_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_variation` FOREIGN KEY (`variation_id`) REFERENCES `product_variations` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,'ORD-001',104,'Pisco Sour','Tradicional',2,0,7000.00,'2025-12-21 17:47:15'),(2,'ORD-001',101,'Corona Extra','330ml',1,0,4500.00,'2025-12-21 17:47:15'),(3,'ORD-002',105,'Mojito','Tradicional',1,1,6500.00,'2025-12-21 17:47:15'),(4,'ORD-002',106,'Caipirinha','Tradicional',1,0,6000.00,'2025-12-21 17:47:15'),(5,'ORD-003',109,'Jägermeister','Shot',3,3,4000.00,'2025-12-21 17:47:15'),(6,'ORD-004',109,'Jägermeister','Shot',3,3,4000.00,'2025-12-21 17:47:15'),(7,'ORD-9A47639C',104,'Pisco Sour','Tradicional',2,2,7000.00,'2025-12-21 22:59:17'),(8,'ORD-E9EB435D',101,'Corona Extra','330ml',1,0,4500.00,'2025-12-21 17:47:15'),(9,'ORD-703C2CBC',101,'Corona Extra','330ml',1,1,4500.00,'2025-12-21 23:26:21'),(10,'ORD-703C2CBC',102,'Heineken','330ml',1,1,5000.00,'2025-12-21 23:26:59'),(11,'ORD-703C2CBC',103,'Stella Artois','330ml',1,1,5500.00,'2025-12-21 23:27:36'),(12,'ORD-703C2CBC',108,'Tequila Shot','Caballito',1,1,3500.00,'2025-12-21 23:27:36'),(13,'ORD-703C2CBC',110,'B-52','Shot',1,1,5000.00,'2025-12-21 23:27:36'),(14,'ORD-703C2CBC',111,'Virgin Mojito','Vaso',1,1,3000.00,'2025-12-21 23:27:36'),(15,'ORD-DB83346B',101,'Corona Extra','330ml',1,1,4500.00,'2025-12-21 23:40:21'),(16,'ORD-DB83346B',102,'Heineken','330ml',3,3,5000.00,'2025-12-21 23:41:11'),(17,'ORD-DB83346B',103,'Stella Artois','330ml',1,0,5500.00,'2025-12-21 23:33:03'),(18,'ORD-DB83346B',106,'Caipirinha','Tradicional',1,0,6000.00,'2025-12-21 23:33:03'),(19,'ORD-DB83346B',108,'Tequila Shot','Caballito',1,0,3500.00,'2025-12-21 23:33:03'),(20,'ORD-F5E862E9',101,'Corona Extra','330ml',1,0,4500.00,'2025-12-21 23:43:17'),(21,'ORD-F5E862E9',102,'Heineken','330ml',1,0,5000.00,'2025-12-21 23:43:17'),(22,'ORD-F5E862E9',103,'Stella Artois','330ml',1,0,5500.00,'2025-12-21 23:43:17'),(23,'ORD-F5E862E9',106,'Caipirinha','Tradicional',5,4,6000.00,'2025-12-21 23:46:04'),(24,'ORD-30C91431',101,'Corona Extra','330ml',6,6,4500.00,'2025-12-21 23:54:15'),(25,'ORD-30C91431',103,'Stella Artois','330ml',5,0,5500.00,'2025-12-21 23:51:07'),(26,'ORD-B85AA1F0',101,'Corona Extra','330ml',2,0,4500.00,'2025-12-30 23:40:38'),(27,'ORD-B85AA1F0',104,'Pisco Sour','Tradicional',1,0,7000.00,'2025-12-30 23:40:38'),(28,'ORD-B85AA1F0',106,'Caipirinha','Tradicional',1,0,6000.00,'2025-12-30 23:40:38'),(29,'ORD-B85AA1F0',110,'B-52','Shot',4,0,5000.00,'2025-12-30 23:40:38'),(30,'ORD-B85AA1F0',111,'Virgin Mojito','Vaso',3,0,3000.00,'2025-12-30 23:40:38'),(31,'ORD-D0208D66',101,'Corona Extra','330ml',5,5,4500.00,'2025-12-30 23:50:57'),(32,'ORD-D0208D66',103,'Stella Artois','330ml',4,4,5500.00,'2025-12-30 23:50:57'),(33,'ORD-D0208D66',106,'Caipirinha','Tradicional',5,5,6000.00,'2025-12-30 23:50:57'),(34,'ORD-5118EA67',101,'Corona Extra','330ml',1,1,4500.00,'2025-12-30 23:53:38'),(35,'ORD-5118EA67',102,'Heineken','330ml',1,0,5000.00,'2025-12-30 23:52:36'),(36,'ORD-5118EA67',103,'Stella Artois','330ml',1,0,5500.00,'2025-12-30 23:52:36'),(37,'ORD-7478C8E5',101,'Corona Extra','330ml',1,0,4500.00,'2025-12-30 23:52:50'),(38,'ORD-7478C8E5',102,'Heineken','330ml',1,0,5000.00,'2025-12-30 23:52:50'),(39,'ORD-7478C8E5',103,'Stella Artois','330ml',1,0,5500.00,'2025-12-30 23:52:50');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` int NOT NULL,
  `iso_date` date NOT NULL,
  `purchase_time` time DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('COMPLETED','PARTIALLY_CLAIMED','FULLY_CLAIMED','CANCELLED') COLLATE utf8mb4_unicode_ci DEFAULT 'COMPLETED',
  `qr_code_data` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  KEY `fk_order_user` (`user_id`),
  KEY `fk_order_event` (`event_id`),
  CONSTRAINT `fk_order_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('ORD-001','1',1,'2025-11-15','14:32:10',18500.00,'COMPLETED',NULL,'2025-12-08 15:23:28','2025-12-21 17:47:20'),('ORD-002','1',2,'2025-11-20','19:45:55',12500.00,'PARTIALLY_CLAIMED',NULL,'2025-12-08 15:23:28','2025-12-21 17:47:20'),('ORD-003','1',3,'2025-12-05','10:15:30',12000.00,'FULLY_CLAIMED',NULL,'2025-12-08 15:23:28','2025-12-21 17:47:20'),('ORD-004','1',4,'2025-12-05','10:39:33',12000.00,'FULLY_CLAIMED',NULL,'2025-12-08 15:23:28','2025-12-21 17:47:20'),('ORD-30C91431','13808843-85a5-4295-80b0-4ddffbc06c63',1,'2025-12-21','20:51:07',54500.00,'PARTIALLY_CLAIMED','{\"orderId\":\"ORD-30C91431\",\"userId\":\"13808843-85a5-4295-80b0-4ddffbc06c63\"}','2025-12-22 02:51:07','2025-12-21 23:51:36'),('ORD-5118EA67','37e82957-df2c-4cc9-93e6-10a69b16f0fc',4,'2025-12-30','20:52:36',15000.00,'PARTIALLY_CLAIMED','{\"orderId\":\"ORD-5118EA67\",\"userId\":\"37e82957-df2c-4cc9-93e6-10a69b16f0fc\"}','2025-12-31 02:52:36','2025-12-30 23:53:38'),('ORD-703C2CBC','13808843-85a5-4295-80b0-4ddffbc06c63',2,'2025-12-20','21:08:44',26500.00,'FULLY_CLAIMED','{\"orderId\":\"ORD-703C2CBC\",\"userId\":\"13808843-85a5-4295-80b0-4ddffbc06c63\"}','2025-12-21 03:08:44','2025-12-21 23:27:36'),('ORD-7478C8E5','37e82957-df2c-4cc9-93e6-10a69b16f0fc',3,'2025-12-30','20:52:50',15000.00,'COMPLETED','{\"orderId\":\"ORD-7478C8E5\",\"userId\":\"37e82957-df2c-4cc9-93e6-10a69b16f0fc\"}','2025-12-31 02:52:50','2025-12-30 23:52:50'),('ORD-9A47639C','13808843-85a5-4295-80b0-4ddffbc06c63',2,'2025-12-20','20:59:17',14000.00,'FULLY_CLAIMED','{\"orderId\":\"ORD-9A47639C\",\"userId\":\"13808843-85a5-4295-80b0-4ddffbc06c63\"}','2025-12-21 02:59:18','2025-12-21 22:59:17'),('ORD-B85AA1F0','23409543-b459-487e-9058-c9ccfb81915d',2,'2025-12-30','20:40:38',51000.00,'COMPLETED','{\"orderId\":\"ORD-B85AA1F0\",\"userId\":\"23409543-b459-487e-9058-c9ccfb81915d\"}','2025-12-31 02:40:38','2025-12-30 23:40:38'),('ORD-D0208D66','37e82957-df2c-4cc9-93e6-10a69b16f0fc',2,'2025-12-30','20:50:06',74500.00,'FULLY_CLAIMED','{\"orderId\":\"ORD-D0208D66\",\"userId\":\"37e82957-df2c-4cc9-93e6-10a69b16f0fc\"}','2025-12-31 02:50:06','2025-12-30 23:50:57'),('ORD-DB83346B','13808843-85a5-4295-80b0-4ddffbc06c63',1,'2025-12-21','14:28:45',34500.00,'PARTIALLY_CLAIMED','{\"orderId\":\"ORD-DB83346B\",\"userId\":\"13808843-85a5-4295-80b0-4ddffbc06c63\"}','2025-12-21 20:28:45','2025-12-21 23:40:21'),('ORD-E9EB435D','13808843-85a5-4295-80b0-4ddffbc06c63',1,'2025-12-20','21:00:35',4500.00,'COMPLETED','{\"orderId\":\"ORD-E9EB435D\",\"userId\":\"13808843-85a5-4295-80b0-4ddffbc06c63\"}','2025-12-21 03:00:35','2025-12-21 17:47:20'),('ORD-F5E862E9','13808843-85a5-4295-80b0-4ddffbc06c63',3,'2025-12-21','20:43:17',45000.00,'PARTIALLY_CLAIMED','{\"orderId\":\"ORD-F5E862E9\",\"userId\":\"13808843-85a5-4295-80b0-4ddffbc06c63\"}','2025-12-22 02:43:17','2025-12-21 23:43:28');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variations`
--

DROP TABLE IF EXISTS `product_variations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_variation_product` (`product_id`),
  CONSTRAINT `fk_variation_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variations`
--

LOCK TABLES `product_variations` WRITE;
/*!40000 ALTER TABLE `product_variations` DISABLE KEYS */;
INSERT INTO `product_variations` VALUES (101,1,'330ml',4500.00,NULL,'2025-12-21 17:47:32'),(102,2,'330ml',5000.00,NULL,'2025-12-21 17:47:32'),(103,3,'330ml',5500.00,NULL,'2025-12-21 17:47:32'),(104,4,'Tradicional',7000.00,NULL,'2025-12-21 17:47:32'),(105,5,'Tradicional',6500.00,NULL,'2025-12-21 17:47:32'),(106,6,'Tradicional',6000.00,NULL,'2025-12-21 17:47:32'),(107,7,'Tradicional',7500.00,NULL,'2025-12-21 17:47:32'),(108,8,'Caballito',3500.00,NULL,'2025-12-21 17:47:32'),(109,9,'Shot',4000.00,NULL,'2025-12-21 17:47:32'),(110,10,'Shot',5000.00,NULL,'2025-12-21 17:47:32'),(111,11,'Vaso',3000.00,NULL,'2025-12-21 17:47:32'),(112,12,'Vaso',2500.00,NULL,'2025-12-21 17:47:32');
/*!40000 ALTER TABLE `product_variations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Corona Extra','Cerveza mexicana refrescante con limón','https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg','2025-12-21 17:47:37'),(2,1,'Heineken','Cerveza premium holandesa','https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg','2025-12-21 17:47:37'),(3,1,'Stella Artois','Cerveza belga de alta calidad','https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg','2025-12-21 17:47:37'),(4,2,'Pisco Sour','El clásico chileno con pisco, limón y clara de huevo','https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg','2025-12-21 17:47:37'),(5,2,'Mojito','Ron blanco, menta fresca, azúcar y limón','https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg','2025-12-21 17:47:37'),(6,2,'Caipirinha','Cachaça brasileña con limón y azúcar','https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg','2025-12-21 17:47:37'),(7,2,'Sex on the Beach','Vodka, ron, durazno, piña y arándanos','https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg','2025-12-21 17:47:37'),(8,3,'Tequila Shot','Tequila premium con sal y limón','https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg','2025-12-21 17:47:37'),(9,3,'Jägermeister','Licor de hierbas alemán bien frío','https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg','2025-12-21 17:47:37'),(10,3,'B-52','Kahlúa, Bailey\'s y Grand Marnier en capas','https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg','2025-12-21 17:47:37'),(11,4,'Virgin Mojito','Menta fresca, limón y soda sin alcohol','https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg','2025-12-21 17:47:37'),(12,4,'Jugo Natural','Jugos frescos de frutas de temporada','https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg','2025-12-21 17:47:37');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `discount_text` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `style_variant` enum('orange-red','blue-purple','green-emerald') COLLATE utf8mb4_unicode_ci DEFAULT 'orange-red',
  `icon_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `action_type` enum('LINK','ADD_TO_CART','NONE') COLLATE utf8mb4_unicode_ci DEFAULT 'NONE',
  `linked_variation_id` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_promo_variation` (`linked_variation_id`),
  CONSTRAINT `fk_promo_variation` FOREIGN KEY (`linked_variation_id`) REFERENCES `product_variations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'Happy Hour Digital','2x1 en cervezas precompradas hasta las 11 PM','50% OFF','orange-red','Clock',NULL,1,'ADD_TO_CART',101,'2025-12-21 17:47:44'),(2,'Grupo Premiado','Compra para 4+ personas y obtén tragos gratis','GRATIS','blue-purple','Users',NULL,1,'NONE',NULL,'2025-12-21 17:47:44'),(3,'Weekend Vibes','Descuentos especiales en fines de semana','30% OFF','green-emerald','Gift',NULL,1,'NONE',NULL,'2025-12-21 17:47:44');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_configuration`
--

DROP TABLE IF EXISTS `site_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_configuration` (
  `section_key` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_json` json NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_configuration`
--

LOCK TABLES `site_configuration` WRITE;
/*!40000 ALTER TABLE `site_configuration` DISABLE KEYS */;
INSERT INTO `site_configuration` VALUES ('about','{\"steps\": [{\"title\": \"Precompra\", \"stepNumber\": 1, \"description\": \"Elige tu evento y tus tragos favoritos desde tu celular.\"}, {\"title\": \"Recibe tu QR\", \"stepNumber\": 2, \"description\": \"Obtén un código único por cada compra realizada.\"}, {\"title\": \"Canjea\", \"stepNumber\": 3, \"description\": \"Muestra tu QR en la barra y recibe tu pedido al instante.\"}], \"vision\": {\"text\": \"Ser la plataforma estándar para la compra de bebestibles en eventos de todo Chile, reconocida por su rapidez y confiabilidad.\"}, \"mission\": {\"text\": \"Transformar la experiencia de los eventos masivos, eliminando las largas filas en las cajas y barras mediante tecnología simple y eficiente.\", \"highlight\": \"cajas y barras\"}}','2025-12-08 15:23:28'),('hero','{\"title\": \"¡Sáltate la fila,\", \"features\": [{\"icon\": \"Clock\", \"title\": \"Ahorra Tiempo\", \"description\": \"No más espera en la caja.\\nCanjea tu trago directo en la barra.\"}, {\"icon\": \"Zap\", \"title\": \"Súper Fácil\", \"description\": \"Compra, recibe tu QR y canjea. ¡Así de simple!\"}, {\"icon\": \"Users\", \"title\": \"Más Diversión\", \"description\": \"Dedica tu tiempo a lo que realmente importa: ¡pasarlo bien!\"}], \"subtitle\": \"y dedícate a disfrutar!\", \"description\": \"Precompra tus tragos favoritos y canjéalos al instante con tu código QR.\\nPara nosotros tu tiempo es oro…¡Gástalo bailando con SkipIT!\", \"ctaButtonText\": \"Buscar Eventos\", \"contestButtonText\": \"Ver Concursos\", \"secondaryButtonText\": \"Ver Promociones\"}','2025-12-08 15:23:28');
/*!40000 ALTER TABLE `site_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_priority_access` tinyint(1) DEFAULT '0',
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1','Juan Perez','juan','123',0,'user-cli',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55'),('13808843-85a5-4295-80b0-4ddffbc06c63','admin test1','admin@test.com','$2a$10$VroeAVkFip.WfplM2CSJwuzLjIongIwmxqiXw7vol9KMfZoLZGi6m',0,'admin','+56999999999','2007-12-21','F','2025-12-21 02:33:13','2025-12-21 17:47:55'),('2','Ana Garcia','ana.garcia@example.com',NULL,0,'user-cli',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55'),('23409543-b459-487e-9058-c9ccfb81915d','admin2 ad','admin2@gmail.com','$2a$10$zpA6eudGVby4o97OKlP/EepiW6kwizsveYcSE77zkg0qggwJvZ6Zi',0,'admin','+56999999999','2007-12-30','M','2025-12-31 02:36:13','2025-12-30 23:36:51'),('3','Carlos Sanchez','carlos.sanchez@example.com',NULL,0,'user-cli',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55'),('313fd1ab-63c2-4809-99b6-f7c3e7a2939c','juan perez','juan.perez@example.com','$2a$10$M8hbfrQ.bd4j96b/Ylk/H.sZwUwRoi8y4lIKoeBrHgDlpHKT0F78G',0,'user_cli','+56999999999','1997-08-14','M','2025-12-21 01:33:44','2025-12-21 17:47:55'),('37e82957-df2c-4cc9-93e6-10a69b16f0fc','pepe p','pepe@gmail.com','$2a$10$VGErHkuzmRIaj.4O1009jOTZCxy8kQLg./tS0nuI.ImVAi7uzbNPu',0,'user_cli','+56999999991','2007-12-30','M','2025-12-31 02:46:47','2025-12-30 23:46:47'),('87ef4bfe-0101-4819-9ad3-a8e4e183f1a3','staff2 st','staff2@gmail.com','$2a$10$JrX140jlJO18UmpCKgqe..h7gZM4lqM7kfrIoy1s43m8L8TcYpqGe',0,'scanner','+56888888888','2007-12-30','M','2025-12-31 02:39:07','2025-12-30 23:39:45'),('admin-1','Ricardo Admin','ricardo@admin.cl','123',1,'admin',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55'),('admin-2','Cristian Gomez','cri.gomezv@profesor.duoc.cl',NULL,1,'admin',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55'),('admin-3','Andres Gomez','andres.gomez.vega@gmail.com',NULL,1,'admin',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55'),('d964573d-1138-4ee5-8566-4925ed4e3a92','ricardo castillo','ricardo@correo.com','$2a$10$Gvjw9sSHCeZ6IUui311ZYeW56C44YUALmFltuiwbdE.hANJGs0gCK',0,'user_cli','+56999999999','1985-06-08','M','2025-12-21 01:28:13','2025-12-21 17:47:55'),('f656a813-1886-43a3-98fe-431772401c6c','new new','new@new.com','$2a$10$5p9xeY3vuQDGNC/nTwu8jelg84jECjllLW.ufy2JI0flFWatxNgwW',0,'scanner','+56999999999','1989-06-17','M','2025-12-21 02:31:59','2025-12-21 22:27:17'),('scanner-1','Scanner Staff','scanner@skipit.cl',NULL,0,'scanner',NULL,NULL,NULL,'2025-12-08 15:23:28','2025-12-21 17:47:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-30 21:29:33
