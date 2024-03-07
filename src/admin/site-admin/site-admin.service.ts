import {BadRequestException, Injectable} from '@nestjs/common'
import {SiteAdminEntity} from '../../entity/site-admin.entity'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {ModifyPasswordDto} from './site-admin.dto'
import {decryptRsa} from '../../common/utils'
import {RolesEnum} from '../auth/role/role.enum'

@Injectable()
export class SiteAdminService {
  constructor(
    @InjectRepository(SiteAdminEntity)
    private repository: Repository<SiteAdminEntity>,
  ) {}

  validate(account, password) {
    return this.repository.findOne({where: {account, password}})
  }

  async validateUser(account: string, password: string): Promise<SiteAdminEntity> {
    const isExistUser = await this.findOneByAccount(account)
    if (!isExistUser) throw new BadRequestException('不存在该账号')
    let inputPassword = password
    try {
      inputPassword = decryptRsa(password)
    } catch (e) {}
    const user = await this.validate(account, inputPassword)
    if (!user) throw new BadRequestException('密码错误')
    if (user.disabled) throw new BadRequestException('该账号已被禁用')
    return user
  }

  findAll() {
    return this.repository.find()
  }

  findOne(id: string) {
    return this.repository.findOne({where: {id}})
  }

  findOneByAccount(account: string) {
    return this.repository.findOne({where: {account}})
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

  async init() {
    const rootSiteAdminEntity = new SiteAdminEntity({
      account: 'root',
      password: 'root123456',
      role: RolesEnum.Root,
      description: '超级管理员',
    })
    const adminSiteAdminEntity = new SiteAdminEntity({
      account: 'admin',
      password: 'admin123456',
      role: RolesEnum.Admin,
      description: '管理员',
    })
    const guestSiteAdminEntity = new SiteAdminEntity({
      account: 'guest',
      password: '123456',
      role: RolesEnum.Guest,
      description: '游客',
    })
    return await this.repository.save([rootSiteAdminEntity, adminSiteAdminEntity, guestSiteAdminEntity])
  }
}
