// 动画
import Anm from './anm'
// 浏览器判断
import Browser from './browser'

import axios from 'axios'
import Vue from './vue.min'

const isMobile = (Browser.versions.mobile && window.screen.width < 800)

function setScrollZero() {
	let $sct = document.querySelectorAll('.tools-section')
	Array.prototype.forEach.call($sct, (em) => {
		em.scrollTop = 0
	})
}
new Vue({
	el: '#container',
	data: {
		isCtnShow: false,
		isShow: false,
		items: [],
		innerArchive: false,
		friends: false,
		aboutme: false,
		jsonFail: false,
		showTags: false,
		showCategories: false,
		search: null
	},
	methods: {
		stop (event) {
			event.stopPropagation()
		},
		chose (name, prefix) {
			this.search = prefix + name
		},
		clearChose () {
			this.search = null
		},
		openSlider (event, type) {
			event.stopPropagation()
			this.innerArchive = false
			this.friends = false
			this.aboutme = false
			this[type] = true
			this.isShow = true
			this.isCtnShow = true
			setScrollZero()
		},
		hideSlider () {
			if (this.isShow) {
				this.isShow = false
				setTimeout(() => {
					this.isCtnShow = false
				}, 300)
			}
		}
	},
	filters: {
		urlformat: (str) => {
			return (window.yiliaConfig && window.yiliaConfig.root) ? window.yiliaConfig.root + str : '/' + str;
		}
	},
	watch: {
		search (newVal, oldVal) {
			if(newVal) {
				handleSearch.call(this, newVal.toLowerCase())
			} else {
				this.items.forEach(function(item){
					item.isHide = false
				})
			}
		}
	},
	mounted () {
		axios.get(window.yiliaConfig.root + 'content.json?t=' + (+ new Date()))
		.then((res)=>{
			this.items = res.data
		}).catch((err) => {
			this.jsonFail = true
		})
	}
})

function handleSearch(val) {
	var type
	if (val.startsWith('#')) {
		val = val.substr(1, val.length)
		type = 'tag'
	} else if (val.startsWith('$')) {
		val = val.substr(1, val.length)
		type = 'category'
	} else {
		type = 'title'
	}
	this.items.forEach((item) => {
		switch(type) {
		case 'title' : 
			item.isHide = item.title.toLowerCase().indexOf(val) < 0
			break
		case 'tag' : 
			item.isHide = Array.prototype.every.call(item.tags, function(tag){
				return tag.name.toLowerCase() !== val
			})
			break
		case 'category' : 
			item.isHide = Array.prototype.every.call(item.categories, function(category){
				return category.name.toLowerCase() !== val
			})
			break
		}
	})
}

if (!isMobile) {
	Anm.init()
}
