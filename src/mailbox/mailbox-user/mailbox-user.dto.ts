import {IsNotEmpty, MinLength} from 'class-validator'

export class WeixinLoginDto {
  @IsNotEmpty({
    message: 'code不能为空',
  })
  code: string
}

export class ModifyPasswordDto {
  @IsNotEmpty({
    message: '旧密码不能为空',
  })
  old_password: string

  @IsNotEmpty({
    message: '新密码不能为空',
  })
  @MinLength(6)
  new_password: string
}

export class ModifyUserProfileDto {
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  name: string

  @IsNotEmpty({
    message: '头像不能为空',
  })
  avatar: string
}
