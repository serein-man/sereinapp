import {Injectable} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class SecretRefreshJwtGuard extends AuthGuard('ADMIN_REFRESH_JWT') {}
