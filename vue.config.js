const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://smart-shop.itheima.net',
        changeOrigin: true,
        onProxyReq: function (proxyReq, req, res) {
          // 后端会用 X-Forwarded-Host 拼图片等资源地址，必须固定为真实域名，
          // 否则会返回 https://localhost:8080/uploads/xxx.jpg，浏览器用 https 访问明文 http 的 dev server 会报 ERR_SSL_PROTOCOL_ERROR
          proxyReq.setHeader('X-Forwarded-Host', 'smart-shop.itheima.net')
          // 将原始查询参数的 ? 替换为 &，避免被 PHP 框架解析为路由的一部分
          const pathname = req.url.split('?')[0]
          const query = req.url.includes('?') ? '&' + req.url.split('?')[1] : ''
          proxyReq.path = '/index.php?s=' + pathname + query
        }
      }
    }
  }
})
