import {Injectable} from '@nestjs/common'
import {MailboxUserEntity} from '../../../entity/mailbox/mailbox-user.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'

@Injectable()
export class MailboxUserService {
  constructor(
    @InjectRepository(MailboxUserEntity)
    private repository: Repository<MailboxUserEntity>,
  ) {}

  validate(telephone: string, password: string) {
    return this.repository.findOne({where: {telephone, password}})
  }

  findAll() {
    return this.repository.find()
  }

  findOne(id: string) {
    return this.repository.findOne({where: {id}})
  }

  findOneByUid(uid: string) {
    return this.repository.findOne({where: {wx_u_id: uid}})
  }

  delete(id: string) {
    return this.repository.softDelete({id})
  }
}
