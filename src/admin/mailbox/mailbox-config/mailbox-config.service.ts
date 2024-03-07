import {GoneException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {FindManyOptions, FindOptionsWhere, Repository} from 'typeorm'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {CreateMailboxConfigDto, ModifyMailboxConfigDto, PageMailboxConfigDto} from './mailbox-config.dto'
import {MailboxConfigEntity} from 'src/entity/mailbox/mailbox-config.entity'

@Injectable()
export class MailboxConfigService {
  constructor(
    @InjectRepository(MailboxConfigEntity)
    private repository: Repository<MailboxConfigEntity>,
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

  async modify(dto: ModifyMailboxConfigDto) {
    const config = await this.repository.findOne({where: {id: dto.id}})
    if (!config) throw new GoneException('不存在的配置')
    const configEntity = new MailboxConfigEntity(dto)
    return await this.repository.save(configEntity)
  }

  async create(dto: CreateMailboxConfigDto) {
    const configEntity = new MailboxConfigEntity(dto)
    return await this.repository.save(configEntity)
  }

  async paginate(options: PageMailboxConfigDto): Promise<Pagination<MailboxConfigEntity>> {
    const {page_size = 20, page_index = 1} = options
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<MailboxConfigEntity> = {}
    const searchOptions: FindManyOptions<MailboxConfigEntity> = {
      where,
      order: {create_at: 'DESC'},
    }
    return await paginate<MailboxConfigEntity>(this.repository, pageOptions, searchOptions)
  }
}
