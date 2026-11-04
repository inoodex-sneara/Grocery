export const SHOP_CATEGORY_NAMES = {
  vegetables: "Vegetables",
  fruits: "Fruits",
  grains: "Grains & Flour",
  meat: "Meat",
  eggs: "Eggs",
  milk: "Milk & Dairy",
} as const;

export type ShopCategory = (typeof SHOP_CATEGORY_NAMES)[keyof typeof SHOP_CATEGORY_NAMES];
