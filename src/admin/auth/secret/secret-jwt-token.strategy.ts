import {Injectable, UnauthorizedException} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {ConfigService} from '../../../config/service'
import {Request} from 'express'
import userSiteAdminTokenState from '../../state/token.state'

export interface JwtPayLoad {
  id: string
  role: string
}

@Injectable()
export class SecretJwtTokenStrategy extends PassportStrategy(Strategy, 'ADMIN_JWT_TOKEN') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.jwt.secret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayLoad) {
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    const userToken = jwtFromRequest(req)
    // 从redis里找用户token
    const stateToken = await userSiteAdminTokenState.get(payload.id)
    // 没有则说明是未登录
    if (!stateToken) {
      throw new UnauthorizedException('登录失效，请重新登录')
    }
    // 跟redis存的不一样，说明是再次获取了token
    if (userToken !== stateToken) {
      throw new UnauthorizedException('您的账号已经在另一处登录，请重新登录')
    }
    return payload // 返回后的数据可在req.user使用
  }
}
