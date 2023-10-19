<script setup lang="ts">
import ElementNode from './Index.vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { INode } from '@/components/Flow/utils'

const { data } = defineProps<{
  data: INode<{ eventType: 1 | 2 | 3; name: string }>
}>()

const formRef = shallowRef<FormInstance>()
const rules: FormRules<typeof data.params> = {
  eventType: [{ required: true, message: '请选择', trigger: 'change' }],
  name: [{ required: true, message: '请输入', trigger: 'change' }]
}
</script>

<template>
  <ElementNode :data="data" title="事件节点2" control-point="right" :form-ref="formRef">
    <el-form
      ref="formRef"
      :inline="true"
      :model="data.params"
      :rules="rules"
      class="bg-#fff py-14px px-20Px h-154Px flex flex-col justify-around"
      :label-width="76"
      label-position="left"
    >
      <el-form-item label="字段1" prop="name">
        <el-input v-model="data.params.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="字段2" prop="eventType">
        <el-select v-model="data.params.eventType" placeholder="请选择类型" popper-class="select-pop">
          <el-option label="类型1" :value="1" />
          <el-option label="类型2" :value="2" />
          <el-option label="类型3" :value="3" />
        </el-select>
      </el-form-item>

      <el-form-item label="字段3">
        <el-input v-model="data.params.name" placeholder="请输入" />
      </el-form-item>
    </el-form>
  </ElementNode>
</template>

<style scoped lang="scss">
.element-node {
  --primary: var(--event-node-color);
}
</style>
