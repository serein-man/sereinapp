import {Transform} from 'class-transformer'

export class PageDto {
  @Transform((params) => Number(params.value))
  page_size: string

  @Transform((params) => Number(params.value))
  page_index: string
}
