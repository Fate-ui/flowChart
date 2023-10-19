import type { Ref } from 'vue'
import { flowEmitter } from '@/utils'
import { useOn } from '@/hooks/useOn'
import { useFlowStore } from '@/store/flow'

export class ScrollParent {
  private flowRef: Ref<HTMLElement>
  // 边缘界定
  private edge = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }

  // 滚动距离，越大滚动越快
  private delta = 10

  constructor(flowRef: Ref<HTMLElement>) {
    this.flowRef = flowRef
    useOn(flowEmitter, 'mouseMove', this.mouseMove)
  }

  mouseMove = (e: MouseEvent) => {
    const flowStore = useFlowStore()
    if (!flowStore.maybeNeedScrollParent) return
    const scrollDom = this.flowRef.value.parentElement
    const delta = this.delta
    if (e.x > this.edge.right) {
      scrollDom.scrollLeft += delta
    } else if (e.x < this.edge.left) {
      scrollDom.scrollLeft -= delta
    }

    if (e.y > this.edge.bottom) {
      scrollDom.scrollTop += delta
    } else if (e.y < this.edge.top) {
      scrollDom.scrollTop -= delta
    }
  }

  public getEdge = () => {
    const rem = Number.parseInt(getComputedStyle(document.documentElement).fontSize)
    // 网页高 - 底部padding - 固定高
    this.edge.bottom = window.innerHeight - 0.5 * rem - 20
    this.edge.right = window.innerWidth - 0.5 * rem - 20
    const { x, y } = this.flowRef.value.getBoundingClientRect()
    this.edge.top = y + 50
    this.edge.left = x + 50
  }
}
