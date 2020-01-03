<template>
  <div>
    <h1 class="d2-mt-0">菜单管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="菜单名称" :disabled="true" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getMenus">查询</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
        <!-- <el-button type="primary" @click="handleEdit()">修改</el-button>
        <el-button type="primary">删除</el-button> -->
      </el-col>

    </el-row>

    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form label-width="80px" size="mini">
        <el-form-item label="类型">
          <el-radio-group v-model="menu.type" @change="changeType">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="menu.type=='0'">
          <el-form-item label="目录名称">
            <el-input v-model="menu.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-input v-model="menu.parentName" auto-complete="off" readonly="readonly" @click.native="showMenuTree" />
          </el-form-item>
          <el-form-item label="菜单路由">
            <el-input v-model="menu.url" auto-complete="off" />
          </el-form-item>
          <el-form-item label="排序号">
            <el-input-number v-model="menu.orderNum" :step="1" :min="0" :max="1000000" controls-position="right" />
          </el-form-item>
        </template>
        <template v-if="menu.type=='1'">
          <el-form-item label="菜单名称">
            <el-input v-model="menu.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-input v-model="menu.parentName" auto-complete="off" readonly="readonly" @click.native="showMenuTree" />
          </el-form-item>
          <el-form-item label="菜单路由">
            <el-input v-model="menu.url" auto-complete="off" />
          </el-form-item>
          <el-form-item label="授权标识">
            <el-input v-model="menu.perms" auto-complete="off" />
          </el-form-item>
          <el-form-item label="排序号">
            <el-input-number v-model="menu.orderNum" :step="1" :min="0" :max="1000000" controls-position="right" />
          </el-form-item>
        </template>
        <template v-if="menu.type=='2'">
          <el-form-item label="按钮名称">
            <el-input v-model="menu.name" auto-complete="off" />
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-input v-model="menu.parentName" auto-complete="off" readonly="readonly" @click.native="showMenuTree" />
          </el-form-item>
          <el-form-item label="菜单路由">
            <el-input v-model="menu.url" auto-complete="off" />
          </el-form-item>
          <el-form-item label="授权标识">
            <el-input v-model="menu.perms" auto-complete="off" />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="commitEvent">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="选择菜单" :visible.sync="menuTreeDialog">
      <el-container style="height: 400px;width:100%; border: 1px solid #eee;overflow-y: scroll;">
        <el-tree
          ref="tree"
          style="width:100%;"
          :data="data2"
          node-key="menuId"
          highlight-current
          :props="defaultProps"
          :default-expanded-keys="[-1]"
        />
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuTreeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveParentMenu">确 定</el-button>
      </div>
    </el-dialog>

    <el-table :data="menus" row-key="menuId" border :tree-props="{children: 'children'}">
      <!-- <el-table-column prop="menuId" label="菜单ID" /> -->
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="icon" label="图标" />
      <el-table-column prop="type" label="类型">
        <!-- <template slot-scope="scope">
          <el-tag>{{ scope.row.type }}</el-tag>

        </template> -->
        <template slot-scope="scope">
          <template v-if="scope.row.type == '0'">
            <el-tag>目录</el-tag>
          </template>
          <template v-else-if="scope.row.type == '1'">
            <el-tag type="success">菜单</el-tag>
          </template>
          <template v-else-if="scope.row.type == '2'">
            <el-tag type="info">按钮</el-tag>
          </template>
        </template>

      </el-table-column>
      <el-table-column prop="orderNum" label="排序" />
      <el-table-column prop="url" label="路由" />
      <el-table-column prop="perms" label="授权标识" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.index,scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.index,scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
// import util from '@/libs/util.js'
import { getTree, addMenu, deleteMenu, editMenu } from '@/api/menu'
// import qs from 'qs'
import treeToArray from '@/utils/eval.js'
export default {
  name: 'Menu',
  data() {
    return {
      dialogTitle: '新增',
      menus: [],
      addDialogVisible: false,
      searchText: '',
      menu: { menuId: 0, name: '', type: '0', url: '', perms: '', parentId: '-1', parentName: '一级菜单', icon: '', orderNum: 0 },
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuTreeDialog: false,
      currentNode: {},
      props: {
        expandAll: {
          type: Boolean,
          default: false
        }
      },
      attrs: [
        {
          text: '菜单ID',
          value: 'menuId',
          width: 180
        },
        {
          text: '名称',
          value: 'name',
          width: 180
        },
        {
          text: '类型',
          value: 'type'
        },
        {
          text: '菜单URL',
          value: 'url'
        },
        {
          text: '权限标识',
          value: 'perms'
        },
        {
          text: '排序号',
          value: 'orderNum'
        }
      ]

    }
  },
  computed: {

  },
  mounted() {
    this.getMenus()
  },
  methods: {
    handleAdd() {
      this.dialogTitle = '新增'
      this.addDialogVisible = true
      this.menu = { menuId: 0, name: '', type: 0, url: '', perms: '', parentId: '-1', parentName: '一级菜单', icon: '', orderNum: 0 }
    },
    handleEdit: function(index, row) {
      var that = this
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      that.menu = row
    },
    getMenus: function(event) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log('sessionid==' + sid)
      getTree({ searchText: that.searchText, menuId: '-1' }).then(response => {
        that.menus = response.data.children
        console.log(response)
        // that.menus = that.formatData()
      })
    },
    addMenu: function(event) {
      var that = this
      addMenu(that.menu).then(response => {
        if (response) {
          that.getMenus()
          that.addDialogVisible = false
          that.$message({
            message: '操作成功！',
            type: 'success'
          })
        }
      })
    },
    editMenu: function(event) {
      var that = this
      editMenu(that.menu).then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: '执行成功!'
          })
          that.getMenus()
          that.addDialogVisible = false
        }
      })
    },
    commitEvent: function(event) {
      if (this.dialogTitle === '新增') {
        this.addMenu()
      } else {
        this.editMenu()
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
          deleteMenu({ menuId: row.menuId }).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getMenus()
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
    showMenuTree: function() {
      var that = this
      getTree({ searchText: that.searchText, menuId: '-1' }).then(response => {
        that.data2 = [response.data]
        that.menuTreeDialog = true
      })
    },
    saveParentMenu: function() {
      this.currentNode = this.$refs.tree.getCurrentNode()
      this.menuTreeDialog = false
      console.log(this.currentNode)
      this.menu.parentId = this.currentNode.menuId
      this.menu.parentName = this.currentNode.name
    },
    toggleExpanded: function(trIndex) {
      console.log(trIndex)
      const record = this.menus[trIndex]
      record._expanded = !record._expanded
      console.log(this.menus)
    },
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.menus)) {
        tmp = [this.menus]
      } else {
        tmp = this.menus
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      console.log('formatData....')
      console.log(args)
      return func.apply(null, args)
    },
    showRow: function(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;' : 'display:none;'
    },
    // 图标显示
    // iconShow(index, record) {
    //   return (index === 0 && record.children && record.children.length > 0)
    // },
    changeType() {
      console.log(this.menu.type)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  $color-blue: #2196F3;
  $space-width: 18px;
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: $space-width;
    height: 14px;
    &::before {
      content: ""
    }
  }
  .processContainer{
    width: 100%;
    height: 100%;
  }
  table td {
    line-height: 26px;
  }

  .tree-ctrl{
    position: relative;
    cursor: pointer;
    color: $color-blue;
    margin-left: -$space-width;
  }
  .tree-ctrl i {
    font-size: 20px;
    margin-left: 10px;
  }
</style>
