import {Logger, Module} from '@nestjs/common'
import {ArticleCategoryService} from './article-category.service'
import {ArticleCategoryController} from './article-category.controller'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CmsArticleCategoryEntity} from '../../../entity/cms/cms-article-category.entity'
import {RoleGuard} from '../../auth/role/role.guard'
import {FileModule} from '../../file/file.module'

@Module({
  imports: [TypeOrmModule.forFeature([CmsArticleCategoryEntity]), FileModule],
  exports: [TypeOrmModule, ArticleCategoryService],
  controllers: [ArticleCategoryController],
  providers: [ArticleCategoryService, Logger, RoleGuard],
})
export class ArticleCategoryModule {}
