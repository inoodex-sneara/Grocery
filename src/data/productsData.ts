export interface Product {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  badgeColor?: string;
  rating: number;
  reviewCount: number;
  vendor: string;
  type: string;
  sizes: string[];
  richIn: string[];
  description: string;
  overview: string;
  healthBenefits: string;
  environment: string;
  viewCount: number;
}

export const PRODUCTS: Product[] = [
  {
    slug: "beetroot",
    name: "Beetroot",
    price: 1.24,
    image: "/products/prod-beetroot.webp",
    hoverImage: "/products/prod-beetroot-hover.jpg",
    badge: "Best Seller",
    badgeColor: "#74B83E",
    rating: 4,
    reviewCount: 12,
    vendor: "Fresho",
    type: "Vegetable",
    sizes: ["1 kg", "2 kg", "3 kg", "1/2 kg"],
    richIn: ["Vitamin C", "Manganese", "Vitamin E", "Potassium"],
    description:
      "Tortor at auctor urna nunc id cursus metus aliquam. Odio tempor orci dapibus ultrices. Tortor condimentum lacinia quis vel eros donec ac odio. Velit euismod in pellentesque massa placerat duis ultricies lacus.",
    overview:
      "Organic farming helps avoid the use of chemical additives or genetically engineered ingredients. It must be fresh, and flavorful with the myriad of vitamins and minerals that only come from whole foods that have been harvested and consumed at their prime. Organic food products provide a multitude of benefits.",
    healthBenefits:
      "Organic products may include higher concentrations of certain antioxidants and flavonoids with antioxidant capabilities. A naturally occurring toxic substance called cadmium is absorbed by plants and can be found in higher quantities in fruits and vegetables. Omega-3 fatty acids, a form of healthy unsaturated fat, are present in organic dairy products, meats, and eggs in amounts up to 50% higher than in conventional products.",
    environment:
      "Sustainable agricultural practices like organic farming aid in mitigating the effects of global warming. Organic farming helps to retain the soil's capacity for reproduction and regeneration, proper plant nutrition, and solid soil management results in the production of nutrient-rich and disease-resistant food.",
    viewCount: 41,
  },
  {
    slug: "broccoli",
    name: "Broccoli",
    price: 2.49,
    image: "/products/prod-broccoli.png",
    hoverImage: "/products/prod-broccoli-hover.webp",
    badge: "Hot",
    badgeColor: "#f97316",
    rating: 5,
    reviewCount: 8,
    vendor: "Fresho",
    type: "Vegetable",
    sizes: ["250 g", "500 g", "1 kg"],
    richIn: ["Vitamin C", "Vitamin K", "Fiber", "Folate"],
    description:
      "Fresh and crispy broccoli florets, rich in nutrients and antioxidants. Perfect for stir-fries, salads, and steaming. Sourced directly from organic farms.",
    overview:
      "Broccoli is an edible green plant in the cabbage family whose large flowering head, stalk and small associated leaves are eaten as a vegetable. Broccoli is classified in the Italica cultivar group of the species Brassica oleracea.",
    healthBenefits:
      "Broccoli is a great source of vitamins K and C, a good source of folate (folic acid) and also provides potassium, fiber. Vitamin C builds collagen, which forms body tissue and bone, and helps cuts and wounds heal. Vitamin C is a powerful antioxidant and protects the body from damaging free radicals.",
    environment:
      "Growing broccoli organically reduces the chemical load on local ecosystems. Crop rotation with broccoli can improve soil health and reduce pest populations naturally.",
    viewCount: 27,
  },
  {
    slug: "tomato",
    name: "Fresh Tomato",
    price: 0.99,
    originalPrice: 1.49,
    image: "/products/prod-tomato.webp",
    hoverImage: "/products/prod-tomato-hover.jpg",
    badge: "Sale",
    badgeColor: "#ef4444",
    rating: 4,
    reviewCount: 20,
    vendor: "FarmFresh",
    type: "Vegetable",
    sizes: ["500 g", "1 kg", "2 kg"],
    richIn: ["Lycopene", "Vitamin C", "Potassium", "Folate"],
    description:
      "Sun-ripened tomatoes bursting with flavor. These juicy, vibrant red tomatoes are perfect for sauces, salads, and cooking. Hand-picked at peak ripeness.",
    overview:
      "Tomatoes are the edible berry of the plant Solanum lycopersicum, commonly known as the tomato plant. The species originated in western South America, Mexico, and Central America.",
    healthBenefits:
      "Tomatoes are the major dietary source of the antioxidant lycopene, which has been linked to many health benefits, including reduced risk of heart disease and cancer. They are also a great source of vitamin C, potassium, folate, and vitamin K.",
    environment:
      "Organic tomato cultivation avoids synthetic pesticides and fertilizers, contributing to healthier soil and water systems. Heirloom varieties support biodiversity.",
    viewCount: 35,
  },
  {
    slug: "cucumber",
    name: "Cucumber",
    price: 0.75,
    image: "/products/prod-cucumber.webp",
    hoverImage: "/products/prod-cucumber-hover.webp",
    badge: "Best Seller",
    badgeColor: "#74B83E",
    rating: 4,
    reviewCount: 15,
    vendor: "Fresho",
    type: "Vegetable",
    sizes: ["250 g", "500 g", "1 kg"],
    richIn: ["Vitamin K", "Potassium", "Magnesium", "Vitamin C"],
    description:
      "Cool, crisp and refreshing cucumbers. Naturally hydrating and low in calories, these cucumbers are perfect for salads, sandwiches, and snacking.",
    overview:
      "Cucumber is a widely-cultivated creeping vine plant in the Cucurbitaceae gourd family. It produces cylindrical fruits that are used as culinary vegetables. Known for their cooling properties and high water content.",
    healthBenefits:
      "Cucumbers contain antioxidants, including flavonoids and tannins, which prevent the accumulation of harmful free radicals and may reduce the risk of chronic disease. They are also high in nutrients while being low in calories, fat, cholesterol, and sodium.",
    environment:
      "Cucumbers grow quickly and can be cultivated with minimal environmental impact when grown organically. They thrive in warm conditions and require less water than many other crops.",
    viewCount: 19,
  },
  {
    slug: "coriander",
    name: "Coriander",
    price: 0.49,
    image: "/products/prod-coriander.png",
    hoverImage: "/products/prod-coriander-hover.jpg",
    badge: "Hot",
    badgeColor: "#f97316",
    rating: 5,
    reviewCount: 6,
    vendor: "Spice Garden",
    type: "Herb",
    sizes: ["50 g", "100 g", "200 g"],
    richIn: ["Vitamin K", "Vitamin A", "Vitamin C", "Iron"],
    description:
      "Fresh, aromatic coriander leaves with rich green color and intense fragrance. Essential for South Asian, Middle Eastern, and Mexican cuisines.",
    overview:
      "Coriander is an annual herb in the family Apiaceae. All parts of the plant are edible, but the fresh leaves and the dried seeds are the parts most traditionally used in cooking.",
    healthBenefits:
      "Coriander has been shown to have a favorable impact on blood sugar regulation. Coriander seeds, extract, and oils may all help lower blood sugar when consumed. Rich in antioxidants that may reduce inflammation and support brain health.",
    environment:
      "Coriander is an easy-to-grow herb that can be cultivated in small spaces and requires minimal water. Growing herbs like coriander at home reduces the carbon footprint associated with transportation.",
    viewCount: 13,
  },
  {
    slug: "almonds",
    name: "Almonds",
    price: 5.99,
    originalPrice: 7.49,
    image: "/products/prod-almonds.webp",
    badge: "Sale",
    badgeColor: "#ef4444",
    rating: 5,
    reviewCount: 31,
    vendor: "NutriFarm",
    type: "Dry Fruit",
    sizes: ["100 g", "250 g", "500 g", "1 kg"],
    richIn: ["Vitamin E", "Magnesium", "Fiber", "Protein"],
    description:
      "Premium quality raw almonds, nutrient-dense and delicious. Perfect for snacking, baking, or making almond milk. Rich in healthy fats and proteins.",
    overview:
      "The almond is a species of tree native to Iran and surrounding countries but widely cultivated elsewhere. The almond is also the name of the edible and widely cultivated seed of this tree.",
    healthBenefits:
      "Almonds deliver a massive amount of nutrients per serving. They are high in fiber, protein, fat, vitamin E, manganese, and magnesium. Almonds can assist with blood sugar control, blood pressure, and cholesterol levels.",
    environment:
      "Almond trees help sequester carbon and their shells and hulls can be used for livestock feed and bedding, creating a sustainable circular agricultural system.",
    viewCount: 55,
  },
  {
    slug: "chicken",
    name: "Fresh Chicken",
    price: 4.99,
    image: "/products/prod-chicken.webp",
    badge: "Best Seller",
    badgeColor: "#74B83E",
    rating: 4,
    reviewCount: 22,
    vendor: "FarmFresh",
    type: "Meat",
    sizes: ["500 g", "1 kg", "1.5 kg", "2 kg"],
    richIn: ["Protein", "Vitamin B12", "Iron", "Zinc"],
    description:
      "Farm-raised fresh chicken, antibiotic-free and hormone-free. Tender and juicy, perfect for grilling, roasting, or curries. Delivered fresh daily.",
    overview:
      "Fresh chicken is one of the most popular and versatile proteins worldwide. Our chickens are raised in free-range conditions with natural feed, ensuring better nutrition and taste.",
    healthBenefits:
      "Chicken is an excellent source of lean protein, which is essential for muscle building and repair. It is rich in vitamins and minerals including B vitamins, phosphorus, and selenium.",
    environment:
      "Free-range poultry farming allows chickens to roam freely, reducing stress and improving animal welfare. This method also reduces the environmental impact compared to factory farming.",
    viewCount: 48,
  },
  {
    slug: "rice",
    name: "Premium Rice",
    price: 3.29,
    image: "/products/prod-rice.webp",
    badge: "Best Seller",
    badgeColor: "#74B83E",
    rating: 4,
    reviewCount: 18,
    vendor: "GrainMaster",
    type: "Grain",
    sizes: ["1 kg", "2 kg", "5 kg", "10 kg"],
    richIn: ["Carbohydrates", "B Vitamins", "Magnesium", "Iron"],
    description:
      "Premium long-grain rice with a delicate aroma and fluffy texture when cooked. Naturally gluten-free and a staple for every kitchen.",
    overview:
      "Rice is the seed of the grass species Oryza sativa or less commonly Oryza glaberrima. As a cereal grain, it is the most widely consumed staple food for a large part of the world's human population.",
    healthBenefits:
      "Rice is a good source of energy due to its high carbohydrate content. Brown rice varieties are rich in fiber and nutrients. Rice is naturally gluten-free and easy to digest, making it ideal for those with dietary sensitivities.",
    environment:
      "Sustainable rice farming practices include water-saving techniques like alternate wetting and drying, which can reduce water use by up to 30% while maintaining yield quality.",
    viewCount: 38,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  return PRODUCTS.filter((p) => p.slug !== slug).slice(0, count);
}
