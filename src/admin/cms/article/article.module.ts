import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CmsArticleEntity} from '../../../entity/cms/cms-article.entity'
import {ArticleService} from './article.service'
import {ArticleController} from './article.controller'
import {ArticleCategoryModule} from '../article-category/article-category.module'
import {FileModule} from '../../file/file.module'

@Module({
  imports: [TypeOrmModule.forFeature([CmsArticleEntity]), ArticleCategoryModule, FileModule],
  exports: [TypeOrmModule, ArticleService],
  controllers: [ArticleController],
  providers: [ArticleService, Logger],
})
export class ArticleModule {}
