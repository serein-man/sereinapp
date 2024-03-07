import {BadRequestException, GoneException, Injectable, UnauthorizedException} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {decryptRsa} from '../../common/utils'
import {ModifyPasswordDto, ModifyUserProfileDto} from './mailbox-user.dto'
import {WeixinLoginSessionRes} from '../../types/weixin.types'
import {MailboxUserEntity} from '../../entity/mailbox/mailbox-user.entity'
import {MailboxVipEntity} from '../../entity/mailbox/mailbox-vip.entity'
import * as dayjs from 'dayjs'

@Injectable()
export class MailboxUserService {
  constructor(
    @InjectRepository(MailboxUserEntity)
    private repository: Repository<MailboxUserEntity>,
  ) {}

  validate(telephone: string, password: string) {
    return this.repository.findOne({where: {telephone, password}})
  }

  async checkUserByWeixinSession(weixinLoginSessionRes: WeixinLoginSessionRes) {
    const {unionid, openid} = weixinLoginSessionRes
    let user: MailboxUserEntity
    if (unionid) {
      user = await this.findOneByUnionId(unionid)
    } else if (openid) {
      user = await this.findOneByOpenId(unionid)
    }
    if (user?.disabled) throw new GoneException('该账号存在风险，已被禁用')
    if (user) return user
    const userProfile = new MailboxUserEntity({
      wx_u_id: unionid || '',
      wx_open_id: openid || '',
    })
    userProfile.vip = new MailboxVipEntity({
      grade: 1,
      start_at: dayjs().toDate(),
      expire_at: dayjs().add(30, 'day').toDate(),
    })
    return await this.repository.save(userProfile)
  }

  async findOneById(id: string) {
    const mailboxUserEntity = await this.repository.findOne({where: {id}, relations: {vip: true}})
    if (!mailboxUserEntity) throw new UnauthorizedException('不存在的用户')
    return mailboxUserEntity
  }

  findOneByUnionId(unionId: string) {
    return this.repository.findOne({where: {wx_u_id: unionId}})
  }

  findOneByOpenId(openId: string) {
    return this.repository.findOne({where: {wx_open_id: openId}})
  }

  delete(id: string) {
    return this.repository.softDelete({id})
  }

  async modifyPassword(userId: string, dto: ModifyPasswordDto) {
    const userInfoEntity = await this.repository.findOne({where: {id: userId}, select: ['password']})
    if (userInfoEntity.password !== decryptRsa(dto.old_password)) {
      throw new BadRequestException('旧密码错误')
    }
    await this.repository.update(userId, {password: decryptRsa(dto.new_password)})
  }

  async modifyProfile(userId: string, dto: ModifyUserProfileDto) {
    await this.repository.update(userId, {
      name: dto.name,
      avatar: dto.avatar,
    })
  }
}
