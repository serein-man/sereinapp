import {GoneException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Between, FindManyOptions, FindOptionsWhere, Like, MoreThan, Repository} from 'typeorm'
import {CmsArticleEntity} from '../../../entity/cms/cms-article.entity'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {CreateArticleDto, ModifyArticleDto, MoveArticleDto, PageArticleDto} from './article.dto'
import * as dayjs from 'dayjs'
import {ArticleCategoryService} from '../article-category/article-category.service'
import {FileService} from '../../file/file.service'
import {cloneDeep} from 'lodash'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(CmsArticleEntity)
    private repository: Repository<CmsArticleEntity>,
    private articleCategoryService: ArticleCategoryService,
    private fileService: FileService,
  ) {}

  async findOne(id: string) {
    const articleEntity = await this.repository.findOne({where: {id}, loadRelationIds: true})
    if (!articleEntity) return null
    return {
      ...new CmsArticleEntity(articleEntity),
      picture: await this.fileService.fileToUrlArray(articleEntity.picture),
      tag: articleEntity.tag,
    }
  }

  async delete(ids: string[], physics?: boolean) {
    for (const id of ids) {
      const articleEntity = await this.repository.findOne({where: {id}})
      if (!articleEntity) throw new GoneException('不存在的文章')
      await this.fileService.delete(articleEntity.picture, physics)
    }
    if (physics) {
      return await this.repository.delete(ids)
    }
    return await this.repository.softDelete(ids)
  }

  async create(dto: CreateArticleDto) {
    const articleCategory = await this.articleCategoryService.findOne(dto.article_category_id)
    if (!articleCategory) throw new GoneException('不存在的栏目')
    const article = new CmsArticleEntity(dto as unknown as CmsArticleEntity)
    article.article_category_id = articleCategory
    return this.repository.save(article)
  }

  async modify(dto: ModifyArticleDto) {
    const article = await this.repository.findOne({where: {id: dto.id}})
    if (!article) throw new GoneException('不存在的文章')
    const articleCategory = await this.articleCategoryService.findOne(dto.article_category_id)
    if (!articleCategory) throw new GoneException('不存在的栏目')
    const modifyArticleEntity = new CmsArticleEntity({
      ...dto,
      article_category_id: articleCategory,
      picture: dto.picture || null,
      tag: dto.tag || null,
    })
    return await this.repository.save(modifyArticleEntity)
  }

  async paginate(options: PageArticleDto): Promise<Pagination<CmsArticleEntity>> {
    const {page_size = 20, page_index = 1, article_category_id, filter = [], keywords = '', start_time = '', end_time = ''} = options
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<CmsArticleEntity> = {}
    if (article_category_id) {
      where['article_category_id'] = {
        id: article_category_id,
      }
    }
    if (keywords) {
      where['title'] = Like(`%${keywords}%`)
    }
    if (start_time || end_time) {
      where['create_at'] = Between<Date>(dayjs(start_time || '2000-01-01 00:00:00').toDate(), dayjs(end_time || '').toDate())
    }
    // filter：1 未发布 、2 已发布 、3 待发布、4 置顶
    const filterArr = filter.map((value) => Number(value))
    if (filterArr.includes(1)) {
      where['publish'] = false
    }
    if (filterArr.includes(2)) {
      where['publish'] = true
    }
    if (filterArr.includes(1) && filterArr.includes(2)) {
      delete where['publish']
    }
    if (filterArr.includes(3)) {
      where['publish_at'] = MoreThan<Date>(dayjs().toDate())
    }
    if (filterArr.includes(4)) {
      where['is_top'] = true
    }
    const searchOptions: FindManyOptions<CmsArticleEntity> = {
      select: [
        'id',
        'article_category_id',
        'title',
        'sub',
        'tag',
        'introduction',
        'author',
        'views',
        'publish',
        'publish_at',
        'is_top',
        'create_at',
        'update_at',
      ],
      where,
      order: {create_at: 'DESC'},
    }
    const result = await paginate<CmsArticleEntity>(this.repository, pageOptions, searchOptions)
    const outputResult = cloneDeep(result) as unknown as any
    if (outputResult.items.length) {
      // 数据格式化
      outputResult.items = outputResult.items.map((item) => {
        return {
          ...item,
          tag: item.tag?.split(',') || [],
        }
      })
    }
    return outputResult
  }

  async move(dto: MoveArticleDto) {
    const articleCategory = await this.articleCategoryService.findOne(dto.article_category_id)
    if (!articleCategory) throw new GoneException('不存在的栏目')
    const article = []
    for (const id of dto.ids) {
      const articleEntity = await this.repository.findOne({where: {id}})
      if (!articleEntity) continue
      articleEntity.article_category_id = articleCategory
      article.push(articleEntity)
    }
    await this.repository.save(article)
  }

  async top(ids: string[]) {
    if (!ids?.length) return
    const article = []
    for (let i = 0; i < ids.length; i++) {
      const articleEntity = await this.repository.findOne({where: {id: ids[i]}})
      if (!articleEntity) continue
      articleEntity.is_top = !articleEntity.is_top
      article.push(articleEntity)
    }
    await this.repository.save(article)
  }
}
