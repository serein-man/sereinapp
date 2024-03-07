import {IsNotEmpty, MinLength} from 'class-validator'

export class ModifyPasswordDto {
  @IsNotEmpty({
    message: '旧密码不能为空',
  })
  old_password: string

  @IsNotEmpty({
    message: '新密码不能为空',
  })
  @MinLength(6, {
    message: '密码长度不能小于6位',
  })
  new_password: string
}
