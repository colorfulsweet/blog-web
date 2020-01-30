---
title: base64文件上传
date: 2018-5-30 13:24:50
tags: 
  - base64
categories: 
  - 前端杂烩
---

对于前端的文件上传 , 有很多时候不能直接通过表单提交来完成
包括但不限于下列情况
1. 需要对文件(图片)进行压缩, 或者进行修改(比如裁剪)
2. 多文件上传 (当然也有办法间接借助表单做到, 但是不够优雅)
3. 画布(比如canvas)的快照图片上传
<!-- more -->

这种情况下就需要将文件内容转化为base64编码, 在JS当中处理后完成上传
### 获取base64编码

#### file类型的input
```javascript
//这是一个<input id='upload-file' type='file' />元素
var fileInput = document.getElementById("upload-file");
fileInput.addEventListener('change', function() {
  //获取File对象
  var file = fileInput.files[0];
  var reader = new FileReader();
  var fileBase64 = null;
  reader.onload = function(e) {
    fileBase64 = e.target.result; //base64编码
  }
  reader.readAsDataURL(file);
})
```
这里获取到的`fileBase64`就是文件的base64编码
如果这个文件是一个图片 , 我们当然可以借助它来实现所选图片的预览
( 当然需要判断所选的文件是不是图片 )
比如
```javascript
//这是一个DIV
var preview = document.getElementById("image-preview");
preview.style.backgroundImage = 'url(' + fileBase64 + ')';
```

#### canvas画布
对于canvas画布 , 我们可以借助`toDataURL`这个API , 来获得这个画布的快照
```javascript
var imageBase64 = document.getElementById("test-canvas").toDataURL('image/jpeg', 0.8);
```
**toDataURL**有两个参数, 都是可选的
1. 图片格式，默认为 image/png
2. 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量
如果超出取值范围，将会使用默认值 0.92

> 如果画布没有填充底色, 生成jpeg格式的快照图片, 底色将为黑色
如果需要底色透明, 可以使用 **image/png** 格式

### 文件上传
通过观察toDataURL方法的返回结果

![image base64](/images/前端杂烩/image_base64.png)

可以发现这个字符串的逗号之前是对文件类型的标识
之后才是文件的实际内容(base64编码可以直接表示二进制的内容)
所以在实际执行上传的时候 , 需要使用的是逗号之后的内容
```javascript
var imgBase64 = document.getElementById("test-canvas").toDataURL('image/png')
//atob 对用base-64编码过的字符串进行解码
var imgBytes = window.atob(imgBase64.split(',')[1])
var arrBuffer = new ArrayBuffer(imgBytes.length)
var ubuffer = new Uint8Array(arrBuffer)
for (let i = 0; i < imgBytes.length; i++) {
  ubuffer[i] = imgBytes.charCodeAt(i)
}
let blob;
try {
  blob = new Blob([ubuffer], {type: 'image/png'});
} catch (e) { // 安卓手机不支持Blob构造方法
  let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
  if(e.name === 'TypeError' && BlobBuilder){
    let blobBuilder = new BlobBuilder();
    blobBuilder.append(arrBuffer);
    blob = blobBuilder.getBlob('image/png');
  }
}
var formData = new FormData();
formData.append('uploadImg', blob);
formData.append('token', 'xxx');//如果需要, 可以添加其他字段
const config = {
  // headers: {'Content-Type': 'multipart/form-data'},
  withCredentials: true
}
axios.create(config).post('ApiUrl', formData).then((response) => {
    alert(response.data.msg)
  })
```
最后的ajax请求是借助`axios`来实现的 , 其他的库基本同理 , 遵循各自API即可
后端写法与blob对应的字段名对应即可
比如上面示例代码当中使用的是 **uploadImg**
那么后端代码大致如下
```java
@PostMapping("/uploadSnapshot")
public String uploadSnapshot(@RequestParam("uploadImg") MultipartFile uploadImg) {
  //do something...
  
  return "上传成功";
}
```

### 多文件上传
有了上面的实现方式 , 多文件上传就十分简单了
其实就是对于多个Blob对象 , 执行多次formData.append
> 注意 : 不是在一个Blob当中添加多个Uint8Array

假如当前页面有多个canvas , 我需要一次性上传这些快照图片
```javascript
var canvasDoms = document.getElementsByTagName('canvas')
var formData = new FormData();
for(let index=0 ; index<canvasDoms.length ; index++) {
  let imgBytes = window.atob(canvasDoms[index].toDataURL('image/png').split(',')[1])
  let arrBuffer = new ArrayBuffer(imgBytes.length)
  let ubuffer = new Uint8Array(arrBuffer)
  for (let i = 0; i < imgBytes.length; i++) {
    ubuffer[i] = imgBytes.charCodeAt(i)
  }
  let blob;
  try {
    blob = new Blob([ubuffer], {type: 'image/png'});
  } catch (e) { // 安卓手机不支持Blob构造方法
    let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
    if(e.name === 'TypeError' && BlobBuilder){
      let blobBuilder = new BlobBuilder();
      blobBuilder.append(arrBuffer);
      blob = blobBuilder.getBlob('image/png');
    }
  }
  formData.append('uploadImg', blob);
}
//...之后执行ajax请求 , 与单文件上传没有差别
```
在后端需要用`MultipartFile`对象的数组进行接收
```java
@PostMapping("/uploadSnapshot")
public String uploadSnapshot(@RequestParam("uploadImg") MultipartFile uploadImg[]) {
  //do something...
  
  return "上传成功";
}
```