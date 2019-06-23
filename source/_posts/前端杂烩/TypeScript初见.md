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










### 写在最后
最近拿 [Nestjs](https://docs.nestjs.cn/) 给自己的博客写了个管理端的后台
当然前后端分离是必须的, Nestjs写后台也只写接口
这个框架需要用TypeScript编写代码, 于是就顺带学了学

据说习惯了TypeScript就再也不想写JavaScript了, 我倒是没怎么觉得
只是Nestjs的很多设计都和Spring有几分神似, 只能说Spring大法好, 上手倒是容易很多