import {Logger, Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {SiteAdminController} from './site-admin.controller'
import {SiteAdminService} from './site-admin.service'
import {SiteAdminEntity} from '../../entity/site-admin.entity'
import {OperationLogModule} from '../auth/operation-log/operation-log.module'
import {RoleGuard} from '../auth/role/role.guard'
import {JwtModule, JwtService} from '@nestjs/jwt'
import {SecretLocalLoginStrategy} from '../auth/secret/secret-local-login.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([SiteAdminEntity]), OperationLogModule, JwtModule],
  exports: [TypeOrmModule, SiteAdminService],
  controllers: [SiteAdminController],
  providers: [SecretLocalLoginStrategy, SiteAdminService, JwtService, Logger, RoleGuard],
})
export class SiteAdminModule {}
