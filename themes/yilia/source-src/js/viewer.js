import PhotoSwipe from '../lib/photoswipe/photoswipe'
import PhotoSwipeUI_Default from '../lib/photoswipe/photoswipe-ui-default'
import '../lib/photoswipe/photoswipe.css'
import '../lib/photoswipe/default-skin/default-skin.css'

import Util from './util'

function init() {
	let pswpElement = document.querySelectorAll('.pswp')[0]
  let imgArr = document.querySelectorAll('.article-entry img:not(.reward-img)')
  let getThumbBoundsFn = function(target) {
    return function(index) { // index是当前点击的图片在相册中的索引值
      var pageYScroll = window.pageYOffset || document.documentElement.scrollTop
      var rect = target.getBoundingClientRect()
      return {x:rect.left, y:rect.top + pageYScroll, w:rect.width}
    }
  }
  const items = Array.prototype.map.call(imgArr, em => {
    let src = em.getAttribute('data-target') || em.getAttribute('src')
    let title = em.getAttribute('alt')
    // 获得原图尺寸
    const image = new Image()
    image.src = src
    return {
      msrc: src, // 缩略图的地址(在动画过程中显示的是缩略图, 这里暂且用相同的地址了)
      src,
      w: image.width || em.width,
      h: image.height || em.height,
      title
    }
  })
	Array.prototype.forEach.call(imgArr, (em, index) => {
		em.addEventListener('click', function(e){
			// slider展开状态
			if (document.querySelector('.left-col.show')) return
			var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
				index,
        bgOpacity: 0.8,
        getThumbBoundsFn: getThumbBoundsFn(e.target)
			})
			gallery.init()
		})
	})
}

// export default { init }
if(!window.themeConfig.pageid) { // 非个性化页面的普通文章
  Util.addLoadEvent(init)
}