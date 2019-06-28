<template>
  <div>
    <h1 class="d2-mt-0">用户管理</h1>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model="searchText" type="text" placeholder="账号" />
      </el-col>
      <el-col :span="18">
        <el-button @click="getUsers">查询</el-button>
        <el-button type="primary" @click="addDialogVisible=true">新增</el-button>
        <el-button type="primary">修改</el-button>
        <el-button type="primary">删除</el-button>
      </el-col>
    </el-row>
    <el-dialog title="新增用户" :visible.sync="addDialogVisible">
      <el-form label-width="80px" size="mini">
        <el-form-item label="登录账号">
          <el-input v-model="user.username" auto-complete="off" />
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="user.password" type="password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" type="email" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="user.mobile" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="user.status" auto-complete="off" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addUser">立即提交</el-button>
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
      <el-table-column prop="status" label="状态" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import util from '@/libs/util.js'
import { getToken } from '@/utils/auth'
import { deleteUser } from '@/api/user'

import qs from 'qs'
export default {
  name: 'User',
  data() {
    return {
      users: [],
      addDialogVisible: false,
      searchText: '',
      user: {
        userId: 0,
        username: '',
        password: '',
        email: '',
        mobile: '',
        status: '',
        deptId: ''
      }
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers: function(event) {
      const that = this
      this.$store
        .dispatch('user/list', {})
        .then(datas => {
          console.log('2222', datas)
          that.users = datas
        })
        .catch(err => {
          console.log(err)
        })

      /*
      this.$axios({
        method: 'post',
        url: '/sysuser/list',
        headers: { token: sid },
        data: qs.stringify({ searchText: that.searchText })
        // headers: {
        //     'X-Requested-With': 'XMLHttpRequest'
        // }
      }).then(res => {
        console.log('ttttttttttt.....')
        console.log(res)
        if (res.data.code === 444) {
          that.$message({
            message: '登录过期，即将跳转登录页面',
            type: 'warning',
            duration: 5000,
            onClose: function() {
              window.location.href = 'http://localhost:8081/mt#/login'
            }
          })
        } else if (res.data.code === 600) {
          that.$message({
            message: res.data.msg,
            type: 'warning',
            duration: 5000
          })
        } else {
          that.users = res.data
        }
      }).catch(err => {
        console.group('登陆结果..')
        console.log('err: ', err)
      })
      */
    },
    addUser: function(event) {
      var that = this
      console.log('addUser....')
      // var sid = util.cookies.get('sessionId')
      // console.log('sessionid==' + sid)
      // var sid = getToken('sessionId')
      this.$store
        .dispatch('user/add', that.user)
        .then(datas => {
          that.getUsers()
          that.addDialogVisible = false
        })
        .catch(err => {
          console.log(err)
        })

      // axios({
      //   method: 'post',
      //   url: '/sysuser/add',
      //   headers: { token: sid },
      //   data: qs.stringify(that.user)
      // })
      //   .then(res => {
      //     console.log(res)
      //     if (res.status === 200) {
      //       that.getUsers()
      //       that.addDialogVisible = false
      //     }
      //   })
      //   .catch(err => {
      //     console.group('登陆结果..')
      //     console.log('err: ', err)
      //   })
    },
    handleDelete: function(index, row) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log(index, row, row.userId, sid)
      // var sid = getToken('vue_admin_template_token')

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // that
          //   .$axios({
          //     method: 'post',
          //     url: '/userDelete',
          //     headers: { token: sid },
          //     data: qs.stringify({ id: row.userId })
          //   })
          //   .then(res => {
          //     console.log(res)
          //     if (res.status === 200) {
          //       that.$message({
          //         type: 'success',
          //         message: '删除成功!'
          //       })
          //       that.getUsers()
          //     }
          //   })
          //   .catch(err => {
          //     console.group('结果..')
          //     console.log('err: ', err)
          //   })
          console.log({ userId: row.userId }, 'delete 111111111')
          deleteUser({ userId: row.userId }).then(response => {
            console.log(response, 'delete....')
            that.$message({
              type: 'success',
              message: '执行成功'
            })
            that.getUsers()
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleUpdate: function(index, row) {
      var that = this
      // var sid = util.cookies.get('sessionId')
      // console.log(index, row, row.userId, sid)
      var sid = getToken('vue_admin_template_token')
      console.log(JSON.stringify(row))

      delete row.createTime // 删除createTime属性，后台不能转换这个属性string类型

      that
        .$axios({
          method: 'post',
          url: '/userUpdate',
          headers: { token: sid },
          data: qs.stringify(row)
        })
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getUsers()
          }
        })
        .catch(err => {
          console.group('结果..')
          console.log('err: ', err)
        })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>

