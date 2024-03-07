import {SetMetadata} from '@nestjs/common'
import {RolesEnum} from './role.enum'

export const Role_KEY = 'ADMIN_USER_ROLES'

export const Roles = (...roles: RolesEnum[]) => {
  return SetMetadata(Role_KEY, roles)
}
