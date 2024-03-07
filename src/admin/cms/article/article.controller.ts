import {Body, Controller, Get, Param, ParseArrayPipe, Post, Query, UseGuards} from '@nestjs/common'
import {HttpResponse, httpResponse} from '../../../common/response'
import {SecretJwtTokenGuard} from '../../auth/secret/secret-jwt-token.guard'
import {ArticleService} from './article.service'
import {CreateArticleDto, DeleteArticleDto, ModifyArticleDto, MoveArticleDto, PageArticleDto} from './article.dto'
import {Pagination} from 'nestjs-typeorm-paginate'
import {CmsArticleEntity} from '../../../entity/cms/cms-article.entity'
import {RoleGuard} from '../../auth/role/role.guard'
import {Roles} from '../../auth/role/role.decorator'
import {RolesEnum} from '../../auth/role/role.enum'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/cms-article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  async findAll(@Query() dto: PageArticleDto): Promise<HttpResponse<Pagination<CmsArticleEntity>>> {
    const result = await this.articleService.paginate(dto)
    return httpResponse(result)
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    const articleList = await this.articleService.findOne(id)
    return httpResponse(articleList)
  }

  @Post('delete')
  async delete(@Body() dto: DeleteArticleDto) {
    await this.articleService.delete(dto.ids)
    return httpResponse()
  }

  @Post('create')
  async create(@Body() dto: CreateArticleDto) {
    const result = await this.articleService.create(dto)
    return httpResponse(result)
  }

  @Post('modify')
  async modify(@Body() dto: ModifyArticleDto) {
    await this.articleService.modify(dto)
    return httpResponse()
  }

  @Post('move')
  async move(@Body() dto: MoveArticleDto) {
    await this.articleService.move(dto)
    return httpResponse()
  }

  @Post('top/:ids')
  async top(@Param('ids', new ParseArrayPipe({items: String, separator: ','})) ids: string[]) {
    await this.articleService.top(ids)
    return httpResponse()
  }
}
