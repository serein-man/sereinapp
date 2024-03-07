import {Injectable} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class SecretLocalLoginGuard extends AuthGuard('ADMIN_PASSWORD_LOGIN') {}
