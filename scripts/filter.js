// 替换markdown中图片路径的正则
const mdImageRegex = /\]\s*\((?=(?!http).*?\))/gi
// 替换所有HTML标签的正则
hexo.extend.filter.register('before_post_render', function(article){
  // article.raw 是原始的文件内容
  // article.content 是处理过代码块语法高亮的内容
  if(hexo.config.picture_cdn) {
    article.content = article.content.replace(mdImageRegex, `](${hexo.config.picture_cdn}`)
  }
  return article
})