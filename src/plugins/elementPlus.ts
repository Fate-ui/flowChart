import { ArrowDown, ArrowLeft, ArrowLeftBold, ArrowRight, ArrowRightBold } from '@element-plus/icons-vue'
import type { App } from 'vue'

const icons = [ArrowDown, ArrowLeft, ArrowLeftBold, ArrowRight, ArrowRightBold]

export function elementPlusIconPlugin(app: App<Element>) {
  icons.forEach((icon) => {
    app.component(icon.name, icon)
  })
}
