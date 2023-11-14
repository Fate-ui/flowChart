<script setup lang="ts">
import { useEventListener, useThrottleFn } from '@vueuse/core'
import ConnectLine from './ConnectLine.vue'
import type { INode } from '@/components/Flow/utils'
import { actionNodes, arrowId, arrowSelectedId, eventNodes, middleNodes } from '@/components/Flow/utils'
import Tag from '@/components/Flow/Tag.vue'
import { EditElementNodeService } from '@/components/Flow/Services/EditElementNodeService'
import { DragElementNodeService } from '@/components/Flow/Services/DragElementNodeService'
import { DrawLineService } from '@/components/Flow/Services/DrawLineService'
import { ScrollParent } from '@/components/Flow/Services/ScrollParent'
import { useFlowStore } from '@/store/flow'
import { RectangleSelect } from '@/components/Flow/Services/RectangleSelect'
import { useOn } from '@/hooks/useOn'
import { flowEmitter } from '@/utils'

const flowStore = useFlowStore()
const flowData = flowStore.flowData
// 画布最外层Dom
const flowRef = shallowRef()
// 画布svg
const flowSvgRef = shallowRef()
// 元素节点外层dom
const elementNodeContainerRef = shallowRef()
// 当前画布在页面中的位置
const flowDomOffset = ref({
  x: 0,
  y: 0
})

function getFlowDomOffset() {
  const { x, y } = flowRef.value.parentElement.getBoundingClientRect()
  flowDomOffset.value.x = x
  flowDomOffset.value.y = y
  flowStore.flowDomOffset = flowDomOffset.value
}

onMounted(() => {
  getFlowDomOffset()
  scrollParent.getEdge()
  flowStore.dom.elementNodeContainerDom = elementNodeContainerRef.value
  flowStore.scrollDom = flowRef.value.parentElement
})

const throttledFn = useThrottleFn(() => {
  getFlowDomOffset()
  scrollParent.getEdge()
}, 50)
useEventListener('resize', throttledFn)

/** * 拖动元素节点功能 * */
const dragElementNodeService = new DragElementNodeService(flowRef)
provide('dragElementNodeService', dragElementNodeService)
useEventListener('mousemove', dragElementNodeService.onMouseMove)

/**滚动画布*/
const scrollParent = new ScrollParent(flowRef)

/**向画布内增加、删除节点*/
const editElementNodeService = new EditElementNodeService(flowDomOffset, flowData, flowRef)
provide('editElementNodeService', editElementNodeService)

/** * 连线功能 * */
const drawLineService = new DrawLineService(flowSvgRef, flowDomOffset, flowData, flowRef)
provide('drawLineService', drawLineService)

/**获取元素节点对应的组件*/
function getComponent(node: INode) {
  return [...eventNodes, ...actionNodes, ...middleNodes].find((el) => node.type === el.type).component
}

/**矩形框选功能*/
const selectElementRef = shallowRef()
const rectangleSelect = new RectangleSelect(selectElementRef, flowData)
provide('rectangleSelect', rectangleSelect)
useOn(flowEmitter, 'removeElementNodes', (nodes: INode[]) => {
  nodes.forEach((item) => editElementNodeService.remove(item))
  rectangleSelect.clear()
})

const dataFormRef = shallowRef()

function confirm() {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      if (drawLineService.isEditTag) {
        drawLineService.curLine.type = drawLineService.dialogState.data.type
      } else {
        drawLineService.add()
      }

      drawLineService.dialogState.visible = false
    }
  })
}

watch(flowStore.flowData, (value) => {
  console.log(value)
})
</script>
<template>
  <div
    ref="flowRef"
    class="relative"
    :style="{ width: `${flowData.canvasSize.width}px`, height: `${flowData.canvasSize.height}px` }"
    @mousedown.prevent="rectangleSelect.mouseDown"
    @mouseup="dragElementNodeService.onMouseUp"
    @dragover="editElementNodeService.dragOver"
    @drop="editElementNodeService.add"
  >
    <svg
      id="flowSvg"
      ref="flowSvgRef"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="100%"
      height="100%"
      class="relative z-1"
      data-spm-anchor-id="TODO.11007039.0.i6.12b64a9bcbXQmm"
    >
      <!--    箭头-->
      <defs>
        <marker :id="arrowId" markerWidth="5" markerHeight="5" viewBox="-6 -6 12 12" refX="10" refY="0" markerUnits="strokeWidth" orient="auto">
          <polygon points="-2,0 -5,5 5,0 -5,-5" stroke="gray" fill="gray" stroke-width="1px" />
        </marker>
        <!--        箭头选中样式-->
        <marker :id="arrowSelectedId" markerWidth="5" markerHeight="5" viewBox="-6 -6 12 12" refX="10" refY="0" markerUnits="strokeWidth" orient="auto">
          <polygon points="-2,0 -5,5 5,0 -5,-5" stroke="red" fill="red" stroke-width="1px" />
        </marker>
      </defs>
      <g>
        <!--      所有连接线-->
        <ConnectLine v-for="line in flowData.connections" :key="line.id" :all-data="flowData" :data="line" @mousedown.stop />
      </g>
    </svg>
    <div ref="elementNodeContainerRef" class="absolute inset-0 select-none overflow-hidden">
      <!--      所有的元素节点-->
      <template v-for="item in flowData.nodes" :key="item.id">
        <component :is="getComponent(item)" class="z-2" :data="item" @mousedown.stop />
      </template>
      <!--      所有的tag-->
      <Tag v-for="line in flowData.connections" :key="line.id" :all-data="flowData" :data="line" class="z-1" @mousedown.stop />
      <!--      矩形框选-->
      <div ref="selectElementRef" class="absolute z-3 bg-#147dff/10" border="2px dashed #5262ff" :class="{ hidden: !rectangleSelect.visible.value }" />
    </div>
    <!--    添加链接-->
    <el-dialog v-model="drawLineService.dialogState.visible" title="添加链接" align-center width="fit-content" destroy-on-close>
      <el-form
        ref="dataFormRef"
        :model="drawLineService.dialogState.data"
        :rules="drawLineService.dialogState.rules"
        label-position="right"
        label-width="100px"
        class="w-400px mx-50px"
      >
        <el-form-item label="链接标签:" prop="type">
          <el-select v-model="drawLineService.dialogState.data.type" placeholder="请选择">
            <el-option v-for="(label, value) in drawLineService.dialogState.linkOp" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex justify-center pt-12px" border="t-1px #ccc t-solid">
        <el-button class="w-80px" text bg @click="drawLineService.dialogState.visible = false"> 取消</el-button>
        <el-button type="primary" class="w-80px !ml-42px" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
/** 给svg添加格子背景 */
#flowSvg {
  // prettier-ignore
  background-size: 25Px 25Px;
  // prettier-ignore
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.1) 1Px, transparent 1Px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1Px, transparent 1Px);
  background-color: #f5f5f5;
}
</style>
