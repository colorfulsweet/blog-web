const nunjucks = require('nunjucks')
const path = require('path')
const fs = require('fs')

// hexo@8 移除了内置 jsfiddle tag，在此重新注册
hexo.extend.tag.register('jsfiddle', function(args) {
  const shortcode = args[0]
  const tabs = args[1] || 'js,resources,html,css,result'
  const skin = args[2] || 'light'
  const width = args[3] || '100%'
  const height = args[4] || '300'
  return `<iframe style="width: ${width}; height: ${height}px" src="//jsfiddle.net/${shortcode}/embedded/${tabs}/?skin=${skin}" allowfullscreen="allowfullscreen" frameborder="0"></iframe>`
})

const env = new nunjucks.configure({ autoescape: false })
env.addFilter('noControlChars', function(str) {
	return str && str.replace(/[\x00-\x1F\x7F]/g, '')
})

const searchTmplSrc = path.join(__dirname, '../templates/articles.xml')

hexo.extend.generator.register('xml', function(locals){
  const searchTmpl = nunjucks.compile(fs.readFileSync(searchTmplSrc, 'utf8'), env)
  const descCompare = function(value1, value2) {
    if(value1 > value2) {
      return -1
    } else if(value1 < value2) {
      return 1
    } else {
      return 0
    }
  }
  const posts = locals.posts.toArray().sort(function(item1, item2){
    return descCompare(item1.updateDate || item1.date, item2.updateDate || item2.date)
  }).slice(0, 10)
  const xmlData = searchTmpl.render({
    posts,
    root: this.config.root
  })
  return {
    path: 'articles.xml',
    data: xmlData
  }
})

// 自定义 Baidu Sitemap 生成器（替代已废弃的 hexo-generator-baidu-sitemap）
hexo.extend.generator.register('baidusitemap', function(locals) {
  const config = hexo.config.baidusitemap || {}
  const outputPath = config.path || 'baidusitemap.xml'

  const posts = locals.posts.toArray().filter(function(post) { return !post.draft })
  const pages = locals.pages.toArray()
  const allItems = posts.concat(pages).sort(function(a, b) {
    const dateA = (a.updated || a.date)
    const dateB = (b.updated || b.date)
    return dateB - dateA
  })

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ]

  allItems.forEach(function(item) {
    const dateObj = item.updated || item.date
    const dateStr = dateObj && dateObj.format
      ? dateObj.format('YYYY-MM-DD')
      : new Date(dateObj).toISOString().split('T')[0]
    lines.push('  <url>')
    lines.push('    <loc>' + item.permalink + '</loc>')
    lines.push('    <lastmod>' + dateStr + '</lastmod>')
    lines.push('  </url>')
  })

  lines.push('</urlset>')

  return {
    path: outputPath,
    data: lines.join('\n')
  }
})