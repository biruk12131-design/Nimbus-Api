export interface OrderItem {
  bookId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  estimatedDeliveryDate: string;
  createdAt: string;
}

export const orders: Order[] = [];
