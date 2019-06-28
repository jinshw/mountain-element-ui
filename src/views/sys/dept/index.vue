<template>
  <div>
    <h1 class="d2-mt-0">部门管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="部门名称" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getDepts">查询</el-button>
        <el-button type="primary" @click="clickAdd()">新增</el-button>
        <el-button type="primary">修改</el-button>
        <el-button type="primary">删除</el-button>
      </el-col>
    </el-row>

    <!-- el-table -->
    <el-table :data="depts" row-key="deptId" border :tree-props="{children: 'children'}">
      <el-table-column prop="deptId" label="部门ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="parentName" label="上级部门" />
      <el-table-column prop="orderNum" label="排序号" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增" :visible.sync="addDialogVisible">
      <el-form label-width="80px" size="mini">
        <el-form-item label="部门名称">
          <el-input v-model="dept.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="上级部门">
          <el-input
            v-model="dept.parentName"
            auto-complete="off"
            readonly="readonly"
            @click.native="showTree"
          />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number
            v-model="dept.orderNum"
            :step="1"
            :min="0"
            :max="1000000"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDept">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="上级部门" :visible.sync="treeDialog">
      <el-container style="height: 400px;width:100%; border: 1px solid #eee;overflow-y: scroll;">
        <el-tree
          ref="tree"
          style="width:100%;"
          :data="data2"
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveParentDept">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import util from '@/libs/util.js'
import { getTree, addDept, deleteDept } from '@/api/dept'
// import qs from 'qs'
import treeToArray from '@/utils/eval.js'
export default {
  name: 'Dept',
  data() {
    return {
      searchText: '',
      addDialogVisible: false,
      dept: {
        deptId: 0,
        parentId: -1,
        parentName: '一级部门',
        name: '',
        orderNum: 0,
        delFlag: 0
      },
      depts: [],
      attrs: [
        {
          text: '部门ID',
          value: 'deptId',
          width: 180
        },
        {
          text: '部门名称',
          value: 'name',
          width: 180
        },
        {
          text: '上级部门',
          value: 'parentName'
        },
        {
          text: '排序号',
          value: 'orderNum'
        }
      ],
      data2: [],
      treeDialog: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted() {
    this.getDepts()
  },
  methods: {
    clickAdd() {
      this.addDialogVisible = true
      this.dept = {
        deptId: 0,
        parentId: -1,
        parentName: '一级部门',
        name: '',
        orderNum: 0,
        delFlag: 0
      }
    },
    getDepts: function(event) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log('sessionid==' + sid)
      getTree({ deptId: '-1' }).then(response => {
        console.log(response, 'getTree...')
        that.depts = response.data.children
        // that.depts = that.formatData()
      })

      // this.$axios({
      //   method: 'post',
      //   url: '/sysdept/getTree',
      //   headers: { },
      //   data: qs.stringify({ searchText: that.searchText, deptId: '-1' })
      // })
      //   .then(res => {
      //     console.log(res.data)
      //     if (res.data.code === 444) {
      //       that.$message({
      //         message: '登录过期，即将跳转登录页面',
      //         type: 'warning',
      //         duration: 5000,
      //         onClose: function() {
      //           window.location.href = 'http://localhost:8081/mt#/login'
      //         }
      //       })
      //     } else {
      //       that.depts = res.data.children
      //       that.depts = that.formatData()
      //     }
      //   })
      //   .catch(err => {
      //     console.log('err: ', err, err.response.data.message)
      //     if (
      //       err.response.data.message.includes(
      //         'Subject does not have permission'
      //       )
      //     ) {
      //       this.$message({
      //         message: '警告，没有操作权限',
      //         type: 'warning'
      //       })
      //     }
      //   })
    },
    toggleExpanded: function(trIndex) {
      console.log(trIndex)
      const record = this.depts[trIndex]
      record._expanded = !record._expanded
      console.log(this.depts)
    },
    // 格式化数据源
    formatData: function() {
      let tmp
      if (!Array.isArray(this.depts)) {
        tmp = [this.depts]
      } else {
        tmp = this.depts
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll]
      console.log('formatData....')
      console.log(args)
      return func.apply(null, args)
    },
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0
    },

    showTree: function() {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log('sessionid==' + sid)

      getTree({ deptId: '-1' }).then(response => {
        console.log(response, 'getTree...')
        that.data2 = [response.data]
        that.treeDialog = true
      })

      // this.$axios({
      //   method: 'post',
      //   url: '/sysdept/getTree',
      //   headers: { },
      //   data: qs.stringify({ searchText: that.searchText, deptId: '-1' })
      // })
      //   .then(res => {
      //     console.log(res.data)
      //     that.data2 = [res.data]
      //     that.treeDialog = true
      //   })
      //   .catch(err => {
      //     console.log('err: ', err, err.response.data.message)
      //     if (
      //       err.response.data.message.includes(
      //         'Subject does not have permission'
      //       )
      //     ) {
      //       this.$message({
      //         message: '警告，没有操作权限',
      //         type: 'warning'
      //       })
      //     }
      //   })
    },
    saveParentDept: function() {
      this.currentNode = this.$refs.tree.getCurrentNode()
      this.treeDialog = false
      console.log(this.currentNode)
      this.dept.parentId = this.currentNode.deptId
      this.dept.parentName = this.currentNode.name
    },
    addDept: function(event) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log('sessionid==' + sid, that.dept)

      addDept(that.dept).then(response => {
        that.getDepts()
        that.addDialogVisible = false
      })

      // this.$axios({
      //   method: 'post',
      //   url: '/sysdept/add',
      //   headers: {},
      //   data: qs.stringify(that.dept)
      // })
      //   .then(res => {
      //     console.log(res)
      //     if (res.status === 200) {
      //       that.getDepts()
      //       that.addDialogVisible = false
      //       that.$message({
      //         message: '操作成功！',
      //         type: 'success'
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     console.log('err: ', err)
      //   })
    },
    handleDelete: function(index, row) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log(index, row, row.deptId, sid)

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDept({ deptId: row.deptId }).then(response => {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getDepts()
          })

          // that
          //   .$axios({
          //     method: 'post',
          //     url: '/sysdeptDelete',
          //     headers: {},
          //     data: qs.stringify({ deptId: row.deptId })
          //   })
          //   .then(res => {
          //     console.log(res)
          //     if (res.data.status === 200) {
          //       that.$message({
          //         type: 'success',
          //         message: '删除成功!'
          //       })
          //       that.getDepts()
          //     } else if (res.data.status === 201) {
          //       that.$message({
          //         type: 'info',
          //         message: '不是子节点不能删除!'
          //       })
          //     }
          //   })
          //   .catch(err => {
          //     console.group('结果..')
          //     console.log('err: ', err)
          //   })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
