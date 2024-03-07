import {Column, Entity} from 'typeorm'
import {BaseEntity, transformerDatetime} from '../base-entity'

@Entity('cms_label_ad')
export class CmsLabelAdEntity extends BaseEntity {
  @Column({
    length: 100,
    comment: '标题',
  })
  title: string

  @Column({
    type: 'text',
    nullable: true,
    comment: '简介',
  })
  introduction: string

  @Column({
    nullable: true,
    comment: '图片',
  })
  picture: string

  @Column({
    default: false,
    comment: '是否置顶',
  })
  is_top: boolean

  @Column({
    default: false,
    comment: '发布',
  })
  publish: boolean

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '发布时间',
    transformer: transformerDatetime,
  })
  publish_at: Date

  constructor(CmsLabelAdEntity: Partial<CmsLabelAdEntity>) {
    super(CmsLabelAdEntity)
  }
}
