import {BadRequestException, Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {Strategy} from 'passport-local'
import {JwtPayLoad} from './secret-jwt-token.strategy'
import userSiteAdminTokenState from '../../state/token.state'
import {SiteAdminService} from '../../site-admin/site-admin.service'
import {SiteAdminEntity} from '../../../entity/site-admin.entity'
import {JwtService} from '@nestjs/jwt'
import {ConfigService} from '../../../config/service'

export interface LocalStrategyUser {
  token: string
  expires: number
  siteAdminUserInfo: SiteAdminEntity
}

@Injectable()
export class SecretLocalLoginStrategy extends PassportStrategy(Strategy, 'ADMIN_PASSWORD_LOGIN') {
  constructor(
    private readonly siteAdminService: SiteAdminService,
    private readonly jwtService: JwtService,
  ) {
    super({
      usernameField: 'account',
      passwordField: 'password',
    })
  }

  async validate(account: string, password: string): Promise<LocalStrategyUser> {
    if (!account) throw new BadRequestException('请输入账号')
    if (!password) throw new BadRequestException('请输入密码')
    const siteAdminEntity = await this.siteAdminService.validateUser(account, password)
    const payload: JwtPayLoad = {
      id: siteAdminEntity.id,
      role: siteAdminEntity.role,
    }
    const token = this.jwtService.sign(payload, {
      secret: ConfigService.jwt.secret,
      expiresIn: ConfigService.jwt.expiresIn,
    })
    // token写入redis => 供后面做单点登陆功能
    await userSiteAdminTokenState.set(payload.id, token)
    return {
      token,
      expires: ConfigService.jwt.expiresInRefresh(),
      siteAdminUserInfo: new SiteAdminEntity(siteAdminEntity),
    } // 返回后的数据可在req.user使用
  }
}
