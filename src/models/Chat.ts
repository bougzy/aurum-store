import mongoose, { Schema, Document } from 'mongoose';

export interface IChatDoc extends Document {
  storeId: mongoose.Types.ObjectId;
  customerId: string;
  customerName: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

const ChatSchema = new Schema<IChatDoc>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChatSchema.index({ storeId: 1 });
ChatSchema.index({ customerId: 1, storeId: 1 });

export default mongoose.models.Chat || mongoose.model<IChatDoc>('Chat', ChatSchema);
