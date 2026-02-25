import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDoc extends Document {
  storeId: mongoose.Types.ObjectId;
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

const ProductSchema = new Schema<IProductDoc>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    goldPurity: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ storeId: 1 });
ProductSchema.index({ storeId: 1, isActive: 1 });

export default mongoose.models.Product || mongoose.model<IProductDoc>('Product', ProductSchema);
