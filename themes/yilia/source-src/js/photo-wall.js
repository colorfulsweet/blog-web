import photoWallJson from '../config/photo-wall.json'

var content = '<div class="itemContainer">'
photoWallJson.forEach(item => {
  content += `
  <div class="item">
      <img class="item-img" src="${item.url}" alt=""/>
  </div>
  `
})
content += '</div>'

document.getElementById('photo-wall').innerHTML = content