import {Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne} from 'typeorm'
import {BaseEntity} from '../base-entity'
import {MailboxEntity} from './mailbox.entity'
import {MailboxVipEntity} from './mailbox-vip.entity'

@Entity('mailbox_user')
export class MailboxUserEntity extends BaseEntity {
  // 用户/信件打开相互联表
  @ManyToMany(() => MailboxEntity, (mailboxEntity) => mailboxEntity.mailboxUsers)
  open_mailboxes: MailboxEntity[]

  // 用户浏览信件记录关联表
  @ManyToMany(() => MailboxEntity, (mailboxEntity) => mailboxEntity.mailboxUserViewers)
  view_mailboxes: MailboxEntity[]

  // 关联创建者用户
  @OneToMany(() => MailboxEntity, (mailboxEntity) => mailboxEntity.creator)
  mailboxes: MailboxEntity[]

  // 关联用户VIP等级
  @OneToOne(() => MailboxVipEntity)
  @JoinColumn({
    name: 'mailbox_user_vip_id',
  })
  vip: MailboxVipEntity

  @Column({
    length: 50,
    comment: '名称',
    nullable: true,
  })
  name: string

  @Column({
    nullable: true,
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
    nullable: true,
    comment: '微信OpenId',
  })
  wx_open_id: string

  @Column({
    nullable: true,
    comment: '微信UnionId',
  })
  wx_u_id: string

  @Column({
    nullable: true,
    comment: '手机号码',
  })
  telephone: string

  @Column({
    default: false,
    comment: '禁用',
  })
  disabled: boolean

  constructor(MailboxUserEntity: Partial<MailboxUserEntity>) {
    super(MailboxUserEntity)
  }
}
