<template>
  <div>
    <h1 class="d2-mt-0">字典管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model.trim="searchText" type="text" placeholder="字典名称" />
      </el-col>
      <el-col :span="18">
        <el-button>查询</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import moment from 'moment'
import { add } from '@/api/es'
export default {
  name: 'Dict',
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    handleAdd() {
      add({}).then(response => {
        if (response) {
          console.log(response)
        }
      })
    }
  }
}
</script>
