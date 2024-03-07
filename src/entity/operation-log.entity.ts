import {Column, Entity} from 'typeorm'
import {BaseEntity} from './base-entity'

@Entity('operation_log')
export class OperationLogEntity extends BaseEntity {
  @Column({
    comment: '管理员ID',
  })
  site_admin_id: string

  @Column({
    comment: '管理员角色',
  })
  site_admin_role: string

  @Column({
    length: 100,
    comment: 'IP',
  })
  ip: string

  @Column({
    comment: '操作类型',
  })
  type: number

  @Column({
    nullable: true,
    length: 50,
    comment: '城市名称',
  })
  city: string

  @Column({
    nullable: true,
    length: 50,
    comment: '省份名称',
  })
  province: string

  @Column({
    nullable: true,
    length: 50,
    comment: '城市的adcode编码',
  })
  adcode: string

  @Column({
    nullable: true,
    comment: '所在城市矩形区域范围',
  })
  rectangle: string

  @Column({
    nullable: true,
    comment: '描述',
  })
  description: string

  constructor(OperationLogEntity: Partial<OperationLogEntity>) {
    super(OperationLogEntity)
  }
}
