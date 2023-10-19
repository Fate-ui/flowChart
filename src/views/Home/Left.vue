<script setup lang="ts">
import { actionNodes, eventNodes, middleNodes } from '@/components/Flow/utils'

const activeNames = ref(['1', '2', '3'])
const filteredEventNodes = ref(eventNodes)
const filteredMiddleNodes = ref(middleNodes)
const filteredActionNodes = ref(actionNodes)
const nodeName = ref('')

function findNode() {
  filteredEventNodes.value = eventNodes.filter((item) => item.title.toLowerCase().includes(nodeName.value.toLowerCase()))
  filteredActionNodes.value = actionNodes.filter((item) => item.title.toLowerCase().includes(nodeName.value.toLowerCase()))
}

function dragStart(data, e: DragEvent) {
  e.dataTransfer.setData('text/plain', data.type)
}

/**收缩面板*/
const isExpanded = ref(true)

function showBar() {
  isExpanded.value = !isExpanded.value
}

function transitionEnd() {
  const myEvent = new Event('resize')
  window.dispatchEvent(myEvent)
}
</script>

<template>
  <div class="relative">
    <div class="node-container overflow-hidden" :class="isExpanded ? 'w-261px' : 'w-0'" @transitionend="transitionEnd">
      <el-input
        v-model.trim="nodeName"
        clearable
        placeholder="查找节点"
        prefix-icon="Search"
        maxlength="60"
        class="mb-12px pt-26px pl-26px pr-20px"
        @input="findNode"
      />
      <el-scrollbar max-height="calc(100vh - 6rem)" class="pl-26px pr-20px">
        <el-collapse v-model="activeNames" class="select-none">
          <el-collapse-item title="事件节点" name="1">
            <div
              v-for="item in filteredEventNodes"
              :key="item.icon"
              class="relative flex w-199px h-40px leading-40px mb-12px"
              text="#333 center"
              draggable="true"
              @dragstart="dragStart(item, $event)"
            >
              <div class="grid place-items-center w-40px bg-$event-node-color rounded-l-4px">
                <SvgIcon :name="item.icon" class="text-22px text-white" />
              </div>
              <div class="w-169px rounded-r-4px" border="1px solid $event-node-color l-none">{{ item.title }}</div>
              <i class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-14px h-14px rounded-3px bg-#e0e0e0" border="1px solid #999" />
            </div>
          </el-collapse-item>
          <el-collapse-item title="中间节点" name="2">
            <div
              v-for="item in filteredMiddleNodes"
              :key="item.icon"
              class="relative flex justify-center w-199px h-40px leading-40px mb-12px ml-7px bg-#22d3ee rounded-4px"
              text="white center"
              draggable="true"
              @dragstart="dragStart(item, $event)"
            >
              <div class="rounded-l-4px ml-7px">{{ item.title }}</div>
              <div class="grid place-items-center w-40px rounded-r-4px">
                <SvgIcon :name="item.icon" class="text-22px" />
              </div>
              <i class="absolute top-1/2 -left-7px -translate-y-1/2 w-14px h-14px rounded-3px bg-#e0e0e0" border="1px solid #999" />
              <i class="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-14px h-14px rounded-3px bg-#e0e0e0" border="1px solid #999" />
            </div>
          </el-collapse-item>
          <el-collapse-item title="动作节点" name="3">
            <div
              v-for="item in filteredActionNodes"
              :key="item.icon"
              class="relative flex w-199px h-40px leading-40px mb-12px"
              text="#333 center"
              draggable="true"
              @dragstart="dragStart(item, $event)"
            >
              <div class="w-169px rounded-l-4px ml-7px" border="1px solid $action-node-color r-none">{{ item.title }} </div>
              <div class="grid place-items-center w-40px bg-$action-node-color rounded-r-4px">
                <SvgIcon :name="item.icon" class="text-22px text-white" />
              </div>
              <i class="absolute top-1/2 left-0 -translate-y-1/2 w-14px h-14px rounded-3px bg-#e0e0e0" border="1px solid #999" />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <!--        折叠左侧面板-->
    <div
      class="absolute top-66px right-0 translate-x-full z-9 grid place-items-center w-13px h-44px rounded-r-6px bg-#D8D8D8 cursor-pointer"
      text="14px white"
      hover="bg-#8c8c8c"
      @click="showBar"
    >
      <el-icon v-if="isExpanded">
        <ArrowLeftBold />
      </el-icon>
      <el-icon v-else>
        <ArrowRightBold />
      </el-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.node-container {
  transition: width $tr;
}
</style>
