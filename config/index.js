const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    // assetsSubDirectory: '',
    assetsSubDirectory: '',
    // assetsPublicPath: 'https://static.120xinmao.com/testing/',
    // assetsPublicPath: '/static/',
    assetsPublicPath: '/',
    productionSourceMap: false
  },
  dev: {
    env: require('./dev.env'),
    port: 9002,
    autoOpenBrowser: true,
    assetsSubDirectory: '',
    assetsPublicPath: '/dist/',
    proxyTable: {
        "/depression-api": {
            //  target: "http://127.0.0.1:8000",
             target: "http://moluantongxue.com:9000",
            //target: "http://192.168.0.247:8000",
            // target: "http://api.120xinmao.com",
            changeOrigin:true, //是否跨域
            // pathRewrite: {
            //     "^/depression-api": ""
            // },
            secure: false
        }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
