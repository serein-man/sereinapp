import {TypeOrmModuleOptions} from '@nestjs/typeorm'
import OrmLogger from './extend/orm-logger'
import * as dayjs from 'dayjs'
import {RedisOptions} from 'ioredis'

export default {
  // 当前环境模式
  mode: 'production',
  // 系统日志等级 小于或等于此级别时才记录 error（code>=500） warn (code>=400) info (所有) 详见any-exception.filter.ts
  loggerLevel: 'warn',
  // typeOrm数据库配置
  orm: <TypeOrmModuleOptions>{
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: '',
    password: '',
    database: '',
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../**/*.migrations.{ts,js}'],
    subscribers: [__dirname + '/../**/*.subscribers.{ts,js}'],
    logging: true,
    // 自定义数据库日志
    logger: new OrmLogger(['warn', 'error']),
    timezone: '+08:00',
    maxQueryExecutionTime: 10 * 1000,
    synchronize: false, // 同步表 ！！！正式环境必须关闭
  },
  // token
  jwt: {
    secret: 'HelloWordJWT',
    // token过期时间
    expiresIn: '7 days',
    // token过期自定义刷新时间（！必须小于真实token过期时间）
    expiresInRefresh: () => dayjs().add(1, 'day').unix(),
  },
  // session
  session: {
    secret: 'HelloWordSession',
  },
  // redis config
  redis: <RedisOptions>{
    retryStrategy() {
      return null
    },
  },
  // 储存文件
  file: {
    path: `public/uploads/`,
    tempPath: `public/temp/`,
    maxSize: 5 * 1024 * 1024, // 全局文件最大限制5M
  },
  // 路由前缀
  globalPrefix: '',
  // 高德地址
  gaode: {
    webJSKey: '', // 服务平台 webapi->web服务
  },
  // 阿里云OSS配置
  ossOfAliyun: {
    accessKeyId: '',
    accessKeySecret: '',
    region: '', // 西南1（成都）-数据中心所在的地域
  },
  // 微信小程序配置-时光满地信箱小程序
  miniprogramConfigOfMailbox: {
    originId: '',
    appid: '',
    secret: '',
  },
}
