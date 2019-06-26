---
title: TypeScript初见
date: 2019-6-23 15:22:13
tags: 
  - TypeScript
categories: 
  - 前端杂烩
---

`TypeScript` ( 以下简称TS ) 由微软开发, 是一个JavaScript的超集, 遵循ES6规范
也就是TS本身支持所有的JS语法, 已有的JS程序不需要任何改动就可以在TS环境下运行
同时进行了扩展
添加了基于类的面向对象编程特性, 以及数据类型
<!-- more -->

> 这种数据类型的定义, 与Java这种编译型语言终究不同
我的体会是它只存在编译期的类型检查, 而运行期还是与JS基本相同
这样的好处也很明显, 能够减少在开发阶段犯错误的几率 ( 毕竟IDE可以完成类型检查的错误提示 )
避免一些类型问题都需要调试来排查

### 开发环境
首先这种JavaScript的超集, 如果需要在浏览器运行
必然是需要compiler的, 因为需要转成可执行的JavaScript代码

如果是在nodejs里面运行, 就可以不需要了, 因为它可以想babel那样, 封装一个自己的运行器出来
比如babel的 `babel-node`, 就如同是nodejs的 `node`, 前者提供了提供一个支持ES6的REPL环境

```shell
npm install -g typescript
```
> 当然如果是只在项目里面使用, 也可以不执行全局安装

![typescript安装](/images/前端杂烩/typescript安装.png)
可以看到安装后添加了两个命令行工具, 分别是`tsc`和`tsserver`
tsc就是 TypeScript Compiler

#### 使用编译器
现在可以尝试写个typescript文件
比如
```typescript
// hello.ts
export class Hello {
  hello(msg) {
    console.log(msg)
  }
}
```
然后执行`tsc hello.ts`
就会生成hello.js文件, 内容如下
```javascript
"use strict";
exports.__esModule = true;
var Hello = /** @class */ (function () {
  function Hello() {
  }
  Hello.prototype.hello = function (msg) {
    console.log(msg);
  };
  return Hello;
}());
exports.Hello = Hello;
```
就是一个语法的转换过程

### 语法与特性
ES6提供的语法糖就不提了, 基本每天都在写
就记录一下TS自己的一套类型体系吧

#### 变量类型
TS自带一套类型体系, 有一些与JavaScript当中有重叠 (当然JS当中也不能完全称之为类型, 因为都是对象)
string对应 JS的 String
number对应 JS的 Number
object对应 JS的 Object
boolean对应 JS的 Boolean
symbol对应 JS的 Symbol

所以定义变量时
```typescript
var str1: string = 'ab'
// 或者
var str2: String = 'cd'
```
都可以, 从eslint的默认设置来看, 官方推荐前者
> 变量类型定义同样可以应用于函数的形参, 语法相同

##### 数组
数组类型有两种表示方法
```typescript
var arr1: string[] = ['ab','cd']
var arr2: Array<string> = ['ab','cd']
```
后一种明显很像Java的泛型写法, 但是eslint默认的语法检查规则推荐前者

##### 枚举
```typescript
enum Color1 {Red, Green, Blue}
let c1: Color1 = Color1.Green

enum Color2 {Black = 10, White = 20}
let c2: Color2 = Color2.Black
```
使用枚举类型可以为一组数值赋予友好的名字
默认从0开始编号, 也可以手动指定编号

##### 任意值
我们并不是每次都能知道变量的类型是什么, 或者是引入的一些第三方库, 本身就是JS写的
没有类型声明
那么可以用`any`来直接忽略编译阶段的检查

> 类型检查是TS的最大优势, 主要是帮助开发者排除错误的
any只是一种兼容的做法, 不应该滥用, 否则和写JS还有什么区别

##### 空值
对于定义变量不算很常用, 有几种表示方法
```typescript
// void类型包含 undefined和null
let n1: void = undefined
let n2: void = null

// undefined和null也是类型
let n3: undefined = undefined
let n4: null = null

// 可以用void表示一个函数无返回值(当然JS当中无返回值就是返回undefined, 这点也正好符合)
function test(): void {
  console.log('test')
}
```

##### never
`never`可以用来表示函数的返回值, 表示用不存在的类型
该函数必须存在无法到达的终点 ( 比如抛出异常或者死循环 )
```typescript
function test1(): never {
  throw new Error()
}
function test2(): never {
  while(true) {}
}
```
#### 类型推断机制

如果声明变量时没有指定类型, 那么编译器就会根据初始化的赋值来推断这个变量的类型
对于函数返回值同样适用
比如
```typescript
let str = 'abc'
str = 10 // Error
```
初始化的赋值编译器推断str是string类型, 所以之后给他赋值number类型就会报错

#### 自定义类型
TS当中可以使用`interface`和`class`来自定义类型
与其他强类型语言当中的接口与类的定义类似, 前者可以写属性和方法声明, 后者可以实现接口
class定义的类型可以直接用new关键字来创建对象
```typescript
interface Demo {
  name: string
  value?: object
  test(msg: string): void
}
let demo = {
  name: 'sookie',
  test: function(msg: string): void{
    console.log(msg)
  }
}
// ? 代表该属性是可选的, 也可以应用于函数的形参
// 上述方式可以理解为给该接口创建一个实现类(类比Java当中的匿名类)
// 或者也可以用下面的方式实现一个接口
class DemoImpl implements Demo{
  name: 'sookie'
  test(msg: string): void{
    console.log(msg)
  }
}
let demo2: Demo = new DemoImpl()
demo2.test('Hello')
```
需要注意的是, 继承接口需要定义函数的实现, 以及属性的值, 带有`?`的可选属性可以不指定

##### 访问控制
TS有3种访问控制关键字, 分别是`public`, `private`, `protected`
具体作用和Java一样, 缺省就是public

##### 构造器
可以对一个类编写一个构造器, 在对象被创建时调用
```typescript
class Demo {
  constructor(private name: string) { }
  show(): void {
    console.log(this.name)
  }
}
new Demo('sookie').show()
```
构造器参数上添加任意一种访问控制关键字, 都可以直接把该参数设置为对象的属性
相当于构造器里面写**this.name = name**, 添加之后就可以省略这个赋值


### 写在最后
最近拿 [Nestjs](https://docs.nestjs.cn/) 给自己的博客写了个管理端的后台
当然前后端分离是必须的, Nestjs写后台也只写接口
这个框架需要用TypeScript编写代码, 于是就顺带学了学

据说习惯了TypeScript就再也不想写JavaScript了, 我倒是没怎么觉得
只是Nestjs的很多设计都和Spring有几分神似, 只能说Spring大法好, 上手倒是容易很多