import {Allow, IsArray, IsNotEmpty} from 'class-validator'

export class CreateLabelAdDto {
  @IsNotEmpty({
    message: '请输入标签标题',
  })
  title: string

  @Allow()
  introduction: string

  @Allow()
  picture: string[]

  @Allow()
  publish: boolean

  @Allow()
  is_top: boolean

  @Allow()
  publish_at: Date
}

export class ModifyLabelAdDto extends CreateLabelAdDto {
  @IsNotEmpty({
    message: '标签id不能为空',
  })
  id: string
}

export class DeleteLabelDto {
  @IsArray({
    message: 'ids必须为数组格式',
  })
  ids: string[]
}
