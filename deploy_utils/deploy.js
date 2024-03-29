const fs = require('fs')
const path = require('path')

class Deploy {
  /**
   * 发布静态化的站点
   * @param {String} source 源位置
   * @param {String} target 目标位置
   * @param {Boolean} isRemove 是否先进行删除
   */
  async exec(source, target, isRemove = false) {
    if(isRemove) {
      await new Promise((resolve, reject) => {
        console.log(`删除${target}目录中的文件`)
        this._deleteFolderRecursive(target, true)
        resolve()
      })
    }
    console.log(`拷贝${source}所有文件 -> ${target}`)
    this._checkDirectory(target)
    this._copyFolderRecursive(source, target)
  }

  /**
   * 递归删除目录以及子目录中的所有文件
   * @param {String} curPath 要递归删除的目录
   * @param {Boolean} retainRoot 是否保留根目录不删除
   */
  _deleteFolderRecursive(curPath, retainRoot) {
    fs.readdirSync(curPath).forEach(file => {
      var nextPath = path.resolve(curPath, file)
      if(fs.statSync(nextPath).isDirectory()) { // recurse
        this._deleteFolderRecursive(nextPath)
      } else {
        fs.unlinkSync(nextPath)
      }
    })
    if(!retainRoot) { // 根目录保留
      fs.rmdirSync(curPath)
    }
  }
  /**
   * 递归拷贝目录
   * @param {String} source 源位置
   * @param {String} target 目标位置
   */
  _copyFolderRecursive(source, target) {
    let files = fs.readdirSync(source); //同步读取当前目录
    files.forEach(file => {
      var _src = path.resolve(source, file)
      var _target = path.resolve(target, file)
      fs.stat(_src,(err,stats) => {  //stats  该对象 包含文件属性
        if (err) throw err
        if (stats.isFile()) { //如果是个文件则拷贝 
          let readable = fs.createReadStream(_src) //创建读取流
          let writable = fs.createWriteStream(_target) //创建写入流
          readable.pipe(writable);
        } else if (stats.isDirectory()) { //是目录则 递归 
          this._checkDirectory(_target, this._copyFolderRecursive, _src, _target)
        }
      })
    })
  }
  
  /**
   * 校验目标目录是否存在
   * @param {String} target 目标目录
   * @param {Function} callback 回调函数
   * @param {Array} args 回调函数入参
   */
  _checkDirectory (target, callback, ...args) {
    fs.access(target, fs.constants.F_OK, err => {
      if (err) {
        fs.mkdirSync(target)
      }
      if (typeof callback === 'function') {
        callback.apply(this, args)
      }
    })
  }
}

module.exports = new Deploy()