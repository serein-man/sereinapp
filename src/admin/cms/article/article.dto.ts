import {Allow, IsArray, IsNotEmpty} from 'class-validator'
import {PageDto} from '../../../common/common.dto'

export class PageArticleDto extends PageDto {
  @Allow()
  article_category_id: string

  @Allow()
  keywords: string

  @Allow()
  start_time: string

  @Allow()
  end_time: string

  @Allow()
  filter: string[]
}

export class CreateArticleDto {
  @IsNotEmpty({
    message: '请输入文章标题',
  })
  title: string

  @IsNotEmpty({
    message: '请选择文章所属栏目',
  })
  article_category_id: string

  @Allow()
  sub: string

  @Allow()
  introduction: string

  @Allow()
  picture: string[]

  @Allow()
  content: string

  @Allow()
  tag: string[]

  @Allow()
  author: string

  @Allow()
  views: number

  @Allow()
  publish: boolean

  @Allow()
  is_top: boolean

  @Allow()
  publish_at: Date
}

export class ModifyArticleDto extends CreateArticleDto {
  @IsNotEmpty({
    message: '文章id不能为空',
  })
  id: string

  @IsNotEmpty({
    message: '栏目id不能为空',
  })
  article_category_id: string
}

export class MoveArticleDto {
  @IsNotEmpty({
    message: '文章id不能为空',
  })
  ids: string[]

  @IsNotEmpty({
    message: '栏目id不能为空',
  })
  article_category_id: string
}

export class DeleteArticleDto {
  @IsArray({
    message: 'ids必须为数组格式',
  })
  ids: string[]
}
