import developmentEnv from './development'
import productionEnv from './production'

const nodeEnv = process.env.NODE_ENV

const nodeEnvEnum = {
  development: developmentEnv,
  production: productionEnv,
}

const curConfig: typeof developmentEnv = nodeEnvEnum[nodeEnv.toLocaleLowerCase()]

export const ConfigService = {
  ...curConfig,
  ...{
    isDev: curConfig.mode === 'development',
  },
}
