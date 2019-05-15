const fs = require('fs'),
    path = require('path'),
    nos = require('@xgheaven/nos-node-sdk')

class ImageSynchronizer {
  /**
   * 构造方法
   * @param {Object} setting NosClient的设置项
   * @param {Array} imagesList 本地图片的列表
   * @param {String} rootPath 本地文件根路径
   */
  constructor(setting, imagesList, rootPath) {
    // 网易云对象存储调用接口client
    this.client = new nos.NosClient(setting)
    this.imagesList = imagesList
    this.rootPath = rootPath
  }
  /**
   * 执行文件同步
   * @param {String} prefix 图片目录前缀
   */
  synchronize(prefix) {
    return this._queryObjects({limit: this.imagesList.length+1, prefix}, function(pendingUploadFiles){
      this._uploadObject(pendingUploadFiles)
    }, function(pendingDeleteFiles){
      this._deleteObjects(pendingDeleteFiles)
    })
  }
  /**
   * 查询所有对象存储库已存在的文件
   * @param {Object} params 查询的参数
   * @param {Function} uploadCallback 处理待上传文件的回调函数
   * @param {Function} deleteCallback 处理待删除文件的回调函数
   */
  async _queryObjects(params, uploadCallback, deleteCallback) {
    // 列出所有已存储的对象
    const ret = await this.client.listObject(params)
    // ret 包括 items(元素)，limit(请求的数量)，nextMarker(下一个标记)
    let storageItems = ret.items.filter(item => {
      return /^images.+?\.(png|jpe?g|gif)$/.test(item.key)
    }).sort((item1, item2) => {
      if (item1.key > item2.key) {
        return 1
      }
      else if (item1.key < item2.key) {
        return -1
      }
      return 0
    });
    // 待上传的文件列表
    let pendingUploadFiles = this.imagesList.filter(item => {
      let index = this._binarySearch(storageItems, item.name, 'key', 0, storageItems.length - 1)
      if (index === -1) {
        // 文件名不存在, 代表是新文件
        item.type = 'new'
        return true
      }
      else if (storageItems[index].eTag !== item.md5) {
        // 文件名存在, 但是hash值不同, 代表有变化
        item.type = 'change'
        return true
      }
      return false
    });
    // 处理待上传的文件
    uploadCallback.call(this, pendingUploadFiles);
    // 待删除的文件列表( 仓库中存在, 本地不存在 )
    let pendingDeleteFiles = storageItems.filter(item => {
      return this._binarySearch(this.imagesList, item.key, 'name', 0, this.imagesList.length - 1) === -1;
    })
    // 处理待删除的文件
    deleteCallback.call(this, pendingDeleteFiles.map(item => item.key))
  }
  /**
   * 上传文件对象
   * @param {Array} filesList 待上传的文件列表
   * @param {Number} index 索引值
   */
  _uploadObject(filesList, index=0) {
    if(index >= filesList.length) return

    this.client.putObject({
      objectKey: filesList[index].name,
      body: fs.createReadStream(path.resolve(this.rootPath, filesList[index].name)), // 支持 Buffer/Readable/string
    }).then(result => {
      // eTag是上传后远端校验的md5值, 用于和本地进行比对
      let eTag = result.eTag.replace(/"/g,'')
      if(filesList[index].md5 === eTag) {
        console.log(`${filesList[index].name} 上传成功, md5:${eTag} 类型: ${filesList[index].type}`)
      } else {
        console.warn(`${filesList[index].name} 上传出错, md5值不一致`)
        console.warn(`===> 本地文件: ${filesList[index].md5}, 接口返回: ${eTag}`)
      }
      this._uploadObject(filesList, ++index)
    })
  }
  /**
   * 批量删除文件
   * @param {Array} fileNamesList 文件名数组
   */
  _deleteObjects(fileNamesList) {
    if(!Array.isArray(fileNamesList) || !fileNamesList.length) return

    this.client.deleteMultiObject({
      objectKeys: fileNamesList
    }).then(err => {
      console.log('===> 文件删除成功')
      fileNamesList.forEach(item => console.log(item))
    })
  }
  /**
   * 二分法查找
   * @param {Array} arr 执行查找的数组 
   * @param {Object} target 要找到的目标元素
   * @param {String} key 数组元素上的键
   * @param {Number} start 查找的范围 起点
   * @param {Number} end 查找的范围 终点
   */
  _binarySearch(arr, target, key, start, end) {
    if(!Array.isArray(arr) || !arr.length) {
      return -1
    }
    if(start >= end) {
      return arr[start][key] === target ? start : -1
    }
    let index = Math.ceil((start + end)/2)
    if(arr[index][key] === target) {
      return index
    } else if(arr[index][key] > target) {
      return this._binarySearch(arr, target, key, start, index-1)
    } else {
      return this._binarySearch(arr, target, key, index+1, end)
    }
  }
}
module.exports = ImageSynchronizer