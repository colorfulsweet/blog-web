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
	if (yiliaConfig && yiliaConfig.toc_hide_index) {
		let $a = document.querySelectorAll('.toc-number')
		Array.prototype.forEach.call($a, function($em){
			$em.style.display = 'none'
		})
	}
}

export default { init }