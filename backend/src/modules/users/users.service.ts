import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) { return this.userModel.findById(id).exec(); }
  async findByEmail(email: string) { return this.userModel.findOne({ email }).select('+password').exec(); }
  async create(data: Partial<User>) { return this.userModel.create(data); }

  async updateProfile(userId: string, dto: any) {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findAll(page = 1, limit = 10, search?: string) {
    const query: any = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.userModel.countDocuments(query),
    ]);
    return { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getStats() {
    const [total, activos, admins, autores] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({ role: 'admin' }),
      this.userModel.countDocuments({ role: 'autor' }),
    ]);
    return { total, activos, admins, autores };
  }

  async updateRole(userId: string, role: string) {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).exec();
  }

  async toggleActive(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.isActive = !user.isActive;
    return user.save();
  }

  async saveRefreshToken(userId: string, token: string | null) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: token }).exec();
  }
}
