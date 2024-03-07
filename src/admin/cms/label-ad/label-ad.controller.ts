import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common'
import {LabelAdService} from './label-ad.service'
import {httpResponse} from '../../../common/response'
import {CreateLabelAdDto, DeleteLabelDto, ModifyLabelAdDto} from './label-ad.dto'
import {SecretJwtTokenGuard} from '../../auth/secret/secret-jwt-token.guard'
import {RoleGuard} from '../../auth/role/role.guard'
import {Roles} from '../../auth/role/role.decorator'
import {RolesEnum} from '../../auth/role/role.enum'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/cms-label-ad')
export class LabelAdController {
  constructor(private readonly labelAdService: LabelAdService) {}

  @Get('all')
  async findAll() {
    const result = await this.labelAdService.findAll()
    return httpResponse(result)
  }

  @Post('delete')
  async delete(@Body() dto: DeleteLabelDto) {
    await this.labelAdService.delete(dto.ids)
    return httpResponse()
  }

  @Post('create')
  async create(@Body() dto: CreateLabelAdDto) {
    const result = await this.labelAdService.create(dto)
    return httpResponse(result)
  }

  @Post('modify')
  async modify(@Body() dto: ModifyLabelAdDto) {
    await this.labelAdService.modify(dto)
    return httpResponse()
  }
}
