import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common'
import {MailboxService} from './mailbox.service'
import {
  DeleteMailboxDetailDto,
  GetMailboxDetailDto,
  InspectionMailboxDto,
  OpenMailboxDto,
  PageMailboxDto,
  PutMailboxDto,
} from './mailbox.dto'
import {httpResponse} from '../../common/response'
import {User} from '../extend/user.decorator'
import {JwtPayLoad} from '../auth/secret/secret-jwt.strategy'
import {SecretJwtAuthGuard} from '../auth/secret/secret-jwt-auth.guard'

@UseGuards(SecretJwtAuthGuard)
@Controller('mailbox')
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  @Get('put/list')
  async putList(@Query() dto: PageMailboxDto, @User() payLoad: JwtPayLoad) {
    const result = await this.mailboxService.paginateForPut(dto, payLoad)
    return httpResponse(result)
  }

  @Get('open/list')
  async openList(@Query() dto: PageMailboxDto, @User() payLoad: JwtPayLoad) {
    const result = await this.mailboxService.paginateForOpen(dto, payLoad)
    return httpResponse(result)
  }

  @Get('view/list')
  async viewList(@Query() dto: PageMailboxDto, @User() payLoad: JwtPayLoad) {
    const result = await this.mailboxService.paginateForView(dto, payLoad)
    return httpResponse(result)
  }

  @Get('detail')
  async getDetail(@Query() dto: GetMailboxDetailDto, @User() payLoad: JwtPayLoad) {
    const entity = await this.mailboxService.detail(dto.id, payLoad)
    return httpResponse(entity)
  }

  @Post('delete')
  async delete(@Body() dto: DeleteMailboxDetailDto, @User() payLoad: JwtPayLoad) {
    await this.mailboxService.delete(dto.id, payLoad)
    return httpResponse()
  }

  @Post('put')
  async put(@Body() dto: PutMailboxDto, @User() payLoad: JwtPayLoad) {
    const entity = await this.mailboxService.put(dto, payLoad)
    return httpResponse(entity)
  }

  @Post('open')
  async open(@Body() dto: OpenMailboxDto, @User() payLoad: JwtPayLoad) {
    const entity = await this.mailboxService.open(dto.id, payLoad, dto.password)
    return httpResponse(entity)
  }

  @Get('inspection')
  async inspection(@Query() dto: InspectionMailboxDto, @User() payLoad: JwtPayLoad) {
    const obj = await this.mailboxService.inspectionMailbox(dto.id, payLoad)
    return httpResponse(obj)
  }
}
