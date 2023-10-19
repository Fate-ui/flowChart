<script setup lang="ts">
import Flow from '@/components/Flow/Index.vue'
import Left from '@/views/Home/Left.vue'
import Right from '@/views/Home/Right.vue'
</script>

<template>
  <div class="flex h-screen">
    <Left class="shrink-0" border="r-1px r-solid #ccc" />
    <section class="grow flex flex-col overflow-hidden">
      <header class="flex items-center justify-between h-50px" p="x-25px" border="b-1px #ccc b-solid">
        <div class="font-bold tracking-3px">流程图绘制</div>
        <el-tooltip content="GitHub">
          <a href="https://github.com/Fate-ui/flowChart" class="text-black" target="_blank">
            <SvgIcon name="flow-list" class="text-32px shrink-0 cursor-pointer" />
          </a>
        </el-tooltip>
      </header>
      <div class="grow relative">
        <!--        流程绘制-->
        <div class="absolute inset-0 overflow-scroll ml-8px mt-8px scroller">
          <Flow />
        </div>
        <!--        右侧信息展示面板-->
        <Right />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.scroller {
  scrollbar-width: thin;
}
</style>
