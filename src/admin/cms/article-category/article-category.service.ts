import {BadRequestException, GoneException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CmsArticleCategoryEntity} from '../../../entity/cms/cms-article-category.entity'
import {CreateArticleCategoryDto, ModifyArticleCategoryDto, SortArticleCategoryTree} from './article-category.dto'
import {cloneDeep} from 'lodash'
import {findTreeParentNode, foreachTree, getTreeData} from '@sky-serein/js-utils'
import {FileService} from '../../file/file.service'
import {CmsArticleEntity} from '../../../entity/cms/cms-article.entity'

@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(CmsArticleCategoryEntity)
    private repository: Repository<CmsArticleCategoryEntity>,
    private fileService: FileService,
  ) {}

  async findAll() {
    const articleCategoryEntity = await this.repository.find({
      select: ['id', 'parent_id', 'name', 'title', 'alias', 'introduction', 'disabled', 'sort'],
    })
    if (!articleCategoryEntity) return []
    let articleCategoryTree = cloneDeep(articleCategoryEntity)
    articleCategoryTree.sort((a, b) => a.sort - b.sort)
    articleCategoryTree = getTreeData(articleCategoryTree, null, 'parent_id')
    foreachTree(articleCategoryTree, 'children', (item) => {
      item.children?.sort((a, b) => a.sort - b.sort)
    })
    return articleCategoryTree
  }

  async findOne(id: string) {
    const articleCategoryEntity = await this.repository.findOne({where: {id}})
    if (!articleCategoryEntity) throw new GoneException('不存在的栏目')
    return articleCategoryEntity
  }

  async delete(ids: string[], physics?: boolean) {
    for (const id of ids) {
      const articleCategoryEntity = await this.repository.findOne({where: {id}})
      if (!articleCategoryEntity) throw new GoneException('不存在的栏目')
      await this.fileService.delete(articleCategoryEntity.picture, physics)
    }

    if (physics) {
      return this.repository.delete(ids)
    }
    return this.repository.softDelete(ids)
  }

  create(dto: CreateArticleCategoryDto) {
    const entity = this.repository.create(new CmsArticleEntity(dto))
    return this.repository.save(entity)
  }

  async modify(dto: ModifyArticleCategoryDto) {
    const entity = await this.findOne(dto.id)
    if (!entity) throw new GoneException('不存在的栏目')
    if (dto.parent_id === entity.id) throw new BadRequestException('上级栏目不能选择当前栏目')
    return await this.repository.update(dto.id, new CmsArticleEntity(dto))
  }

  sort(dto: SortArticleCategoryTree[]) {
    const arr = []
    dto.forEach((item, index) => {
      arr.push(this.repository.update(item.id, {parent_id: '', sort: index}))
      if (item?.children?.length) {
        foreachTree(item.children, 'children', (subItem, subIndex) => {
          if (subItem?.id) {
            const parentItem = findTreeParentNode(dto, 'children', subItem.id)
            const update: any = {
              parent_id: parentItem.id,
              sort: subIndex,
            }
            arr.push(this.repository.update(subItem.id, update))
          }
        })
      }
    })
    return Promise.all(arr)
  }
}
