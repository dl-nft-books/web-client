import packageJson from '../package.json'
import { LogLevelDesc } from 'loglevel'
import { pickBy, mapKeys } from 'lodash-es'

export const config = {
  FACEBOOK_LINK: import.meta.env.VITE_APP_FACEBOOK_LINK,
  YOUTUBE_LINK: import.meta.env.VITE_APP_YOUTUBE_LINK,
  LINKEDIN_LINK: import.meta.env.VITE_APP_LINKEDIN_LINK,
  FAQ_LINK: import.meta.env.VITE_APP_FAQ_LINK,
  HELP_LINK: import.meta.env.VITE_APP_HELP_LINK,
  BLOG_LINK: import.meta.env.VITE_APP_BLOG_LINK,
  DOCS_LINK: import.meta.env.VITE_APP_DOCS_LINK,
  INSTAGRAM_LINK: import.meta.env.VITE_APP_INSTAGRAM_LINK,
  DEPLOY_ENVIRONMENT: import.meta.env.VITE_APP_DEPLOY_ENVIRONMENT,
  API_URL: import.meta.env.VITE_APP_API_URL,
  APP_NAME: import.meta.env.VITE_APP_APP_NAME,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  BUILD_VERSION: packageJson.version || import.meta.env.VITE_APP_BUILD_VERSION,
  DEFAULT_PAGE_LIMIT: 15,
  TECHNICAL_STATE: import.meta.env.VITE_APP_TECHNICAL_STATE,
  DEFAULT_RPC_URL: import.meta.env.VITE_APP_DEFAULT_RPC_URL,
  DEFAULT_CHAIN_ID: import.meta.env.VITE_APP_DEFAULT_CHAIN_ID,
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
