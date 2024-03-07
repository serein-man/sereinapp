import {BadRequestException, GoneException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {FindManyOptions, FindOptionsWhere, Repository} from 'typeorm'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {PageMailboxDto, PutMailboxDto} from './mailbox.dto'
import {MailboxEntity, MailBoxOpenWayEnum} from '../../entity/mailbox/mailbox.entity'
import {MailboxUserService} from '../mailbox-user/mailbox-user.service'
import {JwtPayLoad} from '../auth/secret/secret-jwt.strategy'
import * as dayjs from 'dayjs'
import {InspectionMailboxRes, MailboxDetailRes, MailboxListItemRes} from './mailbox.res'
import {FileService} from '../file/file.service'
import {cloneDeep} from 'lodash'
import {mailboxRedLock} from '../../common/service/redlock/mailbox-redlock'
import {isVip} from '../common/utils'

@Injectable()
export class MailboxService {
  constructor(
    @InjectRepository(MailboxEntity)
    private readonly repository: Repository<MailboxEntity>,
    private readonly mailboxUserService: MailboxUserService,
    private readonly fileService: FileService,
  ) {
  }

  async findOne(id: string, userId: string) {
    return await this.repository.findOne({
      where: {id, creator: {id: userId}},
      relations: {mailboxUsers: true, mailboxUserViewers: true, creator: true},
    })
  }

  async delete(id: string, payLoad: JwtPayLoad, physics?: boolean) {
    const entity = await this.repository.findOne({where: {id, creator: {id: payLoad.id}}, relations: {mailboxUsers: true}})
    if (!entity) throw new GoneException('不存在的信件')
    if (entity.mailboxUsers.length) throw new BadRequestException('信件已被打开，不能被删除')
    if (physics) {
      await this.repository.delete(id)
    }
    await this.repository.softDelete(id)
  }

  async put(dto: PutMailboxDto, payLoad: JwtPayLoad) {
    let mailboxId = dto.id,
      mailboxEntity: MailboxEntity
    if (mailboxId) {
      mailboxEntity = await this.findOne(mailboxId, payLoad.id)
      if (!mailboxEntity) throw new GoneException('不存在的信件')
      if (mailboxEntity.mailboxUsers?.length) throw new BadRequestException('信件已被人打开，不可更改')
      if (mailboxEntity.disabled) throw new GoneException('信件存在风险，已被屏蔽')
    }
    const mailboxUserEntity = await this.mailboxUserService.findOneById(payLoad.id)
    const dtoEffect: Partial<MailboxEntity> = {
      creator: mailboxUserEntity,
      title: dto.title,
      desc: dto.desc,
      content: dto.content,
      publish_at: dto.publish_at,
      is_group: dto.is_group,
      password: dto.password || null,
      open_way: dto.password ? MailBoxOpenWayEnum.Password : MailBoxOpenWayEnum.Local,
    }
    if (dto.picture?.length) {
      dtoEffect.picture = dto.picture
    }
    const mailbox = new MailboxEntity(dtoEffect)
    let mailboxEntityRes: MailboxEntity
    if (mailboxId) {
      await this.repository.update(mailboxId, mailbox)
      mailboxEntityRes = mailboxEntity
    } else {
      mailboxEntityRes = await this.repository.save(mailbox)
    }
    return {id: mailboxEntityRes.id}
  }

  async open(mailboxId: string, payLoad: JwtPayLoad, password?: string): Promise<Partial<MailboxDetailRes>> {
    const mailboxEntity = await this.repository.findOne({
      where: {id: mailboxId},
      relations: {mailboxUsers: true, creator: true},
    })
    if (!mailboxEntity) throw new GoneException('不存在的信件')
    if (mailboxEntity.disabled) throw new GoneException('信件存在风险，已被屏蔽')
    // 关联用户
    const currentUserEntity = await this.mailboxUserService.findOneById(payLoad.id)
    // 判断能否打开
    const publishDate = dayjs(mailboxEntity.publish_at)
    const canOpen = publishDate.unix() <= dayjs().unix()
    const diffDate = (() => {
      if (canOpen) return 0
      const day = publishDate.diff(dayjs(), 'day')
      if (day) return day + '天'
      const hour = publishDate.diff(dayjs(), 'hour')
      if (hour) return hour + '小时'
      const minute = publishDate.diff(dayjs(), 'minute')
      if (minute) return minute + '分钟'
      const second = publishDate.diff(dayjs(), 'second')
      if (second) return second + '秒'
      return 0
    })()
    if (diffDate) throw new BadRequestException(`信件还需${diffDate}才能被打开`)
    const output: Partial<MailboxDetailRes> = {
      id: mailboxEntity.id,
      title: mailboxEntity.title,
      content: mailboxEntity.content,
      publish_at: mailboxEntity.publish_at,
      is_group: mailboxEntity.is_group,
      picture: await this.fileService.fileToUrlArray(mailboxEntity.picture, 'oss_url_custom'),
      creator: {
        id: mailboxEntity.creator.id,
        avatar: mailboxEntity.creator.avatar,
        name: mailboxEntity.creator.name,
      },
    }
    // 我是否打开过
    if (mailboxEntity.mailboxUsers.find((item) => item.id === payLoad.id)) return output
    // 判断群发限制
    if (!mailboxEntity.is_group && mailboxEntity.mailboxUsers.length) throw new BadRequestException(`信件已被他人拾取`)
    // 判断是否需要密码
    if (mailboxEntity.open_way === MailBoxOpenWayEnum.Password && !password) throw new BadRequestException(`缺少信件密码`)
    // 验证密码
    if (mailboxEntity.open_way === MailBoxOpenWayEnum.Password && mailboxEntity.password !== password)
      throw new BadRequestException(`信件密码无效`)
    // 打开信（非群发时->上锁）
    mailboxEntity.mailboxUsers = [currentUserEntity]
    if (mailboxEntity.is_group) {
      await this.repository.save(mailboxEntity)
    } else {
      await mailboxRedLock.using(['MailboxRedLock_Open_Input_User'], 5000, async (signal) => {
        if (signal.aborted) {
          throw new BadRequestException(signal.error)
        }
        await this.repository.save(mailboxEntity)
      })
    }
    return output
  }

  async inspectionMailbox(mailboxId: string, payLoad: JwtPayLoad): Promise<InspectionMailboxRes> {
    const mailboxEntity = await this.repository.findOne({
      where: {id: mailboxId},
      relations: {mailboxUsers: true, mailboxUserViewers: true, creator: true},
    })
    if (!mailboxEntity) throw new GoneException('不存在的信件')
    if (mailboxEntity.disabled) throw new GoneException('信件存在风险，已被屏蔽')
    // 关联用户
    const currentUserEntity = await this.mailboxUserService.findOneById(payLoad.id)
    // 添加浏览记录
    if (!mailboxEntity.mailboxUserViewers.find((item) => item.id === payLoad.id)) {
      const mailboxEntityOfView = cloneDeep(mailboxEntity)
      mailboxEntityOfView.mailboxUserViewers = [currentUserEntity]
      await this.repository.save(mailboxEntityOfView)
    }
    // 判断能否打开
    const publishDate = dayjs(mailboxEntity.publish_at)
    const canOpen = publishDate.unix() <= dayjs().unix()
    const diffDate = (() => {
      if (canOpen) return 0
      const day = publishDate.diff(dayjs(), 'day')
      if (day) return day + '天'
      const hour = publishDate.diff(dayjs(), 'hour')
      if (hour) return hour + '小时'
      const minute = publishDate.diff(dayjs(), 'minute')
      if (minute) return minute + '分钟'
      const second = publishDate.diff(dayjs(), 'second')
      if (second) return second + '秒'
      return 0
    })()
    if (diffDate) throw new BadRequestException(`信件还需${diffDate}才能被打开`)
    // 判断是否TA人被拾取
    const isReceive = mailboxEntity.is_group ? false : !!mailboxEntity.mailboxUsers.filter((item) => item.id !== payLoad.id).length
    if (isReceive) throw new BadRequestException('信件已被他人拾取')
    if (currentUserEntity.vip?.id && isVip(currentUserEntity.vip.id, currentUserEntity.vip.expire_at)) {
      return {
        title: mailboxEntity.title,
        desc: mailboxEntity.desc,
        publish_at: mailboxEntity.publish_at,
        is_password: mailboxEntity.open_way === MailBoxOpenWayEnum.Password,
        creator: {
          id: mailboxEntity.creator.id,
          name: mailboxEntity.creator.name,
          avatar: mailboxEntity.creator.avatar,
        },
      }
    }
    return {
      is_password: mailboxEntity.open_way === MailBoxOpenWayEnum.Password,
    }
  }

  async detail(id: string, payLoad: JwtPayLoad): Promise<MailboxDetailRes> {
    let isMyCreat = true
    let mailboxEntity = await this.repository.findOne({
      where: {id, creator: {id: payLoad.id}},
      relations: {creator: true, mailboxUsers: true},
    })
    // 不是我创建的
    if (!mailboxEntity) {
      isMyCreat = false
      mailboxEntity = await this.repository.findOne({
        where: {id, mailboxUsers: {id: payLoad.id}},
        relations: {creator: true, mailboxUsers: true},
      })
      // 不是我打开的
      if (!mailboxEntity) throw new GoneException('无效的信件')
    }
    if (mailboxEntity.disabled) throw new BadRequestException('信件存在风险，已被屏蔽')
    const res: MailboxDetailRes = {
      id: mailboxEntity.id,
      title: mailboxEntity.title,
      desc: mailboxEntity.desc,
      content: mailboxEntity.content,
      publish_at: mailboxEntity.publish_at,
      is_group: mailboxEntity.is_group,
      picture: await this.fileService.fileToUrlArray(mailboxEntity.picture, 'oss_url_custom'),
      password: mailboxEntity.open_way === MailBoxOpenWayEnum.Password ? mailboxEntity.password : '',
      creator: {
        id: mailboxEntity.creator.id,
        avatar: mailboxEntity.creator.avatar,
        name: mailboxEntity.creator.name,
      },
    }
    if (isMyCreat) {
      const currentUserEntity = await this.mailboxUserService.findOneById(payLoad.id)
      if (currentUserEntity.vip && isVip(currentUserEntity.vip.id, currentUserEntity.vip.expire_at)) {
        res.users = mailboxEntity.mailboxUsers.map((item) => ({
          id: item.id,
          name: item.name,
          avatar: item.avatar,
        }))
      }
    }
    return res
  }

  async paginateForPut(options: PageMailboxDto, payLoad: JwtPayLoad): Promise<Pagination<MailboxListItemRes>> {
    const {page_size = 20, page_index = 1} = options
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<MailboxEntity> = {
      creator: {id: payLoad.id},
      disabled: false,
    }
    const searchOptions: FindManyOptions<MailboxEntity> = {
      select: ['id', 'title', 'publish_at', 'is_group', 'open_way', 'create_at', 'mailboxUsers'],
      where,
      order: {create_at: 'DESC'},
      relations: {mailboxUsers: true},
    }
    const entity = await paginate(this.repository, pageOptions, searchOptions)
    const items = entity.items.map((item) => ({
      id: item.id,
      title: item.title,
      publish_at: item.publish_at,
      is_group: item.is_group,
      is_password: item.open_way === MailBoxOpenWayEnum.Password,
      open_count: item.mailboxUsers.length,
      create_time: item.create_at,
    }))
    return {items, meta: entity.meta}
  }

  async paginateForOpen(options: PageMailboxDto, payLoad: JwtPayLoad): Promise<Pagination<MailboxListItemRes>> {
    const {page_size = 20, page_index = 1} = options
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<MailboxEntity> = {
      disabled: false,
      mailboxUsers: {
        id: payLoad.id,
      },
    }
    const searchOptions: FindManyOptions<MailboxEntity> = {
      select: ['id', 'title', 'publish_at', 'is_group', 'open_way', 'create_at'],
      where,
      order: {create_at: 'DESC'},
    }
    const entity = await paginate(this.repository, pageOptions, searchOptions)
    const items = entity.items.map((item) => ({
      id: item.id,
      title: item.title,
      publish_at: item.publish_at,
      is_group: item.is_group,
      is_password: item.open_way === MailBoxOpenWayEnum.Password,
      create_time: item.create_at,
    }))
    return {items, meta: entity.meta}
  }

  async paginateForView(options: PageMailboxDto, payLoad: JwtPayLoad): Promise<Pagination<MailboxListItemRes>> {
    const {page_size = 20, page_index = 1} = options
    const pageOptions: IPaginationOptions = {page: Number(page_index), limit: Number(page_size)}
    const where: FindOptionsWhere<MailboxEntity> = {
      disabled: false,
      mailboxUserViewers: {
        id: payLoad.id,
      },
    }
    const searchOptions: FindManyOptions<MailboxEntity> = {
      select: ['id', 'title', 'publish_at', 'is_group', 'open_way', 'create_at'],
      where,
      order: {create_at: 'DESC'},
    }
    const entity = await paginate(this.repository, pageOptions, searchOptions)
    const items = entity.items.map((item) => ({
      id: item.id,
      title: item.title,
      publish_at: item.publish_at,
      is_group: item.is_group,
      is_password: item.open_way === MailBoxOpenWayEnum.Password,
      create_time: item.create_at,
    }))
    return {items, meta: entity.meta}
  }
}
