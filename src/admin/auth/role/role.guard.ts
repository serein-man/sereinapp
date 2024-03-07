import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common'
import {RolesEnum} from './role.enum'
import {SiteAdminEntity} from '../../../entity/site-admin.entity'
import {Reflector} from '@nestjs/core'
import {Role_KEY} from './role.decorator'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // 当前权限：user只能GET请求
  // 遇到未授权优先分析是否装饰器的顺序写错了（装饰器的执行顺序为：首先执行属性装饰器，然后执行方法装饰器，其次是方法参数装饰器，最后是类装饰器。如果同一个类型的装饰器有多个，总是先执行后面的装饰器）
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    if (method === 'GET') return true

    const user = new SiteAdminEntity(request.user)
    if (user.role === RolesEnum.Root) return true

    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(Role_KEY, [context.getHandler(), context.getClass()])
    if (requiredRoles && requiredRoles.some((role) => user.role === role)) return true

    throw new ForbiddenException('未授权')
  }
}
