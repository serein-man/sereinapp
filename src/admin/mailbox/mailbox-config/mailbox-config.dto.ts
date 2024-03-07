import {Allow, IsNotEmpty} from 'class-validator'
import {PageDto} from '../../../common/common.dto'

export class PageMailboxConfigDto extends PageDto {
  @Allow()
  name: string
}

export class CreateMailboxConfigDto {
  @IsNotEmpty({
    message: '名称不能为空',
  })
  name: string

  @IsNotEmpty({
    message: '值不能为空',
  })
  value: string
}

export class ModifyMailboxConfigDto extends CreateMailboxConfigDto {
  @IsNotEmpty({
    message: '配置id不能为空',
  })
  id: string
}
