import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {FindManyOptions, FindOptionsWhere, Repository} from 'typeorm'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {MailboxEntity} from '../../../entity/mailbox/mailbox.entity'
import {PageMailboxDto} from './mailbox.dto'

@Injectable()
export class MailboxService {
  constructor(
    @InjectRepository(MailboxEntity)
    private repository: Repository<MailboxEntity>,
  ) {}

  async findOne(id: string) {
    return await this.repository.findOne({where: {id}})
  }

  async delete(id: string, physics?: boolean) {
    if (physics) {
      return await this.repository.delete(id)
    }
    return await this.repository.softDelete(id)
  }

  async paginate(options: PageMailboxDto): Promise<Pagination<MailboxEntity>> {
    const {page_size = 20, page_index = 1} = options
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<MailboxEntity> = {}
    const searchOptions: FindManyOptions<MailboxEntity> = {
      where,
      order: {create_at: 'DESC'},
    }
    return await paginate<MailboxEntity>(this.repository, pageOptions, searchOptions)
  }
}
