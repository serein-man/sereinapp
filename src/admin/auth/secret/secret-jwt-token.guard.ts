import {Injectable} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class SecretJwtTokenGuard extends AuthGuard('ADMIN_JWT_TOKEN') {}
