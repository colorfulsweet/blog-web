---
title: ES6的重要新特性
date: 2018-4-22 19:50:19
tags: 
  - JavaScript
  - ECMAScript6
categories: 
  - JavaScript
---

1. **函数的默认参数**
```javascript
var link = function(height=50,color="red"){
  //some code...
}
```
<!-- more -->
在没有这种写法的时候
我们通常需要通过下面的方式来设置函数参数的默认值
```javascript
var link = function(height,color) {
  height = height || 50;
  color = color || "red";
  //some code...
}
```
但是这种方式存在缺陷 , 就是当实参为0 或者 ""等这种会被判定为false的值 , 他们就会被默认值所替代
而包含参数默认值的函数则不会存在这个问题 

2. **模板表达式**
以往如果需要在字符串中嵌入某个变量值 , 需要使用加号进行拼接
```javascript
var port = 7001;
console.log("the server is listening at " + port + "!");
```
在ES6当中 , 使用`反引号`包裹的字符串 , 可以使用`${varName}`的形式来表示模板字符
```javascript
var port = 7001;
console.log(`the server is listening at ${port}!`);
```
用法类似JSP当中的 EL表达式

3. **多行字符串**
以往要在代码中换行显示字符串 , 需要使用加好进行拼接 , 如果要使字符串当中实际包含换行 , 则需要使用转义字符`\n`

反引号当中的字符串可以直接进行换行 , 而不需要使用`\n`符号

4. **拆包表达式**
如果要把一个JS对象当中的值赋给局部变量 , 以往通常需要这么做
```javascript
var data = {
  name : "Sookie",
  age : 18
};
var name = data.name;
var age = data.age;
console.log(`name : ${name}, age : ${age}`);
```
在ES6当中 , 使用以下语句可以达到相同的效果
```javascript
var {name,age} = data;
```

对于数组的支持
```javascript
var data = {
  name : "Sookie",
  age : 18,
  skill : ["JavaScript","Java","MongoDB"]
};
//这里相当于产生了3个局部变量
var [sk1, sk2, sk3] = data.skill;
console.log(sk1, sk2, sk3);
```
如果要跳过数组中某个位置的元素也是可以的
```javascript
var [sk1, , sk3] = data.skill;
```
5. **块级作用域的`let`和`const`**
let可以认为是一个更新的var , 使用它定义的局部变量 , 作用域仅存在与当前的代码块( 包括复合语句 )
而由于变量的定义提升问题 , var是不能完全做到这一点的
例如 , 从习惯了写Java的程序员 , 通常习惯于下面这种写法
```javascript
var sum = 0;
for(var i=0 ; i<10 ; i++){
  sum += i;
}
console.log(sum);//45
console.log(i);//10
```
但是变量 i 的作用域并不仅限于for循环的子句
如果使用如下方式
```javascript
var sum = 0;
for(let i=0 ; i<10 ; i++){
  sum += i;
}
console.log(sum);//45
console.log(i);
//ReferenceError: i is not defined
```
就把 i 的作用域限制在了代码块当中

对于使用`const`定义的变量 , 可以参照C语言中的const关键字 , 和Java当中的final关键字
作用仅仅是该引用的指向不可变 , 但是指向的对象本身是可变的
6. **类与面向对象**
在ES5当中 , 要定义一个类, 只能是编写一个构造函数 , 这个函数与普通的函数没有本质区别 , 只是使用new关键字进行调用 , 它就可以构造一个对象
而`class`关键字 , 在ES6之前 , 只是作为一个没有意义的保留字存在的
现在 , 我们可以使用与Java十分相像的方式去写一个类
```javascript
class BaseModel {
  constructor(options = {}, data = []) {
    this.name = "Sookie";
    this.options = options;
    this.data = data;
  }
  showName() {
    console.log(`the name is ${this.name}`);
  }
}

var model = new BaseModel();
model.showName();
```
constructor表示这个类的构造函数
需要注意的是 : 对于对象当中属性的赋值 , 必须要在构造函数当中完成 , 而不能像Java那样直接对类中的属性设定初始值
##### 继承
继承的实现方式与Java也十分类似
```javascript
class MyModel extends BaseModel {
  constructor(options = {}, data = []) {
    //如果要显式调用父类的构造方法, super必须放在第一条语句
    super(options, data);
    this.age = 18;
  }
  showAge() {
    console.log(`the name is ${this.age}`);
  }
}
var model = new MyModel();
model.showName();
model.showAge();
```