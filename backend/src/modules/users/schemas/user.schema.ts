import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export enum UserRole { ADMIN = 'admin', AUTOR = 'autor', LECTOR = 'lector' }

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true }) email: string;
  @Prop({ required: true, select: false }) password: string;
  @Prop({ type: String, enum: UserRole, default: UserRole.LECTOR }) role: string;
  @Prop({ default: null }) avatar: string;
  @Prop({ default: '' }) bio: string;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ default: null, select: false }) refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
