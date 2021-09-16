<template>
  <div id="app">
    <!-- 根路由出口 -->
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
