import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {OperationLogEntity} from '../../../entity/operation-log.entity'
import {OperationLogService} from './operation-log.service'
import {OperationLogController} from './operation-log.controller'
import {RoleGuard} from '../role/role.guard'
import {HttpModule} from '@nestjs/axios'

@Module({
  imports: [TypeOrmModule.forFeature([OperationLogEntity]), HttpModule],
  exports: [TypeOrmModule, OperationLogService],
  controllers: [OperationLogController],
  providers: [OperationLogService, Logger, RoleGuard],
})
export class OperationLogModule {}
