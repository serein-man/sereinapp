import {Controller, Get, Param, Post, Query, UseGuards} from '@nestjs/common'
import {httpResponse} from '../../../common/response'
import {MailboxService} from './mailbox.service'
import {PageMailboxDto} from './mailbox.dto'
import {RoleGuard} from '../../auth/role/role.guard'
import {Roles} from '../../auth/role/role.decorator'
import {RolesEnum} from '../../auth/role/role.enum'
import {SecretJwtTokenGuard} from '../../auth/secret/secret-jwt-token.guard'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/mailbox')
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  @Get('all')
  async findAll(@Query() dto: PageMailboxDto) {
    const result = await this.mailboxService.paginate(dto)
    return httpResponse(result)
  }

  @Get('get/:id')
  async findOne(@Param('id') id: string) {
    const result = await this.mailboxService.findOne(id)
    return httpResponse(result)
  }

  @Post('delete/:id')
  async delete(@Param('id') id: string) {
    await this.mailboxService.delete(id)
    return httpResponse()
  }
}
