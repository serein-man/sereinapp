import {Controller, Get, Query} from '@nestjs/common'
import {MailboxConfigService} from './mailbox-config.service'
import {httpResponse} from '../../common/response'
import {GetMailboxConfigDto} from './mailbox-config.dto'

@Controller('mailbox/config')
export class MailboxConfigController {
  constructor(private readonly mailboxConfigService: MailboxConfigService) {
  }

  @Get('get')
  async get(@Query() dto: GetMailboxConfigDto) {
    const entity = await this.mailboxConfigService.findOne(dto)
    const {name, value} = entity
    return httpResponse({name, value})
  }
}
