import { acceptHMRUpdate, defineStore } from 'pinia'
import type { IConnect, IFlow, INode, IPosition } from '@/components/Flow/utils'

export const useFlowStore = defineStore({
  id: 'flow',
  state: () => ({
    maybeNeedScrollParent: false,
    dom: {
      elementNodeContainerDom: null as HTMLElement
    },
    flowData: { canvasSize: { width: 1920, height: 1080 }, nodes: [], connections: [] } as IFlow,
    flowDomOffset: null as IPosition,
    scrollDom: null as HTMLElement,
    selectedLines: [] as IConnect[],
    selectedElementNodes: [] as INode[],
    hoverLine: null as IConnect,
    validateResults: []
  }),
  actions: {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFlowStore, import.meta.hot))
}
