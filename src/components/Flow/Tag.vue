<script setup lang="ts">
import type { DrawLineService } from '@/components/Flow/Services/DrawLineService'
import type { IConnect, IFlow } from '@/components/Flow/utils'
import type { RectangleSelect } from '@/components/Flow/Services/RectangleSelect'
import { conditionNodes, controlBtnClass, defaultLinkOp, linkOp, offset } from '@/components/Flow/utils'
import { useFlowStore } from '@/store/flow'

const { allData, data } = defineProps<{
  allData: IFlow
  data: IConnect
}>()
const rectRef = shallowRef()
let rectWidth = 80
let rectHeight = 40
onMounted(() => {
  const { width, height } = rectRef.value.getBoundingClientRect()
  rectWidth = width
  rectHeight = height
})
/**
 * 实时计算连线路径及文字位置
 * */
const textPosition = computed(() => {
  // 找到对应的元素节点
  const { fromId, toId } = data
  const fromNode = allData.nodes.find((item) => item.id === fromId)
  const toNode = allData.nodes.find((item) => item.id === toId)
  if (!fromNode || !toNode) return
  // 计算起点坐标和终点坐标（并加上对应的偏移量）
  const fromX = fromNode.additional.layoutX + offset.fromX
  const fromY = fromNode.additional.layoutY + offset.fromY
  const toX = toNode.additional.layoutX + offset.toX
  const toY = toNode.additional.layoutY + offset.toY
  // 文字的位置
  return {
    x: (fromX + toX - rectWidth) / 2,
    y: (fromY + toY - rectHeight) / 2
  }
})

const flowStore = useFlowStore()
const rectangleSelect = inject<RectangleSelect>('rectangleSelect')
const isSelected = computed(() => flowStore.selectedLines.some((item) => item.id === data.id))
const isHovered = computed(() => !isSelected.value && flowStore.hoverLine?.id === data.id)

function remove() {
  const index = allData.connections.findIndex((item) => item.id === data.id)
  allData.connections.splice(index, 1)
}

const drawLineService = inject<DrawLineService>('drawLineService')

function edit() {
  drawLineService.dialogState.visible = true
  drawLineService.isEditTag = true
  drawLineService.dialogState.data.type = data.type
  drawLineService.curLine = data
  drawLineService.getLinkTypeOp(startNode.value)
}

function selectConnect() {
  rectangleSelect.clear()
  rectangleSelect.selectLine(data)
}

/**模拟hover*/
function mouseEnter() {
  flowStore.hoverLine = data
}

function mouseLeave() {
  flowStore.hoverLine = null
}

const startNode = computed(() => allData.nodes.find((item) => item.id === data.fromId))
</script>

<template>
  <div
    v-if="!data.hidden"
    :id="data.id"
    ref="rectRef"
    class="connect-tag absolute"
    :class="{ hover: isHovered }"
    :style="{ top: `${textPosition.y}px`, left: `${textPosition.x}px` }"
    @click.stop="selectConnect"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <div
      v-if="data.type && data.type != 'TRUE'"
      :class="{ selected: isSelected && flowStore.selectedElementNodes.length }"
      class="bg-white rounded-6Px"
      p="y-7Px x-18Px"
      text="12px"
      border="2Px solid #ccc"
    >
      <span v-if="conditionNodes.includes(startNode.type)">{{ linkOp[data.type] }}</span>
      <span v-else> {{ defaultLinkOp[data.type] }} </span>
    </div>
    <div v-if="isSelected && !flowStore.selectedElementNodes.length" :class="controlBtnClass" class="absolute top-0px right-0 -translate-y-full" text="24Px">
      <SvgIcon v-if="data.type && data.type != 'TRUE'" name="flow-edit" class="mr-4Px cursor-pointer" @click="edit" />
      <SvgIcon name="flow-delete" class="cursor-pointer" @click="remove" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.connect-tag {
  transition: transform 0.2s;
}

.hover {
  transform: scale(1.2);
}

.selected {
  background-color: red;
  color: white;
  border-color: red;
}
</style>
