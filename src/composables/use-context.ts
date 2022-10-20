import { getCurrentInstance } from 'vue'
import { VueI18nTranslation } from 'vue-i18n'
import { config } from '@config'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'

export const useContext = (): {
  $t: VueI18nTranslation
  $config: typeof config
  $routes: typeof ROUTE_NAMES
  $icons: typeof ICON_NAMES
} => {
  const app = getCurrentInstance()

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const { $t, $config, $routes, $icons } =
    app!.appContext.config.globalProperties

  return {
    $t,
    $config,
    $routes,
    $icons,
  }
}
