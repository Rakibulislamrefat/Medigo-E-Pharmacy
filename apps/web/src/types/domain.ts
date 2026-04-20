export type Role = "customer" | "admin" | "delivery";

export type User = {
  email: string;
  role: Role;
};

export type Medicine = {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  price: number;
  stockQty: number;
  isPublished: boolean;
  imageUrl?: string;
};

export type CartItem = {
  medicineId: string;
  name: string;
  unitPrice: number;
  qty: number;
};

export type AddressSnapshot = {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  postalCode: string;
};

export type OrderStatus = "created" | "packed" | "shipped" | "delivered";
export type PaymentStatus = "unpaid" | "paid";

export type Order = {
  id: string;
  userEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  address: AddressSnapshot;
  items: CartItem[];
  createdAt: string;
};

export type Feedback = {
  id: string;
  userEmail: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

