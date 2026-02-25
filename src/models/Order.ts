import mongoose, { Schema, Document } from 'mongoose';
import { OrderStatus, PaymentMethod } from '@/types';

export interface IOrderDoc extends Document {
  storeId: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: mongoose.Types.ObjectId;
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

const OrderSchema = new Schema<IOrderDoc>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        goldPurity: { type: String, required: true },
        weight: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['whatsapp', 'bitcoin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'awaitingConfirmation', 'confirmed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    paymentProof: { type: String },
    txHash: { type: String },
    bitcoinAmount: { type: Number },
  },
  { timestamps: true }
);

OrderSchema.index({ storeId: 1 });
OrderSchema.index({ storeId: 1, status: 1 });

export default mongoose.models.Order || mongoose.model<IOrderDoc>('Order', OrderSchema);
