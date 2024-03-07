import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {ConfigService} from '../../../config/service'
import {Request} from 'express'
import {JwtService} from '@nestjs/jwt'

export interface JwtPayLoad {
  id: string
  role: string
}

@Injectable()
export class SecretRefreshJwtStrategy extends PassportStrategy(Strategy, 'ADMIN_REFRESH_JWT') {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.jwt.secret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: JwtPayLoad) {
    // 跳过jwt验证直接更新token
    const token = this.jwtService.sign(payload, {
      secret: ConfigService.jwt.secret,
      expiresIn: ConfigService.jwt.expiresIn,
    })
    return {
      token,
      expires: ConfigService.jwt.expiresInRefresh(),
    } // 返回后的数据可在req.user使用
  }
}
