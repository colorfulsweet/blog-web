const nunjucks = require('nunjucks')
const path = require('path')
const fs = require('fs')

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