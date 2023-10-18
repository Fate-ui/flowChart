import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { unocssPlugin } from './unocss'
import type { PluginOption } from 'vite'

export function createVitePlugins(): PluginOption[] {
  return [
    vue(),
    /*原子化CSS插件*/
    unocssPlugin(),
    /* 打包分析 */
    visualizer()
  ]
}
