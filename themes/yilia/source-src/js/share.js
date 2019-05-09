import QRious from 'qrious'

function generate(url, opts) {
  var url = url.replace(/<%-sUrl%>/g, encodeURIComponent(opts.sUrl))
    .replace(/<%-sTitle%>/g, opts.sTitle)
    .replace(/<%-sDesc%>/g, opts.sDesc)
    .replace(/<%-sPic%>/g, encodeURIComponent(opts.sPic))

  window.open(url)
}

var qrcodeInit = false
function showWX() {
  let wx = document.querySelector('.js-wx-box')
  let mask = document.querySelector('.mask')
  if(!qrcodeInit) {
    new QRious({
      element: document.querySelector('.qrcode-canvas'),
      value: location.href
    })
    qrcodeInit = true
  }
  wx.classList.add('in', 'ready')
  mask.classList.add('in')
}

function hideWX() {
  let wx = document.querySelector('.js-wx-box')
  let mask = document.querySelector('.mask')
  wx.classList.remove('in', 'ready')
  mask.classList.remove('in')
}

function handleClick(type, opts) {
  if (type === 'weibo') {
    generate('http://service.weibo.com/share/share.php?url=<%-sUrl%>&title=<%-sTitle%>&pic=<%-sPic%>', opts)
  } else if (type === 'qq') {
    generate('http://connect.qq.com/widget/shareqq/index.html?url=<%-sUrl%>&title=<%-sTitle%>&source=<%-sDesc%>', opts)
  } else if (type === 'douban') {
    generate('https://www.douban.com/share/service?image=<%-sPic%>&href=<%-sUrl%>&name=<%-sTitle%>&text=<%-sDesc%>', opts)
  } else if (type === 'qzone') {
    generate('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<%-sUrl%>&title=<%-sTitle%>&pics=<%-sPic%>&summary=<%-sDesc%>', opts)
  } else if (type === 'facebook') {
    generate('https://www.facebook.com/sharer/sharer.php?u=<%-sUrl%>', opts)
  } else if (type === 'twitter') {
    generate('https://twitter.com/intent/tweet?text=<%-sTitle%>&url=<%-sUrl%>&via=<%-config.url%>', opts)
  } else if (type === 'google') {
    generate('https://plus.google.com/share?url=<%-sUrl%>', opts)
  } else if (type === 'weixin') {
    showWX()
  }
}

let init = function() {
  let $sns = document.querySelectorAll('.share-sns')
  if (!$sns || $sns.length === 0) return

  let sUrl = window.location.href
  let sTitle = document.querySelector('title').innerHTML
  let $img = document.querySelectorAll('.article-entry img')
  let sPic = $img.length ? document.querySelector('.article-entry img').getAttribute('src') : ''
  if ((sPic !== '') && !/^(http:|https:)?\/\//.test(sPic)) {
    sPic = window.location.origin + sPic
  }
  Array.prototype.forEach.call($sns, ($em) => {
    $em.onclick = (e) => {
      let type = $em.getAttribute('data-type')
      handleClick(type, {
        sUrl: sUrl,
        sPic: sPic,
        sTitle: sTitle,
        sDesc: sTitle
      })
    }
  })
  document.querySelector('.mask').addEventListener('click', hideWX)
  document.querySelector('.js-modal-close').addEventListener('click', hideWX)
}

export default { init }