<template>
  <div>
    <el-dialog title="修改密码" :visible.sync="resetPasswordDialogVisible" :close-on-click-modal="false">
      <el-form ref="resetPasswordRef" label-width="80px" size="mini" :rules="rules" :model="user">
        <el-form-item label="旧密码" prop="oldPassword" :style="{display:showPassWordInput}">
          <el-input ref="oldPasswordRef" v-model="user.oldPassword" :type="oldPasswordType" auto-complete="off" />
          <span class="show-pwd" @click="showOldPwd()">
            <svg-icon :icon-class="oldPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="新密码" prop="password" :style="{display:showPassWordInput}">
          <el-input ref="passwordRef" v-model="user.password" :type="passwordType" auto-complete="off" />
          <span class="show-pwd" @click="showPwd()">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commitEvent()">立即提交</el-button>
          <el-button @click="resetPasswordDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import { modifyPassword } from '@/api/user'
export default {
  data() {
    return {
      resetPasswordDialogVisible: false,
      passwordType: 'password',
      oldPasswordType: 'password',
      showPassWordInput: 'block',
      user: {
        password: '',
        oldPassword: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: ['blur', 'change'] }
        ],
        oldPassword: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    setDialog(flag) {
      this.resetPasswordDialogVisible = flag
    },
    showOldPwd() {
      if (this.oldPasswordType === 'password') {
        this.oldPasswordType = ''
      } else {
        this.oldPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.oldPasswordRef.focus()
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.passwordRef.focus()
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    commitEvent: function() {
      var that = this
      console.log('user ====', this.user)
      modifyPassword(this.user).then(response => {
        if (response.status === 200) {
          that.$message({
            type: 'success',
            message: response.message,
            duration: 3000,
            onClose: function() {
              that.logout()
            }
          })
        } else if (response.status === 501) {
          that.$message({
            type: 'warning',
            message: response.message
          })
        } else if (response.status === 500) {
          that.$message({
            type: 'warning',
            message: response.message
          })
        }
      })
    }
  }
}
</script>
<style scoped>
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 0px;
        font-size: 16px;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
    }
</style>
