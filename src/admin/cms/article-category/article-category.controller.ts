import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common'
import {ArticleCategoryService} from './article-category.service'
import {httpResponse} from '../../../common/response'
import {SecretJwtTokenGuard} from '../../auth/secret/secret-jwt-token.guard'
import {
  CreateArticleCategoryDto,
  DeleteArticleCategoryDto,
  ModifyArticleCategoryDto,
  SortArticleCategoryDto,
} from './article-category.dto'
import {RoleGuard} from '../../auth/role/role.guard'
import {Roles} from '../../auth/role/role.decorator'
import {RolesEnum} from '../../auth/role/role.enum'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/cms-article-category')
export class ArticleCategoryController {
  constructor(private readonly articleCategoryService: ArticleCategoryService) {}

  @Get('all')
  async findAll() {
    const articleCategoryList = await this.articleCategoryService.findAll()
    return httpResponse(articleCategoryList)
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    const articleCategoryList = await this.articleCategoryService.findOne(id)
    return httpResponse(articleCategoryList)
  }

  @Post('delete')
  async delete(@Body() dto: DeleteArticleCategoryDto) {
    await this.articleCategoryService.delete(dto.ids)
    return httpResponse()
  }

  @Post('create')
  async create(@Body() dto: CreateArticleCategoryDto) {
    return httpResponse(await this.articleCategoryService.create(dto))
  }

  @Post('modify')
  async modify(@Body() dto: ModifyArticleCategoryDto) {
    await this.articleCategoryService.modify(dto)
    return httpResponse()
  }

  @Post('sort')
  async sort(@Body() dto: SortArticleCategoryDto) {
    await this.articleCategoryService.sort(dto.category)
    return httpResponse()
  }
}
