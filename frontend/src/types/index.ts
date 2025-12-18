export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isBestSeller: boolean;
  isHotToday: boolean;
  discountPercentage?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Room {
  id: string;
  type: 'deluxe' | 'executive' | 'suite';
  name: string;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  maxGuests: number;
  description: string;
  size: string;
}

export interface EventPlan {
  id: string;
  eventType: 'birthday' | 'wedding' | 'corporate';
  name: string;
  price: number;
  inclusions: string[];
  capacity: string;
  images: string[];
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  tokenNumber?: string;
  createdAt: Date;
}
