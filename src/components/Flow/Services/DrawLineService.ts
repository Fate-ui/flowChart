import type { Ref } from 'vue'
import type { IPosition } from '@/types'
import type { IConnect, IFlow, INode, IStartType } from '@/components/Flow/utils'
import { useOn } from '@/hooks/useOn'
import { createUuid, flowEmitter } from '@/utils'
import { conditionNodes, controlBtnClass, defaultLinkOp, getCurvePath, linkOp, offset } from '@/components/Flow/utils'
import { useFlowStore } from '@/store/flow'

/**
 * 连线功能
 * */
export class DrawLineService {
  private isDrawing = false

  private startPointDom: HTMLElement
  private startPos = {
    x: 0,
    y: 0
  }
  private startPointType = ''
  private startNode: INode

  // 是否匹配到连接点
  private endNode = null

  // 是添加新的连线还是编辑已有连线
  private isEditLine = false

  public isEditTag = false
  public curLine: IConnect

  private path: SVGPathElement

  flowSvgRef: Ref<SVGElement>
  flowDomOffset: Ref<IPosition>
  flowData: IFlow
  private flowRef: Ref<HTMLElement>

  public dialogState = reactive({
    visible: false,
    rules: {
      type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
    },
    data: { type: null },
    linkOp: defaultLinkOp as Record<string, string>
  })

  private tempTagDom: HTMLElement

  constructor(flowSvgRef: Ref<SVGElement>, flowDomOffset: Ref<IPosition>, flowData: IFlow, flowRef: Ref<HTMLElement>) {
    this.flowSvgRef = flowSvgRef
    this.flowDomOffset = flowDomOffset
    this.flowData = flowData
    this.flowRef = flowRef
    useOn(flowEmitter, 'mouseMove', this.mouseMove)
    useOn(flowEmitter, 'mouseUp', this.mouseUp)
  }

  /**鼠标落下时，记录起点及创建path元素*/
  public mouseDown = (type: IStartType, node: INode, e: MouseEvent) => {
    this.endNode = null
    this.startPointDom = e.target as HTMLElement
    this.startPointDom.style.backgroundColor = '#999999'
    this.isDrawing = true
    this.dialogState.data.type = null
    const flowStore = useFlowStore()
    flowStore.maybeNeedScrollParent = true
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.path.setAttribute('stroke', '#808080')
    this.path.setAttribute('stroke-width', '4')
    this.path.setAttribute('fill', 'transparent')
    this.flowSvgRef.value.append(this.path)
    const scrollDom = this.flowRef.value.parentElement
    if (type === 'left') {
      // 找到所有以当前节点为终点的连线
      const relativeLines = this.flowData.connections.filter((item) => item.toId === node.id)
      if (relativeLines.length) {
        const line = relativeLines[Math.floor(Math.random() * relativeLines.length)]
        this.editLine(line)
        return
      }
    }

    this.isEditLine = false
    this.startNode = node
    this.startPointType = type
    const { x, y } = this.startPointDom.getBoundingClientRect()
    this.startPos.x = x + scrollDom.scrollLeft
    this.startPos.y = y + scrollDom.scrollTop
  }

  /**编辑已有连线*/
  private editLine = (line: IConnect) => {
    this.startPointType = 'right'
    this.isEditLine = true
    // 从数组随机选出一个元素
    this.curLine = line
    this.cancelSelect(line)
    this.addTempTag(line)
    this.startNode = this.flowData.nodes.find((item) => item.id === line.fromId)
    this.startPos.x = this.startNode.additional.layoutX + offset.fromX + this.flowDomOffset.value.x
    this.startPos.y = this.startNode.additional.layoutY + offset.fromY + this.flowDomOffset.value.y
    const end = this.flowData.nodes.find((item) => item.id === line.toId)
    this.setPath({
      x: end.additional.layoutX + this.flowDomOffset.value.x,
      y: end.additional.layoutY + offset.fromY + this.flowDomOffset.value.y
    })
    line.hidden = true
  }

  private cancelSelect = (line: IConnect) => {
    const flowStore = useFlowStore()
    const selectedLines = flowStore.selectedLines
    const index = selectedLines.findIndex((item) => item.id === line.id)
    if (index > -1) {
      selectedLines.splice(index, 1)
    }
  }

  private addTempTag = (line: IConnect) => {
    this.tempTagDom?.remove()
    const tagDom = document.getElementById(line.id)
    const tempTagDom = tagDom.cloneNode(true) as HTMLElement
    const controlBtnDom = tempTagDom.querySelector(`.${controlBtnClass}`)
    controlBtnDom?.remove()
    tempTagDom.id = 'tempTagDom'
    const flowStore = useFlowStore()
    flowStore.dom.elementNodeContainerDom.append(tempTagDom)
    this.tempTagDom = tempTagDom
  }

  /**鼠标移动时，更新path元素的终点位置*/
  private mouseMove = (e: MouseEvent) => {
    if (!this.isDrawing || this.endNode) return
    const scrollDom = this.flowRef.value.parentElement
    const endPos = {
      x: e.x + scrollDom.scrollLeft,
      y: e.y + scrollDom.scrollTop
    }
    const position = this.setPath(endPos)
    if (this.isEditLine) this.setTagPosition(position.from, position.to)
  }

  private setPath = (endPos: IPosition) => {
    const flowDomOffset = this.flowDomOffset
    const fromX = this.startPos.x - flowDomOffset.value.x
    const fromY = this.startPos.y - flowDomOffset.value.y
    let toX = endPos.x - flowDomOffset.value.x
    let toY = endPos.y - flowDomOffset.value.y
    if (toX < 0) toX = 0
    if (toY < 0) toY = 0
    const d = getCurvePath({ x: fromX, y: fromY }, { x: toX, y: toY })
    this.path.setAttribute('d', d)
    return { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } }
  }

  private setTagPosition = (from: IPosition, to: IPosition) => {
    const { width, height } = this.tempTagDom.getBoundingClientRect()
    this.tempTagDom.style.left = `${(from.x + to.x - width) / 2}px`
    this.tempTagDom.style.top = `${(from.y + to.y - height) / 2}px`
  }

  /**鼠标进入连接点*/
  public mouseEnterConnector = (type: IStartType, node: INode, e: MouseEvent) => {
    // 成功匹配规则：1.左侧点不能作为起始点2.连接点类型与起点类型不同 3.起点与终点不属于同一元素节点
    if (!this.isDrawing || this.startPointType == 'left' || type === this.startPointType || this.startNode.id === node.id) return
    // 4.两个元素节点间最多允许出现一根连线
    const isConnected = this.flowData.connections.some((item) => [item.fromId, item.toId].every((el) => [this.startNode.id, node.id].includes(el)))
    if (isConnected) return
    this.endNode = node
    // 自动吸附功能
    this.setPath({ x: node.additional.layoutX + this.flowDomOffset.value.x, y: node.additional.layoutY + offset.fromY + this.flowDomOffset.value.y })
  }

  /**鼠标离开连接点*/
  public mouseLeaveConnector = () => {
    if (!this.dialogState.visible) {
      this.endNode = null
    }
  }

  /**鼠标抬起后结束*/
  private mouseUp = () => {
    if (!this.isDrawing) return
    this.isDrawing = false
    const flowStore = useFlowStore()
    flowStore.maybeNeedScrollParent = false
    this.startPointDom.style.backgroundColor = '#E0E0E0'
    this.path.remove()
    if (this.isEditLine) {
      this.tempTagDom.remove()
      this.tempTagDom = null
    }

    /**不能正确连线*/
    if (!this.endNode) {
      // 编辑连线时，如果不能正确连线，需要把之前隐藏的连线显示出来
      if (this.isEditLine) {
        this.curLine.hidden = false
      }
    } else {
      /**能正确连线*/
      // 编辑连线时，如果能正确连线，需要把之前的连线删除
      if (this.isEditLine) {
        const connections = this.flowData.connections
        const index = connections.findIndex((item) => item.id === this.curLine.id)
        connections.splice(index, 1)
        this.dialogState.data.type = this.curLine.type
        this.add()
      } else if (conditionNodes.includes(this.startNode.type)) {
        // 弹出选择条件弹窗 新增连线
        this.getLinkTypeOp(this.startNode)
        this.dialogState.visible = true
        this.isEditTag = false
      } else {
        // 直接新增连线
        this.dialogState.data.type = 'TRUE'
        this.add()
      }
    }
  }

  /**添加连线*/
  public add = () => {
    this.flowData.connections.push({
      fromId: this.startNode.id,
      toId: this.endNode.id,
      type: this.dialogState.data.type,
      id: createUuid()
    })
  }

  public getLinkTypeOp = (startNode: INode) => {
    if (conditionNodes.includes(startNode.type)) {
      this.dialogState.linkOp = linkOp
    } else {
      this.dialogState.linkOp = defaultLinkOp
    }
  }
}
