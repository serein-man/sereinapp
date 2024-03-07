import {Allow, IsNotEmpty, MaxLength} from 'class-validator'
import {PageDto} from '../../common/common.dto'

export class PageMailboxDto extends PageDto {}

export class PutMailboxDto {
  @Allow()
  id?: string

  @IsNotEmpty({
    message: '请输入标题',
  })
  title: string

  @Allow()
  content?: string

  @MaxLength(200, {
    message: '打开信件前的展示内容不得超过200字',
  })
  desc: string

  @Allow()
  picture?: string[]

  @IsNotEmpty({
    message: '请选择信件打开时间',
  })
  publish_at: Date

  @Allow()
  password?: string

  @Allow()
  is_group: boolean
}

export class OpenMailboxDto {
  @IsNotEmpty({
    message: '缺少参数Id',
  })
  id: string

  @Allow()
  password: string
}

export class InspectionMailboxDto {
  @IsNotEmpty({
    message: '缺少参数Id',
  })
  id: string
}

export class GetMailboxDetailDto {
  @IsNotEmpty({
    message: '缺少参数Id',
  })
  id: string
}

export class DeleteMailboxDetailDto {
  @IsNotEmpty({
    message: '缺少参数Id',
  })
  id: string
}
