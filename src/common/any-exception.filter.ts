import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const code = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception?.getResponse?.()?.message ?? exception.message ?? 'Unknown Error'

    // 组装日志信息
    const logFormat = {
      url: request.originalUrl,
      method: request.method,
      ip: request.ip,
      code: code,
      message: message,
      params: request.params,
      query: request.query,
      body: request.body,
      user: request.user,
      meta: request.meta,
    }
    if (code >= 500) {
      Logger.error(logFormat)
    } else if (code >= 400) {
      Logger.warn(logFormat)
    } else {
      Logger.log(logFormat)
    }

    // 重新定义错误输出格式
    const errorResponse = {
      data: null,
      message: code >= 500 ? '服务器错误，请稍后重试' : message,
      code,
    }

    // 设置返回的状态码、请求头、发送错误信息
    response.status(code)
    response.header('Content-Type', 'application/json; charset=utf-8')
    response.send(errorResponse)
  }
}
