import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MailboxEntity} from '../../../entity/mailbox/mailbox.entity'
import {MailboxService} from './mailbox.service'
import {MailboxController} from './mailbox.controller'

@Module({
  imports: [TypeOrmModule.forFeature([MailboxEntity])],
  exports: [TypeOrmModule, MailboxService],
  controllers: [MailboxController],
  providers: [MailboxService, Logger],
})
export class MailboxModule {}
