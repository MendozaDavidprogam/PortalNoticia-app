import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  NEW_NEWS = 'new_news',
  NEW_COMMENT = 'new_comment',
  NEW_REPLY = 'new_reply',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) recipient: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) sender: Types.ObjectId;
  @Prop({ type: String, enum: NotificationType, required: true }) type: NotificationType;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) message: string;
  @Prop({ default: null }) link: string;
  @Prop({ default: false }) read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
