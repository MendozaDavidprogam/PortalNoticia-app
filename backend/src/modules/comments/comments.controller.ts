import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, DefaultValuePipe, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NewsService } from '../news/news.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReplyDto } from './dto/reply.dto';

@ApiTags('Comments') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly notificationsService: NotificationsService,
    private readonly newsService: NewsService,
  ) {}

  @Public() @Get('news/:newsId')
  async findByNews(
    @Param('newsId') newsId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) { return { message: 'Comentarios', data: await this.commentsService.findByNews(newsId, page, limit) }; }

  @Post()
  async create(@Body() dto: CreateCommentDto, @CurrentUser() user: any) {
    const comment = await this.commentsService.create(dto.newsId, dto.content, user._id.toString());
    if (!comment) return { message: 'Comentario creado', data: null };
    try {
      const news = await this.newsService.findOneRaw(dto.newsId);
      if (news && news.author.toString() !== user._id.toString()) {
        await this.notificationsService.notifyNewComment(news, user, comment._id.toString());
      }
    } catch {}
    return { message: 'Comentario creado', data: comment };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @CurrentUser() user: any) {
    return { message: 'Comentario actualizado', data: await this.commentsService.update(id, dto.content, user._id.toString(), user.role) };
  }

  @Delete(':id') @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.commentsService.remove(id, user._id.toString(), user.role);
    return { message: 'Comentario eliminado', data: null };
  }

  @Post(':commentId/replies')
  async addReply(
    @Param('commentId') commentId: string,
    @Body() dto: ReplyDto,
    @CurrentUser() user: any,
    @Query('newsId') newsId: string,
  ) {
    const updated = await this.commentsService.addReply(commentId, dto.content, user._id.toString());
    try {
      const comment = await this.commentsService.findById(commentId);
      if (comment && comment.author.toString() !== user._id.toString() && newsId) {
        await this.notificationsService.notifyNewReply(comment, user, newsId);
      }
    } catch {}
    return { message: 'Respuesta agregada', data: updated };
  }

  @Delete(':commentId/replies/:replyId') @HttpCode(HttpStatus.OK)
  async deleteReply(@Param('commentId') cId: string, @Param('replyId') rId: string, @CurrentUser() user: any) {
    return { message: 'Respuesta eliminada', data: await this.commentsService.deleteReply(cId, rId, user._id.toString(), user.role) };
  }
}