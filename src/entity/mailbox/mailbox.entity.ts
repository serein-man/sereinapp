import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from 'typeorm'
import {BaseEntity, transformerDatetime} from '../base-entity'
import {MailboxUserEntity} from './mailbox-user.entity'

export enum MailBoxOpenWayEnum {
  Local = 'Local',
  Password = 'Password',
}

@Entity('mailbox')
export class MailboxEntity extends BaseEntity {
  // 用户/信件打开相互联表
  @ManyToMany(() => MailboxUserEntity, (mailboxUserEntity) => mailboxUserEntity.open_mailboxes)
  @JoinTable({
    name: 'mailboxes_open_users',
    joinColumn: {
      name: 'mailbox_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'mailbox_user_id',
      referencedColumnName: 'id',
    },
  })
  mailboxUsers: MailboxUserEntity[]

  // 用户浏览信件记录关联表
  @ManyToMany(() => MailboxUserEntity, (mailboxUserEntity) => mailboxUserEntity.view_mailboxes)
  @JoinTable({
    name: 'mailboxes_view_users',
    joinColumn: {
      name: 'mailbox_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'mailbox_user_id',
      referencedColumnName: 'id',
    },
  })
  mailboxUserViewers: MailboxUserEntity[]

  // 关联创建者用户
  @JoinColumn({name: 'creator_id'})
  @ManyToOne(() => MailboxUserEntity, (mailboxUserEntity) => mailboxUserEntity.mailboxes)
  creator: MailboxUserEntity

  @Column({
    comment: '标题',
  })
  title: string

  @Column({
    type: 'text',
    comment: '内容',
    nullable: true,
  })
  content: string

  @Column({
    comment: '描述',
    nullable: true,
  })
  desc: string

  // 图片上oss，这里存储的是FileEntity对应的id数组
  @Column({
    comment: '图片',
    type: 'simple-array',
    nullable: true,
  })
  picture: string[]

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '发布时间',
    transformer: transformerDatetime,
  })
  publish_at: Date

  @Column({
    default: false,
    comment: '是否群发',
  })
  is_group: boolean

  @Column({
    comment: '信件密码',
    nullable: true,
  })
  password: string

  @Column({
    type: 'enum',
    enum: MailBoxOpenWayEnum,
    comment: '打开方式',
    default: MailBoxOpenWayEnum.Local,
  })
  open_way: MailBoxOpenWayEnum

  @Column({
    default: false,
    comment: '禁用',
  })
  disabled: boolean

  constructor(MailboxEntity: Partial<MailboxEntity>) {
    super(MailboxEntity)
  }
}
