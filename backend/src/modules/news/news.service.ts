import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async findAll(page = 1, limit = 9, search?: string, tag?: string) {
    const query: any = { status: 'published' };
    if (search) query.$text = { $search: search };
    if (tag) query.tags = tag;
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
      this.newsModel.find(query).populate('author', 'name avatar role').skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.newsModel.countDocuments(query),
    ]);
    return { news, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const news = await this.newsModel.findById(id).populate('author', 'name avatar role').exec();
    if (!news) throw new NotFoundException('Noticia no encontrada');
    news.views += 1;
    await news.save();
    return news;
  }

  async findOneRaw(id: string) {
    return this.newsModel.findById(id).exec();
  }

  async findMyNews(authorId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [news, total] = await Promise.all([
      this.newsModel.find({ author: authorId }).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.newsModel.countDocuments({ author: authorId }),
    ]);
    return { news, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async create(dto: any, authorId: string) {
    return this.newsModel.create({ ...dto, author: authorId });
  }

  async update(id: string, dto: any, userId: string, role: string) {
    const news = await this.newsModel.findById(id).exec();
    if (!news) throw new NotFoundException('Noticia no encontrada');
    if (news.author.toString() !== userId && role !== 'admin') throw new ForbiddenException('Sin permiso');
    return this.newsModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string, userId: string, role: string) {
    const news = await this.newsModel.findById(id).exec();
    if (!news) throw new NotFoundException('Noticia no encontrada');
    if (news.author.toString() !== userId && role !== 'admin') throw new ForbiddenException('Sin permiso');
    await this.newsModel.findByIdAndDelete(id).exec();
  }

  async getStats() {
    const [total, published, draft, views] = await Promise.all([
      this.newsModel.countDocuments(),
      this.newsModel.countDocuments({ status: 'published' }),
      this.newsModel.countDocuments({ status: 'draft' }),
      this.newsModel.aggregate([{ $group: { _id: null, t: { $sum: '$views' } } }]),
    ]);
    return { total, published, draft, totalViews: views[0]?.t || 0 };
  }
}
