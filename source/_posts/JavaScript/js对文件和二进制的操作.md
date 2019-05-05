---
title: js对文件和二进制的操作
date: 2019-1-30 16:34:53
tags: 
  - JavaScript
categories: 
  - JavaScript
---

### FileReader
它是一个文件读取器
MDN文档里面是这样介绍的
> 其中File对象可以是来自用户在一个&lt;input&gt;元素上选择文件后返回的FileList对象，也可以来自拖放操作生成的 DataTransfer对象，还可以是来自在一个HTMLCanvasElement上执行mozGetAsFile()方法后返回结果。
<!-- more -->
#### 来自input元素
```javascript
const fileInput = document.getElementById("upload-file")
if(!fileInput.value) return

const reader = new FileReader()
reader.onload = function(e) {
  console.log(e.target.result)
}
reader.readAsDataURL(fileInput.files[0])
```
使用FileReader对象的`readAsDataURL`方法获取到的是base64编码, 可以用于图片的预览或文件上传
`readAsText`方法可以获取文本文件的字符

如果file类型的input带有`multiple="multiple"`则可以选择多个文件
fileInput.files就包含多个File对象
这个files本身是一个`FileList`对象

#### 来自Blob对象
```javascript
const reader = new FileReader()
const blob = new Blob(['Hello World'], { type: 'text/plain'})
reader.onload = function(e) {
  console.log(e.target.result)
  // data:text/plain;base64,SGVsbG8gV29ybGQ=
}
reader.readAsDataURL(blob)
```
File对象的原型是Blob对象, 所以本质上与来自input元素没什么区别
![File对象](/images/JavaScript/File对象.png)
