import http from './request'
import { createApp } from 'vue'
import waifuTips from '../config/waifu-tip.json'

function setScrollZero() {
  document.querySelectorAll('.tools-section').forEach(em => {
    em.scrollTop = 0
  })
}

function urlformat(str) {
  return (window.themeConfig && window.themeConfig.root) ? window.themeConfig.root + str : '/' + str
}

var waifuTipTimer = null, fullTextSearchTimer = null

const vm = createApp({
  data() {
    return {
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
    }
  },
  methods: {
    urlformat,
    stop(event) {
      event.stopPropagation()
    },
    openSlider(event, type, isMobile) {
      if (isMobile && this.isShow) {
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
    hideSlider() {
      if (this.isShow) {
        this.isShow = false
        setTimeout(() => { this.isCtnShow = false }, 300)
      }
    },
    linkMouseover(name) {
      if (name === 'waifu' && waifuTipTimer) return
      this.showMessage(waifuTips.mouseover[name], 3000)
    },
    toolsClick(name) {
      this.showMessage(waifuTips.click[name])
      if (name in waifuTools) {
        waifuTools[name].call(this)
      }
    },
    addSearchItem(query, type = 'title') {
      if (query) {
        query = query.trim()
      }
      // 如果已存在相同的查询条件, 则不加入
      const isExist = this.searchItems.some(searchItem => {
        return searchItem.query === query && searchItem.type === type
      })
      if (!isExist && query) {
        this.searchItems.push({ query, type })
      }
      this.search = null
    },
    openFullTextSearch() {
      this.hideSlider()
      this.$refs.fullTextSearch.classList.add('in')
      this.$refs.mask.classList.add('in')
    },
    loadSearchResult() {
      this.fullTextSearch.pageNum++
      this.fullTextSearch.isLoading = true
      this.fullTextSearch.tip = undefined
      const params = {
        pageNum: this.fullTextSearch.pageNum,
        limit: this.fullTextSearch.limit,
        words: this.fullTextSearchWords
      }
      http.get('/api/v2/common/search', { params }).then(res => {
        this.fullTextSearch.isLoading = false
        fullTextSearchTimer = null
        if (!Array.isArray(res.list) || !res.list.length) {
          this.fullTextSearch.tip = '未搜索到匹配文章'
        } else {
          this.fullTextSearchItems.push(...res.list)
        }
        this.fullTextSearch.hasMore = (res.total > this.fullTextSearch.pageNum * this.fullTextSearch.limit)
      }).catch(err => {
        this.fullTextSearch.tip = '加载失败, 请刷新重试'
        this.fullTextSearch.isLoading = false
        throw err
      })
    },
    searchKeydown(event) {
      if (event.keyCode == 13) { // 回车键
        this.addSearchItem(this.search)
      } else if (event.keyCode == 8 && !this.search) { // 退格键
        this.searchItems.pop()
      }
    },
    showMessage(text, time) {
      if (!text) return
      if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1]
      this.waifu.tip = text
      this.waifu.tipOpacity = 1
      if (waifuTipTimer) {
        clearTimeout(waifuTipTimer)
        waifuTipTimer = null
      }
      waifuTipTimer = setTimeout(() => {
        this.waifu.tipOpacity = 0
        waifuTipTimer = null
      }, time || 5000)
    }
  },
  watch: {
    searchItems(newVal) {
      if (newVal && newVal.length) {
        handleSearch.call(this, newVal)
      } else {
        this.items.forEach(item => { item.isHide = false })
      }
    },
    fullTextSearchWords(newVal) {
      this.fullTextSearch.hasMore = false
      this.fullTextSearchItems.isLoading = false
      this.fullTextSearch.tip = undefined
      this.fullTextSearchItems.splice(0, this.fullTextSearchItems.length)
      if (fullTextSearchTimer) {
        clearTimeout(fullTextSearchTimer)
        fullTextSearchTimer = null
      }
      if (!newVal) return
      this.fullTextSearch.pageNum = 0
      fullTextSearchTimer = setTimeout(this.loadSearchResult.bind(this), 500)
    }
  },
  mounted() {
    fetch(window.themeConfig.root + 'content.json').then(res => res.json()).then(resJson => {
      this.items = resJson
    }).catch(() => {
      console.warn('加载文章列表失败')
    })
    welcomeMessage().then(msg => {
      this.showMessage(msg, 6000)
    })
    document.addEventListener('copy', () => {
      this.showMessage('你都复制了些什么呀，转载要记得加上出处哦')
    })
    const hideModal = () => {
      document.querySelectorAll('.page-modal').forEach(modal => {
        modal.classList.remove('in')
      })
      this.$refs.mask.classList.remove('in')
    }
    // 隐藏模态框
    this.$refs.mask.addEventListener('click', hideModal)
    document.querySelectorAll('.js-modal-close').forEach(modalClose => {
      modalClose.addEventListener('click', hideModal)
    })
  },
  created() {
    // 夜间模式
    const night = localStorage.getItem('night')
    if (night === 'true') {
      document.querySelector('body').classList.add('night')
    }
  }
}).mount('#container')

function handleSearch(searchItems) {
  this.items.forEach(articleItem => {
    articleItem.isHide = !searchItems.every(searchItem => {
      switch (searchItem.type) {
        case 'title':
          return articleItem.title.toLowerCase().indexOf(searchItem.query.toLowerCase()) !== -1
        case 'tag':
          return articleItem.tags.some(tag => tag.name === searchItem.query)
        case 'category':
          return articleItem.categories.some(category => category.name === searchItem.query)
        case 'date':
          return articleItem.date && (articleItem.date.substr(0, 7) === searchItem.query)
      }
    })
  })
}

async function welcomeMessage() {
  let now = new Date().getHours()
  return http.get('/api/v2/common/config/waifu_tip').then(textTimes => {
    let text = null
    textTimes.sort((a, b) => a.start - b.start)
    textTimes.forEach(textTime => {
      if (now > textTime.start && now <= textTime.end) {
        text = textTime.text
      }
    })
    if (!text) {
      text = textTimes[textTimes.length - 1].text
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
    http.get('/api/v2/common/hitokoto', { params: { format: 'json' } }).then(res => {
      this.showMessage(res.hitokoto + (res.from ? `　　——${res.from}` : ''))
    })
  },
  'tools.search'() {
    // 打开全文检索Modal
    vm.openFullTextSearch()
  }
}
