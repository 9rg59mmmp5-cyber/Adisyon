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
  colorClass: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Waiter {
  id: string;
  name: string;
}

export interface CompletedOrder {
  id: string;
  tableName: string;
  total: number;
  timestamp: number;
}

export interface Table {
  id: string;
  name: string;
  orders: OrderItem[];
  status: 'empty' | 'occupied';
  needsWaiter?: boolean;
}
