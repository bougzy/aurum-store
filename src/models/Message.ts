import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/types';

export interface IMessageDoc extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: string;
  senderRole: UserRole;
  text: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: String, required: true },
    senderRole: {
      type: String,
      enum: ['admin', 'storeOwner', 'customer'],
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model<IMessageDoc>('Message', MessageSchema);
