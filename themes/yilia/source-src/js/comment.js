const axios = require('axios')
// const AV = require('leancloud-storage')
window.AV = require('leancloud-storage')
// const Valine = require('../lib/Valine.min')
/**
 * 使用根据Valine项目源代码重新打包
 * 可以支持对于AV对象的传参输入, 而不需要暴露全局变量
 * 但是缺少一些新功能
 */

import(/* webpackChunkName: "valine" */ '../lib/Valine.min').then(({default: Valine }) => {
  // 从接口获取评论配置
  axios.get(`${window.themeConfig.root}api/v1/common/config/valine_config`).then(res => {
    let config = res.data
    config.path = window.location.pathname
    // config.av = AV
    new Valine(config)
  })
})
