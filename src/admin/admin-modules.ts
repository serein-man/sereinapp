import {FileModule} from './file/file.module'
import {SiteAdminModule} from './site-admin/site-admin.module'
import {OperationLogModule} from './auth/operation-log/operation-log.module'
import {ArticleCategoryModule} from './cms/article-category/article-category.module'
import {ArticleModule} from './cms/article/article.module'
import {LabelAdModule} from './cms/label-ad/label-ad.module'
import {MailboxModule} from './mailbox/mailbox/mailbox.module'
import {MailboxUserModule} from './mailbox/mailbox-user/mailbox-user.module'
import {MailboxConfigModule} from './mailbox/mailbox-config/mailbox-config.module'

export const AdminModules = [
  FileModule,
  SiteAdminModule,
  OperationLogModule,
  // cms
  ArticleCategoryModule,
  ArticleModule,
  LabelAdModule,
  // mailbox
  MailboxModule,
  MailboxUserModule,
  MailboxConfigModule,
]
