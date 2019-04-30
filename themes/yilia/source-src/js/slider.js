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
var waifuTipTimer = null
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
    search: null,
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
        setTimeout(() => {this.isCtnShow = false}, 300)
      }
    },
    linkMouseover(name) {
      this.showMessage(waifuTips.mouseover[name], 3000)
    },
    toolsClick(name) {
      this.showMessage(waifuTips.click[name])
      if(name in waifuTools) {
        waifuTools[name].call(this)
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
    this.showMessage(welcomeMessage(), 6000)
    document.addEventListener('copy', () => {
      this.showMessage('你都复制了些什么呀，转载要记得加上出处哦');
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
    window.Live2D.captureName = 'Kesshouban.png'
    window.Live2D.captureFrame = true
  },
  "tools.close"() {
    setTimeout(function() {
      document.querySelector('.waifu').style.display = 'none';
    }, 1300);
  },
  "tools.eye"() {
    //TODO  切换到夜间模式
  },
  "tools.chart"() {
    // 一言
    axios.get('https://api.imjad.cn/hitokoto/?cat=&charset=utf-8&length=55&encode=json').then(res => {
      this.showMessage(res.data.hitokoto + (res.data.source?`　　——${res.data.source}`:''))
    })
  }
}

if (!isMobile) {
  Anm.init()
}
