import {Controller, Get, UseGuards} from '@nestjs/common'
import {MailboxUserService} from './mailbox-user.service'
import {httpResponse} from '../../../common/response'
import {SecretJwtTokenGuard} from '../../auth/secret/secret-jwt-token.guard'
import {RoleGuard} from '../../auth/role/role.guard'
import {RolesEnum} from '../../auth/role/role.enum'
import {Roles} from '../../auth/role/role.decorator'

@UseGuards(RoleGuard)
@Roles(RolesEnum.Admin)
@UseGuards(SecretJwtTokenGuard)
@Controller('admin/mailbox-user')
export class MailboxUserController {
  constructor(private readonly mailboxUserService: MailboxUserService) {}

  @UseGuards(RoleGuard)
  @Roles(RolesEnum.Root)
  @UseGuards(SecretJwtTokenGuard)
  @Get('all')
  all() {
    return httpResponse(this.mailboxUserService.findAll())
  }
}
