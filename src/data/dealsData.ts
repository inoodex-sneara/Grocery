export interface DealProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice: number;
  image: string;
  unit: string;
  rating: number;
  sold: number;
  total: number;
  endsInHours?: number;
}

export const DEAL_PRODUCTS: DealProduct[] = [
  {
    id: "deal-1",
    slug: "tomato",
    name: "Fresh Tomato",
    category: "Vegetables",
    price: 60,
    oldPrice: 85,
    image: "/products/prod-tomato.webp",
    unit: "1 kg",
    rating: 4,
    sold: 62,
    total: 100,
    endsInHours: 8,
  },
  {
    id: "deal-2",
    slug: "almonds",
    name: "Premium Almonds",
    category: "Dry Fruits & Nuts",
    price: 560,
    oldPrice: 750,
    image: "/products/prod-almonds.webp",
    unit: "500 g",
    rating: 5,
    sold: 45,
    total: 80,
    endsInHours: 5,
  },
  {
    id: "deal-3",
    slug: "watermelon",
    name: "Whole Watermelon",
    category: "Fresh Fruits",
    price: 180,
    oldPrice: 240,
    image: "/shop/Shop-1.webp",
    unit: "1 pc (approx 2.5 kg)",
    rating: 5,
    sold: 88,
    total: 120,
    endsInHours: 12,
  },
  {
    id: "deal-4",
    slug: "country-brown-eggs",
    name: "Country Brown Eggs",
    category: "Dairy & Eggs",
    price: 145,
    oldPrice: 180,
    image: "/shop/Shop-4.webp",
    unit: "12 pcs (1 Dozen)",
    rating: 5,
    sold: 30,
    total: 60,
    endsInHours: 6,
  },
  {
    id: "deal-5",
    slug: "oyster-mushrooms",
    name: "Oyster Mushrooms",
    category: "Vegetables",
    price: 120,
    oldPrice: 160,
    image: "/shop/Shop-9.webp",
    unit: "250 g pack",
    rating: 5,
    sold: 54,
    total: 70,
    endsInHours: 4,
  },
  {
    id: "deal-6",
    slug: "beetroot",
    name: "Organic Beetroot",
    category: "Vegetables",
    price: 45,
    oldPrice: 70,
    image: "/products/prod-beetroot.webp",
    unit: "1 kg",
    rating: 4,
    sold: 71,
    total: 100,
    endsInHours: 10,
  },
  {
    id: "deal-7",
    slug: "valencia-oranges",
    name: "Valencia Oranges",
    category: "Fresh Fruits",
    price: 240,
    oldPrice: 320,
    image: "/shop/Shop-17.webp",
    unit: "1 kg",
    rating: 5,
    sold: 40,
    total: 90,
    endsInHours: 9,
  },
  {
    id: "deal-8",
    slug: "broccoli",
    name: "Fresh Broccoli",
    category: "Vegetables",
    price: 150,
    oldPrice: 210,
    image: "/products/prod-broccoli.png",
    unit: "500 g",
    rating: 5,
    sold: 25,
    total: 60,
    endsInHours: 7,
  },
];

export const FEATURED_DEAL = DEAL_PRODUCTS[1];
