import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async findByNews(newsId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [comments, total] = await Promise.all([
      this.commentModel.find({ news: newsId }).populate('author', 'name avatar').populate('replies.author', 'name avatar').skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.commentModel.countDocuments({ news: newsId }),
    ]);
    return { comments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async findById(id: string) { return this.commentModel.findById(id).exec(); }

  async create(newsId: string, content: string, authorId: string) {
    const comment = await this.commentModel.create({ news: newsId, author: authorId, content });
    return this.commentModel.findById(comment._id).populate('author', 'name avatar').exec();
  }

  async update(id: string, content: string, userId: string, role: string) {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.author.toString() !== userId && role !== 'admin') throw new ForbiddenException('Sin permiso');
    return this.commentModel.findByIdAndUpdate(id, { content }, { new: true }).populate('author', 'name avatar').populate('replies.author', 'name avatar').exec();
  }

  async remove(id: string, userId: string, role: string) {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    if (comment.author.toString() !== userId && role !== 'admin') throw new ForbiddenException('Sin permiso');
    await this.commentModel.findByIdAndDelete(id).exec();
  }

  async addReply(commentId: string, content: string, authorId: string) {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    const reply = { _id: new Types.ObjectId(), author: new Types.ObjectId(authorId), content, createdAt: new Date() };
    comment.replies.push(reply as any);
    await comment.save();
    return this.commentModel.findById(commentId).populate('author', 'name avatar').populate('replies.author', 'name avatar').exec();
  }

  async deleteReply(commentId: string, replyId: string, userId: string, role: string) {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comentario no encontrado');
    const reply = (comment.replies as any[]).find(r => r._id.toString() === replyId);
    if (!reply) throw new NotFoundException('Respuesta no encontrada');
    if (reply.author.toString() !== userId && role !== 'admin') throw new ForbiddenException('Sin permiso');
    comment.replies = (comment.replies as any[]).filter(r => r._id.toString() !== replyId) as any;
    await comment.save();
    return this.commentModel.findById(commentId).populate('author', 'name avatar').populate('replies.author', 'name avatar').exec();
  }
}
