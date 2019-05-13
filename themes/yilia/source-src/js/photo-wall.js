import axios from 'axios'

var groupid = 1, currentIndex = 0, defaultStep = 20, scrollLock = false

// 滚动区域DOM
const scrollDom = document.getElementById('container')
// 作为底部标记的DOM
const markDom = document.getElementById('footer')
// 加载提示文字
const loadTip = document.getElementById('load-tip')

function loadMoreItems(step) {
  scrollLock = true //加载过程中锁定滚动加载
  loadTip.style.display = 'block'
  var photoWallWrapper = document.getElementById('photo-wall')
  // 滚动到底部时调用
  axios.get(`${themeConfig.pictureCdn}/photo-wall/${groupid}/list.json`).then(res => {
    var itemContainer = document.createElement('div')
    var imgItems = '', index = currentIndex
    while(index<currentIndex+step && index<res.data.files.length) {
      let imgHeight = null
      if(res.data.files[index].width && res.data.files[index].height) {
        let wrapperWidth = photoWallWrapper.getBoundingClientRect().width
        // 列宽240px 列间距20px, 计算每列宽度
        let columnWidth = (wrapperWidth + 20) / Math.floor((wrapperWidth + 20) / (240 + 20)) - 20
        imgHeight = (columnWidth / res.data.files[index].width) * res.data.files[index].height
      }
      imgItems += `<div class="item" ${imgHeight ? 'style="height:' + imgHeight + 'px"' : ''}>
          <img class="item-img" src="${themeConfig.pictureCdn}/${res.data.files[index].name}" alt=""/>
      </div>`
      index++
    }
    if(index >= res.data.files.length) { // 已到达当前分组列表的末尾
      groupid++
      if(index<currentIndex+step) { // 如果加载的数据数量不足步长
        // 则需要再加载下一个分组, 下一个分组需要加载的图片数量是剩余的步长
        let tempIndex = currentIndex
        currentIndex = 0
        loadMoreItems(tempIndex + step - index) 
      }
    } else {
      currentIndex = index
    }
    itemContainer.classList.add('item-container')
    itemContainer.insertAdjacentHTML('beforeend', imgItems)
    photoWallWrapper.appendChild(itemContainer)
    setTimeout(()=>{
      loadTip.style.display = 'none'
      scrollLock = false
    }, 2000)
  }).catch(res => { // 未加载到文件列表, 代表已经没有更多图片
    scrollLock = true
    loadTip.textContent = '没有更多图片啦/(ㄒoㄒ)/~~'
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
  var _onscroll = scrollDom.onscroll
  var timer = null
  scrollDom.onscroll = function () {
    // 保留已有的滚动事件回调函数并在新的回调函数中进行调用
    typeof _onscroll === 'function' && _onscroll.apply(this, arguments)
    if(scrollLock) return
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      if(checkScrollSlide()) {
        loadMoreItems(defaultStep)
      }
      timer = null
    }, 200)
  }
  loadMoreItems(defaultStep)
}
export default { init } 