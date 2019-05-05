// 样式
import '../css/main.scss'
// 图片查看器 -> 改为单独分块打包
// import Viewer from './viewer'
// 分享
import Share from './share'
// 边缘
import Aside from './aside'

import Util from './util'

Util.addLoadEvent(function() {
	Share.init()
	// Viewer.init()
	Aside.init()
})
const commentConfig = require("../config/comment.json")
if(window.yiliaConfig.isPost && commentConfig.valine.enable) {
  // 如果是文章详情页面, 并且启用了评论, 则加载评论相关代码
  import(/* webpackChunkName: "comment" */ './comment')
}