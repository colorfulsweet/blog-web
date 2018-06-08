// 样式
import '../css/main.scss'
// 图片查看器
import Viewer from './viewer'
// 分享
import Share from './share'
// 边缘
import Aside from './aside'

import Util from './util'

Util.addLoadEvent(function() {
	Share.init()
	Viewer.init()
	Aside.init()
})
