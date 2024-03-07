import {IsNotEmpty} from 'class-validator'

export class GetMailboxConfigDto {
  @IsNotEmpty({
    message: '缺少配置参数name',
  })
  name: string
}
