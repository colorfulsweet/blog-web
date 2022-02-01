import axios from 'axios'
import Vue from '../lib/vue/vue.min'
import waifuTips from '../config/waifu-tip.json'

function setScrollZero() {
  let $sct = document.querySelectorAll('.tools-section')
  Array.prototype.forEach.call($sct, (em) => {
    em.scrollTop = 0
  })
}
var waifuTipTimer = null, fullTextSearchTimer = null
const vm = new Vue({
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
      isLoading: false,
      tip: undefined,
      hasMore: false
    },
    fullTextSearchWords: null,
    fullTextSearchItems: [],
    waifu: {
      tip: null, // 提示语文字
      tipOpacity: 0, // 提示语框透明度
      showTools: false // 显示工具栏
    },
    themeConfig: window.themeConfig
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
    loadSearchResult() {
      this.fullTextSearch.pageNum ++
      this.fullTextSearch.isLoading = true
      this.fullTextSearch.tip = undefined
      let params = {
        pageNum: this.fullTextSearch.pageNum,
        limit: this.fullTextSearch.limit,
        words: this.fullTextSearchWords
      }
      axios.get(window.themeConfig.root + 'api/v1/common/search', {params}).then(res => {
        this.fullTextSearch.isLoading = false
        fullTextSearchTimer = null
        let result = res.data
        if(!Array.isArray(result.data) || !result.data.length) {
          this.fullTextSearch.tip = '未搜索到匹配文章'
        } else {
          this.fullTextSearchItems.push(...result.data)
        }
        this.fullTextSearch.hasMore = (result.total > this.fullTextSearch.pageNum * this.fullTextSearch.limit)
      }).catch(err => {
        this.fullTextSearch.tip = '加载失败, 请刷新重试'
        this.fullTextSearch.isLoading = false
        throw err
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
    fullTextSearchWords (newVal, oldVal) {
      this.fullTextSearch.hasMore = false
      this.fullTextSearchItems.isLoading = false
      this.fullTextSearch.tip = undefined
      this.fullTextSearchItems.splice(0, this.fullTextSearchItems.length)
      if(fullTextSearchTimer) {
        clearTimeout(fullTextSearchTimer)
        fullTextSearchTimer = null
      }
      if(!newVal) {
        return
      }
      this.fullTextSearch.pageNum = 0
      fullTextSearchTimer = setTimeout(this.loadSearchResult.bind(this), 500)
    }
  },
  mounted () {
    axios.get(window.themeConfig.root + 'content.json').then((res)=>{
      this.items = res.data
    }).catch(err => {
      console.warn('加载文章列表失败')
    })
    welcomeMessage().then(msg => {
      this.showMessage(msg, 6000)
    })
    document.addEventListener('copy', () => {
      this.showMessage('你都复制了些什么呀，转载要记得加上出处哦')
    })
    // 隐藏模态框
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
  },
  created() {
    // 夜间模式
    let night = localStorage.getItem('night')
    try {
      if(night && eval(night)) document.querySelector('body').classList.add('night')
    } catch (e){}
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

async function welcomeMessage() {
  let now = new Date().getHours()
  return axios.get(`${window.themeConfig.root}api/v1/common/config/waifu_tip`).then(res => {
    let textTimes = res.data
    let text = null
    Array.prototype.sort.call(textTimes, (item1, item2) => {
      if(item1.start>item2.start) {
        return 1
      } else if(item1.start<item2.start) {
        return -1
      } else {
        return 0
      }
    })
    Array.prototype.forEach.call(textTimes, textTime => {
      if(now > textTime.start && now <= textTime.end) {
        text = textTime.text
      }
    })
    if(!text) {
      text = textTimes[textTimes.length-1].text
    }
    return text
  })
}

const waifuTools = {
  'tools.photo'() {
    // 生成canvas快照
    window.Live2D.captureName = 'Kesshouban.png'
    window.Live2D.captureFrame = true
  },
  'tools.close'() {
    // 移除看板娘
    setTimeout(function() {
      let waifuDiv = document.querySelector('.waifu')
      waifuDiv.parentNode.removeChild(waifuDiv)
    }, 1300)
  },
  'tools.eye'() {
    // 切换到夜间模式
    document.querySelector('.mid-col').classList.remove('hide')
    let night = document.querySelector('body').classList.toggle('night')
    localStorage.setItem('night', night)
  },
  'tools.info'() {
    window.open('https://github.com/xiazeyu/live2d-widget.js')
  },
  'tools.chart'() {
    // 一言
    axios.get(`${window.themeConfig.root}api/v1/common/hitokoto?length=40&format=json`).then(res => {
      this.showMessage(res.data.hitokoto + (res.data.from?`　　——${res.data.from}`:''))
    })
  },
  'tools.search'() {
    // 打开全文检索Modal
    vm.openFullTextSearch()
  }
}