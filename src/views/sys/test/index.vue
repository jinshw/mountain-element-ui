<template>
  <div>
    <h1 class="d2-mt-0">测试页面</h1>
    <el-row>
      <el-button @click="getAge">getAge</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
  </div>
</template>
<script>
import { getAge } from '@/api/test'
export default {
  name: 'Test',
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    getAge: function() {
      getAge({}).then(response => {
        console.log(response.data)
      })
    }
  }

}
</script>

