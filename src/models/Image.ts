import mongoose, { Schema, Document } from 'mongoose';

export interface IImageDoc extends Document {
  data: string;
  contentType: string;
  createdAt: Date;
}

const ImageSchema = new Schema<IImageDoc>(
  {
    data: { type: String, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model<IImageDoc>('Image', ImageSchema);
