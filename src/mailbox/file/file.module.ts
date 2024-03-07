import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {FileService} from './file.service'
import {FileController} from './file.controller'
import {FileEntity} from '../../entity/file.entity'
import {OssService} from './oss.service'
import {JwtService} from '@nestjs/jwt'
import {BaseFileService} from '../../common/service/file/base-file.service'
import {BaseOssService} from '../../common/service/file/base-oss.service'

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  exports: [TypeOrmModule, FileService, OssService],
  controllers: [FileController],
  providers: [JwtService, FileService, OssService, BaseFileService, BaseOssService, Logger],
})
export class FileModule {}
