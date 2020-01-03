<template>
  <div>
    <h1 class="d2-mt-0">定时任务</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="bean名称" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getTasks">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleAdd">删除</el-button>
        <el-button type="primary" @click="stopCron">暂停</el-button>
        <el-button type="primary" @click="changeCron10">恢复10</el-button>
        <el-button type="primary" @click="startCron">执行</el-button>
        <el-button type="primary" @click="handleAdd">日志列表</el-button>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form ref="taskRef" label-width="100px" size="mini" :rules="taskRules" :model="user">
        <el-form-item label="bean名称" prop="beanName">
          <el-input v-model="task.beanName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="参数" prop="param">
          <el-input v-model="task.param" auto-complete="off" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExp">
          <el-input v-model="task.cronExp" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="task.remark" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitEvent('taskRef')">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="users" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="userId" label="主键" width="180" />
      <el-table-column prop="username" label="账号" width="180" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="mobile" label="手机" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status == '0'">
            <el-tag type="info">禁用</el-tag>
          </template>
          <template v-else-if="scope.row.status == '1'">
            <el-tag type="success">正常</el-tag>
          </template>
          <!-- <template v-else>
            <el-tag type="info">按钮</el-tag>
          </template> -->
        </template>

      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import util from '@/libs/util.js'
// import { getToken } from '@/utils/auth'
import { deleteUser, editUser } from '@/api/user'
import { startCron, stopCron, changeCron10 } from '@/api/task'
import { getList } from '@/api/role'

// import qs from 'qs'
export default {
  name: 'Task',
  data() {
    return {
      dialogTitle: '新增',
      tasks: [],
      addDialogVisible: false,
      searchText: '',
      task: {
        taskId: 0,
        beanName: '',
        param: '',
        cronExp: '',
        remark: ''
      },
      taskRules: {
        beanName: [
          { required: true, message: '请输bean名称', trigger: 'blur' }
        ],
        cronExp: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    startCron: function() {
      const that = this
      startCron().then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
        }
      })
    },
    stopCron: function() {
      const that = this
      stopCron().then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
        }
      })
    },
    changeCron10: function() {
      const that = this
      changeCron10().then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
        }
      })
    },

    getTasks: function(event) {
      const that = this
      this.$store
        .dispatch('task/list', {})
        .then(datas => {
          that.tasks = datas
        })
        .catch(err => {
          console.log(err)
        })
    },
    addUser: function(event) {
      var that = this
      this.$store
        .dispatch('user/add', that.user)
        .then(datas => {
          that.getUsers()
          that.addDialogVisible = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDelete: function(index, row) {
      var that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUser({ userId: row.userId }).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '执行成功'
              })
              that.getUsers()
            }
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleAdd() {
      this.dialogTitle = '新增'
      this.showPassWordInput = 'display'
      this.passwordType = 'password'
      this.addDialogVisible = true
      this.user = { userId: 0, username: '', password: '', email: '', mobile: '', status: 1, deptId: '' }
    },
    handleEdit: function(index, row) {
      var that = this
      this.showPassWordInput = 'none'
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      that.user = row
      that.rolesSelect = that.user.roles.slice()
    },
    editUser: function(event) {
      var that = this
      editUser(that.user).then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
          that.getUsers()
          that.addDialogVisible = false
        }
      })
    },
    commitEvent: function(userRef) {
      var that = this
      this.$refs[userRef].validate((valid) => {
        if (valid) {
          that.user.roles = that.rolesSelect
          if (this.dialogTitle === '新增') {
            this.addUser()
          } else {
            that.user.password = ''
            this.editUser()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRoles: function(event) {
      var that = this
      getList({}).then(response => {
        that.roles = response.data
      })
    },
    rolesSelectChange: function(val) {
      console.log('rolesSelectChange...', val)
      this.rolesSelect = val
      console.log('user.roles...', this.user.roles)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
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
</style>

