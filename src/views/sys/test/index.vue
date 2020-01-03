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
      <el-button type="primary" @click="showQRCode">获取二维码</el-button>
      <el-input v-model="qcodeText" auto-complete="off" />
    </el-row>
    <div ref="qrcodeContainer" class="qrcode" />
  </div>
</template>
<script>
import { getAge } from '@/api/test'
import QRCode from 'qrcodejs2'
export default {
  name: 'Test',
  data() {
    return {
      qcodeText: ''
    }
  },
  mounted() {

  },
  methods: {
    getAge: function() {
      getAge({}).then(response => {
        console.log(response.data)
      })
    },
    showQRCode() {
      var qrcode2 = new QRCode(this.$refs.qrcodeContainer, {
        text: this.qcodeText,
        width: 400,
        height: 400,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    }
  }

}
</script>

