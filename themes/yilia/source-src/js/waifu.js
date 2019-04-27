import '../lib/live2d'
// 浏览器判断
import Browser from './browser'
const isMobile = (Browser.versions.mobile && window.screen.width < 800)
// 加载live2d模型
if(!isMobile) {
  loadlive2d('live2d', 'https://blog-cdn.nos-eastchina1.126.net/live2D/Kesshouban/model.json')
  document.querySelector('.waifu').style.display = 'block'
}


// 控制台
console.log(
  '\n %c Silence %c https://www.colorfulsweet.site \n',
  'color:#FFFFFB;background:#ffa628;padding:5px 0;border-radius:.5rem 0 0 .5rem;',
  'background: #efefef;padding:5px 0;border-radius:0 .5rem .5rem 0;'
)
console.log(`页面加载消耗了 ${(Math.round(performance.now()*100)/100/1000).toFixed(2)}s`)


