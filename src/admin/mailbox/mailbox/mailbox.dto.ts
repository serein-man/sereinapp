import {Allow} from 'class-validator'
import {PageDto} from '../../../common/common.dto'

export class PageMailboxDto extends PageDto {
  @Allow()
  title: string

  @Allow()
  date: Date
}
