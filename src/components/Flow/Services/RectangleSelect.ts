import type { Ref } from 'vue'
import type { IConnect, IFlow } from '@/components/Flow/utils'
import { useOn } from '@/hooks/useOn'
import { flowEmitter } from '@/utils'
import { useFlowStore } from '@/store/flow'
import { elementNodeSize } from '@/components/Flow/utils'

/**矩形框选功能*/
export class RectangleSelect {
  public visible = ref(false)
  private selectRect = { x1: 0, y1: 0, x2: 0, y2: 0 }
  private selectElement: Ref<HTMLElement>

  private flowData: IFlow

  constructor(selectElement: Ref<HTMLElement>, flowData: IFlow) {
    this.flowData = flowData
    this.selectElement = selectElement
    useOn(flowEmitter, 'mouseMove', this.mouseMove)
    useOn(flowEmitter, 'mouseUp', this.mouseUp)
  }

  public mouseDown = (e: MouseEvent) => {
    this.visible.value = true
    const startPos = this.getRelativePos(e)
    this.selectRect.x1 = startPos.x
    this.selectRect.y1 = startPos.y
    this.selectRect.x2 = this.selectRect.x1
    this.selectRect.y2 = this.selectRect.y1
    this.updateSelectRect()
    const flowStore = useFlowStore()
    flowStore.maybeNeedScrollParent = true
  }

  public mouseMove = (e: MouseEvent) => {
    if (!this.visible.value) return
    const endPos = this.getRelativePos(e)
    this.selectRect.x2 = endPos.x
    this.selectRect.y2 = endPos.y
    this.updateSelectRect()
  }

  public mouseUp = (e: MouseEvent) => {
    if (!this.visible.value) return
    this.visible.value = false
    const flowStore = useFlowStore()
    flowStore.maybeNeedScrollParent = false
    this.selectElementNode()
  }

  private getRelativePos = (e: MouseEvent) => {
    const flowStore = useFlowStore()
    const flowDomOffset = flowStore.flowDomOffset
    const scrollDom = flowStore.scrollDom
    return {
      x: e.x - flowDomOffset.x + scrollDom.scrollLeft,
      y: e.y - flowDomOffset.y + scrollDom.scrollTop
    }
  }

  private updateSelectRect() {
    const selectElement = this.selectElement.value
    const { x1, x2, y1, y2 } = this.selectRect
    const x3 = Math.min(x1, x2)
    const x4 = Math.max(x1, x2)
    const y3 = Math.min(y1, y2)
    const y4 = Math.max(y1, y2)
    selectElement.style.left = `${x3}px`
    selectElement.style.top = `${y3}px`
    selectElement.style.width = `${x4 - x3}px`
    selectElement.style.height = `${y4 - y3}px`
  }

  private selectElementNode = () => {
    this.clear()
    const flowStore = useFlowStore()
    // 找出在矩形内的所有节点
    for (const node of this.flowData.nodes) {
      const { layoutX, layoutY } = node.additional
      const { x1, x2, y1, y2 } = this.selectRect
      const x3 = Math.min(x1, x2)
      const x4 = Math.max(x1, x2)
      const y3 = Math.min(y1, y2)
      const y4 = Math.max(y1, y2)
      if (layoutX > x3 && layoutX + elementNodeSize.width < x4 && layoutY > y3 && layoutY + elementNodeSize.height < y4) {
        flowStore.selectedElementNodes.push(node)
      }
    }

    // 将选中节点的连线也选中
    for (const connect of this.flowData.connections) {
      if (flowStore.selectedElementNodes.some((item) => item.id === connect.fromId)) {
        flowStore.selectedLines.push(connect)
      }
    }
  }

  public selectLine = (connect: IConnect) => {
    const flowStore = useFlowStore()
    flowStore.selectedLines.push(connect)
  }

  public clear = () => {
    const flowStore = useFlowStore()
    flowStore.selectedLines = []
    flowStore.selectedElementNodes = []
  }
}
