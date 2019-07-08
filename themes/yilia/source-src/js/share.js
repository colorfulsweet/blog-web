import QRious from 'qrious'

var qrcodeInit = false
function showWXModal() {
  let wx = document.querySelector('.js-wx-box')
  let mask = document.querySelector('.mask')
  if(!qrcodeInit) {
    new QRious({
      element: document.querySelector('.qrcode-canvas'),
      value: location.href
    })
    qrcodeInit = true
  }
  wx.classList.add('in')
  mask.classList.add('in')
}

function handleClick(type, opts) {
  let url = null
  switch(type) {
    case 'weibo' :
      url = `http://service.weibo.com/share/share.php?url=${opts.sUrl}&title=${opts.sTitle}&pic=${opts.sPic}`
      break
    case 'qq' :
      url = `http://connect.qq.com/widget/shareqq/index.html?url=${opts.sUrl}&title=${opts.sTitle}&source=${opts.sDesc}`
      break
    case 'douban' :
      url = `https://www.douban.com/share/service?image=${opts.sPic}&href=${opts.sUrl}&name=${opts.sTitle}&text=${opts.sDesc}`
      break
    case 'qzone' :
      url = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${opts.sUrl}&title=${opts.sTitle}&pics=${opts.sPic}&summary=${opts.sDesc}`
      break
    case 'facebook' :
      url = `https://www.facebook.com/sharer/sharer.php?u=${opts.sUrl}`
      break
    case 'twitter' :
      url = `https://twitter.com/intent/tweet?text=${opts.sTitle}&url=${opts.sUrl}&via=${themeConfig.baseUrl}`
      break
    case 'google' :
      url = `https://plus.google.com/share?url=${opts.sUrl}`
      break
    case 'weixin' :
      showWXModal()
      break
  }
  if(url) {
    window.open(url)
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
        sUrl: encodeURIComponent(sUrl),
        sPic: encodeURIComponent(sPic),
        sTitle: sTitle,
        sDesc: sTitle
      })
    }
  })
}

export default { init }