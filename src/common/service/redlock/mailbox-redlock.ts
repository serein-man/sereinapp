import Redis from 'ioredis'
import {ConfigService} from '../../../config/service'
import Redlock from 'redlock'

const redisRedLockClient = new Redis(ConfigService.redis)

/**
 * @see https://github.com/mike-marcacci/node-redlock#usage
 */
const mailboxRedLock = new Redlock([redisRedLockClient])

export {mailboxRedLock}
