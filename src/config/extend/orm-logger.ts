import {Logger as TypeOrmLogger} from 'typeorm/logger/Logger'
import {QueryRunner} from 'typeorm'
import {Logger} from '@nestjs/common'

type OrmLoggerLevel = 'log' | 'info' | 'warn' | 'error' | 'migration' | 'query' | 'query slow' | 'schema build'

export default class OrmLogger implements TypeOrmLogger {
  level: OrmLoggerLevel[] = []

  constructor(level: OrmLoggerLevel[]) {
    this.level = level
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
    if (this.level.includes(level)) {
      Logger.log(
        {
          level,
          message,
          queryRunner,
        },
        'DataBase',
      )
    }
  }

  logMigration(message: string, queryRunner?: QueryRunner): any {
    if (this.level.includes('migration')) {
      Logger.log(
        {
          level: 'migration',
          message,
          queryRunner,
        },
        'DataBase',
      )
    }
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (this.level.includes('query')) {
      Logger.log(
        {
          level: 'query',
          query,
          queryRunner,
        },
        'DataBase',
      )
    }
  }

  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (this.level.includes('error')) {
      Logger.error(
        {
          level: 'query error',
          query,
          parameters,
          queryRunner,
        },
        'DataBase',
      )
    }
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    if (this.level.includes('query slow')) {
      Logger.log(
        {
          level: 'query slow',
          time,
          query,
          parameters,
          queryRunner,
        },
        'DataBase',
      )
    }
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    if (this.level.includes('schema build')) {
      Logger.log(
        {
          level: 'schema build',
          message,
          queryRunner,
        },
        'DataBase',
      )
    }
  }
}
