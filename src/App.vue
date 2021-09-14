<template>
  <div id="app">
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>
    <button class="btn">123</button>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import request from '@/utils/request'

// console.log(request)

// request({
//   method: 'GET',
//   url: '/boss'
// }).then(res => {
//   console.log(res)
// })

export default Vue.extend({
  data () {
    return {
      a: 1
    }
  },

  methods: {
    test () {
      this.a = 2
    }
  }
})
</script>

<style lang="scss" scoped>
// @import '~@/styles/variables.scss';
.btn {
  background-color: $info-color;
}

</style>
