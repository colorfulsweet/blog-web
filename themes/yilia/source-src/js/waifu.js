import '../lib/live2d'
// 浏览器判断
import Browser from './browser'
const isMobile = (Browser.versions.mobile && window.screen.width < 800)

/**
 * 判断浏览器是否支持WebGL
 */
function isSupportWebGL() {
  var canvas = document.createElement("canvas")
  var webGL = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
  return webGL && webGL instanceof WebGLRenderingContext
}

export default {
  init() {
    if(!isMobile && isSupportWebGL()) {
      // 加载live2d模型
      loadlive2d('live2d', window.themeConfig.pictureCdn + '/live2D/Kesshouban/model.json')
      document.querySelector('.waifu').style.display = 'block'
    }
  }
}
