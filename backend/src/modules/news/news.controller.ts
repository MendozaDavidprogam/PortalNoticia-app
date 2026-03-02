import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, DefaultValuePipe, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NotificationsService } from '../notifications/notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@ApiTags('News') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Public() @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(9), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) { return { message: 'Noticias', data: await this.newsService.findAll(page, limit, search, tag) }; }

  @Get('stats') @UseGuards(RolesGuard) @Roles('admin')
  async getStats() { return { message: 'Stats', data: await this.newsService.getStats() }; }

  @Get('my-news') @UseGuards(RolesGuard) @Roles('autor', 'admin')
  async getMyNews(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) { return { message: 'Mis noticias', data: await this.newsService.findMyNews(user._id.toString(), page, limit) }; }

  @Public() @Get(':id')
  async findOne(@Param('id') id: string) { return { message: 'Noticia', data: await this.newsService.findOne(id) }; }

  @Post() @UseGuards(RolesGuard) @Roles('autor', 'admin')
  async create(@Body() dto: CreateNewsDto, @CurrentUser() user: any) {
    const news = await this.newsService.create(dto, user._id.toString());
    if ((dto.status || 'published') !== 'draft') {
      this.notificationsService.notifyNewNews(news, user).catch(() => {});
    }
    return { message: 'Noticia creada', data: news };
  }

  @Put(':id') @UseGuards(RolesGuard) @Roles('autor', 'admin')
  async update(@Param('id') id: string, @Body() dto: UpdateNewsDto, @CurrentUser() user: any) {
    return { message: 'Noticia actualizada', data: await this.newsService.update(id, dto, user._id.toString(), user.role) };
  }

  @Delete(':id') @HttpCode(HttpStatus.OK) @UseGuards(RolesGuard) @Roles('autor', 'admin')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.newsService.remove(id, user._id.toString(), user.role);
    return { message: 'Noticia eliminada', data: null };
  }
}