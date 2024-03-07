import {GoneException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CmsLabelAdEntity} from '../../../entity/cms/cms-label-ad.entity'
import {FileService} from '../../file/file.service'
import {CreateLabelAdDto, ModifyLabelAdDto} from './label-ad.dto'

@Injectable()
export class LabelAdService {
  constructor(
    @InjectRepository(CmsLabelAdEntity)
    private repository: Repository<CmsLabelAdEntity>,
    private fileService: FileService,
  ) {}

  async findAll() {
    const labelAdEntity = await this.repository.find()
    const outputLabelAdEntity = []
    for (const item of labelAdEntity) {
      outputLabelAdEntity.push({
        ...item,
        picture: await this.fileService.fileToUrlArray(item.picture),
      })
    }
    return outputLabelAdEntity
  }

  async delete(ids: string[], physics?: boolean) {
    for (const id of ids) {
      const labelAdEntity = await this.repository.findOne({where: {id}})
      if (!labelAdEntity) throw new GoneException('不存在的标签')
      await this.fileService.delete(labelAdEntity.picture, physics)
    }

    if (physics) {
      return this.repository.delete(ids)
    }
    return this.repository.softDelete(ids)
  }

  async create(dto: CreateLabelAdDto) {
    const labelAdEntity = new CmsLabelAdEntity({
      ...dto,
      ...{
        picture: dto.picture?.join(',') || null,
      },
    })
    return this.repository.save(labelAdEntity)
  }

  async modify(dto: ModifyLabelAdDto) {
    const labelAdEntity = await this.repository.findOne({where: {id: dto.id}})
    if (!labelAdEntity) throw new GoneException('不存在的标签')
    const modifyLabelAdEntity = new CmsLabelAdEntity({
      ...dto,
      picture: dto.picture?.join(',') || null,
    })
    return await this.repository.save(modifyLabelAdEntity)
  }
}
