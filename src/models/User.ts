import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/types';

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  storeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['admin', 'storeOwner', 'customer'],
      default: 'customer',
    },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model<IUserDoc>('User', UserSchema);
