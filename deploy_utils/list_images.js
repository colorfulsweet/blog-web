const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

/**
 * 递归遍历目录中的所有文件
 * @param {String} imageFolderPath 文件夹路径
 * @param {Array} images 图片列表
 * @param {String} rootPath 根路径
 */
function readDirSync(imageFolderPath, images, rootPath){
  var files = fs.readdirSync(imageFolderPath);
  files.forEach(item => {
    var fileInfo = fs.statSync(`${imageFolderPath}/${item}`)
    if(fileInfo.isDirectory()){
      // 该文件是一个目录, 则遍历该目录内容
      readDirSync(`${imageFolderPath}/${item}`, images, rootPath)
    }else{
      //读取一个Buffer
      let buffer = fs.readFileSync(`${imageFolderPath}/${item}`)
      let fsHash = crypto.createHash('md5')
      fsHash.update(buffer)
      images.push({
        name: `${imageFolderPath}/${item}`.replace(rootPath, ''),
        md5: fsHash.digest('hex')
      })
    }
  })
  return images
}

module.exports = function (rootPath, imageFloder) {
  return readDirSync(path.resolve(rootPath, imageFloder), [], rootPath).sort(function(item1, item2){
    if(item1.name > item2.name) {
      return 1
    } else if(item1.name < item2.name) {
      return -1
    }
    return 0
  })
}
