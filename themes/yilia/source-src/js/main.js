// 样式
import '../css/main.scss'
import '../css/font-awsome.css'
// 分享
import Share from './share'
// 边缘
import Aside from './aside'

import Util from './util'

Util.addLoadEvent(function() {
	Share.init()
	// Viewer.init()
  Aside.init()
  if(window.themeConfig.pageid === 'PhotoWall') {
    // 自定义的照片墙页面
    import(/* webpackChunkName: "photo-wall" */ './photo-wall').then(PhotoWall => {
      PhotoWall.default.init()
    })
  }
  if(window.themeConfig.animate && window.themeConfig.isHome) {
    // 文章列表页动画效果
    let animateTypes = [{ // 右侧移入
      distance: '50px', 
      origin: 'right'
    },{ // 放大
      scale: 0.8
    },{ // 缩小
      scale: 1.1
    },{ // 绕X轴旋转
      rotate: { x: 30 }
    },{ // 绕Y轴旋转
      rotate: { y: 20 }
    }]
    import(/* webpackChunkName: "scrollreveal" */ 'scrollreveal').then(ScrollReveal => {
      let index = Math.floor(Math.random() * animateTypes.length)
      ScrollReveal.default().reveal('.article-index', Object.assign({
        delay: 200,
        container: document.getElementById('container')
      }, animateTypes[index]))
    })
  }
})

// 初始化看板娘
import(/* webpackChunkName: "waifu" */ './waifu').then(waifuInit => {
  waifuInit.default.init()
})

// 控制台
console.log(
  '\n %c Silence %c https://www.colorfulsweet.site \n',
  'color:#FFFFFB;background:#ffa628;padding:5px 0;border-radius:.5rem 0 0 .5rem;',
  'background: #efefef;padding:5px 0;border-radius:0 .5rem .5rem 0;'
)
console.log(`页面加载消耗了 ${(Math.round(performance.now()*100)/100/1000).toFixed(2)}s`)