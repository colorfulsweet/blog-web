var backTop = function (domE, ctn, distance) {
  if (!domE) return
  ctn.addEventListener('scroll', function(){
    // 滚动到一定高度才显示"回到顶部"按钮
    throttle(toggleDomE, 200)(domE, ctn, distance)
  })
  if(!window.getComputedStyle || window.getComputedStyle(ctn).scrollBehavior === undefined) {
    // 浏览器不支持scroll-behavior属性
    let timer = null
    domE.querySelector('a[href="#top"]').addEventListener('click', function (event) {
      event.preventDefault()
      timer = setInterval(function () { //设置一个计时器
        var ct = ctn.scrollTop || document.documentElement.scrollTop || document.body.scrollTop //获取距离顶部的距离
        var diff = Math.max(10, ct / 6)
        ct -= diff
        if (ct > 0) {//如果与顶部的距离大于零
          ctn.scrollTop = ctn.scrollTop - diff
          window.scrollTo(0, ct)//向上移动10px
        } else {//如果距离小于等于零
          ctn.scrollTop = 0
          window.scrollTo(0, 0)//移动到顶部
          clearInterval(timer)//清除计时器
        }
      }, 13)//隔13ms执行一次前面的function，展现一种平滑滑动效果
    })
  }

  function toggleDomE(targetDom, containerDom, distance) {
    targetDom.style.display = (containerDom.scrollTop || document.documentElement.scrollTop || document.body.scrollTop) > distance  ? 'block' : 'none'
  }
  function throttle(func, wait) {
    var timer = null
    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        return typeof func === 'function' && func.apply(this, args)
      }, wait)
    }
  }
};

function init() {
  backTop(document.getElementById('js-jump-container'), document.getElementById('container'), 300)
}

export default { init }