import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MailboxUserController} from './mailbox-user.controller'
import {MailboxUserService} from './mailbox-user.service'
import {MailboxUserEntity} from '../../entity/mailbox/mailbox-user.entity'
import {SecretWeixinService} from '../auth/secret/secret-weixin.service'
import {JwtModule, JwtService} from '@nestjs/jwt'
import {HttpModule} from '@nestjs/axios'
import {FileModule} from '../file/file.module'
import {MailboxVipEntity} from '../../entity/mailbox/mailbox-vip.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MailboxUserEntity, MailboxVipEntity]), HttpModule, FileModule, JwtModule],
  exports: [TypeOrmModule, MailboxUserService],
  controllers: [MailboxUserController],
  providers: [MailboxUserService, SecretWeixinService, JwtService, Logger],
})
export class MailboxUserModule {}
