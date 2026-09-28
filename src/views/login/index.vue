<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode" :disabled="isCounting">{{ Second === totalSecond ? '获取验证码' : Second + '秒后重新获取' }}</button>
        </div>
      </div>
      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
// 引入axios实例
import { getLoginCode, getMsgCode, codeLogin } from '@/api/login.js'
export default {
  name: 'LoginPage',
  data () {
    return {
      picCode: '', // 图形验证码
      picKey: '', // 图形验证码key
      picUrl: '', // 图形验证码图片
      totalSecond: 60, // 倒计时总秒数
      Second: 60, // 当前倒计时秒数
      isCounting: false, // 是否倒计时中
      timer: null, // 定时器id
      mobile: '', // 手机号
      msgCode: '' // 短信验证码
    }
  },
  async created () {
    // 初始化获取验证码图片
    this.getPicCode()
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    // 获取验证码验证码图片
    async getPicCode () {
      const { data: { base64, key } } = await getLoginCode()
      this.picUrl = base64
      this.picKey = key
      // this.$toast('获取验证码成功')
      // this.$toast.success('获取验证码成功')
      // this.$toast.loading({
      //   message: '加载中...',
      //   forbidClick: true
      // })
    },
    // 校验手机号，图形验证码是否合规,返回值通过为true,否则为false
    validFn () {
      if (!/^1[3456789]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },
    // 获取短信验证码
    async getCode () {
      // 校验手机号，图形验证码是否合规,不合规则直接返回
      if (!this.validFn()) return

      // 调用获取短信验证码接口
      const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
      if (res.status === 200) {
        this.$toast('获取短信验证码成功')
        // console.log(res)
      }

      // 倒计时
      if (this.isCounting) return
      this.isCounting = true
      this.Second = this.totalSecond
      this.timer = setInterval(() => {
        this.Second--
        if (this.Second <= 0) {
          clearInterval(this.timer)
          this.timer = null
          this.Second = this.totalSecond
          this.isCounting = false
        }
      }, 1000)
    },

    // 登录
    async login () {
      // 校验手机号，图形验证码是否合规,不合规则直接返回
      if (!this.validFn()) return
      // 校验短信验证码是否合规,不合规则直接返回
      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast('请输入正确的短信验证码')
        return
      }
      // 调用登录接口
      const res = await codeLogin(this.mobile, this.msgCode)
      if (res.status === 200) {
        // 登录成功,将token存储到store中
        this.$store.commit('user/setUserInfo', res.data)
        // 登录成功,跳转到首页
        this.$toast('登录成功')
        // 添加判断，如果地址栏有回跳参数，就跳转到该页面，如果没有，就跳转到首页
        const url = this.$route.query.backUrl || '/'
        // 使用replace，不要使用push，使用push点击返回的话会回到登录页
        this.$router.replace(url)
        // console.log(res)
      }
    }
  },
  // 离开页面停止定时器，（路由切换就可以触发destroyed方法）
  destroyed () {
    clearInterval(this.timer)
    this.timer = null
  }

}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
    button[disabled] {
      color: #ccc;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
