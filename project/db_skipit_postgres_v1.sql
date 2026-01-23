-- SkipIT PostgreSQL Database Schema v1
-- Generated from Spring Boot Entities

-- Database Creation
DROP DATABASE IF EXISTS "skipit_db";
CREATE DATABASE "skipit_db";

-- Clean up existing tables
DROP TABLE IF EXISTS "order_items";
DROP TABLE IF EXISTS "orders";
DROP TABLE IF EXISTS "events";
DROP TABLE IF EXISTS "product_variations";
DROP TABLE IF EXISTS "products";
DROP TABLE IF EXISTS "categories";
DROP TABLE IF EXISTS "menus";
DROP TABLE IF EXISTS "users";

-- Users Table
CREATE TABLE "users" (
    "id" VARCHAR(255) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255),
    "has_priority_access" BOOLEAN DEFAULT FALSE,
    "role" VARCHAR(50) CHECK (role IN ('admin', 'user_cli', 'scanner')),
    "phone" VARCHAR(255),
    "dob" DATE,
    "gender" VARCHAR(20) CHECK (gender IN ('M', 'F', 'Otro')),
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menus Table
CREATE TABLE "menus" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE "categories" (
    "id" SERIAL PRIMARY KEY,
    "menu_id" INTEGER NOT NULL REFERENCES "menus"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "display_order" INTEGER
);

-- Products Table
CREATE TABLE "products" (
    "id" SERIAL PRIMARY KEY,
    "category_id" INTEGER NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR(255)
);

-- Product Variations Table
CREATE TABLE "product_variations" (
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(19, 2) NOT NULL,
    "stock" INTEGER
);

-- Events Table
CREATE TABLE "events" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "overlay_title" VARCHAR(255),
    "iso_date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255),
    "price" DECIMAL(19, 2) NOT NULL,
    "rating" DECIMAL(2, 1),
    "type" VARCHAR(255),
    "is_featured" BOOLEAN DEFAULT FALSE,
    "carousel_order" INTEGER,
    "menu_id" INTEGER REFERENCES "menus"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE "orders" (
    "order_id" VARCHAR(255) PRIMARY KEY,
    "user_id" VARCHAR(255) NOT NULL, -- Logical reference to users(id)
    "event_id" INTEGER NOT NULL, -- Logical reference to events(id)
    "iso_date" DATE NOT NULL,
    "purchase_time" TIME,
    "total" DECIMAL(19, 2) NOT NULL,
    "status" VARCHAR(255) CHECK (status IN ('COMPLETED', 'PARTIALLY_CLAIMED', 'FULLY_CLAIMED', 'CANCELLED')),
    "qr_code_data" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE "order_items" (
    "id" SERIAL PRIMARY KEY,
    "order_id" VARCHAR(255) NOT NULL REFERENCES "orders"("order_id") ON DELETE CASCADE,
    "variation_id" INTEGER NOT NULL, -- Logical reference to product_variations(id)
    "product_name" VARCHAR(255) NOT NULL,
    "variation_name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "claimed" INTEGER DEFAULT 0,
    "price_at_purchase" DECIMAL(19, 2) NOT NULL
);

-- Indexes for performance (Optional but recommended)
CREATE INDEX idx_orders_user_id ON "orders"("user_id");
CREATE INDEX idx_orders_event_id ON "orders"("event_id");
CREATE INDEX idx_product_variations_product_id ON "product_variations"("product_id");
CREATE INDEX idx_products_category_id ON "products"("category_id");
CREATE INDEX idx_categories_menu_id ON "categories"("menu_id");
