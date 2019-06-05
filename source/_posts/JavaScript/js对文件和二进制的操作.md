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

### Blob对象
Blob对象使用同名构造函数创建
该构造函数接收两个参数, 第一个参数必须是 Array 类型的
第二个参数可选, 可以传入一个对象
有2个选项, 分别是`type`和`endings`

type 指定第一个参数的 MIME-Type, endings 指定第一个参数的数据格式,其可选值有 transparent(不变,默认) 和 native(随系统转换)

Blob对象上的属性和方法
+ `size`属性 - 对象中包含数据的大小(字节)
+ `type`属性 - 获取对象所包含数据的MIME类型
+ `slice(start, end, type)`方法 - 截取Blob对象中的一部分, 返回一个新的Blob对象, 包含开始索引, 不包含结束索引

> 使用slice和size, 可以实现大文件分段上传

### ArrayBuffer

> ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。ArrayBuffer 不能直接操作,而是要通过类型数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

FileReader 有个 `readAsArrayBuffer` 方法,如果的被读的文件是二进制数据, 用这个方法去读应该是最合适的, 读出来的数据, 就是一个 Arraybuffer 对象

同名构造函数用于创建一个指定长度的, 内容全部为0的ArrayBuffer对象
```javascript
// 创建一个8字节的ArrayBuffer
let arrayBuffer = new ArrayBuffer(8)
```
![ArrayBuffer](/images/JavaScript/ArrayBuffer.jpg)
> 这里的`[[Int8Array]]`等只是为了方便开发者查看的, 实际上并不能直接进行操作

由于无法对ArrayBuffer直接操作, 所以我们需要借助其他对象来操作
也就是`TypedArray`(类型数组对象)和`DataView`

### TypedArray
没有名为 TypedArray 的全局对象, 也没有一个名为的 TypedArray 构造函数, 它是一类对象的统称
有以下9个
<pre>
Int8Array();
Uint8Array();
Uint8ClampedArray();
Int16Array();
Uint16Array();
Int32Array();
Uint32Array();
Float32Array();
Float64Array();
</pre>
`Int`表示有符号整数, `Uint`表示无符号整数

**基本用法**
```javascript
let arrayBuffer = new ArrayBuffer(8);
console.log(arrayBuffer[0]);  // undefined

let uint8Array = new Uint8Array(arrayBuffer);
console.log(uint8Array);  // [0, 0, 0, 0, 0, 0, 0, 0]

uint8Array[0] = 1;
console.log(uint8Array[0]); // 1
console.log(uint8Array);  // [1, 0, 0, 0, 0, 0, 0, 0]
```

### DataView
`DataView`功能跟TypedArray类似, 但它是一个**真实存在**的对象
提供各种方法来操作不同类型的数据

语法
<pre>
new DataView(buffer [, byteOffset [, byteLength]])
</pre>
**基本用法**
```javascript
let arrayBuffer = new ArrayBuffer(8);
let dataView = new DataView(arrayBuffer);

console.log(dataView.getUint8(1)); // 0
// 第一个参数是偏移量, 第二个参数是要设置为的整数
dataView.setUint8(1, 2);
console.log(dataView.getUint8(1)); // 2
console.log(dataView.getUint16(1)); // 512

dataView.setUint16(1, 255);
console.log(dataView.getUint16(1)); // 255
console.log(dataView.getUint8(1)); // 0
```
get方法用于读取, set方法用于写入

### btoa 和 atob 
这两个方法可以实现字符串与base64编码的互转

+ `btoa` - 字符串转化为base64
+ `atob` - base64转化为字符串

![btoa和atob](/images/JavaScript/btoa和atob.jpg)
中文会有报错, 需要先执行一下转码, 当然从base64转化为字符串也要进行解码