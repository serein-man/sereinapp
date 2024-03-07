import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MailboxUserController} from './mailbox-user.controller'
import {MailboxUserService} from './mailbox-user.service'
import {MailboxUserEntity} from '../../../entity/mailbox/mailbox-user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MailboxUserEntity])],
  exports: [TypeOrmModule, MailboxUserService],
  controllers: [MailboxUserController],
  providers: [MailboxUserService, Logger],
})
export class MailboxUserModule {}
