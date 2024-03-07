import {Controller, Get, UseGuards} from '@nestjs/common'
import {HttpResponse, httpResponse} from '../../../common/response'
import {SecretJwtTokenGuard} from '../secret/secret-jwt-token.guard'
import {Pagination} from 'nestjs-typeorm-paginate'
import {RoleGuard} from '../role/role.guard'
import {OperationLogEntity} from '../../../entity/operation-log.entity'
import {OperationLogService} from './operation-log.service'
import {Roles} from '../role/role.decorator'
import {RolesEnum} from '../role/role.enum'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/login-log')
export class OperationLogController {
  constructor(private readonly loginLog: OperationLogService) {}

  @Get('all')
  async findAll(): Promise<HttpResponse<Pagination<OperationLogEntity>>> {
    const result = await this.loginLog.paginate()
    return httpResponse(result)
  }
}
