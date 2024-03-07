import {Column, Entity} from 'typeorm'
import {BaseEntity} from './base-entity'
import {RolesEnum} from '../admin/auth/role/role.enum'

@Entity('site_admin')
export class SiteAdminEntity extends BaseEntity {
  @Column({
    length: 50,
    comment: '用户名',
  })
  account: string

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string

  @Column({
    nullable: true,
    comment: '头像',
  })
  avatar: string

  @Column({
    type: 'enum',
    enum: RolesEnum,
    comment: '角色',
  })
  role: RolesEnum

  @Column({
    nullable: true,
    comment: '描述',
  })
  description: string

  @Column({
    default: false,
    comment: '禁用',
  })
  disabled: boolean

  constructor(SiteAdminEntity: Partial<SiteAdminEntity>) {
    super(SiteAdminEntity)
  }
}
