<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type { INode, IStartType } from '@/components/Flow/utils'
import type { EditElementNodeService } from '@/components/Flow/Services/EditElementNodeService'
import type { DragElementNodeService } from '@/components/Flow/Services/DragElementNodeService'
import type { DrawLineService } from '@/components/Flow/Services/DrawLineService'
import { useFlowStore } from '@/store/flow'
import { flowEmitter } from '@/utils'
import { useOn } from '@/hooks/useOn'

const { data, title, controlPoint, formRef } = defineProps<{
  data: INode
  title: string
  controlPoint?: IStartType
  formRef?: FormInstance
}>()
const nodeRef = shallowRef()

const dragElementNodeService = inject<DragElementNodeService>('dragElementNodeService')
const drawLineService = inject<DrawLineService>('drawLineService')
const editElementNodeService = inject<EditElementNodeService>('editElementNodeService')

data.additional.showDrop ??= true
const showDrop = toRef(data.additional, 'showDrop')

const dropRef = shallowRef()
onMounted(() => {
  const { height } = dropRef.value.firstElementChild.getBoundingClientRect()
  dropRef.value.style.setProperty('--height', `${height}px`)
  isRounded.value = !showDrop.value
})

const flowStore = useFlowStore()
const isSelected = computed(() => flowStore.selectedElementNodes.some((item) => item.id === data.id))

function changeShowDrop() {
  showDrop.value = !showDrop.value
  if (showDrop.value) {
    isRounded.value = false
  }
}

const isRounded = ref(false)

function transitionEnd() {
  isRounded.value = !showDrop.value
}

/**表单验证*/
const isValidated = ref(true)
const handleChange = () => {
  if (!formRef) return
  formRef.validate((valid) => {
    isValidated.value = valid
    flowStore.validateResults.push(valid)
  })
}

useOn(flowEmitter, 'validate', handleChange)
</script>

<template>
  <div
    ref="nodeRef"
    :style="{ transform: `translate(${data.additional.layoutX}px, ${data.additional.layoutY}px)` }"
    class="element-node absolute flex flex-col items-center w-280Px rounded-6Px"
    :class="{ selected: isSelected, 'validate-fail': !isValidated }"
    @mousedown="dragElementNodeService.onMouseDown(data, $event, nodeRef)"
  >
    <header class="flex items-center h-40Px w-full">
      <i
        v-if="controlPoint !== 'right'"
        class="extend-area !absolute w-14Px h-14Px inline-block rounded-3Px cursor-pointer bg-#e0e0e0 -translate-x-1/2"
        border="1Px solid #999"
        @mousedown.stop="drawLineService.mouseDown('left', data, $event)"
        @mouseenter="drawLineService.mouseEnterConnector('left', data, $event)"
        @mouseleave="drawLineService.mouseLeaveConnector"
      />
      <div
        class="header-bar w-full flex items-center justify-between h-full rounded-t-6Px"
        :class="{ 'rounded-b-6Px': isRounded }"
        p="x-20Px"
        text="14Px center white"
      >
        <el-icon class="cursor-pointer" @click.prevent="changeShowDrop" @mousedown.stop="dragElementNodeService.setIndex(nodeRef)">
          <ArrowDown class="arrow" :class="{ '-rotate-180': !showDrop }" />
        </el-icon>
        <span>{{ title }}</span>
        <SvgIcon name="close" class="text-17Px cursor-pointer" @click="editElementNodeService.remove(data)" @mousedown.stop />
      </div>
      <i
        v-if="controlPoint !== 'left'"
        class="extend-area !absolute right-0 w-14Px h-14Px inline-block rounded-3Px cursor-pointer bg-#e0e0e0 translate-x-1/2"
        border="1Px solid #999"
        @mousedown.stop="drawLineService.mouseDown('right', data, $event)"
        @mouseenter="drawLineService.mouseEnterConnector('right', data, $event)"
        @mouseleave="drawLineService.mouseLeaveConnector"
      />
    </header>
    <footer ref="dropRef" class="drop-content w-full overflow-hidden rounded-b-6Px" :class="showDrop ? 'h-drop' : '!h-0'" @transitionend="transitionEnd">
      <slot />
    </footer>
  </div>
</template>

<style scoped lang="scss">
.selected {
  outline: 3px solid red;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.validate-fail {
  outline: 3px solid red;
}

.header-bar {
  background-color: var(--primary);
}

.element-node {
  // prettier-ignore
  box-shadow: 0px 0px 10Px 0px rgba(0, 0, 0, 0.2);
}

.arrow {
  transition: transform $tr;
}

.drop-content {
  transition: height $tr;
}

.h-drop {
  height: var(--height);
}
</style>
