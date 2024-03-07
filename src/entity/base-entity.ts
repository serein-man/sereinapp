import {CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ValueTransformer} from 'typeorm'
import * as dayjs from 'dayjs'

export const transformerDatetime: ValueTransformer | ValueTransformer[] = {
  from: (value) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : value),
  to: (value) => value,
}

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    transformer: transformerDatetime,
  })
  create_at: Date

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    transformer: transformerDatetime,
  })
  update_at: Date

  @DeleteDateColumn({
    type: 'datetime',
    comment: '删除时间',
    transformer: transformerDatetime,
  })
  deleted_at: Date

  protected constructor(partial: Partial<BaseEntity>) {
    partial && Object.assign(this, partial)
  }
}
