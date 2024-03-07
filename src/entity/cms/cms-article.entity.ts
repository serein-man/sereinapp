import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm'
import {BaseEntity, transformerDatetime} from '../base-entity'
import {CmsArticleCategoryEntity} from './cms-article-category.entity'

@Entity('cms_article')
export class CmsArticleEntity extends BaseEntity {
  @ManyToOne(() => CmsArticleCategoryEntity, (cmsArticleCategoryEntity) => cmsArticleCategoryEntity.articles)
  @JoinColumn({
    name: 'article_category_id',
  })
  article_category_id: CmsArticleCategoryEntity

  @Column({
    comment: '标题',
  })
  title: string

  @Column({
    nullable: true,
    comment: '子标题',
  })
  sub: string

  @Column({
    type: 'text',
    nullable: true,
    comment: '简介',
  })
  introduction: string

  @Column({
    type: 'simple-array',
    nullable: true,
    comment: '图片',
  })
  picture: string[]

  @Column({
    type: 'text',
    nullable: true,
    comment: '内容',
  })
  content: string

  @Column({
    nullable: true,
    comment: '标签',
    type: 'simple-array',
  })
  tag: string[]

  @Column({
    nullable: true,
    comment: '作者',
  })
  author: string

  @Column({
    nullable: true,
    comment: '浏览量',
  })
  views: number

  @Column({
    default: false,
    comment: '发布',
  })
  publish: boolean

  @Column({
    default: false,
    comment: '是否置顶',
  })
  is_top: boolean

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '发布时间',
    transformer: transformerDatetime,
  })
  publish_at: Date

  constructor(CmsArticleEntity: Partial<CmsArticleEntity>) {
    super(CmsArticleEntity)
  }
}
