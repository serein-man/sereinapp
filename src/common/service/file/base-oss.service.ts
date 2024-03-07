import OSS, * as OSSClient from 'ali-oss'
import {BadRequestException, GoneException, Injectable} from '@nestjs/common'
import {ConfigService} from '../../../config/service'

@Injectable()
export class BaseOssService {
  protected options: OSS.Options = {
    accessKeyId: ConfigService.ossOfAliyun.accessKeyId,
    accessKeySecret: ConfigService.ossOfAliyun.accessKeySecret,
    region: ConfigService.ossOfAliyun.region,
    bucket: '',
    secure: true,
  }

  constructor() {}

  // 上传文件到oss 并返回  图片oss 地址
  public async putOssFile(params: {fileBuffer: Buffer; bucket: string; ossPath: string}): Promise<string> {
    const {bucket, ossPath, fileBuffer} = params
    if (!bucket || !ossPath || !fileBuffer) throw new BadRequestException('文件存储参数有误')
    this.options.bucket = bucket
    const client = new OSSClient(this.options)
    const res = await client.put(ossPath, fileBuffer).catch((error) => {
      throw new BadRequestException(error)
    })
    return res.url
  }

  // 获取文件URL地址
  public async getFileSignatureUrl(params: {bucket: string; filePath: string}): Promise<string> {
    const {bucket, filePath} = params
    if (!bucket || !filePath) throw new BadRequestException('文件存储参数有误')
    this.options.bucket = bucket
    const client = new OSSClient(this.options)
    let result = ''
    try {
      result = client.signatureUrl(filePath, {expires: 36000})
    } catch (error) {
      throw new GoneException(error)
    }
    return result
  }
}
