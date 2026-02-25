export type UserRole = 'admin' | 'storeOwner' | 'customer';

export type OrderStatus =
  | 'pending'
  | 'awaitingConfirmation'
  | 'confirmed'
  | 'cancelled'
  | 'rejected';

export type PaymentMethod = 'whatsapp' | 'bitcoin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  storeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStore {
  _id: string;
  name: string;
  slug: string;
  ownerId: string;
  description?: string;
  logo?: string;
  whatsappNumber?: string;
  bitcoinWallet?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: string;
  storeId: string;
  name: string;
  description: string;
  images: string[];
  goldPurity: string;
  weight: number;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  productId: string;
  product?: IProduct;
  quantity: number;
}

export interface IOrder {
  _id: string;
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    goldPurity: string;
    weight: number;
  }[];
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentProof?: string;
  txHash?: string;
  bitcoinAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat {
  _id: string;
  storeId: string;
  customerId: string;
  customerName: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface IMessage {
  _id: string;
  chatId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  createdAt: Date;
}

export interface IChatbotConfig {
  _id: string;
  storeId: string;
  greetingMessage: string;
  autoReplies: {
    keyword: string;
    response: string;
  }[];
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    outsideMessage: string;
  };
  isActive: boolean;
}
