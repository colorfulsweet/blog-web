---
title: 实现bind方法
date: 2018-4-14 00:35:19
tags: 
	- JavaScript
	- prototype
categories: 
	- JavaScript
---


bind方法来自于`Function.prototype`
这个方法会创建一个新函数 , 当这个函数被调用时 , 第一个参数将会作为它运行时的this , 之后的参数会作为实际调用时传递的实参前作为实参
<!-- more -->
语法
<pre>
func.bind(thisArg [,arg1[,arg2[, ...]]])
</pre>
**应用示例 :** 
```javascript
var obj = {
	name : "Sookie",
	show : function() {
		console.log(this.name);
		console.log(arguments);
	}
}
var _show = obj.show.bind(obj,"aa","bb");
_show("cc");
/*output:
Sookie
{ '0': 'aa', '1': 'bb', '2': 'cc' }
*/
```
如果要实现一个bind方法 , 需要用到柯里化
```javascript
Function.prototype.bind = function(context) {
	var me = this;//调用bind的函数对象
	var args = Array.prototype.slice.call(arguments, 1);//传入的固定实参
	return function () {
		//实际调用时传入的参数
		var innerArgs = Array.prototype.slice.call(arguments);
		//合并两个参数数组
		var finalArgs = args.concat(innerArgs);
		//调用该函数
		return me.apply(context, finalArgs);
	}
}
```
这里解释一下 , arguments并不是数组对象 , 而是**类数组**
+ 具有 : 指向对象元素的数字索引 , 以及length属性
+ 不具有 : push , slice等数组对象的方法

> 数组对象的\_\_proto\_\_是Array
而arguments的 \_\_proto\_\_是Object

如果要把一个arguments转化为一个数组对象 , 可以使用如下方式
<pre>
var args = Array.prototype.slice.call(arguments);
</pre>

#### 嗅探
在运行时如果对标准库当中的内容有修改
( 可能是出于兼容性的需要 , 比如旧版本的标准库当中无此函数 )
```javascript
Function.prototype.bind = Function.prototype.bind || function(context) {
	//...
}
```
这属于一个加分项
由于标准库当中的函数多是经过了深度优化的
一般要比我们自己写的函数效率更高 更健壮
所以如果标准库中存在 , 其实没有必要用我们自己写的方法去替换
这里就是进行`嗅探`
> 这是一个典型的 `Monkey patch(猴子补丁)`
> 主要有以下几个用处
> + 在运行时替换方法 属性等
> + 在不修改第三方代码的情况下增加原来不支持的功能
> + 在运行时为内存中的对象增加patch而不是在磁盘的源代码中增加

#### 更严谨的做法
由于需要调用bind方法的一定是一个函数 , 所以有必要在bind的内部做一个校验
```javascript
if(typeof this !== "function") {
	throw new TypeError("what is trying to be bound is not callable");
}
```
