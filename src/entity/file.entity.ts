import {Column, Entity} from 'typeorm'
import {BaseEntity} from './base-entity'

export enum FileSaveTypeEnum {
  Local = 'Local',
  Aliyun = 'Aliyun',
}

@Entity('file')
export class FileEntity extends BaseEntity {
  @Column({
    comment: '新文件名',
  })
  name: string

  @Column({
    nullable: true,
    comment: '原文件名',
  })
  origin: string

  @Column({
    comment: '文件大小',
  })
  size: number

  @Column({
    comment: '存储类型',
    type: 'enum',
    enum: FileSaveTypeEnum,
    default: FileSaveTypeEnum.Local,
  })
  type: FileSaveTypeEnum

  @Column({
    nullable: true,
    comment: 'oss桶名称',
  })
  bucket: string

  @Column({
    nullable: true,
    comment: 'oss默认地址',
  })
  oss_url: string

  @Column({
    nullable: true,
    comment: 'oss自定义域名完整url地址',
  })
  oss_url_custom: string

  @Column({
    nullable: true,
    comment: '本地文件路径',
  })
  local_url: string

  constructor(FileEntity: Partial<FileEntity>) {
    super(FileEntity)
  }
}
