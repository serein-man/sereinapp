/**
 * 判断用户是否VIP
 * @param userId 用户id
 * @param {string | Date} expireTime 过期时间
 * @return {Boolean} True:过期  False:未过期
 */
export function isVip(userId: string, expireTime: string | Date): boolean {
  if (!userId) return false
  const dayjs = require('dayjs')
  return dayjs().unix() > dayjs(expireTime).unix()
}
