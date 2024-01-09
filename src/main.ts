import { createApp } from 'vue'
import '@/style/index.scss'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'normalize.css'
//原子化css
import 'uno.css'
import 'virtual:svg-icons-register'
import SvgIcon from './components/SvgIcon/index.vue'
import router from '@/router'
import { elementPlusIconPlugin } from '@/plugins/elementPlus'

const app = createApp(App)
app.use(createPinia())
app.use(elementPlusIconPlugin)
app.use(router)
app.component('SvgIcon', SvgIcon)
app.mount('#app')
// test
