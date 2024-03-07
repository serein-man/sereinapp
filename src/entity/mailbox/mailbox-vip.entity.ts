import {Column, Entity, OneToOne} from 'typeorm'
import {BaseEntity, transformerDatetime} from '../base-entity'
import {MailboxUserEntity} from './mailbox-user.entity'

@Entity('mailbox_vip')
export class MailboxVipEntity extends BaseEntity {
  // 关联用户
  @OneToOne(() => MailboxUserEntity, (mailboxUserEntity) => mailboxUserEntity.vip)
  user: MailboxUserEntity

  @Column({
    default: 1,
    comment: 'VIP等级',
  })
  grade: number

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '到期时间',
    transformer: transformerDatetime,
  })
  expire_at: Date

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '开始时间',
    transformer: transformerDatetime,
  })
  start_at: Date

  @Column({
    default: false,
    comment: '禁用',
  })
  disabled: boolean

  constructor(MailboxVipEntity: Partial<MailboxVipEntity>) {
    super(MailboxVipEntity)
  }
}
