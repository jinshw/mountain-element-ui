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
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="二维码" name="first">
        <div id="qrcode" ref="qrcodeContainer" class="qrcode" />
      </el-tab-pane>
      <el-tab-pane label="图片上传" name="second">
        <el-row>
          <el-col :span="12">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="https://jsonplacehoder.typeicon.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              list-type="picture"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-image v-for="url in imgList" :key="url" :src="url" />
          </el-col>
        </el-row>

      </el-tab-pane>
      <el-tab-pane label="文件上传" name="third" />
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import { getAge, imgUpload } from '@/api/test'
import QRCode from 'qrcodejs2'
export default {
  name: 'Test',
  data() {
    return {
      activeTab: 'first',
      qcodeText: '',
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      fileTypes: ['png', 'jpg', 'jpeg', 'zip', 'rar'],
      imgList: []

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
      var qrcode = new QRCode('qrcode', {
        text: this.qcodeText,
        width: 400,
        height: 400,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.log(qrcode)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      // 如果上传的文件不符合条件
      var checkMessage = this.fileCheck(file)
      if (checkMessage !== '') {
        this.$message(checkMessage)
        return
      }
      var formData = new FormData()
      formData.append('file', file)
      imgUpload(formData).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.imgList.push(response.imgUrl)
          this.fileList.push({ name: response.imgName, url: response.imgUrl })
          this.$message({
            type: 'success',
            message: '文件上传成功'
          })
        } else if (response.status === 500) {
          this.$message({
            type: 'warning',
            message: `文件上传失败,失败原因${response.msg}`
          })
        }
      })
    },
    onSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },

    // 前端校验文件上传是否符合条件
    fileCheck(file) {
      var ret = ''
      if (file === undefined) {
        ret = ''
      }
      var max_file_size = 5 * 1024 * 1024
      if (file.size > max_file_size) {
        ret = '图片不能大于5Mb'
      }
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (!this.validFile(fileType)) {
        ret = '文件类型不符合要求'
      }
      return ret
    },
    validFile(type) {
      var result = false
      for (var i = 0; i < this.fileTypes.length; i++) {
        if (this.fileTypes[i] === type) {
          result = true
          return result
        }
      }
      return result
    }

  }

}
</script>

