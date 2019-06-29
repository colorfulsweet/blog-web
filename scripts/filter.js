const crypto = require('crypto')
/**
 * 创建mongodb数据库连接, 返回Model
 */
function createModel(dbUrl) {
  const Segment = require('segment')
  const segment = new Segment() // 创建实例
  segment.useDefault() // 使用默认的识别模块及字典

  const mongoose = require('mongoose')
  mongoose.connect(dbUrl, {useNewUrlParser: true})
  const articleSchema = new mongoose.Schema({
    title: String,
    path: String,
    create_date: Date,
    content: String,
    content_hash: String
  }, {
    collection: 'article',
    versionKey: false,
  })

  const articleKeysSchema = new mongoose.Schema({
    article_id: mongoose.Types.ObjectId,
    keys: Array
  }, {
    collection: 'article_keys',
    versionKey: false,
  }) 
  return {
    articleModel: mongoose.model('Article', articleSchema),
    articleKeysModel: mongoose.model('ArticleKeys', articleKeysSchema)
  }
}

var mongooseModels = undefined
if(hexo.config.save_content) {
  mongooseModels = createModel('mongodb://127.0.0.1:27017/common_api')
}

// 替换markdown中图片路径的正则
const mdImageRegex = /\]\s*\((?=(?!http).*?\))/gi
// 替换所有HTML标签的正则
const tagRegex = /<[^>]*>/g
hexo.extend.filter.register('before_post_render', function(article){
  // article.raw 是原始的文件内容
  // article.content 是处理过代码块语法高亮的内容
  if(hexo.config.picture_cdn) {
    article.content = article.content.replace(mdImageRegex, `](${hexo.config.picture_cdn}`)
  }
  return article
})

hexo.extend.filter.register('after_post_render', function(article){
  if(!mongooseModels || article.pageid) return article
  let textContent = article.content.replace(tagRegex, '')
  const contentHash = crypto.createHash('sha1')
        .update(textContent)
        .digest('hex')
  let articleKeys = segment.doSegment(textContent, {
    simple: true, // 不返回词性
    stripPunctuation: true // 去除标点符号
  })
  const articleEntity = new mongooseModels.articleModel({
    title: article.title,
    path: article.path,
    create_date: article.date._i,
    content: textContent,
    content_hash: contentHash
  })
  articleEntity.save(function(err, savedArticle){
    if(err) console.error(err)
    const articleKeysEntity = new mongooseModels.articleKeysModel({
      article_id: savedArticle._id,
      keys: articleKeys,
    })
    articleKeysEntity.save()
  })
  return article;
})