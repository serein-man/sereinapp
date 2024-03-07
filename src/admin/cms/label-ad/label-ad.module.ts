import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {LabelAdService} from './label-ad.service'
import {CmsLabelAdEntity} from '../../../entity/cms/cms-label-ad.entity'
import {LabelAdController} from './label-ad.controller'
import {RoleGuard} from '../../auth/role/role.guard'
import {FileModule} from '../../file/file.module'

@Module({
  imports: [TypeOrmModule.forFeature([CmsLabelAdEntity]), FileModule],
  exports: [TypeOrmModule, LabelAdService],
  controllers: [LabelAdController],
  providers: [LabelAdService, Logger, RoleGuard],
})
export class LabelAdModule {}
