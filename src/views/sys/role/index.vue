<template>
  <div>
    <h1 class="d2-mt-0">角色管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="角色名称" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getRoles">查询</el-button>
        <el-button type="primary" @click="showMenuTree">新增</el-button>
        <el-button type="primary">修改</el-button>
        <el-button type="primary">删除</el-button>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" width="50%" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" size="mini">
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.remark" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-col :span="12">
            <el-form-item label="菜单授权">
              <el-tree
                ref="menuTree"
                :data="menuTreeData"
                :props="defaultProps"
                node-key="menuId"
                :default-expand-all="true"
                show-checkbox
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据授权">
              <el-tree
                ref="deptTree"
                :data="deptTreeData"
                :props="defaultProps"
                node-key="deptId"
                :default-expand-all="true"
                show-checkbox
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">立即提交</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <el-table :data="roles" style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="roleId" label="角色ID" width="180" />
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="remark" label="角色描述" />
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
import { getList, addRole, deleteRole } from '@/api/role'
import { getTree as getMenuTree } from '@/api/menu'
import { getTree as getDeptTree } from '@/api/dept'
// import qs from 'qs'
// import $ from 'jquery'
export default {
  name: 'Role',
  data() {
    return {
      dialogTitle: '新增角色',
      roles: [],
      addDialogVisible: false,
      searchText: '',
      role: { roleName: '', remark: '', roleId: 0, menus: [] },
      menus: [],
      menu: {
        menuId: 0,
        name: '',
        type: '0',
        url: '',
        perms: '',
        parentId: '-1',
        parentName: '一级菜单',
        icon: '',
        orderNum: 0
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuTreeData: [],
      deptTreeData: []
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    getRoles: function(event) {
      var that = this
      getList({}).then(response => {
        that.roles = response.data
      })
      that.getMenuTree()
      that.showDeptTree()
    },
    addRole: function(event) {
      var that = this
      that.role.menus = this.$refs.menuTree.getCheckedNodes()
      that.role.depts = this.$refs.deptTree.getCheckedNodes()
      console.log(that.role.menus, that.role.depts)
      addRole(that.role).then(response => {
        that.$message({
          type: 'success',
          message: '执行成功!'
        })
        that.getRoles()
        that.addDialogVisible = false
      })
    },
    handleDelete: function(index, row) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log(index, row, row.roleId, sid)

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole({ roleId: row.roleId }).then(response => {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getRoles()
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleEdit: function(index, row) {
      var that = this
      that.dialogTitle = '编辑'
      // that.getMenuTree()
      // that.showDeptTree()
      that.addDialogVisible = true
      that.role = row
      this.setTree()
    },
    getMenus: function(event) {
      var that = this
      getMenuTree({ searchText: that.searchText, menuId: '-1' }).then(response => {
        that.menus = response.data.children
      })
    },
    showMenuTree: function() {
      var that = this
      this.dialogTitle = '新增'
      that.role = {}
      that.getMenuTree()
      that.showDeptTree()
      that.addDialogVisible = true
    },
    getMenuTree: function() {
      var that = this
      getMenuTree({ searchText: that.searchText, menuId: '-1' }).then(response => {
        that.menuTreeData = [response.data]
      })
    },
    showDeptTree: function() {
      var that = this
      getDeptTree({ deptId: '-1' }).then(response => {
        that.deptTreeData = [response.data]
      })
    },
    setTree: function() {
      this.$refs.menuTree.setCheckedNodes(this.role.menus)
      this.$refs.deptTree.setCheckedNodes(this.role.depts)
    }
  }
}
</script>
