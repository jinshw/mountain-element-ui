<template>
  <div>
    <h1 class="d2-mt-0">字典管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model.trim="searchText" type="text" placeholder="字典名称" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getDicts">查询</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-col>
    </el-row>

    <!-- el-table -->
    <el-table :data="dicts" row-key="dictId" style="width: 100%">
      <el-table-column prop="dictId" label="部门ID" />
      <el-table-column prop="dictName" label="名称" />
      <el-table-column prop="dictGroupName" label="分组名称" />
      <el-table-column prop="dictValue" label="字典值" />
      <el-table-column prop="orders" label="排序号" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" :formatter="dateFormat" label="创建时间" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form label-width="100px" size="mini">
        <el-form-item label="字典名称">
          <el-input v-model="dict.dictName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="字典组名称">
          <el-input v-model="dict.dictGroupName" auto-complete="off" />
        </el-form-item>
        <el-form-item label="字典值">
          <el-input v-model="dict.dictValue" auto-complete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dict.remark" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number
            v-model="dict.orders"
            :step="1"
            :min="0"
            :max="1000000"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitEvent">立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import { getDicts, addDict, editDict, deleteDict } from '@/api/dict'
export default {
  name: 'Dict',
  data() {
    return {
      dialogTitle: '新增',
      searchText: '',
      addDialogVisible: false,
      dict: {
        dictId: 0,
        dictName: '',
        dictGroupName: '',
        dictValue: '',
        orders: 0
      },
      dicts: []
    }
  },
  mounted() {
    this.getDicts()
  },
  methods: {
    getDicts: function(event) {
      var that = this
      this.dict.dictName = this.searchText
      getDicts(that.dict).then(response => {
        that.dicts = response.data
      })
    },
    handleAdd() {
      this.dialogTitle = '新增'
      this.addDialogVisible = true
      this.dict = {
        dictId: 0,
        dictName: '',
        dictGroupName: '',
        dictValue: '',
        orders: 0
      }
    },
    handleEdit: function(index, row) {
      var that = this
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      that.dict = row
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

    addDict: function(event) {
      var that = this
      this.dialogTitle = '新增'
      addDict(that.dict).then(response => {
        if (response) {
          that.$message({
            type: 'success',
            message: that.dialogTitle + '成功!'
          })
          that.resetDict()
          that.getDicts()
          that.addDialogVisible = false
        }
      })
    },
    editDict: function(event) {
      var that = this
      this.dialogTitle = '编辑'
      editDict(that.dict).then(response => {
        that.resetDict()
        that.getDicts()
        that.addDialogVisible = false
      })
    },
    commitEvent: function() {
      if (this.dialogTitle === '新增') {
        this.addDict()
      } else {
        this.editDict()
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
          deleteDict({ dictId: row.dictId }).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getDicts()
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

    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    resetDict: function() {
      this.dict = {
        dictId: 0,
        dictName: '',
        dictGroupName: '',
        dictValue: '',
        orders: 0
      }
    }

  }
}
</script>
