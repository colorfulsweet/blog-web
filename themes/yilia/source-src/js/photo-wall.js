import axios from 'axios'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

var totalIndex = 0, defaultStep = 20, scrollLock = false

// 容器DIV
const photoWallWrapper = document.getElementById('photo-wall')
// 滚动区域DOM
const scrollDom = document.getElementById('container')
// 作为底部标记的DOM
const markDom = document.getElementById('footer')
// 加载提示文字
const loadTip = document.getElementById('load-tip')

// 相册集
const items = []
function getThumbBoundsFn(target) {
  return function(index) { // index是当前点击的图片在相册中的索引值
    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop
    var rect = target.getBoundingClientRect()
    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width}
  }
}
var pswpElement = document.querySelectorAll('.pswp')[0]
function loadMoreItems(step) {
  scrollLock = true //加载过程中锁定滚动加载
  loadTip.style.display = 'block'
  // 滚动到底部时调用
  axios.get(`${themeConfig.root}api/v1/common/photos`, {params: {start:totalIndex, limit:step}}).then(res => {
    var itemContainer = document.createElement('div')
    for(let index = 0 ; index<res.data.data.length && totalIndex<res.data.total ; index++,totalIndex++ ) {
      let imgHeight = null, imgFile = res.data.data[index],
        imgSrc = `${themeConfig.pictureCdn}/${imgFile.name}`,
        imgThumbnail = imgFile.thumbnail ? `${themeConfig.pictureCdn}/${imgFile.thumbnail}` : imgSrc
      let wrapperWidth = photoWallWrapper.getBoundingClientRect().width
      // 列宽240px 列间距20px, 计算每列宽度
      let columnWidth = (wrapperWidth + 20) / Math.floor((wrapperWidth + 20) / (240 + 20)) - 20
      // 图片的实际显示高度
      imgHeight = (columnWidth / imgFile.width) * imgFile.height
      imgHeight = Math.round(imgHeight * 100) / 100 // 四舍五入保留2位小数
      items.push({
        msrc: imgThumbnail, // 缩略图的地址
        src: imgSrc,
        w: imgFile.width,
        h: imgFile.height,
        title: imgFile.name
      })
      let imgItemDiv = document.createElement('div'), imgItem = document.createElement('img')
      imgItemDiv.classList.add('item')
      imgItemDiv.style.height = imgHeight+'px'
      imgItem.classList.add('item-img')
      imgItem.setAttribute('src', imgThumbnail)
      imgItem.addEventListener('click', (function(totalIndex){
        return function(e) {
          // slider展开状态
          if (document.querySelector('.left-col.show')) return
          var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
            index: totalIndex,
            bgOpacity: 0.8,
            getThumbBoundsFn: getThumbBoundsFn(e.target)
          })
          gallery.init()
        }
      })(totalIndex))
      imgItemDiv.appendChild(imgItem)
      itemContainer.appendChild(imgItemDiv)
    }
    itemContainer.classList.add('item-container')
    // itemContainer.insertAdjacentHTML('beforeend', imgItems)
    photoWallWrapper.appendChild(itemContainer)
    if( totalIndex >= res.data.total ) {
      loadTip.textContent = '没有更多图片啦/(ㄒoㄒ)/~~'
    } else {
      setTimeout(()=>{
        loadTip.style.display = 'none'
        scrollLock = false
      }, 2000)
    }
  }).catch(res => {
    scrollLock = false
    loadTip.textContent = '图片加载失败, 请稍后重试...'
  })
}

//检测是否具备滚动条加载数据块的条件
function checkScrollSlide(){
  var scrollH = scrollDom.scrollTop || document.body.scrollTop || document.documentElement.scrollTop
  var clientHeight = document.body.clientHeight || document.documentElement.clientHeight
  var footerOffetTop = markDom.offsetTop
  return scrollH + clientHeight > footerOffetTop
}

function init() {
  var timer = null
  scrollDom.addEventListener('scroll', function(){
    if(scrollLock) return
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      if(checkScrollSlide()) {
        loadMoreItems(defaultStep)
      }
      timer = null
    }, 200)
  })
  loadMoreItems(defaultStep)
}
export default { init } 