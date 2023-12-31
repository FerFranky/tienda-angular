export interface Details {
  productId: number;
  quantity: number;
  productName: string;
}

export interface Order {
  name: string;
  date: string;
  shippingAddress: string;
  city: string;
  pickup: boolean;
}

export interface DetailsOrder {
    details: Details[];
    orderId: number;
  }