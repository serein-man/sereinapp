import {Body, Controller, Get, Post, UnauthorizedException, UseGuards} from '@nestjs/common'
import {MailboxUserService} from './mailbox-user.service'
import {SecretJwtAuthGuard} from '../auth/secret/secret-jwt-auth.guard'
import {HttpResponse, httpResponse} from '../../common/response'
import {JwtPayLoad} from '../auth/secret/secret-jwt.strategy'
import {User} from '../extend/user.decorator'
import {ModifyPasswordDto, ModifyUserProfileDto, WeixinLoginDto} from './mailbox-user.dto'
import {LocalTokenSecret, SecretWeixinService} from '../auth/secret/secret-weixin.service'
import {isVip} from '../common/utils'

@Controller('mailbox/user')
export class MailboxUserController {
  constructor(
    private readonly mailboxUserService: MailboxUserService,
    private readonly secretWeixinService: SecretWeixinService,
  ) {}

  @Post('login-by-weixin')
  async loginByWx(@Body() body: WeixinLoginDto): Promise<HttpResponse<LocalTokenSecret>> {
    const res = await this.secretWeixinService.validate(body)
    return httpResponse(res)
  }

  @UseGuards(SecretJwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@User() payLoad: JwtPayLoad) {
    const res = this.secretWeixinService.refreshToken(payLoad)
    return httpResponse(res)
  }

  @UseGuards(SecretJwtAuthGuard)
  @Post('modify-profile')
  async modifyProfile(@Body() dto: ModifyUserProfileDto, @User() payLoad: JwtPayLoad) {
    await this.mailboxUserService.modifyProfile(payLoad.id, dto)
    return httpResponse()
  }

  @UseGuards(SecretJwtAuthGuard)
  @Get('profile')
  async getProfile(@User() payLoad: JwtPayLoad) {
    const entity = await this.mailboxUserService.findOneById(payLoad.id)
    if (!entity) throw new UnauthorizedException()
    return httpResponse({
      id: entity.id,
      name: entity.name,
      avatar: entity.avatar,
      vip: isVip(entity.vip?.id, entity.vip?.expire_at),
    })
  }

  @UseGuards(SecretJwtAuthGuard)
  @Post('modify-password')
  async modifyPassword(@Body() dto: ModifyPasswordDto, @User() payLoad: JwtPayLoad) {
    await this.mailboxUserService.modifyPassword(payLoad.id, dto)
    return httpResponse()
  }
}
