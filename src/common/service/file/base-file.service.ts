import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {FileEntity} from '../../../entity/file.entity'

@Injectable()
export class BaseFileService {
  constructor(
    @InjectRepository(FileEntity)
    protected repository: Repository<FileEntity>,
  ) {}

  create(dto: FileEntity) {
    const fileEntity = this.repository.create(dto)
    return this.repository.save(fileEntity)
  }

  findOne(id: string) {
    return this.repository.findOne({where: {id}})
  }

  async fileToUrl(id: string = '', urlField = 'relation_path'): Promise<{id: string; url: string} | null> {
    if (!id) return null
    const fileEntity = await this.findOne(id)
    if (fileEntity?.[urlField]) {
      return {
        id: fileEntity.id,
        url: fileEntity[urlField],
      }
    }
    return null
  }

  async fileToUrlArray(ids: string | string[] = '', urlField = 'relation_path'): Promise<{id: string; url: string}[]> {
    if (!ids) return []
    const idsArr = (typeof ids === 'string' ? ids?.split(',') : ids).filter((v) => !!v)
    const resArr = []
    for (const id of idsArr) {
      const fileEntity = await this.findOne(id)
      if (fileEntity?.[urlField]) {
        resArr.push({
          id: fileEntity.id,
          url: fileEntity[urlField],
        })
      }
    }
    return resArr
  }

  delete(idsStr: string | string[], physics?: boolean) {
    if (!idsStr) return
    const ids = typeof idsStr === 'string' ? idsStr.split(',') : idsStr
    if (!ids.length) return
    if (physics) {
      return this.repository.delete(ids)
    }
    return this.repository.softDelete(ids)
  }
}
