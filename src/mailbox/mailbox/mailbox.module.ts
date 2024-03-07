import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MailboxService} from './mailbox.service'
import {MailboxController} from './mailbox.controller'
import {MailboxEntity} from '../../entity/mailbox/mailbox.entity'
import {FileModule} from '../file/file.module'
import {MailboxUserModule} from '../mailbox-user/mailbox-user.module'

@Module({
  imports: [TypeOrmModule.forFeature([MailboxEntity]), FileModule, MailboxUserModule],
  exports: [TypeOrmModule, MailboxService],
  controllers: [MailboxController],
  providers: [MailboxService, Logger],
})
export class MailboxModule {}
