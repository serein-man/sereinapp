import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {FindManyOptions, FindOptionsWhere, Repository} from 'typeorm'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {OperationLogEntity} from '../../../entity/operation-log.entity'
import {HttpService} from '@nestjs/axios'
import {ConfigService} from '../../../config/service'
import {SiteAdminEntity} from '../../../entity/site-admin.entity'

@Injectable()
export class OperationLogService {
  constructor(
    @InjectRepository(OperationLogEntity)
    private repository: Repository<OperationLogEntity>,
    private httpService: HttpService,
  ) {}

  // 操作类型1：登录
  create(ip: string, type: number, user: SiteAdminEntity) {
    return new Promise((resolve, reject) => {
      const key = ConfigService.gaode.webJSKey
      this.httpService.get(`https://restapi.amap.com/v3/ip?ip=${ip}&key=${key}`).subscribe(async (res) => {
        const operationLogEntity = new OperationLogEntity({
          site_admin_id: user.id,
          site_admin_role: user.role,
          ip,
          type,
        })
        if (res.status === 200 && res.data?.status.toString() === '1') {
          operationLogEntity.city = res.data.city.toString()
          operationLogEntity.province = res.data.province.toString()
          operationLogEntity.adcode = res.data.adcode.toString()
          operationLogEntity.rectangle = res.data.rectangle.toString()
          await this.repository.save(operationLogEntity)
          resolve(res.data)
        } else {
          await this.repository.save(operationLogEntity)
          reject(res.data)
        }
      })
    })
  }

  async paginate(page_index = 0, page_size = 20): Promise<Pagination<OperationLogEntity>> {
    const siteAdminId = ''
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<OperationLogEntity> = {site_admin_id: siteAdminId}
    const searchOptions: FindManyOptions<OperationLogEntity> = {
      where,
      order: {id: 'DESC'},
    }
    return await paginate<OperationLogEntity>(this.repository, pageOptions, searchOptions)
  }
}
