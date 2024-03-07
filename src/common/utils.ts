import {readFileSync} from 'fs'
import {join} from 'path'
import {BadRequestException} from '@nestjs/common'

/**
 * RSA加密
 */
export function encryptionRsa(data: string, keyPath = './public.pem') {
  let crypto
  try {
    crypto = require('node:crypto')
  } catch (err) {
    throw new BadRequestException('crypto support is disabled!')
  }
  const publicKey = readFileSync(join(__dirname, keyPath))
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64')
}

/**
 * RSA解密
 */
export function decryptRsa(data: string, keyPath = './private.pem') {
  let crypto
  try {
    crypto = require('node:crypto')
  } catch (err) {
    throw new BadRequestException('crypto support is disabled!')
  }
  const privateKey = readFileSync(join(__dirname, keyPath))
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(data, 'base64'),
    )
    .toString()
}

/**
 * 是否过期
 * @param {string | Date} expireTime 过期时间
 * @return {Boolean} True:过期  False:未过期
 */
export function isExpire(expireTime: string | Date): boolean {
  const dayjs = require('dayjs')
  return dayjs().unix() > dayjs(expireTime).unix()
}
