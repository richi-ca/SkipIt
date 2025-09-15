export interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: string;
  rating: number;
  type: string;
}

export interface Drink {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const events: Event[] = [
  {
    id: 1,
    name: "Ultra Music Festival",
    date: "15 Enero 2025",
    time: "20:00 - 06:00",
    location: "Parque O'Higgins, Santiago",
    image: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
    price: "$15.000",
    rating: 4.8,
    type: "Festival"
  },
  {
    id: 2,
    name: "Noche de Reggaeton",
    date: "18 Enero 2025",
    time: "22:00 - 04:00",
    location: "Club The One, Las Condes",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
    price: "$8.000",
    rating: 4.6,
    type: "Club"
  },
  {
    id: 3,
    name: "Rock en Español",
    date: "22 Enero 2025",
    time: "19:00 - 02:00",
    location: "Teatro Cariola, Santiago",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
    price: "$12.000",
    rating: 4.9,
    type: "Concierto"
  },
  {
    id: 4,
    name: "Summer Beach Party",
    date: "25 Enero 2025",
    time: "16:00 - 01:00",
    location: "Playa Reñaca, Viña del Mar",
    image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg",
    price: "$10.000",
    rating: 4.7,
    type: "Playa"
  }
];

export const drinks: Drink[] = [
  // Cervezas
  {
    id: 1,
    name: "Corona Extra",
    description: "Cerveza mexicana refrescante con limón",
    price: 4500,
    image: "https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg",
    category: "Cervezas"
  },
  {
    id: 2,
    name: "Heineken",
    description: "Cerveza premium holandesa",
    price: 5000,
    image: "https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg",
    category: "Cervezas"
  },
  {
    id: 3,
    name: "Stella Artois",
    description: "Cerveza belga de alta calidad",
    price: 5500,
    image: "https://images.pexels.com/photos/5946085/pexels-photo-5946085.jpeg",
    category: "Cervezas"
  },
  
  // Tragos
  {
    id: 4,
    name: "Pisco Sour",
    description: "El clásico chileno con pisco, limón y clara de huevo",
    price: 7000,
    image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
    category: "Tragos"
  },
  {
    id: 5,
    name: "Mojito",
    description: "Ron blanco, menta fresca, azúcar y limón",
    price: 6500,
    image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
    category: "Tragos"
  },
  {
    id: 6,
    name: "Caipirinha",
    description: "Cachaça brasileña con limón y azúcar",
    price: 6000,
    image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
    category: "Tragos"
  },
  {
    id: 7,
    name: "Sex on the Beach",
    description: "Vodka, ron, durazno, piña y arándanos",
    price: 7500,
    image: "https://images.pexels.com/photos/5947043/pexels-photo-5947043.jpeg",
    category: "Tragos"
  },
  
  // Shots
  {
    id: 8,
    name: "Tequila Shot",
    description: "Tequila premium con sal y limón",
    price: 3500,
    image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
    category: "Shots"
  },
  {
    id: 9,
    name: "Jägermeister",
    description: "Licor de hierbas alemán bien frío",
    price: 4000,
    image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
    category: "Shots"
  },
  {
    id: 10,
    name: "B-52",
    description: "Kahlúa, Bailey's y Grand Marnier en capas",
    price: 5000,
    image: "https://images.pexels.com/photos/5947088/pexels-photo-5947088.jpeg",
    category: "Shots"
  },
  
  // Sin Alcohol
  {
    id: 11,
    name: "Virgin Mojito",
    description: "Menta fresca, limón y soda sin alcohol",
    price: 3000,
    image: "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
    category: "Sin Alcohol"
  },
  {
    id: 12,
    name: "Jugo Natural",
    description: "Jugos frescos de frutas de temporada",
    price: 2500,
    image: "https://images.pexels.com/photos/5947091/pexels-photo-5947091.jpeg",
    category: "Sin Alcohol"
  }
];