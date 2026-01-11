# SkipIT - Plataforma de Precompra de Bebidas para Eventos

![Estado del Proyecto](https://img.shields.io/badge/Estado-Beta%20Funcional-orange)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue)
![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%20%7C%20Microservicios-green)
![Base de Datos](https://img.shields.io/badge/DB-MySQL-lightgrey)
![Infraestructura](https://img.shields.io/badge/Infra-Docker%20%7C%20K8s%20Ready-blueviolet)

SkipIT es una solución tecnológica integral diseñada para eliminar las filas en eventos masivos. Permite a los usuarios pre-comprar sus tragos desde su celular y canjearlos instantáneamente en la barra mediante códigos QR seguros, optimizando la experiencia del asistente y la gestión del inventario.

---

## 🚀 Características Principales

### Para el Usuario (Asistente)
*   **🛒 Precompra Inteligente:** Catálogo de eventos y tragos con gestión de carrito en tiempo real. Soporta múltiples variaciones por producto (ej: "Pisco" -> "35°", "40°").
*   **🔞 Verificación de Edad:** Sistema de cumplimiento legal con persistencia local segura.
*   **🎟️ Billetera de QRs:** Generación de códigos QR únicos. Soporta dos modos:
    *   **QR Global:** Para canjear la orden completa de una vez.
    *   **QR Individual:** Para canjear items específicos uno a uno.
*   **👤 Perfil de Usuario:** Historial de compras persistente y gestión de datos personales.

### Para el Staff (Bartenders)
*   **📱 Scanner Dashboard:** Interfaz dedicada para validación y canje.
*   **⚡ Validación en Tiempo Real:** Detección instantánea de QRs válidos, usados o inválidos contra la base de datos.
*   **🛡️ Protección Anti-Fraude:** Impide el "Replay Attack" (usar el mismo QR dos veces) mediante tokens únicos de canje.

### Para el Administrador (Roadmap)
*   **📊 Panel de Control "Admin Total":** Gestión centralizada de eventos, productos, precios, stocks y campañas de marketing (Promociones/Concursos).

---

## 📐 Principios de Ingeniería y Diseño

El sistema ha sido construido siguiendo principios de arquitectura de software estrictos para garantizar seguridad y escalabilidad.

### 1. Seguridad "Trust-No-Client"
El frontend es solo una interfaz de presentación. Toda la lógica crítica ocurre en el backend:
*   **Cálculo de Precios:** El servidor recalcula el total de la orden basándose en los precios de la base de datos, ignorando cualquier precio enviado por el navegador para evitar manipulaciones.
*   **Validación de Stock:** Se verifica la disponibilidad en tiempo real antes de confirmar la transacción.

### 2. Integridad de Datos (Snapshots)
Para garantizar la consistencia histórica, las órdenes guardan una "foto instantánea" (`snapshot`) de los datos del producto al momento de la compra. Si el precio del "Pisco" cambia mañana, el historial de un usuario que compró hoy no se verá afectado.

### 3. Modelo de Datos Jerárquico
La base de datos implementa una estructura relacional flexible:
`Menu` -> `Category` (Cervezas) -> `Product` (Corona) -> `ProductVariation` (710ml, 330ml).
Esto permite una gestión de inventario granular y precios específicos por variación.

---

## 🛠️ Arquitectura Técnica

El sistema utiliza una **Arquitectura de Microservicios** pura, comunicándose vía REST y orquestados por un API Gateway.

### Stack Tecnológico

*   **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Context API (Gestión de estado asíncrono).
*   **Backend:** Java 17, Spring Boot 3.2, Spring Data JPA.
*   **Base de Datos:** MySQL 8.0 (con soporte JSONB para configuraciones flexibles).
*   **Seguridad:** Spring Security 6 + JWT (Stateless Authentication).

### Mapa de Microservicios

| Servicio | Puerto | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **Gateway Service** | `8080` | Puerta de enlace única. Enrutamiento dinámico (`Spring Cloud Gateway`) y manejo centralizado de CORS. | ✅ Operativo |
| **Auth Service** | `8081` | Gestión de identidad. Registro, Login y emisión de Tokens JWT firmados. | ✅ Operativo |
| **Catalog Service** | `8082` | Catálogo Maestro. Gestión de Eventos, Menús, Productos y Variaciones. | ✅ Operativo |
| **Order Service** | `8083` | Motor Transaccional. Coordina la creación de órdenes, validación de stock (vía cliente HTTP) y ciclo de vida del canje. | ✅ Operativo |

---

## 🔮 Visión de Producción (On-Premise)

La arquitectura está diseñada para ser desplegada en un entorno de alta disponibilidad autogestionado:
*   **Orquestación:** Kubernetes (K8s) para el manejo de contenedores.
*   **Base de Datos:** Clúster de PostgreSQL/MySQL con replicación.
*   **Observabilidad:** Stack Prometheus + Grafana para métricas en tiempo real.
*   **CI/CD:** Pipelines automatizados con GitHub Actions y Harbor (Registro de imágenes privado).

---

## ⚙️ Instalación y Despliegue Local

### Requisitos Previos
*   Node.js 18+
*   Java JDK 17
*   MySQL 8.0
*   Maven

### 1. Base de Datos
Ejecuta el script `schema.sql` para crear la estructura relacional y poblar los datos semilla (`mockData` migrada).

### 2. Levantar Microservicios
Iniciar en este orden para asegurar el registro y dependencias:
1.  `gateway-service` (:8080)
2.  `auth-service` (:8081)
3.  `catalog-service` (:8082)
4.  `order-service` (:8083)

### 3. Levantar Frontend
```bash
cd project
npm install
npm run dev
```
Acceso: `http://localhost:5173`.

---

## 📚 Documentación Interna

Para profundizar en decisiones técnicas específicas, consultar los siguientes documentos en la carpeta `project/`:
*   `ARQUITECTURA_PRODUCCION.md`: Plan detallado de infraestructura K8s.
*   `MODELO_DE_DATOS.md`: Diccionario de datos y relaciones ER.
*   `AUDITORIA.md`: Registro de decisiones de refactorización y deuda técnica.
*   `PROPUESTA_QR_UNICO.md`: Lógica detallada del sistema anti-fraude de QRs.

---

## 🧪 Usuarios de Prueba

Credenciales pre-configuradas para validar los distintos roles del sistema:

| Rol | Usuario (Email) | Contraseña | Propósito |
| :--- | :--- | :--- | :--- |
| **Admin** | `soyAdmin2@gmail.com` | `admin2` | Acceso total y futuro panel de administración. |
| **Scanner (Staff)** | `staff2@gmail.com` | `soyStaff2` | Acceso restringido al Dashboard de Canje. |
| **Usuario** | (Registro libre) | (Tu contraseña) | Flujo de compra estándar. |

---

## 📄 Licencia
Copyright (c) 2026 Ricardo Castillo Avalos.
Este proyecto está bajo la licencia MIT.