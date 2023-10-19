<script setup lang="ts">
import type { IConnect, IFlow } from '@/components/Flow/utils'
import type { RectangleSelect } from '@/components/Flow/Services/RectangleSelect'
import { arrowId, arrowSelectedId, getCurvePath, offset } from '@/components/Flow/utils'
import { useFlowStore } from '@/store/flow'

const { allData, data } = defineProps<{
  allData: IFlow
  data: IConnect
}>()
/**
 * 实时计算连线路径及文字位置
 * */
const linePath = ref()
watchEffect(() => {
  if (!allData) return
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
  // 连线的路径
  linePath.value = getCurvePath({ x: fromX, y: fromY }, { x: toX, y: toY })
})

const flowStore = useFlowStore()
const rectangleSelect = inject<RectangleSelect>('rectangleSelect')
const isSelected = computed(() => flowStore.selectedLines.some((item) => item.id === data.id))
function clickPath() {
  rectangleSelect.clear()
  rectangleSelect.selectLine(data)
}

const isHovered = computed(() => !isSelected.value && flowStore.hoverLine?.id === data.id)
/**模拟hover*/
function mouseEnter() {
  flowStore.hoverLine = data
}

function mouseLeave() {
  flowStore.hoverLine = null
}
</script>

<template>
  <path
    v-if="!data.hidden"
    :d="linePath"
    class="line"
    :class="[isSelected ? 'selected-line' : 'default-line', { hover: isHovered }]"
    :marker-end="`url(#${isSelected ? arrowSelectedId : arrowId})`"
    @click.stop="clickPath"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  />
</template>

<style scoped lang="scss">
.line {
  stroke-width: 4px;
  /* fill: none; */
  fill: transparent;
  //stroke-dasharray: 5px;
  //stroke-dashoffset: 1000px;
  //animation: grown 40s infinite linear;
  transition: stroke-width 0.2s;
}
@keyframes grown {
  to {
    stroke-dashoffset: 0px;
  }
}
.hover {
  stroke-width: 6px;
}

.default-line {
  stroke: #808080;
}
.selected-line {
  stroke: red;
}
</style>
