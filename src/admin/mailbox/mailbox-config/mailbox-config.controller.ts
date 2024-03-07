import {Body, Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common'
import {httpResponse} from '../../../common/response'
import {MailboxConfigService} from './mailbox-config.service'
import {RoleGuard} from '../../auth/role/role.guard'
import {Roles} from '../../auth/role/role.decorator'
import {RolesEnum} from '../../auth/role/role.enum'
import {SecretJwtTokenGuard} from '../../auth/secret/secret-jwt-token.guard'
import {CreateMailboxConfigDto, ModifyMailboxConfigDto, PageMailboxConfigDto} from './mailbox-config.dto'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/mailbox-config')
export class MailboxConfigController {
  constructor(private readonly mailboxConfigService: MailboxConfigService) {}

  @Get('all')
  async findAll(@Query() dto: PageMailboxConfigDto) {
    const result = await this.mailboxConfigService.paginate(dto)
    return httpResponse(result)
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    const result = await this.mailboxConfigService.findOne(id)
    return httpResponse(result)
  }

  @Post('modify')
  async modify(@Body() dto: ModifyMailboxConfigDto) {
    const result = await this.mailboxConfigService.modify(dto)
    return httpResponse(result)
  }

  @Post('create')
  async create(@Body() dto: CreateMailboxConfigDto) {
    const result = await this.mailboxConfigService.create(dto)
    return httpResponse(result)
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    await this.mailboxConfigService.delete(id)
    return httpResponse()
  }
}
