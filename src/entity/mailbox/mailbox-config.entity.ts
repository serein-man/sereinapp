import {Column, Entity} from 'typeorm'
import {BaseEntity} from '../base-entity'

@Entity('mailbox_config')
export class MailboxConfigEntity extends BaseEntity {
  @Column({
    comment: '名称',
  })
  name: string

  @Column({
    comment: '值',
  })
  value: string

  constructor(MailboxConfigEntity: Partial<MailboxConfigEntity>) {
    super(MailboxConfigEntity)
  }
}
