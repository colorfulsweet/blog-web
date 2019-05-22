function init() {
	// 由于hexo分页不支持，手工美化
	var $nav = document.querySelector('#page-nav')
	if ($nav && !document.querySelector('#page-nav .extend.prev')) {
		$nav.innerHTML = '<a class="extend prev disabled" rel="prev">&laquo; Prev</a>' + $nav.innerHTML
	}
	if ($nav && !document.querySelector('#page-nav .extend.next')) {
		$nav.innerHTML = $nav.innerHTML + '<a class="extend next disabled" rel="next">Next &raquo;</a>'
	}

	// 目录序号
	if (window.themeConfig && window.themeConfig.toc_hide_index) {
		let $a = document.querySelectorAll('.toc-number')
		Array.prototype.forEach.call($a, function($em){
			$em.style.display = 'none'
		})
  }
  
  // 避免由于动画带来的fix元素定位失效, 移到动画元素外层
  var sideOpt = document.querySelector('.wrap-side-operation')
  document.getElementById('container').appendChild(sideOpt)
}

export default { init }