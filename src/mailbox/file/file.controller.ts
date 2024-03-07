import {Body, Controller, Post, UseGuards} from '@nestjs/common'
import {FileService} from './file.service'
import {ConfigService} from '../../config/service'
import {FileEntity, FileSaveTypeEnum} from '../../entity/file.entity'
import {httpResponse} from '../../common/response'
import {OssService} from './oss.service'
import {FileInDiskDto, FileInMemoryDto, FilePathTypeEnum, FilePathTypeValueEnum} from './file.dto'
import {OSS_DOMAIN, OssBucketEnum} from '../../config/enum'
import {SecretJwtAuthGuard} from '../auth/secret/secret-jwt-auth.guard'
import {splicingPath, splicingUrl} from '@sky-serein/js-utils'
import {User} from '../extend/user.decorator'
import {JwtPayLoad} from '../auth/secret/secret-jwt.strategy'
import {FileSystemStoredFile, FormDataRequest, MemoryStoredFile} from 'nestjs-form-data'
import fs from 'fs'

@UseGuards(SecretJwtAuthGuard)
@Controller('mailbox/file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly ossService: OssService,
  ) {}

  // 上传单个文件FormData
  @FormDataRequest({
    storage: FileSystemStoredFile,
  })
  @Post('upload')
  async uploadFile(@Body() dto: FileInDiskDto, @User() payLoad: JwtPayLoad) {
    const {file, pathType} = dto
    let newPathType: string = FilePathTypeValueEnum[pathType]
    const newFileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + file.extension
    // 动态构建存储路径
    if (pathType === FilePathTypeEnum.MailboxImg) newPathType = FilePathTypeValueEnum.MailboxImg.replace('[id]', payLoad.id)
    // 拼接磁盘存储地址
    const localPath = splicingPath(ConfigService.file.path, newPathType)
    const localUrl = splicingPath(localPath, newFileName)
    // 保存文件到磁盘
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, {recursive: true})
    }
    const data = fs.readFileSync(file.path)
    fs.writeFileSync(localUrl, data)
    // 数据库记录文件
    const fileEntity: FileEntity = new FileEntity({
      name: newFileName,
      origin: file.originalName,
      size: file.size,
      local_url: localUrl,
    })
    const result = await this.fileService.create(fileEntity)
    return httpResponse({
      id: result.id,
      name: result.name,
      origin: result.origin,
      url: result.local_url,
    })
  }

  // 上传单个文件-在阿里云OSS上
  @FormDataRequest({
    storage: MemoryStoredFile,
  })
  @Post('upload-oss')
  async uploadFileByOssInAliyun(@Body() dto: FileInMemoryDto, @User() payLoad: JwtPayLoad) {
    const {file, pathType} = dto
    let newPathType: string = FilePathTypeValueEnum[pathType]
    const newFileName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + file.extension
    // 动态构建存储路径
    if (pathType === FilePathTypeEnum.MailboxImg) newPathType = FilePathTypeValueEnum.MailboxImg.replace('[id]', payLoad.id)
    // 拼接oss存储地址
    const ossPath = splicingPath(newPathType, newFileName)
    // 存储桶
    const ossBucket = OssBucketEnum.OpenResourcesFiles
    // 上传文件
    const ossUrl = await this.ossService.putOssFile({
      fileBuffer: file.buffer,
      bucket: ossBucket,
      ossPath: ossPath,
    })
    // 数据库记录文件
    const fileEntity: FileEntity = new FileEntity({
      name: newFileName,
      origin: file.originalName,
      size: file.size,
      type: FileSaveTypeEnum.Aliyun,
      bucket: ossBucket,
      oss_url: ossUrl,
      oss_url_custom: splicingUrl(OSS_DOMAIN[ossBucket], ossPath),
    })
    const result = await this.fileService.create(fileEntity)
    return httpResponse({
      id: result.id,
      name: result.name,
      origin: result.origin,
      url: result.oss_url_custom || result.oss_url,
    })
  }
}
