import {IsEnum} from 'class-validator'
import {FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile} from 'nestjs-form-data'

export enum FilePathTypeEnum {
  MailboxAvatar = 'MailboxAvatar',
  MailboxImg = 'MailboxImg',
}

export enum FilePathTypeValueEnum {
  MailboxAvatar = '/mailbox/avatar',
  MailboxImg = '/mailbox/picture/[id]',
}

// 文件数据在磁盘
export class FileInDiskDto {
  @IsFile({
    message: '请上传文件',
  })
  @MaxFileSize(2 * 1024 * 1024, {
    message: '超出文件大小限制2M',
  })
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png'], {
    message: '不支持的文件格式',
  })
  file: FileSystemStoredFile

  @IsEnum(FilePathTypeEnum, {
    message: '文件存储路径类型不存在',
  })
  pathType: FilePathTypeEnum
}

// 文件数据在内存中
export class FileInMemoryDto {
  @IsFile({
    message: '请上传文件',
  })
  @MaxFileSize(2 * 1024 * 1024, {
    message: '超出文件大小限制2M',
  })
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png'], {
    message: '不支持的文件格式',
  })
  file: MemoryStoredFile

  @IsEnum(FilePathTypeEnum, {
    message: '文件存储路径类型不存在',
  })
  pathType: FilePathTypeEnum
}
