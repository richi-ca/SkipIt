// --- Interfaces de Site Content (Configuración) ---
export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaButtonText: string;
    secondaryButtonText: string;
    contestButtonText: string;
    features: {
      icon: 'Clock' | 'Zap' | 'Users';
      title: string;
      description: string;
    }[];
  };
  about: {
    mission: {
      text: string;
      highlight: string;
    };
    vision: {
      text: string;
    };
    steps: {
      stepNumber: number;
      title: string;
      description: string;
    }[];
  };
}

export const siteContent: SiteContent = {
  hero: {
    title: "¡Sáltate la fila,",
    subtitle: "y dedícate a disfrutar!",
    description: "Precompra tus tragos favoritos y canjéalos al instante con tu código QR.\nPara nosotros tu tiempo es oro…¡Gástalo bailando con SkipIT!",
    ctaButtonText: "Buscar Eventos",
    secondaryButtonText: "Ver Promociones",
    contestButtonText: "Ver Concursos",
    features: [
      {
        icon: 'Clock',
        title: 'Ahorra Tiempo',
        description: 'No más espera en la caja.\nCanjea tu trago directo en la barra.'
      },
      {
        icon: 'Zap',
        title: 'Súper Fácil',
        description: 'Compra, recibe tu QR y canjea. ¡Así de simple!'
      },
      {
        icon: 'Users',
        title: 'Más Diversión',
        description: 'Dedica tu tiempo a lo que realmente importa: ¡pasarlo bien!'
      }
    ]
  },
  about: {
    mission: {
      text: "Transformar la experiencia de los eventos masivos, eliminando las largas filas en las cajas y barras mediante tecnología simple y eficiente.",
      highlight: "cajas y barras"
    },
    vision: {
      text: "Ser la plataforma estándar para la compra de bebestibles en eventos de todo Chile, reconocida por su rapidez y confiabilidad."
    },
    steps: [
      {
        stepNumber: 1,
        title: "Precompra",
        description: "Elige tu evento y tus tragos favoritos desde tu celular."
      },
      {
        stepNumber: 2,
        title: "Recibe tu QR",
        description: "Obtén un código único por cada compra realizada."
      },
      {
        stepNumber: 3,
        title: "Canjea",
        description: "Muestra tu QR en la barra y recibe tu pedido al instante."
      }
    ]
  }
};

// --- Interfaces de Usuario ---
export interface User {
  id: string;
  name: string;
  email: string;
  hasPriorityAccess: boolean;
  dob?: string; // Date of Birth
  gender?: 'M' | 'F' | 'Otro';
  phone?: string;
  role?: 'admin' | 'user-cli' | 'scanner'; // Nuevo campo de rol
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
  description?: string;     // Nueva descripción
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
  isoDate: string;          // Fecha ISO para lógica (YYYY-MM-DD)
  startTime: string;        // Hora inicio (HH:mm)
  endTime: string;          // Hora fin (HH:mm)
  location: string;
  image: string;
  // price removed
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
  linkedVariationId?: number; // Si es ADD_TO_CART, qué variación agrega (ID específico)
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
  linkedVariationId?: number; // Si es ADD_TO_CART (Compra y participa)
}

export interface Order {
  orderId: string;
  userId: string;
  isoDate: string; // Renombrado de date a isoDate
  purchaseTime?: string; // Hora de compra (HH:mm:ss)
  event: Event;
  items: {
    variationId: number;    // ID único para tracking preciso
    productName: string;    // Snapshot del nombre
    variationName: string;  // Snapshot de la variación
    quantity: number;
    claimed: number;
    price: number;
  }[];
  total: number;
  status: 'COMPLETED' | 'PARTIALLY_CLAIMED' | 'FULLY_CLAIMED' | 'CANCELLED';
}

// ==========================================
// DATA MOCK (Migrada de los componentes)
// ==========================================

export const users: User[] = [
  {
    id: "1",
    name: "Juan Perez",
    email: "juan.perez@example.com",
    hasPriorityAccess: false,
    role: 'user-cli',
  },
  {
    id: "2",
    name: "Ana Garcia",
    email: "ana.garcia@example.com",
    hasPriorityAccess: false,
    role: 'user-cli',
  },
  {
    id: "3",
    name: "Carlos Sanchez",
    email: "carlos.sanchez@example.com",
    hasPriorityAccess: false,
    role: 'user-cli',
  },
  {
    id: "1759105113010",
    name: "Ricardo Castillo Avalos",
    email: "ricardo@correo.com",
    hasPriorityAccess: true,
    role: 'user-cli',
  },
  // --- Nuevos Usuarios Admin ---
  {
    id: "admin-1",
    name: "Ricardo Admin",
    email: "ricardo@admin.cl",
    hasPriorityAccess: true,
    role: 'admin',
  },
  {
    id: "admin-2",
    name: "Cristian Gomez",
    email: "cri.gomezv@profesor.duoc.cl",
    hasPriorityAccess: true,
    role: 'admin',
  },
  {
    id: "admin-3",
    name: "Andres Gomez",
    email: "andres.gomez.vega@gmail.com",
    hasPriorityAccess: true,
    role: 'admin',
  },
  // --- Usuario Scanner ---
  {
    id: "scanner-1",
    name: "Scanner Staff",
    email: "scanner@skipit.cl",
    hasPriorityAccess: false,
    role: 'scanner',
  }
];

// --- Menú General (Base para todos los eventos por ahora) ---
const generalMenu: Menu = {
  id: 1,
  name: "Menú General 2025",
  categories: [
    {
      id: 1,
      name: "Cervezas (Brewed Beverages)",
      description: "Incluye todo lo derivado de la fermentación de cereales. Desde las Lager industriales hasta las Artesanales (IPA, Stout, Porter) y versiones sin alcohol.",
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
      name: "Destilados Puros (Spirits / Neat)",
      description: "Bebidas de alta graduación servidas solas o \"on the rocks\". Aquí entran el Pisco, Whisky, Tequila, Vodka, Ron y Gin sin mezcla adicional.",
      products: [
        {
          id: 8,
          name: "Tequila Shot",
          description: "Tequila premium con sal y limón",
          image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
          variations: [{ id: 108, name: "Caballito", price: 3500 }]
        }
      ]
    },
    {
      id: 3,
      name: "Combinados Clásicos (Mixers / Highballs)",
      description: "La base de los eventos masivos. Mezcla directa de un destilado con una bebida carbonatada o jugo. Ejemplos: Piscola, Gin Tonic, Cuba Libre o Fernet con Coca.",
      products: []
    },
    {
      id: 4,
      name: "Coctelería de Autor & Mixología",
      description: "Tragos complejos que requieren técnica (shaker, refrescado) y ingredientes específicos (bitters, jarabes, botánicos). Aquí clasificarías tus Margaritas, Mojitos, Negronis y creaciones exclusivas del evento.",
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
      id: 5,
      name: "Vinos y Derivados (Viticultura)",
      description: "Abarca Vino Tinto, Blanco, Rosado y preparados típicos chilenos como el Terremoto o la Sangría.",
      products: []
    },
    {
      id: 6,
      name: "Espumantes y Sidras",
      description: "Categoría para celebraciones y sectores VIP. Incluye Champagne, Prosecco, Cava y Sidras de manzana o pera.",
      products: []
    },
    {
      id: 7,
      name: "Licores y Digestivos",
      description: "Bebidas dulces o herbales de menor graduación que suelen servirse al final o como base de otros tragos. Ejemplos: Manzanilla, Amaretto, Baileys o Limoncello.",
      products: [
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
      id: 8,
      name: "Bebidas Analcohólicas (Soft Drinks)",
      description: "Todo lo que no contiene alcohol: Gaseosas (bebidas), Aguas minerales, Jugos de fruta y Bebidas Isotónicas.",
      products: [
        {
          id: 12,
          name: "Jugo Natural",
          description: "Jugos frescos de frutas de temporada",
          image: "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
          variations: [{ id: 112, name: "Vaso", price: 2500 }]
        }
      ]
    },
    {
      id: 9,
      name: "Bebidas Energéticas",
      description: "Aunque son analcohólicas, en eventos masivos se manejan aparte por su alto costo y uso frecuente para \"bombas\" o mezclas con Vodka y Jägermeister.",
      products: []
    },
    {
      id: 10,
      name: "Mocktails (Coctelería 0%)",
      description: "Esta categoría es técnica: son tragos que imitan la complejidad de un cóctel (presentación, mezcla de sabores) pero con 0% alcohol, como un Mojito Virgin.",
      products: [
        {
          id: 11,
          name: "Virgin Mojito",
          description: "Menta fresca, limón y soda sin alcohol",
          image: "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
          variations: [{ id: 111, name: "Vaso", price: 3000 }]
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
    isoDate: "2025-12-15",
    startTime: "20:00",
    endTime: "06:00",
    location: "Parque O'Higgins, Santiago",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    // price removed
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
    isoDate: "2025-12-18",
    startTime: "22:00",
    endTime: "04:00",
    location: "Club The One, Las Condes",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    // price removed
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
    isoDate: "2025-12-22",
    startTime: "19:00",
    endTime: "02:00",
    location: "Teatro Cariola, Santiago",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
    // price removed
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
    isoDate: "2025-12-25",
    startTime: "16:00",
    endTime: "01:00",
    location: "Playa Reñaca, Viña del Mar",
    image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg",
    // price removed
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
    linkedVariationId: 101 // Variación 330ml Corona
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
    linkedVariationId: 101
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
    linkedVariationId: 104
  }
];

export const orders: Order[] = [
  {
    orderId: 'ORD-001',
    userId: "1",
    isoDate: '2025-11-15', // Ajustado: Compra 1 mes antes del evento
    purchaseTime: '14:32:10', // Hora aleatoria
    event: events[0],
    items: [
      { variationId: 104, productName: "Pisco Sour", variationName: "Tradicional", quantity: 2, claimed: 0, price: 7000 },
      { variationId: 101, productName: "Corona Extra", variationName: "330ml", quantity: 1, claimed: 0, price: 4500 },
    ],
    total: 18500,
    status: 'COMPLETED',
  },
  {
    orderId: 'ORD-002',
    userId: "1",
    isoDate: '2025-11-20', // Ajustado
    purchaseTime: '19:45:55', // Hora aleatoria
    event: events[1],
    items: [
      { variationId: 105, productName: "Mojito", variationName: "Tradicional", quantity: 1, claimed: 1, price: 6500 },
      { variationId: 106, productName: "Caipirinha", variationName: "Tradicional", quantity: 1, claimed: 0, price: 6000 },
    ],
    total: 12500,
    status: 'PARTIALLY_CLAIMED',
  },
  {
    orderId: 'ORD-003',
    userId: "1",
    isoDate: '2025-12-05', // Ajustado
    purchaseTime: '10:15:30', // Hora aleatoria
    event: events[2],
    items: [
      { variationId: 109, productName: "Jägermeister", variationName: "Shot", quantity: 3, claimed: 3, price: 4000 },
    ],
    total: 12000,
    status: 'FULLY_CLAIMED',
  },
  {
    orderId: 'ORD-004',
    userId: "1",
    isoDate: '2025-12-05', // Ajustado
    purchaseTime: '10:39:33', // Hora aleatoria
    event: events[3],
    items: [
      { variationId: 109, productName: "Jägermeister", variationName: "Shot", quantity: 3, claimed: 3, price: 4000 },
    ],
    total: 12000,
    status: 'FULLY_CLAIMED',
  },
];

// --- Helpers de Búsqueda (Simulando Backend) ---

export const findProductByVariationId = (variationId: number) => {
  for (const menu of menus) {
    for (const category of menu.categories) {
      for (const product of category.products) {
        const variation = product.variations.find(v => v.id === Number(variationId));
        if (variation) {
          return {
            product,
            variation
          };
        }
      }
    }
  }
  return null;
};
