import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {DataSource} from 'typeorm'
import {ConfigModule} from '@nestjs/config'
import {ConfigService} from './config/service'
import {RedisModule} from '@nestjs-modules/ioredis'
import {PassportModule} from '@nestjs/passport'
import {AdminModules} from './admin/admin-modules'
import {MailboxModules} from './mailbox/mailbox-modules'
import {SecretJwtTokenStrategy as AdminSecretJwtStrategy} from './admin/auth/secret/secret-jwt-token.strategy'
import {SecretJwtStrategy as MailboxSecretJwtStrategy} from './mailbox/auth/secret/secret-jwt.strategy'
import {NestjsFormDataModule} from 'nestjs-form-data'

@Module({
  imports: [
    //导入typeOrm数据库模型
    TypeOrmModule.forRoot(ConfigService.orm),
    //导入配置文件
    ConfigModule.forRoot({
      load: [() => ConfigService],
    }),
    //导入isRedis
    RedisModule.forRoot({
      config: ConfigService.redis,
    }),
    // 用于处理多部分/表单数据，主要用于上传文件
    NestjsFormDataModule.config({
      isGlobal: true,
      fileSystemStoragePath: ConfigService.file.tempPath,
      limits: {
        fileSize: ConfigService.file.maxSize,
      },
      autoDeleteFile: true,
    }),
    //导入权限认证
    PassportModule,
    // 导入业务模型
    ...AdminModules,
    ...MailboxModules,
  ],
  controllers: [],
  providers: [
    // admin 登录/鉴权策略jwt
    AdminSecretJwtStrategy,
    // mailbox 鉴权策略jwt
    MailboxSecretJwtStrategy,
    // 供生命周期之外使用日志
    Logger,
  ],
})
export class AppModule {
  constructor(private readonly connection: DataSource) {}
}
