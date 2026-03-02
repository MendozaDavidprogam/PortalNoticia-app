import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ _id: true, timestamps: false })
class Reply {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) author: Types.ObjectId;
  @Prop({ required: true }) content: string;
  @Prop({ default: () => new Date() }) createdAt: Date;
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'News', required: true }) news: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) author: Types.ObjectId;
  @Prop({ required: true }) content: string;
  @Prop({ type: [Object], default: [] }) replies: Reply[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ news: 1, createdAt: -1 });
