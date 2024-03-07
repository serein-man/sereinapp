import IORedis from 'ioredis'
import {ConfigService} from '../../config/service'

const redisClient = new IORedis(ConfigService.redis)

const key = (id: string) => `SITE_ADMIN_TOKEN_${id}` // id必须唯一

const userSiteAdminTokenState = {
  get: (id: string) => {
    return redisClient.get(key(id))
  },
  set: (id: string, token, seconds?: number) => {
    if (!seconds) {
      return redisClient.set(key(id), token)
    }
    return redisClient.set(key(id), token, 'EX', seconds)
  },
  clear: (id: string) => {
    redisClient.del(key(id))
  },
}

export default userSiteAdminTokenState
