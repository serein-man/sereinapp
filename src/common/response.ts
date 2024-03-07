import * as dayjs from 'dayjs'

export interface HttpResponse<T = any> {
  data?: T
  code?: number
  message?: string
  _: number // 服务器时间戳(s)
}

/**
 * 自定义http响应数据格式
 * @param data
 * @param {number} code
 * @param {string} message
 * @returns {HttpResponse}
 */
export function httpResponse<T extends any>(
  data: T = null,
  code = 200,
  message: string = '',
): HttpResponse<T> | Promise<HttpResponse<T>> {
  const build = (data: T, code: number, message?: string): HttpResponse<T> => ({
    data,
    code,
    message: message || code === 200 ? 'ok' : 'fail',
    _: dayjs().unix(),
  })

  const isPromise = Object.prototype.toString.call(data) === '[object Promise]'
  if (isPromise) {
    return (data as Promise<any>).then((resolve) => {
      return build(resolve, code, message)
    })
  }
  return build(data, code, message)
}
