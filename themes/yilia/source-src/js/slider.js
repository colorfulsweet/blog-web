// 动画
import Anm from './anm'
// 浏览器判断
import Browser from './browser'

import axios from 'axios'
import Vue from '../lib/vue/vue.min'
import waifuTips from '../config/waifu-tip.json'
const isMobile = (Browser.versions.mobile && window.screen.width < 800)

function setScrollZero() {
  let $sct = document.querySelectorAll('.tools-section')
  Array.prototype.forEach.call($sct, (em) => {
    em.scrollTop = 0
  })
}
var waifuTipTimer = null, fullTextSearchTimer = null
new Vue({
  el: '#container',
  data: {
    isCtnShow: false,
    isShow: undefined,
    items: [],
    innerArchive: false,
    friends: false,
    aboutme: false,
    showTags: false,
    showCategories: false,
    search: null,
    searchItems: [],
    fullTextSearch: {
      pageNum: 1,
      limit: 10,
      words: null
    },
    fullTextSearchItems: [],
    waifu: {
      tip: null, // 提示语文字
      tipOpacity: 0, // 提示语框透明度
      showTools: false // 显示工具栏
    }
  },
  methods: {
    stop (event) {
      event.stopPropagation()
    },
    openSlider (event, type, isMobile) {
      if(isMobile && this.isShow) {
        this.hideSlider()
        return
      }
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
        setTimeout(() => {this.isCtnShow = false}, 300)
      }
    },
    linkMouseover(name) {
      if(name === 'waifu' && waifuTipTimer) return
      this.showMessage(waifuTips.mouseover[name], 3000)
    },
    toolsClick(name) {
      this.showMessage(waifuTips.click[name])
      if(name in waifuTools) {
        waifuTools[name].call(this)
      }
    },
    addSearchItem(query, type='title') {
      if(query) {
        query = query.trim()
      }
      // 如果已存在相同的查询条件, 则不加入
      var isExist = Array.prototype.some.call(this.searchItems, searchItem => {
        return searchItem.query === query && searchItem.type === type
      })
      if(!isExist && query) {
        this.searchItems.push({query, type})
      }
      this.search = null
    },
    openFullTextSearch() {
      this.hideSlider()
      this.$refs.fullTextSearch.classList.add('in')
      this.$refs.mask.classList.add('in')
    },
    loadMoreSearchResult() {
      this.fullTextSearch.pageNum ++
      axios.get(window.themeConfig.root + 'api/common/search', {params: this.fullTextSearch}).then(res => {
        let result = res.data
        this.fullTextSearchItems.hasMore = (result.total > this.fullTextSearch.pageNum * this.fullTextSearch.limit)
        this.fullTextSearchItems.push(...result.data)
      })
    },
    searchKeydown(event) {
      if(event.keyCode == 13){ // 回车键
        this.addSearchItem(this.search)
      } else if(event.keyCode == 8 && !this.search) { // 退格键
        this.searchItems.pop()
      }
    },
    showMessage (text, time) {
      if(!text) return
      if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1]
      this.waifu.tip = text
      this.waifu.tipOpacity = 1
      if(waifuTipTimer) {
        clearTimeout(waifuTipTimer)
        waifuTipTimer = null
      }
      waifuTipTimer = setTimeout(()=>{
        this.waifu.tipOpacity = 0
        waifuTipTimer = null
      }, time || 5000)
    } 
  },
  filters: {
    urlformat (str) {
      return (window.themeConfig && window.themeConfig.root) ? window.themeConfig.root + str : '/' + str
    }
  },
  watch: {
    searchItems (newVal, oldVal) {
      if(newVal && newVal.length) {
        handleSearch.call(this, newVal)
      } else {
        this.items.forEach(function(item){
          item.isHide = false
        })
      }
    },
    fullTextSearch: {
      deep: true,
      handler(newVal, oldVal) {
        if(!newVal.words) {
          return
        }
        if(fullTextSearchTimer) {
          clearTimeout(fullTextSearchTimer)
        }
        fullTextSearchTimer = setTimeout(() => {
          this.fullTextSearchItems.length = 0
          axios.get(window.themeConfig.root + 'api/common/search', {params: newVal}).then(res => {
            let result = res.data
            this.fullTextSearchItems.hasMore = (result.total > this.fullTextSearch.pageNum * this.fullTextSearch.limit)
            this.fullTextSearchItems.push(...result.data)
          })
        }, 1000)
      } 
    }
  },
  mounted () {
    axios.get(window.themeConfig.root + 'content.json?t=' + (+ new Date()))
    .then((res)=>{
      this.items = res.data
    }).catch((err) => {
      console.warn('加载文章列表失败')
    })
    this.showMessage(welcomeMessage(), 6000)
    document.addEventListener('copy', () => {
      this.showMessage('你都复制了些什么呀，转载要记得加上出处哦')
    })
  },
  created() {
    // 夜间模式
    let night = localStorage.getItem('night')
    try {
      if(night && eval(night)) document.querySelector('body').classList.add('night')
    } catch (e){}

    let hideModal = (function() {
      let modals = document.querySelectorAll('.page-modal')
      Array.prototype.forEach.call(modals, modal => {
        modal.classList.remove('in')
      })
      this.$refs.mask.classList.remove('in')
    }).bind(this)
    this.$refs.mask.addEventListener('click', hideModal)
    Array.prototype.forEach.call(document.querySelectorAll('.js-modal-close'), modalClose => {
      modalClose.addEventListener('click', hideModal)
    })
  }
})

function handleSearch(searchItems) {
  this.items.forEach(articleItem => {
    articleItem.isHide = !Array.prototype.every.call(searchItems, searchItem => {
      switch(searchItem.type) {
        case 'title': 
          return articleItem.title.toLowerCase().indexOf(searchItem.query.toLowerCase()) !== -1
        case 'tag' : 
          return Array.prototype.some.call(articleItem.tags, tag => {
            return tag.name === searchItem.query
          })
        case 'category' : 
          return Array.prototype.some.call(articleItem.categories, category => {
            return category.name === searchItem.query
          })
        case 'date' : 
          return articleItem.date && ( articleItem.date.substr(0,7) === searchItem.query )
      }
    })
  })
}

function welcomeMessage() {
  let now = new Date().getHours()
  let text
  if (now > 23 || now <= 5) {
    text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛'
  } else if (now > 5 && now <= 7) {
    text = '早上好！一日之计在于晨，美好的一天就要开始了'
  } else if (now > 7 && now <= 11) {
    text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
  } else if (now > 11 && now <= 14) {
    text = '中午了，工作了一个上午，现在是午餐时间！'
  } else if (now > 14 && now <= 17) {
    text = '午后很容易犯困呢，今天的运动目标完成了吗？'
  } else if (now > 17 && now <= 19) {
    text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~'
  } else if (now > 19 && now <= 21) {
    text = '晚上好，今天过得怎么样？'
  } else if (now > 21 && now <= 23) {
    text = '已经这么晚了呀，早点休息吧，晚安~'
  } else {
    text = '嗨~ 快来逗我玩吧！'
  }
  return text
}

const waifuTools = {
  "tools.photo"() {
    // 生成canvas快照
    window.Live2D.captureName = 'Kesshouban.png'
    window.Live2D.captureFrame = true
  },
  "tools.close"() {
    // 隐藏看板娘
    setTimeout(function() {
      document.querySelector('.waifu').style.display = 'none'
      localStorage.setItem('hideWaifu', true)
    }, 1300)
  },
  "tools.eye"() {
    // 切换到夜间模式
    document.querySelector('.mid-col').classList.remove('hide')
    let night = document.querySelector('body').classList.toggle('night')
    localStorage.setItem('night', night)
  },
  "tools.info"() {
    window.open('https://github.com/xiazeyu/live2d-widget.js')
  },
  "tools.chart"() {
    // 一言
    axios.get(`${window.themeConfig.root}api/common/hitokoto?length=40&format=json`).then(res => {
      this.showMessage(res.data.hitokoto + (res.data.from?`　　——${res.data.from}`:''))
    })
  }
}

if (!isMobile) {
  Anm.init()
}
