import axios from 'axios'

var groupid = 1, currentIndex = 0

function loadMore(step) {
  // 滚动到底部时调用
  axios.get(`${themeConfig.pictureCdn}/photo-wall/${groupid}/list.json`).then(res => {
    var itemContainer = document.createElement('div')
    var imgItems = '', index = currentIndex
    for( ; index<currentIndex+step && index<res.data.files.length ; index++) {
      imgItems += `
      <div class="item">
          <img class="item-img" src="${themeConfig.pictureCdn}/${res.data.files[index].name}" alt=""/>
      </div>
      `
    }
    if(index >= res.data.files.length) { // 已到达当前分组列表的末尾
      groupid++
      if(index<currentIndex+step) { // 如果加载的数据数量不足步长
        // 则需要再加载下一个分组, 下一个分组需要加载的图片数量是剩余的步长
        loadMore(currentIndex + step - index) 
      }
    } else {
      currentIndex = index
    }
    itemContainer.classList.add('item-container')
    itemContainer.innerHTML = imgItems
    document.getElementById('photo-wall').appendChild(itemContainer)
  }).catch(res => { // 未加载到文件列表, 代表已经没有更多图片
    // TODO 显示已没有更多内容
    // console.log(res)
  })
}
loadMore(20)

//TODO 在滚动到底部时调用loadMore