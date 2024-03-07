import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {ConfigService} from '../../../config/service'
import {Request} from 'express'

export interface JwtPayLoad {
  id: string
}

@Injectable()
export class SecretJwtStrategy extends PassportStrategy(Strategy, 'MAILBOX_JWT') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.jwt.secret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayLoad) {
    return payload // 返回后的数据可在req.user使用
  }
}
