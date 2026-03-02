import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true })
export class News {
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ required: true }) content: string;
  @Prop({ default: null }) image: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) author: Types.ObjectId;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ enum: ['draft', 'published'], default: 'published' }) status: string;
  @Prop({ default: 0 }) views: number;
}

export const NewsSchema = SchemaFactory.createForClass(News);
NewsSchema.index({ title: 'text', content: 'text' });
NewsSchema.index({ status: 1, createdAt: -1 });
