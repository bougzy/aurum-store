import mongoose, { Schema, Document } from 'mongoose';

export interface IStoreDoc extends Document {
  name: string;
  slug: string;
  ownerId: mongoose.Types.ObjectId;
  description?: string;
  logo?: string;
  whatsappNumber?: string;
  bitcoinWallet?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStoreDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    bitcoinWallet: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StoreSchema.index({ slug: 1 });
StoreSchema.index({ ownerId: 1 });

export default mongoose.models.Store || mongoose.model<IStoreDoc>('Store', StoreSchema);
