export type MailboxDetailRes = {
  id: string
  title: string
  desc: string
  content: string
  publish_at: Date
  password: string
  is_group: boolean
  picture: {id: string; url: string}[]
  creator: {
    id: string
    avatar: string
    name: string
  }
  users?: {
    id: string
    avatar: string
    name: string
  }[]
}

export type MailboxListItemRes = {
  id: string
  title: string
  publish_at: Date
  is_group: boolean
  is_password: boolean
  open_count?: number
  create_time: Date
}

export interface InspectionMailboxRes {
  publish_at?: Date
  is_password: boolean
  desc?: string
  title?: string
  creator?: {
    id: string
    avatar: string
    name: string
  }
}
