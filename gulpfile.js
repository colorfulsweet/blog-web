const gulp = require('gulp'),
  htmlmin = require('gulp-htmlmin'),   // html压缩组件
  htmlclean = require('gulp-htmlclean'), // html清理组件
  plumber = require('gulp-plumber'),  // 容错组件（发生错误不跳出任务，并报出错误内容）
  Hexo = require('hexo'),
  log = require('fancy-log') // gulp的日志输出

// 程序执行的传参
const argv = require('optimist')
  // .demand(['accessKey', 'accessSecret', 'deployPath'])
  .describe('accessKey', '网易云对象存储key')
  .describe('accessSecret', '网易云对象存储secret')
  .describe('deployPath', '静态化后发布的目录')
  .argv

const hexo = new Hexo(process.cwd(), {})

// 创建静态页面 （等同 hexo generate）
gulp.task('generate', async function() {
  try {
    await hexo.init()
    await hexo.call('clean')
    await hexo.call('generate', { watch: false })
    return hexo.exit()
  } catch (err) {
    return hexo.exit(err)
  }
})

// 压缩public目录下的html文件
gulp.task('compressHtml', () => {
  const cleanOptions = {
    protect: /<\!--%fooTemplate\b.*?%-->/g,             //忽略处理
    unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/ig //特殊处理
  }
  const minOption = {
    collapseWhitespace: true,           //删除html中的空白
    conservativeCollapse: false,        //将多个空白折叠为1空白(永远不要完全移除), 必须与 collapseWhitespace=true 一起使用
    collapseBooleanAttributes: true,    //省略布尔属性的值  <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,        //删除所有空属性值    <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,   //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    removeComments: true,               //清除HTML注释
    minifyJS: true,                     //压缩页面JS
    minifyCSS: true,                    //压缩页面CSS
    minifyURLs: false                   //替换页面URL
  }
  return gulp.src('./public/**/*.html')
    .pipe(plumber())
    .pipe(htmlclean(cleanOptions))
    .pipe(htmlmin(minOption))
    .pipe(gulp.dest('./public'))
})

// 同步图片到对象存储仓库
gulp.task('syncImages', () => {
  const listImages = require('./deploy_utils/list_images')
  if(!argv.accessKey || !argv.accessSecret) {
    return Promise.resolve('未获得accessKey以及accessSecret, 跳过图片同步').then(log)
  }
  // 同步当前本地存在的所有图片
  const rootPath = `${process.cwd()}/`.replace(/\\/g, '/')
  return new Promise(resolve => {
    listImages(rootPath, 'images/', resolve)
  }).then(imagesList => {
    const ImageSynchronizer = require('./deploy_utils/image_synchronize')
    const nosSetting = {
      defaultBucket: 'blog-cdn',
      endpoint: 'http://nos-eastchina1.126.net',
      accessKey: argv.accessKey,
      accessSecret: argv.accessSecret
    }
    const imageSynchronizer = new ImageSynchronizer(nosSetting, imagesList, rootPath)
    return imageSynchronizer.synchronize('images/')
  })
})

gulp.task('deploy', () => {
  if(!argv.deployPath) {
    return Promise.resolve('未获得deployPath, 跳过发布').then(log)
  }
  const deploy = require('./deploy_utils/deploy')
  return deploy.exec('./public', argv.deployPath, false)
})

// 默认任务
gulp.task('default', 
	gulp.series('generate', 'compressHtml', 'syncImages', 'deploy') // 串行执行任务
)