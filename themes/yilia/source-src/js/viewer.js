import PhotoSwipe from '../lib/photoswipe/photoswipe'
import PhotoSwipeUI_Default from '../lib/photoswipe/photoswipe-ui-default'
import '../lib/photoswipe/photoswipe.css'
import '../lib/photoswipe/default-skin/default-skin.css'

import Util from './util'

function init() {
	let pswpElement = document.querySelectorAll('.pswp')[0];
	let $imgArr = document.querySelectorAll(('.article-entry img:not(.reward-img)'))
	Array.prototype.forEach.call($imgArr, ($em, i) => {
		$em.addEventListener('click', function(){
			// slider展开状态
			if (document.querySelector('.left-col.show')) return
			let items = []
			Array.prototype.forEach.call($imgArr, ($em2, i2) => {
				let src = $em2.getAttribute('data-target') || $em2.getAttribute('src')
				let title = $em2.getAttribute('alt')
				// 获得原图尺寸
				const image = new Image()
				image.src = src
				items.push({
					src: src,
					w: image.width || $em2.width,
					h: image.height || $em2.height,
					title: title
				})
			})
			var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
				index: parseInt(i),
				bgOpacity: 0.8
			});
			gallery.init()
		})
	})
}

// export default { init }
Util.addLoadEvent(function() {
	init()
})