import {Column, Entity, OneToMany} from 'typeorm'
import {BaseEntity} from '../base-entity'
import {CmsArticleEntity} from './cms-article.entity'

@Entity('cms_article_category')
export class CmsArticleCategoryEntity extends BaseEntity {
  @OneToMany(() => CmsArticleEntity, (cmsArticleEntity) => cmsArticleEntity.article_category_id)
  articles: CmsArticleEntity[]

  @Column({
    comment: '上级栏目id',
    nullable: true,
  })
  parent_id: string

  @Column({
    comment: '名称',
  })
  name: string

  @Column({
    comment: '标题',
    nullable: true,
  })
  title: string

  @Column({
    comment: '别名',
    nullable: true,
  })
  alias: string

  @Column({
    comment: '简介',
    nullable: true,
  })
  introduction: string

  @Column({
    comment: '图片',
    type: 'simple-array',
    nullable: true,
  })
  picture: string[]

  @Column({
    type: 'text',
    comment: '内容',
    nullable: true,
  })
  content: string

  @Column({
    default: false,
    comment: '禁用',
  })
  disabled: boolean

  @Column({
    default: 0,
    comment: '排序',
  })
  sort: number

  constructor(CmsArticleCategoryEntity: Partial<CmsArticleCategoryEntity>) {
    super(CmsArticleCategoryEntity)
  }
}
