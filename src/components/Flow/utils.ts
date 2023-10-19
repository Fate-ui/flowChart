import Event2 from '@/components/Flow/ElementNodes/Event2.vue'
import Event3 from '@/components/Flow/ElementNodes/Evnet3.vue'
import Event4 from '@/components/Flow/ElementNodes/Event4.vue'
import Event5 from '@/components/Flow/ElementNodes/Event5.vue'
import Event1 from '@/components/Flow/ElementNodes/Event1.vue'
import Middle1 from '@/components/Flow/ElementNodes/Middle1.vue'
import Middle2 from '@/components/Flow/ElementNodes/Middle2.vue'
import Action2 from '@/components/Flow/ElementNodes/Action2.vue'
import Action1 from '@/components/Flow/ElementNodes/Action1.vue'
import Action3 from '@/components/Flow/ElementNodes/Action3.vue'
import Action4 from '@/components/Flow/ElementNodes/Action4.vue'
import Action5 from '@/components/Flow/ElementNodes/Action5.vue'

export type IStartType = 'left' | 'right'
export const elementNodeSize = {
  width: 280,
  height: 40
}

export const arrowId = `arrow${Math.random() * 100}`
export const arrowSelectedId = `${arrowId}-selected`
export const controlBtnClass = 'control-btn'
export const offset = {
  fromX: elementNodeSize.width,
  fromY: elementNodeSize.height / 2,
  toX: 0,
  toY: elementNodeSize.height / 2
}

export type IPosition = {
  x: number
  y: number
}

/**根据起始点获取贝塞尔曲线*/
export function getCurvePath(from: IPosition, to: IPosition) {
  return `M ${from.x} ${from.y}  C ${from.x}, ${from.y + (to.y - from.y) / 2} ${to.x - 50}, ${to.y - (to.y - from.y) / 2} ${to.x} ${to.y}`
}

export const conditionNodes = ['eventNode1', 'eventNode3', 'middleNode1']
/**事件节点*/
export const eventNodes = [
  {
    icon: 'event-1',
    title: '条件节点1',
    type: 'eventNode1',
    component: Event1
  },
  {
    icon: 'event-2',
    title: '事件节点2',
    type: 'eventNode2',
    component: Event2
  },
  {
    icon: 'event-3',
    title: '条件节点3',
    type: 'eventNode3',
    component: Event3
  },
  {
    icon: 'event-4',
    title: '事件节点4',
    type: 'eventNode4',
    component: Event4
  },
  {
    icon: 'event-5',
    title: '事件节点5',
    type: 'eventNode5',
    component: Event5
  }
]
/**中间节点*/
export const middleNodes = [
  {
    icon: 'middle-1',
    title: '条件节点1',
    type: 'middleNode1',
    component: Middle1
  },
  {
    icon: 'middle-2',
    title: '中间节点2',
    type: 'middleNode2',
    component: Middle2
  }
]
/**动作节点*/
export const actionNodes = [
  {
    icon: 'action-1',
    title: '动作节点1',
    type: 'actionNode1',
    component: Action1
  },
  {
    icon: 'action-2',
    title: '动作节点2',
    type: 'actionNode2',
    component: Action2
  },
  {
    icon: 'action-3',
    title: '动作节点3',
    type: 'actionNode3',
    component: Action3
  },
  {
    icon: 'action-4',
    title: '动作节点4',
    type: 'actionNode4',
    component: Action4
  },
  {
    icon: 'action-5',
    title: '动作节点5',
    type: 'actionNode5',
    component: Action5
  }
]

/**选择链接*/
export const defaultLinkOp = {
  TRUE: '满足',
  FALSE: '不满足'
}
export const linkOp = {
  FIRST: '条件一',
  SECOND: '条件二',
  THIRD: '条件三'
}

export interface INode<Params = any> {
  id: string
  type: string
  params: Params
  additional: {
    layoutX: number
    layoutY: number
    showDrop?: boolean
  }
}

export interface IConnect {
  from?: number
  to?: number
  fromId: string
  toId: string
  type: string
  id: string
  hidden?: boolean
}

export interface IFlow {
  nodes: INode[]
  connections: IConnect[]
  canvasSize: { width: number; height: number }
}
