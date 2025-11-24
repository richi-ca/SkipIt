import { Clock, Gift, Users } from 'lucide-react';

// --- Interfaces de Usuario ---
export interface User {
  id: string;
  name: string;
  email: string;
  hasPriorityAccess: boolean;
  dob?: string; // Date of Birth
  gender?: 'M' | 'F' | 'Otro';
  phone?: string;
}

// --- Interfaces de Menú y Productos (Jerárquico) ---
export interface ProductVariation {
  id: number;
  name: string;             // Ej: "Capel 35°", "Original"
  price: number;
  stock?: number;
}

export interface Product {
  id: number;
  name: string;             // Ej: "Pisco", "Corona Extra"
  description: string;
  image: string;
  variations: ProductVariation[];
}

export interface Category {
  id: number;
  name: string;             // Ej: "Cervezas", "Tragos"
  products: Product[];
}

export interface Menu {
  id: number;
  name: string;
  categories: Category[];
}

// --- Interfaces de Eventos ---
export interface Event {
  id: number;
  name: string;
  overlayTitle?: string;    // Título artístico sobre la imagen
  date: string;
  time: string;
  location: string;
  image: string;
  price: string;
  rating: number;
  type: string;
  
  // Configuración Admin
  isFeatured: boolean;      // Si aparece en el carrusel
  carouselOrder?: number;
  menuId?: number;          // Menú asociado
}

// --- Interfaces de Marketing (Promociones y Concursos) ---
export type PromotionStyle = 'orange-red' | 'blue-purple' | 'green-emerald';
export type ActionType = 'LINK' | 'ADD_TO_CART' | 'NONE';

export interface Promotion {
  id: number;
  title: string;
  description: string;
  discountText: string;     // Ej: "50% OFF"
  
  // Visuals
  styleVariant: PromotionStyle; 
  iconName: 'Clock' | 'Users' | 'Gift'; 
  imageUrl?: string;        // Opcional: Para subir logo de fiesta/marca (PDF requirement)
  
  // Logic
  active: boolean;
  actionType?: ActionType;  // Qué hace el botón "Activar"
  linkedProductId?: number; // Si es ADD_TO_CART, qué producto agrega
}

export interface Contest {
  id: number;
  title: string;
  brand: string;
  description: string;
  prizeText: string;
  endDate: string;
  
  // Visuals
  image?: string;           // Imagen de la copa o premio
  
  // Logic
  active: boolean;
  actionType: ActionType;   // Qué hace el botón "Participar"
  actionUrl?: string;       // Si es LINK, a dónde va
  linkedProductId?: number; // Si es ADD_TO_CART (Compra y participa)
}

export interface Order {
  orderId: string;
  userId: string;
  date: string;
  event: Event;
  items: {
    productName: string;    // Snapshot del nombre
    variationName: string;  // Snapshot de la variación
    quantity: number;
    claimed: number;
    price: number;
  }[];
  total: number;
  status: 'COMPLETED' | 'PARTIALLY_CLAIMED' | 'FULLY_CLAIMED';
}

// ==========================================
// DATA MOCK (Migrada de los componentes)
// ==========================================

export const users: User[] = [
  {
    id: "1",
    name: "Juan Perez",
    email: "juan.perez@example.com",
    hasPriorityAccess: true,
  },
  {
    id: "2",
    name: "Ana Garcia",
    email: "ana.garcia@example.com",
    hasPriorityAccess: false,
  },
  {
    id: "3",
    name: "Carlos Sanchez",
    email: "carlos.sanchez@example.com",
    hasPriorityAccess: false,
  },
  {
    id: "1759105113010",
    name: "Ricardo Castillo Avalos",
    email: "ricardo@correo.com",
    hasPriorityAccess: true,
  },
];

// --- Menú General (Base para todos los eventos por ahora) ---
const generalMenu: Menu = {
  id: 1,
  name: "Menú General 2025",
  categories: [
    {
      id: 1,
      name: "Cervezas",
      products: [
        {
          id: 1,
          name: "Corona Extra",
          description: "Cerveza mexicana refrescante con limón",
          image: "https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg",
          variations: [{ id: 101, name: "330ml", price: 4500 }]
        },
        {
          id: 2,
          name: "Heineken",
          description: "Cerveza premium holandesa",
          image: "https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg",
          variations: [{ id: 102, name: "330ml", price: 5000 }]
        },
        {
          id: 3,
          name: "Stella Artois",
          description: "Cerveza belga de alta calidad",
          image: "https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg",
          variations: [{ id: 103, name: "330ml", price: 5500 }]
        }
      ]
    },
    {
      id: 2,
      name: "Tragos",
      products: [
        {
          id: 4,
          name: "Pisco Sour",
          description: "El clásico chileno con pisco, limón y clara de huevo",
          image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
          variations: [{ id: 104, name: "Tradicional", price: 7000 }]
        },
        {
          id: 5,
          name: "Mojito",
          description: "Ron blanco, menta fresca, azúcar y limón",
          image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
          variations: [{ id: 105, name: "Tradicional", price: 6500 }]
        },
        {
          id: 6,
          name: "Caipirinha",
          description: "Cachaça brasileña con limón y azúcar",
          image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
          variations: [{ id: 106, name: "Tradicional", price: 6000 }]
        },
        {
          id: 7,
          name: "Sex on the Beach",
          description: "Vodka, ron, durazno, piña y arándanos",
          image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
          variations: [{ id: 107, name: "Tradicional", price: 7500 }]
        }
      ]
    },
    {
      id: 3,
      name: "Shots",
      products: [
        {
          id: 8,
          name: "Tequila Shot",
          description: "Tequila premium con sal y limón",
          image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
          variations: [{ id: 108, name: "Caballito", price: 3500 }]
        },
        {
          id: 9,
          name: "Jägermeister",
          description: "Licor de hierbas alemán bien frío",
          image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
          variations: [{ id: 109, name: "Shot", price: 4000 }]
        },
        {
          id: 10,
          name: "B-52",
          description: "Kahlúa, Bailey's y Grand Marnier en capas",
          image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
          variations: [{ id: 110, name: "Shot", price: 5000 }]
        }
      ]
    },
    {
      id: 4,
      name: "Sin Alcohol",
      products: [
        {
          id: 11,
          name: "Virgin Mojito",
          description: "Menta fresca, limón y soda sin alcohol",
          image: "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
          variations: [{ id: 111, name: "Vaso", price: 3000 }]
        },
        {
          id: 12,
          name: "Jugo Natural",
          description: "Jugos frescos de frutas de temporada",
          image: "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
          variations: [{ id: 112, name: "Vaso", price: 2500 }]
        }
      ]
    }
  ]
};

// Exportar el menú plano para compatibilidad temporal si es necesario
// (Aunque idealmente migraremos los componentes)
export const menus = [generalMenu];

export const events: Event[] = [
  {
    id: 1,
    name: "Ultra Music Festival",
    overlayTitle: "Ultra Music Festival",
    date: "15 Diciembre 2025",
    time: "20:00 - 06:00",
    location: "Parque O'Higgins, Santiago",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    price: "$15.000",
    rating: 4.8,
    type: "Festival",
    isFeatured: true,
    carouselOrder: 1,
    menuId: 1
  },
  {
    id: 2,
    name: "Noche de Reggaeton",
    overlayTitle: "Noche de Reggaeton",
    date: "18 Diciembre 2025",
    time: "22:00 - 04:00",
    location: "Club The One, Las Condes",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    price: "$8.000",
    rating: 4.6,
    type: "Club",
    isFeatured: true,
    carouselOrder: 2,
    menuId: 1
  },
  {
    id: 3,
    name: "Rock en Español",
    overlayTitle: "Rock en Español",
    date: "22 Diciembre 2025",
    time: "19:00 - 02:00",
    location: "Teatro Cariola, Santiago",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
    price: "$12.000",
    rating: 4.9,
    type: "Concierto",
    isFeatured: true,
    carouselOrder: 3,
    menuId: 1
  },
  {
    id: 4,
    name: "Summer Beach Party",
    overlayTitle: "Summer Beach Party",
    date: "25 Diciembre 2025",
    time: "16:00 - 01:00",
    location: "Playa Reñaca, Viña del Mar",
    image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg",
    price: "$10.000",
    rating: 4.7,
    type: "Playa",
    isFeatured: true,
    carouselOrder: 4,
    menuId: 1
  }
];

export const promotions: Promotion[] = [
  {
    id: 1,
    title: "Happy Hour Digital",
    description: "2x1 en cervezas precompradas hasta las 11 PM",
    discountText: "50% OFF",
    styleVariant: 'orange-red', 
    iconName: 'Clock',
    active: true,
    actionType: 'ADD_TO_CART', // Ejemplo: Debería añadir una cerveza
    linkedProductId: 101 // Variación 330ml Corona
  },
  {
    id: 2,
    title: "Grupo Premiado",
    description: "Compra para 4+ personas y obtén tragos gratis",
    discountText: "GRATIS",
    styleVariant: 'blue-purple',
    iconName: 'Users',
    active: true,
    actionType: 'NONE' // Solo informativo por ahora
  },
  {
    id: 3,
    title: "Weekend Vibes",
    description: "Descuentos especiales en fines de semana",
    discountText: "30% OFF",
    styleVariant: 'green-emerald',
    iconName: 'Gift',
    active: true,
    actionType: 'NONE'
  }
];

export const contests: Contest[] = [
  {
    id: 1,
    title: "Corona Extra Challenge",
    description: "Compra 3 cervezas Corona y participa por entradas VIP",
    brand: "Corona",
    prizeText: "Entradas VIP",
    endDate: "31 Dic",
    active: true,
    actionType: 'ADD_TO_CART', // "Compra trago y participa"
    linkedProductId: 101
  },
  {
    id: 2,
    title: "Pisco Sour Festival",
    description: "Gana un viaje a Perú comprando Pisco Sour",
    brand: "Capel",
    prizeText: "Viaje a Perú",
    endDate: "15 Ene",
    active: true,
    actionType: 'ADD_TO_CART',
    linkedProductId: 104
  }
];

export const orders: Order[] = [
  {
    orderId: 'ORD-001',
    userId: "1",
    date: '2025-01-15',
    event: events[0],
    items: [
      { productName: "Pisco Sour", variationName: "Tradicional", quantity: 2, claimed: 0, price: 7000 },
      { productName: "Corona Extra", variationName: "330ml", quantity: 1, claimed: 0, price: 4500 },
    ],
    total: 18500,
    status: 'COMPLETED',
  },
  {
    orderId: 'ORD-002',
    userId: "1",
    date: '2025-01-18',
    event: events[1],
    items: [
      { productName: "Mojito", variationName: "Tradicional", quantity: 1, claimed: 1, price: 6500 },
      { productName: "Caipirinha", variationName: "Tradicional", quantity: 1, claimed: 0, price: 6000 },
    ],
    total: 12500,
    status: 'PARTIALLY_CLAIMED',
  },
  {
    orderId: 'ORD-003',
    userId: "2",
    date: '2025-01-22',
    event: events[2],
    items: [
      { productName: "Jägermeister", variationName: "Shot", quantity: 3, claimed: 3, price: 4000 },
    ],
    total: 12000,
    status: 'FULLY_CLAIMED',
  },
];