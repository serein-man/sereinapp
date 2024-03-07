import {Injectable} from '@nestjs/common'
import {BaseFileService} from '../../common/service/file/base-file.service'

@Injectable()
export class FileService extends BaseFileService {}
