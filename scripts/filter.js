hexo.extend.filter.register('before_post_render', function(data){
  // data.raw 是原始的文件内容
  // data.content 是处理过代码块语法高亮的内容
  if(hexo.config.picture_cdn) {
    data.content = data.content.replace(/\]\s*\((?=(?!http).*?\))/gi, 
      `](${hexo.config.picture_cdn}`)
  }
  return data;
});