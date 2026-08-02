export type Category = string;

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  badge?: string;
  active: boolean;
  createdAt: string;
};

export type ReviewStatus = "pending" | "approved" | "rejected";

export type Review = {
  id: string;
  productId?: string;
  productName: string;
  author: string;
  email?: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  createdAt: string;
};

export type CartLine = {
  key: string;
  product: Product;
  quantity: number;
  size: string;
};

export type OrderInput = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
};

export type ProductDraft = Omit<Product, "id" | "createdAt" | "images"> & {
  id?: string;
  createdAt?: string;
  images: string[];
};
