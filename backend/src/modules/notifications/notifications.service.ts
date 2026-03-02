import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class NotificationsService {
  private gateway: any = null;

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  setGateway(gateway: any) { this.gateway = gateway; }


  async notifyNewNews(news: any, author: any) {
    const users = await this.userModel.find({ _id: { $ne: author._id }, isActive: true }).select('_id').lean().exec();
    if (!users.length) return;

    const notifications = users.map(u => ({
      recipient: u._id,
      sender: author._id,
      type: NotificationType.NEW_NEWS,
      title: 'Nueva noticia publicada',
      message: `${author.name} publicó: "${news.title}"`,
      link: `/news/${news._id}`,
      read: false,
    }));

    const created = await this.notificationModel.insertMany(notifications);


    if (this.gateway) {
      users.forEach((u, i) => {
        this.gateway.notifyUser(u._id.toString(), 'new-notification', {
          _id: created[i]._id.toString(),
          type: NotificationType.NEW_NEWS,
          title: 'Nueva noticia publicada',
          message: `${author.name} publicó: "${news.title}"`,
          link: `/news/${news._id}`,
          read: false,
          createdAt: new Date().toISOString(),
          sender: { name: author.name, avatar: author.avatar },
        });
      });
    }
  }


  async notifyNewComment(news: any, commenter: any, commentId: string) {
    const notification = await this.notificationModel.create({
      recipient: news.author,
      sender: commenter._id,
      type: NotificationType.NEW_COMMENT,
      title: 'Nuevo comentario en tu noticia',
      message: `${commenter.name} comentó en: "${news.title}"`,
      link: `/news/${news._id}#comment-${commentId}`,
      read: false,
    });

    if (this.gateway) {
      this.gateway.notifyUser(news.author.toString(), 'new-notification', {
        _id: notification._id.toString(),
        type: NotificationType.NEW_COMMENT,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read: false,
        createdAt: new Date().toISOString(),
        sender: { name: commenter.name, avatar: commenter.avatar },
      });
    }
  }


  async notifyNewReply(comment: any, replier: any, newsId: string) {
    const notification = await this.notificationModel.create({
      recipient: comment.author,
      sender: replier._id,
      type: NotificationType.NEW_REPLY,
      title: 'Respondieron tu comentario',
      message: `${replier.name} respondió tu comentario`,
      link: `/news/${newsId}#comment-${comment._id}`,
      read: false,
    });

    if (this.gateway) {
      this.gateway.notifyUser(comment.author.toString(), 'new-notification', {
        _id: notification._id.toString(),
        type: NotificationType.NEW_REPLY,
        title: notification.title,
        message: notification.message,
        link: notification.link,
        read: false,
        createdAt: new Date().toISOString(),
        sender: { name: replier.name, avatar: replier.avatar },
      });
    }
  }

  async getMyNotifications(userId: string, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [notifications, total, unread] = await Promise.all([
      this.notificationModel.find({ recipient: userId }).populate('sender', 'name avatar').skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.notificationModel.countDocuments({ recipient: userId }),
      this.notificationModel.countDocuments({ recipient: userId, read: false }),
    ]);
    return { notifications, unread, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async markAsRead(id: string, userId: string) {
    return this.notificationModel.findOneAndUpdate({ _id: id, recipient: userId }, { read: true }, { returnDocument: 'after' }).exec();
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany({ recipient: userId, read: false }, { read: true }).exec();
  }

  async countUnread(userId: string) {
    return this.notificationModel.countDocuments({ recipient: userId, read: false });
  }

  async deleteNotification(id: string, userId: string) {
    await this.notificationModel.findOneAndDelete({ _id: id, recipient: userId }).exec();
  }
}
