<template>
  <div>
    <h1 class="d2-mt-0">文件管理</h1>
    <div>
      <div id="top">
        <el-row>
          <el-button type="primary" @click="search">查询</el-button>
          <el-upload
            ref="upload"
            class="upload-demo inline-block"
            action="https://jsonplacehoder.typeicon.com/posts/"
            :show-file-list="false"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :auto-upload="true"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
          >
            <el-button slot="trigger" type="primary">上传文件</el-button>

            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          </el-upload>
        </el-row>

      </div>

      <div style="margin-top:15px">

        <el-table
          ref="testTable"
          :data="tableData"
          style="width:100%"
          border
        >
          <el-table-column
            prop="fname"
            label="文件名称"
            sortable
            show-overflow-tooltip
          />

          <el-table-column
            prop="ftype"
            label="文件类型"
            :formatter="formatFtype"
          />

          <el-table-column
            prop="suffixName"
            label="文件后缀"
          />

          <el-table-column
            prop="size"
            label="文件大小"
            sortable
          />

          <el-table-column
            prop="createTime"
            label="上传时间"
            :formatter="formatDate"
            sortable
          />

          <el-table-column
            prop="sysUser.username"
            label="操作人"
          />
          <!-- <el-table-column
            prop="isDelete"
            label="是否已删除"
            sortable
          /> -->

          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="success"
                @click="handleDownload(scope.$index, scope.row)"
              >下载</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>

          </el-table-column>
        </el-table>

        <div align="center">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { queryFileList, fileUpload, fileDownLoad, fileDelete } from '@/api/files'
import moment from 'moment'

// import qs from 'qs'
export default {
  name: 'Files',
  data() {
    return {
      // 表格当前页数据
      tableData: [],

      // 请求的URL
      url: 'job/queryjob',

      // 默认每页数据量
      pagesize: 10,

      // 当前页码
      currentPage: 1,

      // 查询的页码
      start: 1,

      // 默认数据总数
      totalCount: 1000,

      // 添加对话框默认可见性
      dialogFormVisible: false,

      // 修改对话框默认可见性
      updateFormVisible: false,

      // 提交的表单
      form: {
        jobName: '',
        jobGroup: '',
        cronExpression: ''
      },

      updateform: {
        jobName: '',
        jobGroup: '',
        cronExpression: ''
      },

      fileTypes: ['png', 'jpg', 'jpeg', 'zip', 'rar'],
      headers: {}

    }
  },
  mounted() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {

    // 搜索
    search: function() {
      this.loadData(this.currentPage, this.pagesize)
    },

    // 从服务器读取数据
    loadData: function(pageNum, pageSize) {
      const that = this
      queryFileList({ pageNum: pageNum, pageSize: pageSize }).then(response => {
        that.tableData = response.list.list
        that.totalCount = response.number
      })
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.currentPage, this.pagesize)
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
      fileUpload(formData).then(response => {
        console.log(response)
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '文件上传成功'
          })
          this.search()
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
      // var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      // if (!this.validFile(fileType)) {
      //   ret = '文件类型不符合要求'
      // }
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
    },
    formatDate(row, column) {
      // 获取单元格数据
      const date = row[column.property]
      if (date === undefined || date === null) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatFtype(row, column) {
      // 获取单元格数据
      const val = row[column.property]
      var result = '附件'
      switch (val) {
        case 1:
          result = '图片'
          break
        case 2:
          result = '附件'
          break
        default:
          result = ''
          break
      }
      return result
    },
    // 单行删除
    handleDelete: function(index, row) {
      const that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          fileDelete({ fid: row.fid }).then(response => {
            this.search()
            that.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleDownload: function(index, row) {
      console.log(index, row)

      fileDownLoad(row).then(response => {
        const data = response.data
        if (!data) {
          this.$message({
            type: 'warning',
            message: '下载失败'
          })
          return
        }
        console.log(response)
        const fileName = row.fname
        console.log('fileName=' + fileName)
        const url = window.URL.createObjectURL(new Blob([data]))
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', fileName)
        document.body.appendChild(a)
        // 点击下载
        a.click()
        // 下载完成移除元素
        document.body.removeChild(a)
        // 释放掉blob对象
        window.URL.revokeObjectURL(url)
        console.log('下载完成')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.inline-block {
  display: inline-block;
}
</style>

