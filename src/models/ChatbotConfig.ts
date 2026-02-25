import mongoose, { Schema, Document } from 'mongoose';

export interface IChatbotConfigDoc extends Document {
  storeId: mongoose.Types.ObjectId;
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

const ChatbotConfigSchema = new Schema<IChatbotConfigDoc>(
  {
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true, unique: true },
    greetingMessage: {
      type: String,
      default: 'Welcome! How can I help you today?',
    },
    autoReplies: [
      {
        keyword: { type: String, required: true },
        response: { type: String, required: true },
      },
    ],
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' },
      timezone: { type: String, default: 'UTC' },
      outsideMessage: {
        type: String,
        default: "We're currently offline. We'll get back to you during business hours!",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChatbotConfigSchema.index({ storeId: 1 });

export default mongoose.models.ChatbotConfig ||
  mongoose.model<IChatbotConfigDoc>('ChatbotConfig', ChatbotConfigSchema);
