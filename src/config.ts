import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash-es'

export const config = {
  FACEBOOK_LINK: 'https://www.facebook.com/distributedlab/',
  YOUTUBE_LINK: 'https://www.youtube.com/channel/UCAKVZKVgINgKAwmAeyojMaw',
  LINKEDIN_LINK: 'https://www.linkedin.com/company/distributed-lab/',
  FAQ_LINK:
    'https://docs.google.com/document/d/1VWZIgsHpwHpuKBSn8QFXuh4fjBlJI9ovrPTmrFtdjZw/edit?usp=drivesdk',
  HELP_LINK: 'https://t.me/+j3M-yIjRmv1lYWEy',
  BLOG_LINK: 'https://distributedlab.com/blog',
  DEPLOY_ENVIRONMENT: import.meta.env.VITE_APP_DEPLOY_ENVIRONMENT,
  API_URL: import.meta.env.VITE_APP_API_URL,
  APP_NAME: import.meta.env.VITE_APP_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  DEFAULT_PAGE_LIMIT: 15,
} as const

Object.assign(config, _mapEnvCfg(import.meta.env))
Object.assign(config, _mapEnvCfg(document.ENV))

function _mapEnvCfg(env: ImportMetaEnv | typeof document.ENV): {
  [k: string]: string | boolean | undefined
} {
  return mapKeys(
    pickBy(env, (v, k) => k.startsWith('VITE_APP_')),
    (v, k) => k.replace(/^VITE_APP_/, ''),
  )
}
