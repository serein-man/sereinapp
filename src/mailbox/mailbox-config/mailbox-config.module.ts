import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {MailboxConfigService} from './mailbox-config.service'
import {MailboxConfigController} from './mailbox-config.controller'
import {MailboxConfigEntity} from '../../entity/mailbox/mailbox-config.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MailboxConfigEntity])],
  exports: [TypeOrmModule, MailboxConfigService],
  controllers: [MailboxConfigController],
  providers: [MailboxConfigService],
})
export class MailboxConfigModule {}
