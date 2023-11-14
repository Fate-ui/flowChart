import { acceptHMRUpdate, defineStore } from 'pinia'
import type { IConnect, IFlow, INode, IPosition } from '@/components/Flow/utils'

const defaultFlowData: IFlow = {
  canvasSize: { width: 1920, height: 1080 },
  nodes: [
    {
      id: 'b8311a00-7202-445d-8758-6a60df5403a3',
      type: 'middleNode2',
      params: {},
      additional: {
        layoutX: 450,
        layoutY: 293,
        showDrop: false
      }
    },
    {
      id: '8eae56e7-6f42-441e-87e5-ff9731fd94cb',
      type: 'actionNode1',
      params: {
        name: 'test',
        eventType: 2
      },
      additional: {
        layoutX: 770,
        layoutY: 444,
        showDrop: true
      }
    },
    {
      id: '6bba2281-d768-4b54-9010-954ab077ba55',
      type: 'eventNode1',
      params: {},
      additional: {
        layoutX: 35,
        layoutY: 161,
        showDrop: false
      }
    }
  ],
  connections: [
    {
      fromId: '6bba2281-d768-4b54-9010-954ab077ba55',
      toId: 'b8311a00-7202-445d-8758-6a60df5403a3',
      type: 'SECOND',
      id: '1f1a741c-9236-4883-89f4-38b1b226f208'
    },
    {
      fromId: 'b8311a00-7202-445d-8758-6a60df5403a3',
      toId: '8eae56e7-6f42-441e-87e5-ff9731fd94cb',
      type: 'TRUE',
      id: '96e4e78e-64dc-497d-8b3d-6465653dc376'
    }
  ]
}

export const useFlowStore = defineStore({
  id: 'flow',
  state: () => ({
    maybeNeedScrollParent: false,
    dom: {
      elementNodeContainerDom: null as HTMLElement
    },
    flowData: defaultFlowData,
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
