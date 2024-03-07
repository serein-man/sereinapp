import {MailboxUserModule} from './mailbox-user/mailbox-user.module'
import {FileModule} from './file/file.module'
import {MailboxModule} from './mailbox/mailbox.module'
import {MailboxConfigModule} from './mailbox-config/mailbox-config.module'

export const MailboxModules = [FileModule, MailboxUserModule, MailboxConfigModule, MailboxModule]
