<template>
  <div>
    <h1 class="d2-mt-0">用户管理</h1>
    <el-row class="d2-mb">
      <el-form :inline="true">
        <el-form-item label="账号">
          <el-input v-model.trim="searchText" type="text" placeholder="账号" />
        </el-form-item>
        <el-form-item label="角色">
          <!-- <el-select v-model="filters.options.rolesOptions.value" placeholder="请选择">
            <el-option
              v-for="item in filters.options.rolesOptions.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
          <el-select
            v-model="searchObj.roles"
            style="width:100%;"
            filterable
            multiple
            allow-create
            default-first-option
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-button @click="search">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form ref="userRef" label-width="80px" size="mini" :rules="rules" :model="user">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="user.username" auto-complete="off" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="user.nickname" auto-complete="off" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password" :style="{display:showPassWordInput}">
          <el-input ref="password" v-model="user.password" :type="passwordType" auto-complete="off" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-input v-model="user.deptName" auto-complete="off" readonly="readonly" @click.native="showDeptTree">
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" type="email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="user.mobile" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="rolesSelect"
            style="width:100%;"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择角色"
            @change="rolesSelectChange"
          >
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="user.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="commitEvent('userRef')">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div>
      <el-table :data="users" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column prop="userId" label="主键" width="180" /> -->
        <el-table-column prop="username" label="账号" width="180" />
        <el-table-column prop="nickname" label="昵称" width="180" />
        <el-table-column prop="sysDept.name" label="所属部门" />
        <!-- <el-table-column prop="email" label="邮箱" /> -->
        <!-- <el-table-column prop="mobile" label="手机" /> -->
        <el-table-column prop="roleList" label="角色" :formatter="formatRoles" />

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
            <!-- <el-button type="text" size="small">查看</el-button> -->
            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="resetPassword(scope.$index, scope.row)">重置密码</el-button>
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

    <el-dialog title="选择" :visible.sync="deptTreeDialog" :close-on-click-modal="false">
      <el-container style="height: 400px;width:100%; border: 1px solid #eee;overflow-y: scroll;">
        <el-tree
          ref="tree"
          show-checkbox
          :check-strictly="true"
          style="width:100%;"
          :data="deptTreeData"
          node-key="deptId"
          highlight-current
          :props="defaultProps"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          @node-click="handleNodeClick"
          @check-change="checkChange"
        />
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptTreeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveParent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import util from '@/libs/util.js'
// import { getToken } from '@/utils/auth'
import { deleteUser, editUser, resetPassword } from '@/api/user'
import { getList } from '@/api/role'
import { getTree as getDeptTree } from '@/api/dept'

// import qs from 'qs'
export default {
  name: 'User',
  data() {
    return {
      dialogTitle: '新增',
      users: [],
      addDialogVisible: false,
      searchText: '',
      user: {
        userId: 0,
        username: '',
        nickname: '',
        password: '',
        deptName: '',
        email: '',
        mobile: '',
        status: '1',
        deptId: '',
        roleList: [],
        menuList: []
      },
      searchObj: {
        userId: 0,
        username: '',
        nickname: '',
        password: '',
        deptName: '',
        email: '',
        mobile: '',
        status: '1',
        deptId: '',
        roleList: [],
        menuList: []
      },
      rules: {
        username: [
          { required: true, message: '请输账号', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在3 到 30 个字符', trigger: ['blur', 'change'] }
        ],
        nickname: [
          { required: true, message: '请输昵称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2 到 30 个字符', trigger: ['blur', 'change'] }
        ],
        deptId: [
          { required: true, message: '请输部门', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      roles: [],
      rolesSelect: [],
      passwordType: 'password',
      showPassWordInput: 'block',
      // 默认每页数据量
      pagesize: 10,
      // 当前页码
      currentPage: 1,
      // 查询的页码
      start: 1,
      // 默认数据总数
      totalCount: 1000,
      deptTreeData: [],
      deptTreeDialog: false,
      defaultExpandedKeys: ['-1'],
      defaultCheckedKeys: ['-1'],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: function(data, node) {
          if (node.childNodes.length > 0) {
            return true
          } else {
            return false
          }
        }
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    // 搜索
    search: function() {
      this.getUsers(this.currentPage, this.pagesize)
    },
    getUsers: function(pageNum, pageSize) {
      const that = this
      this.searchObj.username = this.searchText
      this.searchObj.pageNum = pageNum
      this.searchObj.pageSize = pageSize

      this.$store
        .dispatch('user/list', that.searchObj)
        .then(datas => {
          that.users = datas.list
          that.totalCount = datas.list.length
        })
        .catch(err => {
          console.log(err)
        })

      this.getRoles()
    },
    addUser: function(event) {
      var that = this
      this.$store
        .dispatch('user/add', that.user)
        .then(datas => {
          that.resetObject()
          that.search()
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
          console.log({ userId: row.userId }, 'delete 111111111')
          deleteUser({ userId: row.userId }).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '执行成功'
              })
              that.search()
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
      this.showPassWordInput = 'block'
      this.passwordType = 'password'
      this.addDialogVisible = true
      this.user = { userId: 0, username: '', nickname: '', password: '', email: '', mobile: '', status: 1, deptId: '' }
      this.rolesSelect = []
    },
    handleEdit: function(index, row) {
      var that = this
      this.showPassWordInput = 'none'
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      this.initRowToObj(row)
      // that.user = row
      that.rolesSelect = that.user.roles.slice()
    },
    initRowToObj: function(row) {
      this.user = JSON.parse(JSON.stringify(row))
      this.user.deptName = row.sysDept.name
    },
    editUser: function(event) {
      var that = this
      editUser(that.user).then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
          that.resetObject()
          that.search()
          that.addDialogVisible = false
        }
      })
    },
    resetPassword: function(index, row) {
      var that = this
      this.$confirm('重置该用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          resetPassword({ userId: row.userId }).then(response => {
            if (response.status === 200) {
              that.$message({
                type: 'success',
                message: '执行成功'
              })
            } else {
              that.$message({
                type: 'error',
                message: '执行失败'
              })
            }
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已经取消'
          })
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
    },
    resetObject: function() {
      this.user = {}
    },
    formatRoles(row, column) {
      var result = ''
      // 获取单元格数据
      const val = row[column.property]
      var temp = null
      for (var i = 0; i < val.length; i++) {
        temp = val[i]
        result = result + temp.roleName + '|'
      }
      return result
    },

    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.search()
    },

    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },

    showDeptTree: function(event) {
      var that = this
      getDeptTree({ deptId: '-1' }).then(response => {
        that.deptTreeData = [response.data]
        that.deptTreeDialog = true
        that.defaultExpandedKeys = [that.user.deptId]
        that.defaultCheckedKeys = [that.user.deptId]
      })
      // getSceneTypeTree({ stId: '0', stType: '1' }).then(response => {
      //   that.sceneTypeTree = [response.data]
      //   console.log(response)
      //   that.sceneTypeTreeDialog = true
      //   that.defaultExpandedKeys = [that.data.roadType]
      //   that.defaultCheckedKeys = [that.data.roadType]
      // })
    },
    handleNodeClick(item, node, self) { // 自己定义的editCheckId，防止单选出现混乱
      if (item.children.length === 0) {
        this.editCheckId = item.deptId
        this.$refs.tree.setCheckedKeys([item.deptId])
      }
    },
    checkChange(item, node, self) {
      if (item.children.length === 0) {
        if (node === true) {
          this.editCheckId = item.deptId
          this.$refs.tree.setCheckedKeys([item.deptId])
        } else {
          if (this.editCheckId === item.deptId) {
            this.$refs.tree.setCheckedKeys([item.deptId])
          }
        }
      } else {
        this.$refs.tree.setChecked(item, false)
      }
    },
    saveParent: function() {
      this.currentNode = this.$refs.tree.getCheckedNodes()[0]
      this.deptTreeDialog = false
      this.user.deptId = this.currentNode.deptId
      this.user.deptName = this.currentNode.name
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

