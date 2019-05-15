const fs = require('fs')
const path = require('path')
const crypto = require('crypto')


function sortName(item1, item2) {
  if(item1.name > item2.name) {
    return 1
  } else if(item1.name < item2.name) {
    return -1
  }
  return 0
}

/**
 * 递归遍历目录中的所有文件
 * @param {String} imageFolderPath 文件夹路径
 * @param {Array} images 图片列表
 * @param {String} rootPath 根路径
 */
function readDirSync(imageFolderPath, images, rootPath, callback, count={fileCount:0, finishCount:0}){
  var files = fs.readdirSync(imageFolderPath);
  files.forEach(item => {
    var fileInfo = fs.statSync(`${imageFolderPath}/${item}`)
    if(fileInfo.isDirectory()){
      // 该文件是一个目录, 则遍历该目录内容
      readDirSync(`${imageFolderPath}/${item}`, images, rootPath, callback, count)
    } else {
      count.fileCount ++
      var stream = fs.createReadStream(`${imageFolderPath}/${item}`)
      var fsHash = crypto.createHash('md5')

      stream.on('data', data => {
        fsHash.update(data)
      })
      stream.on('end', () => {
        count.finishCount ++
        images.push({
          name: `${imageFolderPath}/${item}`.replace(rootPath, ''),
          md5: fsHash.digest('hex')
        })
        if(count.fileCount === count.finishCount && typeof callback === 'function') {
          callback(images.sort(sortName))
        }
      })
    }
  })
}

module.exports = function (rootPath, imageFloder, callback) {
  readDirSync(path.resolve(rootPath, imageFloder), [], rootPath, callback)
}
