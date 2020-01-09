<template>
  <div>
    <h1 class="d2-mt-0">定时任务</h1>
    <div>

      <div id="top">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="handleadd">添加</el-button>
      </div>

      <div style="margin-top:15px">

        <el-table
          ref="testTable"
          :data="tableData"
          style="width:100%"
          border
        >
          <el-table-column
            prop="job_NAME"
            label="任务名称"
            sortable
            show-overflow-tooltip
          />

          <el-table-column
            prop="job_GROUP"
            label="任务所在组"
            sortable
          />

          <el-table-column
            prop="job_CLASS_NAME"
            label="任务类名"
            sortable
          />

          <el-table-column
            prop="trigger_NAME"
            label="触发器名称"
            sortable
          />

          <el-table-column
            prop="trigger_GROUP"
            label="触发器所在组"
            sortable
          />

          <el-table-column
            prop="cron_EXPRESSION"
            label="表达式"
            sortable
          />
          <el-table-column
            prop="trigger_STATE"
            label="状态"
            sortable
          />

          <el-table-column
            prop="time_ZONE_ID"
            label="时区"
            sortable
          />

          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="warning"
                @click="handlePause(scope.$index, scope.row)"
              >暂停</el-button>

              <el-button
                size="small"
                type="info"
                @click="handleResume(scope.$index, scope.row)"
              >恢复</el-button>

              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>

              <el-button
                size="small"
                type="success"
                @click="handleUpdate(scope.$index, scope.row)"
              >修改</el-button>
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

      <el-dialog title="添加任务" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="120px">
          <el-form-item label="任务名称">
            <el-input v-model="form.jobName" auto-complete="off" placeholder="com.site.job.HelloJob" />
          </el-form-item>
          <el-form-item label="任务分组">
            <el-input v-model="form.jobGroup" auto-complete="off" placeholder="分组名称" />
          </el-form-item>
          <el-form-item label="表达式">
            <el-input v-model="form.cronExpression" auto-complete="off" placeholder="*/10 * * * * ?" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改任务" :visible.sync="updateFormVisible">
        <el-form :model="updateform">
          <el-form-item label="表达式" label-width="120px" style="width:35%">
            <el-input v-model="updateform.cronExpression" auto-complete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { queryjob, addjob, pausejob, resumejob, deletejob, reschedulejob } from '@/api/job'

// import qs from 'qs'
export default {
  name: 'Job',
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
      }
    }
  },
  mounted() {
    this.loadData(this.currentPage, this.pagesize)
  },
  methods: {

    // 从服务器读取数据
    loadData: function(pageNum, pageSize) {
      const that = this
      queryjob({ pageNum: pageNum, pageSize: pageSize }).then(response => {
        that.tableData = response.JobAndTrigger.list
        that.totalCount = response.number
      })
      // this.$http.get('job/queryjob?' + 'pageNum=' + pageNum + '&pageSize=' + pageSize).then(function(res) {
      //   console.log(res)
      //   this.tableData = res.body.JobAndTrigger.list
      //   this.totalCount = res.body.number
      // }, function() {
      //   console.log('failed')
      // })
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
          deletejob({ 'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP }).then(response => {
            that.loadData(this.currentPage, this.pagesize)
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 暂停任务
    handlePause: function(index, row) {
      const that = this
      pausejob({ 'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP }).then(response => {
        that.loadData(that.currentPage, that.pagesize)
      })
      // this.$http.post('job/pausejob', { 'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP }, { emulateJSON: true }).then(function(res) {
      //   this.loadData(this.currentPage, this.pagesize)
      // }, function() {
      //   console.log('failed')
      // })
    },

    // 恢复任务
    handleResume: function(index, row) {
      const that = this
      resumejob({ 'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP }).then(response => {
        that.loadData(that.currentPage, that.pagesize)
      })
      // this.$http.post('job/resumejob', { 'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP }, { emulateJSON: true }).then(function(res) {
      //   this.loadData(this.currentPage, this.pagesize)
      // }, function() {
      //   console.log('failed')
      // })
    },

    // 搜索
    search: function() {
      this.loadData(this.currentPage, this.pagesize)
    },

    // 弹出对话框
    handleadd: function() {
      this.dialogFormVisible = true
    },

    // 添加
    add: function() {
      const that = this
      addjob({ 'jobClassName': this.form.jobName,
        'jobGroupName': this.form.jobGroup, 'cronExpression': this.form.cronExpression }).then(response => {
        that.loadData(that.currentPage, that.pagesize)
        that.dialogFormVisible = false
      })

      // this.$http.post('job/addjob', { 'jobClassName': this.form.jobName, 'jobGroupName': this.form.jobGroup, 'cronExpression': this.form.cronExpression }, { emulateJSON: true }).then(function(res) {
      //   this.loadData(this.currentPage, this.pagesize)
      //   this.dialogFormVisible = false
      // }, function() {
      //   console.log('failed')
      // })
    },

    // 更新
    handleUpdate: function(index, row) {
      console.log(row)
      this.updateFormVisible = true
      this.updateform.jobName = row.job_CLASS_NAME
      this.updateform.jobGroup = row.job_GROUP
      this.updateform.cronExpression = row.cron_EXPRESSION
    },

    // 更新任务
    update: function() {
      const that = this
      reschedulejob({ 'jobClassName': this.updateform.jobName,
        'jobGroupName': this.updateform.jobGroup, 'cronExpression': this.updateform.cronExpression }).then(response => {
        that.loadData(this.currentPage, this.pagesize)
        that.updateFormVisible = false
      })
      // this.$http.post('job/reschedulejob',
      //   { 'jobClassName': this.updateform.jobName,
      //     'jobGroupName': this.updateform.jobGroup,
      //     'cronExpression': this.updateform.cronExpression
      //   }, { emulateJSON: true }
      // ).then(function(res) {
      //   this.loadData(this.currentPage, this.pagesize)
      //   this.updateFormVisible = false
      // }, function() {
      //   console.log('failed')
      // })
    },

    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.currentPage, this.pagesize)
    },

    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.loadData(this.currentPage, this.pagesize)
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
</style>

