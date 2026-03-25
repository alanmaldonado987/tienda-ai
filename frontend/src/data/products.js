// Mock data para productos - E-commerce multigénero
export const products = [
  // HOMBRE
  {
    id: 1,
    name: "Camisa Manga Larga Classic",
    price: 89900,
    originalPrice: 119900,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    category: "hombre",
    gender: "hombre",
    tag: "Nuevo",
    colors: ["#F5F5F5", "#1a1a1a", "#3B82F6"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    name: "Jeans Slim Fit",
    price: 129900,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    category: "jeans",
    gender: "hombre",
    tag: "Best Seller",
    colors: ["#1a1a1a", "#2F4F4F", "#4B5563"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 3,
    name: "Sudadera con Capucha",
    price: 99900,
    originalPrice: 149900,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    category: "sudadera",
    gender: "unisex",
    tag: "Oferta",
    colors: ["#1a1a1a", "#F5F5F5", "#374151"],
    sizes: ["S", "M", "L", "XL"]
  },
  // MUJER
  {
    id: 4,
    name: "Vestido Midi Floral",
    price: 159900,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
    category: "vestidos",
    gender: "mujer",
    tag: null,
    colors: ["#E8C4B8", "#1a1a1a"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 5,
    name: "Blusa Satinada",
    price: 79900,
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&h=800&fit=crop",
    category: "blusas",
    gender: "mujer",
    tag: "Nuevo",
    colors: ["#F5F5F5", "#1a1a1a", "#EC4899"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 6,
    name: "Falda Plisada Midi",
    price: 89900,
    originalPrice: 119900,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0edd9?w=600&h=800&fit=crop",
    category: "faldas",
    gender: "mujer",
    tag: "Oferta",
    colors: ["#1a1a1a", "#8B4513", "#F5F5F5"],
    sizes: ["XS", "S", "M", "L"]
  },
  // ZAPATOS
  {
    id: 7,
    name: "Zapatillas Urbanas",
    price: 199900,
    originalPrice: 259900,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
    category: "zapatos",
    gender: "unisex",
    tag: "Descuento",
    colors: ["#1a1a1a", "#FFFFFF", "#DC2626"],
    sizes: ["36", "37", "38", "39", "40", "41", "42"]
  },
  {
    id: 8,
    name: "Zapatos Formales Cuero",
    price: 249900,
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&h=800&fit=crop",
    category: "zapatos",
    gender: "hombre",
    tag: null,
    colors: ["#1a1a1a", "#8B4513"],
    sizes: ["38", "39", "40", "41", "42", "43"]
  },
  // NIÑOS
  {
    id: 9,
    name: "Conjunto Deportivo Niño",
    price: 89900,
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&h=800&fit=crop",
    category: "ninos",
    gender: "ninos",
    tag: "Nuevo",
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    sizes: ["2", "4", "6", "8", "10", "12"]
  },
  {
    id: 10,
    name: "Vestido Niña Floral",
    price: 79900,
    originalPrice: 99000,
    image: "https://images.unsplash.com/photo-1981083572586-f4ae6ab7af40?w=600&h=800&fit=crop",
    category: "ninos",
    gender: "ninas",
    tag: "Oferta",
    colors: ["#EC4899", "#F472B6", "#FCD34D"],
    sizes: ["2", "4", "6", "8", "10", "12"]
  },
  // ACCESORIOS
  {
    id: 11,
    name: "Bolso Bandolera",
    price: 119900,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    category: "accesorios",
    gender: "mujer",
    tag: null,
    colors: ["#1a1a1a", "#8B4513", "#F5F5F5"],
    sizes: ["Único"]
  },
  {
    id: 12,
    name: "Gorra Snapback",
    price: 49900,
    originalPrice: 69900,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop",
    category: "accesorios",
    gender: "unisex",
    tag: "Oferta",
    colors: ["#1a1a1a", "#3B82F6", "#DC2626"],
    sizes: ["Único"]
  }
];

export const categories = [
  { id: "todos", name: "Todos", count: 12 },
  { id: "hombre", name: "Hombre", count: 3 },
  { id: "mujer", name: "Mujer", count: 3 },
  { id: "ninos", name: "Niños", count: 2 },
  { id: "zapatos", name: "Zapatos", count: 2 },
  { id: "accesorios", name: "Accesorios", count: 2 },
  { id: "jeans", name: "Jeans", count: 1 },
  { id: "vestidos", name: "Vestidos", count: 1 },
  { id: "blusas", name: "Blusas", count: 1 },
  { id: "faldas", name: "Faldas", count: 1 },
  { id: "sudadera", name: "Sudaderas", count: 1 }
];

export const banners = [
  {
    id: 1,
    title: "Nueva Colección 2026",
    subtitle: "Para Toda la Familia",
    description: "Moda para hombre, mujer, niños y más",
    cta: "Ver Ahora",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1440&h=600&fit=crop",
    bgColor: "#f5f0eb"
  },
  {
    id: 2,
    title: "Hasta 40% de Descuento",
    subtitle: "Sale",
    description: "En toda la colección de temporada",
    cta: "Explorar",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1440&h=600&fit=crop",
    bgColor: "#1a1a1a"
  }
];
