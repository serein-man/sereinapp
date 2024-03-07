import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {AllExceptionsFilter} from './common/any-exception.filter'
import {utilities as nestWinstonModuleUtilities, WinstonModule} from 'nest-winston'
import * as winston from 'winston'
import {format} from 'winston'
import 'winston-daily-rotate-file'
import {join} from 'path'
import {ConfigService} from './config/service'
import {BadRequestException, ValidationPipe} from '@nestjs/common'

// 创建日志记录
const logger = (() => {
  const transports: winston.transport[] = [
    new winston.transports.DailyRotateFile({
      level: ConfigService.loggerLevel,
      filename: join(__dirname, '..', 'logs', `%DATE%.log`),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '15d',
    }),
  ]
  // 开发环境打印错误到控制台
  if (ConfigService.isDev) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
      }),
    )
  }
  return WinstonModule.createLogger({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({stack: true}),
      format.splat(),
      format.json(),
    ),
    transports: transports,
  })
})()

const validation = (() => {
  return new ValidationPipe({
    transform: true,
    stopAtFirstError: true,
    whitelist: true,
    validationError: {
      target: true,
      value: true,
    },
    exceptionFactory: (errors) => {
      const res = errors.reduce<string[]>((result, currentValue) => {
        result.push(...Object.values(currentValue.constraints))
        return result
      }, [])
      return new BadRequestException(res[0])
    },
  })
})()

async function bootstrap() {
  // 注册APP
  const app = await NestFactory.create(AppModule, {
    logger,
  })
  // 全局路由前缀
  ConfigService.globalPrefix && app.setGlobalPrefix(ConfigService.globalPrefix)
  // 全局注册错误的过滤器
  app.useGlobalFilters(new AllExceptionsFilter())
  // 自动验证
  app.useGlobalPipes(validation)

  await app.listen(3000, '0.0.0.0')
}

bootstrap()
