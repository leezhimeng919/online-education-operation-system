<template>
  <div class="login">
    <el-form
      class="login-form"
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onSubmit"
          :loading="isLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'
import { mapState, mapMutations } from 'vuex'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度要在6-18之间', trigger: 'blur' }
        ]
      },
      isLoading: false
    }
  },
  methods: {
    ...mapMutations(['getUser']),
    async onSubmit () {
      try {
        // 1. 表单验证
        await (this.$refs.form as Form).validate()
        this.isLoading = true
        // 2. 提交表单
        const { data } = await login(this.form)
        // 3. 处理请求结果
        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          // 持久化用户信息
          this.getUser(data.content)
          // 登录成功 跳到到之前访问的页面
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登录成功')
        }
        //      成功或者失败
      } catch (e) {
        console.log('登录失败', e)
      }
      this.isLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    background-color: rgb(218, 216, 216);
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
