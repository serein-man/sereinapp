import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {FileService} from './file.service'
import {FileController} from './file.controller'
import {FileEntity} from '../../entity/file.entity'
import {OssService} from './oss.service'
import {RoleGuard} from '../auth/role/role.guard'

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  exports: [TypeOrmModule, FileService],
  controllers: [FileController],
  providers: [FileService, OssService, Logger, RoleGuard],
})
export class FileModule {}
