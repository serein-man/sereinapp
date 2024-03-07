import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {MailboxConfigEntity} from '../../entity/mailbox/mailbox-config.entity'
import {GetMailboxConfigDto} from './mailbox-config.dto'

@Injectable()
export class MailboxConfigService {
  constructor(
    @InjectRepository(MailboxConfigEntity)
    private readonly repository: Repository<MailboxConfigEntity>,
  ) {
  }

  async findOne(dto: GetMailboxConfigDto) {
    return await this.repository.findOne({
      where: {name: dto.name},
    })
  }
}
