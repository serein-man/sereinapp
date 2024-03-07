import {Injectable} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class SecretJwtAuthGuard extends AuthGuard('MAILBOX_JWT') {}
