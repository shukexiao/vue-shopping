// 登录接口
import request from '@/utils/request'

// 获取图形验证码
export const getLoginCode = () => {
  return request.get('/captcha/image')
}
// 获取短信验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    from: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}

// 登录
export const codeLogin = (mobile, smsCode) => {
  return request.post('/passport/login', {
    form: {
      isParty: false,
      mobile,
      partyData: {},
      smsCode
    }
  })
}
