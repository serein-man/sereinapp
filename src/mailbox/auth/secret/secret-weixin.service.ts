import {BadRequestException, Injectable} from '@nestjs/common'
import {ConfigService} from '../../../config/service'
import {serializeToGetRequestString} from '@sky-serein/js-utils'
import {JwtService} from '@nestjs/jwt'
import {HttpService} from '@nestjs/axios'
import {lastValueFrom} from 'rxjs'
import {WeixinLoginSessionRes} from '../../../types/weixin.types'
import {MailboxUserService} from '../../mailbox-user/mailbox-user.service'
import {JwtPayLoad} from './secret-jwt.strategy'

export interface LocalTokenSecret {
  token: string
  expires: number
}

@Injectable()
export class SecretWeixinService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly mailboxUserService: MailboxUserService,
  ) {}

  async validate(body: any): Promise<LocalTokenSecret> {
    const {code} = body
    const params = {
      appid: ConfigService.miniprogramConfigOfMailbox.appid,
      secret: ConfigService.miniprogramConfigOfMailbox.secret,
      js_code: code,
      grant_type: 'authorization_code',
    }
    const url = `https://api.weixin.qq.com/sns/jscode2session?${serializeToGetRequestString(params)}`
    const dataObservable = this.httpService.get(url)
    const res = await lastValueFrom(dataObservable).catch(({errMsg}) => {
      throw new BadRequestException(JSON.stringify(errMsg))
    })
    const resData = res.data as WeixinLoginSessionRes
    if (resData.errmsg) throw new BadRequestException(resData.errmsg)
    const mailboxUserEntity = await this.mailboxUserService.checkUserByWeixinSession(resData)
    const payload = {id: mailboxUserEntity.id}
    const token = this.jwtService.sign(payload, {
      secret: ConfigService.jwt.secret,
      expiresIn: ConfigService.jwt.expiresIn,
    })
    return {
      token,
      expires: ConfigService.jwt.expiresInRefresh(),
    }
  }

  refreshToken(payLoad: JwtPayLoad): LocalTokenSecret {
    const payload = {id: payLoad.id}
    const token = this.jwtService.sign(payload, {
      secret: ConfigService.jwt.secret,
      expiresIn: ConfigService.jwt.expiresIn,
    })
    return {
      token,
      expires: ConfigService.jwt.expiresInRefresh(),
    }
  }
}
