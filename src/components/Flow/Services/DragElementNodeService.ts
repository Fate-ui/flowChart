import type { Ref } from 'vue'
import type { INode, IPosition } from '@/components/Flow/utils'
import { flowEmitter } from '@/utils'
import { useFlowStore } from '@/store/flow'
import { elementNodeSize } from '@/components/Flow/utils'

/**
 * 拖动元素节点功能
 * */
export class DragElementNodeService {
  // 当前正拖动的元素节点
  private curNode: INode

  // 在mouseDown时记录鼠标位置与元素位置的偏移量
  private moveOffset = {
    x: 0,
    y: 0
  }

  private flowRef: Ref<HTMLElement>

  private elementNodeDom: HTMLElement
  private preElementNodeDom: HTMLElement

  constructor(flowRef: Ref<HTMLElement>) {
    this.flowRef = flowRef
  }

  onMouseDown = (data: INode, e: MouseEvent, dom: HTMLElement) => {
    this.curNode = data
    const { x, y } = dom.getBoundingClientRect()
    this.moveOffset.x = e.x - x
    this.moveOffset.y = e.y - y
    const flowStore = useFlowStore()
    flowStore.maybeNeedScrollParent = true
    this.setIndex(dom)
  }

  onMouseMove = (e: MouseEvent) => {
    flowEmitter.emit('mouseMove', e)
    if (!this.curNode) return
    const flowStore = useFlowStore()
    const scrollDom = flowStore.scrollDom
    let x = e.x - flowStore.flowDomOffset.x - this.moveOffset.x + scrollDom.scrollLeft
    let y = e.y - flowStore.flowDomOffset.y - this.moveOffset.y + scrollDom.scrollTop
    if (x < 0) x = 0
    if (y < 0) y = 0
    let xDelta = x - this.curNode.additional.layoutX
    let yDelta = y - this.curNode.additional.layoutY
    // 如果选中了多个元素节点，则一起移动
    if (flowStore.selectedElementNodes.length > 1 && flowStore.selectedElementNodes.some((item) => item.id === this.curNode.id)) {
      // 如果有元素节点超出画布，则不移动
      const isAtLeft = flowStore.selectedElementNodes.some((node) => node.additional.layoutX + xDelta < 0)
      const isAtTop = flowStore.selectedElementNodes.some((node) => node.additional.layoutY + yDelta < 0)
      if (isAtLeft) xDelta = 0
      if (isAtTop) yDelta = 0
      flowStore.selectedElementNodes.forEach((node) => {
        node.additional.layoutX += xDelta
        node.additional.layoutY += yDelta
      })
    } else {
      this.curNode.additional.layoutX += xDelta
      this.curNode.additional.layoutY += yDelta
    }

    this.extendCanvasSize({ x, y })
  }

  onMouseUp = (e) => {
    flowEmitter.emit('mouseUp', e)
    const flowStore = useFlowStore()
    flowStore.maybeNeedScrollParent = false
    this.curNode = null
    this.setPreDom()
  }

  // 将当前节点置于最上层
  public setIndex = (dom: HTMLElement) => {
    if (this.preElementNodeDom) {
      this.preElementNodeDom.style.zIndex = '2'
    }

    this.elementNodeDom = dom
    dom.style.zIndex = '3'
  }

  public setPreDom = () => {
    this.preElementNodeDom = this.elementNodeDom
  }

  // 扩展画布尺寸
  private extendCanvasSize = (pos: IPosition) => {
    const { width, height } = this.flowRef.value.getBoundingClientRect()
    const flowStore = useFlowStore()
    if (pos.x > width - elementNodeSize.width) flowStore.flowData.canvasSize.width += 500
    if (pos.y > height) flowStore.flowData.canvasSize.height += 500
  }
}
