<script setup lang="ts">
import { useFlowStore } from '@/store/flow'
import { flowEmitter } from '@/utils'

const flowStore = useFlowStore()

function removeSelected() {
  flowEmitter.emit('removeElementNodes', flowStore.selectedElementNodes)
}
</script>

<template>
  <!--    底部操作按钮-->
  <div class="absolute z-2 bottom-30px right-30px flex gap-x-30px" text="38px">
    <transition name="slide-up1" appear>
      <div v-if="flowStore.selectedElementNodes.length">
        <el-tooltip content="删除选中节点和连接">
          <div class="grid place-items-center w-38px h-38px rounded-1/2 bg-red cursor-pointer">
            <SvgIcon name="delete" class="text-20px text-white" @click="removeSelected" />
          </div>
        </el-tooltip>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.right-box {
  transition: width $tr;
}

:deep(.el-textarea) {
  .el-textarea__inner {
    background-color: #f5f7fa;
    box-shadow: none;
  }
}

:deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  //padding: 0;
  box-shadow: none;
  border-radius: 0;

  .el-input__inner {
    text-align: center;
  }
}

// 底部元素从下往上滑动
.slide-up1-enter-active,
.slide-up1-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-up1-enter-from,
.slide-up1-leave-to {
  transform: translateY(150%);
}

.slide-up1-enter-to,
.slide-up1-leave-from {
  transform: translateY(0%);
}
</style>
