export default {
  methods: {
    // 根据登录状态判断是否显示登录确认框
    // 1，如果未登录 => 显示确认框 返回true
    // 2，如果已经登录 => 啥也不干 返回false
    loginConfirm () {
      // 判断token是否存在
      // 存在->添加购物车
      // 不存在->弹提示框登录
      if (!this.$store.getters.token) {
        // 弹框
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请登录后继续操作',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // 如果希望跳转登录后=>可以回跳回来，需要在跳转去携带参数（当前的路径地址）
            // this.$route.fullpath（会包含查询参数）
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {})
        return true
      }
      return false
    }
  }
}
