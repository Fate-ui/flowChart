import type { Ref } from 'vue'
import type { IFlow, INode, IPosition } from '@/components/Flow/utils'
import { createUuid } from '@/utils'
import { elementNodeSize } from '@/components/Flow/utils'

/**增加、删除元素节点*/
export class EditElementNodeService {
  private flowDomOffset: Ref<IPosition>
  private flowData: IFlow
  private flowRef: Ref<HTMLElement>

  constructor(flowDomOffset: Ref<IPosition>, flowData: IFlow, flowRef: Ref<HTMLElement>) {
    this.flowDomOffset = flowDomOffset
    this.flowData = flowData
    this.flowRef = flowRef
  }

  public add = (e: DragEvent) => {
    e.preventDefault()
    const dataType = e.dataTransfer.getData('text/plain')
    const scrollDom = this.flowRef.value.parentElement
    this.flowData.nodes.push({
      id: createUuid(),
      type: dataType,
      params: {},
      additional: {
        //主要放一些ui层面的数据
        layoutX: Math.floor(e.clientX - this.flowDomOffset.value.x - elementNodeSize.width / 2 + scrollDom.scrollLeft),
        layoutY: Math.floor(e.clientY - this.flowDomOffset.value.y - elementNodeSize.height / 2 + scrollDom.scrollTop)
      }
    })
  }

  public remove = (data: INode) => {
    const flowData = this.flowData
    // 删除节点
    const index = flowData.nodes.findIndex((item) => item.id === data.id)
    this.flowData.nodes.splice(index, 1)
    // 删除节点关联的线
    while (flowData.connections.some((item) => item.fromId === data.id || item.toId === data.id)) {
      const i = flowData.connections.findIndex((item) => item.fromId === data.id || item.toId === data.id)
      flowData.connections.splice(i, 1)
    }
  }

  public dragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'link'
  }
}
