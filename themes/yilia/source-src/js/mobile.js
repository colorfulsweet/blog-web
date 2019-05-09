// 浏览器判断
import Browser from './browser'
// fix hexo 不支持的配置
import Fix from './fix'

import Util from './util'

function isPathMatch(path, href) {
	let reg = /\/|index.html/g
	return (path.replace(reg, '')) === (href.replace(reg, ''))
}

function tabActive() {
	let tabs = document.querySelectorAll('.js-header-menu li a')
	let path = window.location.pathname
	Array.prototype.forEach.call(tabs, function(tab, i){
		if (isPathMatch(path, tab.getAttribute('href'))) {
      tab.classList.add('active')
		}
	})
}

function getElementLeft(element) {　　　　
	var actualLeft = element.offsetLeft　　　　
	var current = element.offsetParent　　　　
	while (current !== null) {　　　　　　
		actualLeft += current.offsetLeft　　　　
		current = current.offsetParent　　
	}　　
	return actualLeft
}　　
function getElementTop(element) {　　　　
	var actualTop = element.offsetTop　　　　
	var current = element.offsetParent　　　　
	while (current !== null) {　　　　　　
		actualTop += current.offsetTop　　　　　　
		current = current.offsetParent　　　　
	}　　　　
	return actualTop　　
}

function scrollStop($dom, top, limit, zIndex, diff) {
	let nowLeft = getElementLeft($dom)
	let nowTop = getElementTop($dom) - top

	if (nowTop - limit <= diff) {
		let $newDom = $dom.$newDom
		if (!$newDom) {
      $newDom = $dom.cloneNode(true)
      let parentNode = $dom.parentNode
      if(parentNode.lastChild == $dom){ // 将新生成的节点插入到当前节点之后
        parentNode.appendChild($newDom)
      }else{
        parentNode.insertBefore($newDom, $dom.nextSibling)
      }
			$dom.$newDom = $newDom
			$newDom.style.position = 'fixed'
			$newDom.style.top = (limit || nowTop) + 'px'
			$newDom.style.left = nowLeft + 'px'
			$newDom.style.zIndex = zIndex || 2
			$newDom.style.width = '100%'
			$newDom.style.color = '#fff'
		}
		$newDom.style.visibility = 'visible'
		$dom.style.visibility = 'hidden'
	} else {
		$dom.style.visibility = 'visible'
		let $newDom = $dom.$newDom
		if ($newDom) {
			$newDom.style.visibility = 'hidden'
		}
	}
}

function handleScroll() {
	let $overlay = document.querySelector('.js-overlay')
	let $menu = document.querySelector('.js-header-menu')
	scrollStop($overlay, document.body.scrollTop, -63, 2, 0)
	scrollStop($menu, document.body.scrollTop, 1, 3, 0)
}

function bindScroll() {
	document.querySelector('#container').addEventListener('scroll', (e) => {
		handleScroll()
	})

	window.addEventListener('scroll', (e) => {
		handleScroll()
	})
	handleScroll()
}

(function () {
	if (Browser.versions.mobile && window.screen.width < 800) {
		tabActive()
		bindScroll()
	}
})()

Util.addLoadEvent(function() {
	Fix.init()
})