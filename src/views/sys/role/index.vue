<template>
  <div>
    <h1 class="d2-mt-0">角色管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="角色名称" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getRoles">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <!-- <el-button type="primary">修改</el-button>
        <el-button type="primary">删除</el-button> -->
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
                :default-checked-keys="defaultCheckedMenu"
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
                :default-checked-keys="defaultCheckedDept"
                show-checkbox
              />
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="commitEvent">立即提交</el-button>
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
import { getList, addRole, deleteRole, editRole } from '@/api/role'
import { getTree as getMenuTree } from '@/api/menu'
import { getTree as getDeptTree } from '@/api/dept'
// import qs from 'qs'
// import $ from 'jquery'
export default {
  name: 'Role',
  data() {
    return {
      dialogTitle: '新增',
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
      defaultCheckedMenu: [],
      defaultCheckedDept: [],
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
      this.role.roleName = this.searchText
      getList(this.role).then(response => {
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
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
          that.resetObject()
          that.getRoles()
          that.addDialogVisible = false
        }
      })
    },
    editRole: function(event) {
      var that = this
      that.role.menus = this.$refs.menuTree.getCheckedNodes()
      that.role.depts = this.$refs.deptTree.getCheckedNodes()
      editRole(that.role).then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
          that.resetObject()
          that.getRoles()
          that.addDialogVisible = false
        }
      })
    },
    commitEvent: function(event) {
      if (this.dialogTitle === '新增') {
        this.addRole()
      } else {
        this.editRole()
      }
    },
    handleDelete: function(index, row) {
      var that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole({ roleId: row.roleId }).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getRoles()
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
    handleAdd: function() {
      var that = this
      this.dialogTitle = '新增'
      that.role = {}
      that.defaultCheckedMenu = []
      that.defaultCheckedDept = []
      that.getMenuTree()
      that.showDeptTree()
      that.addDialogVisible = true
    },
    handleEdit: function(index, row) {
      var that = this
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      that.role = row
      that.defaultCheckedMenu = []
      that.defaultCheckedDept = []

      for (var indexMenu in row.menus) {
        that.getMenuTreeCheckedKeys(that.defaultCheckedMenu, row.menus[indexMenu])
      }
      for (var indexDept in row.depts) {
        that.getDeptTreeCheckedKeys(that.defaultCheckedDept, row.depts[indexDept])
      }
      console.log(that.defaultCheckedMenu, that.defaultCheckedDept)
      this.setTree()
    },
    getMenus: function(event) {
      var that = this
      getMenuTree({ searchText: that.searchText, menuId: '-1' }).then(response => {
        that.menus = response.data.children
      })
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
      if (this.$refs.menuTree !== undefined) {
        this.$refs.menuTree.setCheckedNodes(this.role.menus)
      }
      if (this.$refs.deptTree !== undefined) {
        this.$refs.deptTree.setCheckedNodes(this.role.depts)
      }
    },
    getDeptTreeCheckedKeys: function(arr, node) {
      var that = this
      if (node.children.length === 0) {
        arr.push(node.deptId)
        return node.deptId
      }
      for (var index in node.children) {
        that.getDeptTreeCheckedKeys(arr, node.children[index])
      }
      arr.push(node.deptId)
    },
    getMenuTreeCheckedKeys: function(arr, node) {
      var that = this
      if (node.children.length === 0) {
        arr.push(node.menuId)
        return node.menuId
      }
      for (var index in node.children) {
        that.getMenuTreeCheckedKeys(arr, node.children[index])
      }
      arr.push(node.menuId)
    },
    resetObject: function() {
      this.role = { roleName: '', remark: '', roleId: 0, menus: [] }
    }
  }
}
</script>
