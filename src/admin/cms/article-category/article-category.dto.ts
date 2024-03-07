import {Allow, IsArray, IsNotEmpty} from 'class-validator'

export class CreateArticleCategoryDto {
  @IsNotEmpty({
    message: '请输入栏目名称',
  })
  name: string

  @Allow()
  parent_id: string | null

  @Allow()
  title: string

  @Allow()
  alias: string

  @Allow()
  introduction: string

  @Allow()
  picture: string[]

  @Allow()
  content: string

  @Allow()
  disabled: boolean

  @Allow()
  sort: number
}

export class ModifyArticleCategoryDto extends CreateArticleCategoryDto {
  @IsNotEmpty({
    message: '栏目id不能为空',
  })
  id: string
}

export interface SortArticleCategoryTree {
  id: number
  children: SortArticleCategoryTree[]
}

export class SortArticleCategoryDto {
  @IsNotEmpty({
    message: '栏目分类不能为空',
  })
  category: SortArticleCategoryTree[]
}

export class DeleteArticleCategoryDto {
  @IsArray({
    message: 'ids必须为数组格式',
  })
  ids: string[]
}
