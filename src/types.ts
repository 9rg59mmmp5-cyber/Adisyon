export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  stock: number;
  colorClass: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
