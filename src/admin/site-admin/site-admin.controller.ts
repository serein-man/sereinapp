import {Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards} from '@nestjs/common'
import {SiteAdminService} from './site-admin.service'
import {ModifyPasswordDto} from './site-admin.dto'
import {SecretJwtTokenGuard} from '../auth/secret/secret-jwt-token.guard'
import {httpResponse} from '../../common/response'
import {User} from '../extend/user.decorator'
import {SecretLocalLoginGuard} from '../auth/secret/secret-local-login.guard'
import {RoleGuard} from '../auth/role/role.guard'
import {OperationLogService} from '../auth/operation-log/operation-log.service'
import {LocalStrategyUser} from '../auth/secret/secret-local-login.strategy'
import {Roles} from '../auth/role/role.decorator'
import {omitRole, RolesEnum} from '../auth/role/role.enum'
import {JwtPayLoad} from '../auth/secret/secret-jwt-token.strategy'
import {SecretRefreshJwtGuard} from '../auth/secret/secret-refresh-jwt.guard'

@Controller('admin/site-admin')
export class SiteAdminController {
  constructor(
    private readonly siteAdminService: SiteAdminService,
    private readonly operationLog: OperationLogService,
  ) {}

  @UseGuards(SecretLocalLoginGuard)
  @Post('login')
  async login(@User() user: LocalStrategyUser, @Req() req) {
    const {token, expires, siteAdminUserInfo} = user
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    await this.operationLog.create(ip, 1, siteAdminUserInfo)
    return httpResponse({
      token,
      expires,
      user: {
        name: siteAdminUserInfo.account,
        role: siteAdminUserInfo.role,
        avatar: siteAdminUserInfo.avatar,
        description: siteAdminUserInfo.description,
      },
    })
  }

  @UseGuards(SecretRefreshJwtGuard)
  @UseGuards(SecretJwtTokenGuard)
  @Post('refresh-token')
  async refreshToken(@User() user: LocalStrategyUser) {
    const {token, expires} = user
    return httpResponse({
      token,
      expires,
    })
  }

  @UseGuards(SecretJwtTokenGuard)
  @Get('profile')
  getProfile(@User() payLoad: JwtPayLoad) {
    return httpResponse(this.siteAdminService.findOne(payLoad.id))
  }

  @UseGuards(RoleGuard)
  @Roles(RolesEnum.Root)
  @UseGuards(SecretJwtTokenGuard)
  @Get('all')
  all() {
    return httpResponse(this.siteAdminService.findAll())
  }

  @UseGuards(RoleGuard)
  @Roles(...omitRole(RolesEnum.Guest))
  @UseGuards(SecretJwtTokenGuard)
  @Post('modify-password')
  async modifyPassword(@Body() dto: ModifyPasswordDto, @User() payLoad: JwtPayLoad) {
    await this.siteAdminService.modifyPassword(payLoad.id, dto)
    return httpResponse()
  }

  @Post('init/:option')
  init(@Param('option') option: string) {
    if (option !== 'management') throw new UnauthorizedException()
    return httpResponse(this.siteAdminService.init())
  }
}
