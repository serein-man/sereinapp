export enum RolesEnum {
  // 只能看
  Guest = 'guest',
  // 普通管理员
  Admin = 'admin',
  // 最高权限
  Root = 'root',
}

export const omitRole = (value: RolesEnum) => Object.values(RolesEnum).filter((v) => v !== value)
