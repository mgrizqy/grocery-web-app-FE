import { CartItemProps } from "@/components/types";

export const mockCartItems: CartItemProps[] = [
  {
    id: "item-1",
    name: "Organic Fuji Apples",
    details: "Pack of 6, freshly sourced from local farms",
    price: 5.49,
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80",
    quantity: 1,
  },
  {
    id: "item-2",
    name: "Almond Milk - Unsweetened",
    details: "1L carton, dairy-free and vegan",
    price: 3.29,
    image:
      "https://images.unsplash.com/photo-1583337130417-b2df30b9e1b3?w=500&q=80",
    quantity: 1,
  },
  {
    id: "item-3",
    name: "Whole Wheat Bread",
    details: "400g loaf, soft and fresh-baked",
    price: 2.79,
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484b7?w=500&q=80",
    quantity: 1,
  },
  {
    id: "item-4",
    name: "Free-Range Brown Eggs",
    details: "12 large eggs, cage-free",
    price: 4.19,
    image:
      "https://images.unsplash.com/photo-1589927986089-35812388d1ef?w=500&q=80",
    quantity: 1,
  },
];
