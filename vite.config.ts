import path from 'path'
import { defineConfig } from 'vite'
import { createVitePlugins } from './config/vitePlugin'
import { buildConfig } from './config/build'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === 'development' ? '/' : '/flowChart/'
  return {
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: createVitePlugins(),
    esbuild: {
      pure: ['console.log'] // 去除console.log
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          //引入variables.module.scss、mixin.scss，在vue组件和其他scss文件中可直接使用，无需再次引用，再次引用会报错
          additionalData: `
          @use "@/style/variables.module.scss" as *; 
          `
        }
      }
    },
    build: buildConfig()
  }
})
