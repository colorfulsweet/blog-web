---
title: Vue3新特性总结
date: 2022-03-13 00:43:37
tags: 
  - 前端
  - Vue
categories: 
  - 前端杂烩
---

Vue3发布已经有一段时间了, 各种特性和一些组件库的配套基本趋于成熟
这里就目前了解到的一些新特性和用法的变更做一些汇总

<!-- more -->

## 生命周期

![vue3生命周期](/images/前端杂烩/vue/vue3生命周期.png)

在源码当中定义的生命周期钩子有如下这些

![生命周期钩子](/images/前端杂烩/vue/生命周期钩子.png)

可以看到 beforeDestroy 已被标记为废弃, 建议使用`beforeUnmount`替代
destroyed 已被标记为废弃, 建议使用`unmounted`替代
`errorCaptured`是捕获一个来自后代组件的异常时被调用

## setup
在vue2当中, 使用的方式是`选项式API`
也就是在一个vue组件的定义当中, 可以包含 data、computed、methods 等等这些
为了减少代码迁移的成本, 这种方式在vue3当中依然支持, 可以不做重大改动

但是vue3提供了一个setup的选项, 可以在其中编写`组合式API`

这主要是源于使用选项式API, 如果一个组件当中包含诸多功能
就会出现这种情况
![选项式API](/images/前端杂烩/vue/选项式API.png)
也就是同一个功能相关的代码, 会分布在各个指令当中
如果一个组件十分复杂, 代码就会变得难以维护
需要进行修改的时候, 就要到各个选项当中去找

> 如果有setup选项, 它的执行会**在beforeCreate之前**, 所以此时组件实例还未创建, 是不能使用this来表示组件实例的

```html
<template>
  <div>{{obj}}</div>
  <button @click="valueChange">valueChange</button>
</template>
```
```javascript
import { ref, reactive } from 'vue'

export default {
  name: 'App',
  setup(props, context) {
    const obj = ref({count:1, name:"123"})
    const valueChange = () => {
      obj.value.count = obj.value.count + 1
      obj.value.name = "456"
    }
    return{
      obj,
      valueChange
    }
  }
}
```
上述代码当中使用vue3提供的`ref`函数将一个对象转化为响应式对象
相当于之前在data当中的定义
而setup返回的对象中包含的函数, 相当于之前在methods当中定义的函数

### ref与reactive

与ref类似的还有`reactive`函数
+ reactive和ref都是用来定义响应式数据的，而reactive更推荐用来定义对象，ref更推荐定义基础数据类型，但是ref也可以定义对象
+ 在访问数据的时候，ref需要使用.value，而reactive不需要

### setup的参数
setup可以接受两个参数, 分别是`props`和`context`
+ props是组件传入的属性, vue2中使用props选项来定义的属性, 可以从这个参数当中获取到, 它本身就是响应式的
+ context可以理解为该组件的上下文, 提供了vue2的this中最常用的三个属性：attrs、slot 和emit
比如2当中的事件发射使用的是 this.$emit, 在3当中应当使用 context.emit

### 在setup中定义生命周期钩子函数
这里直接借用官方文档的表格了, 写的十分清晰
| 选项式 API | Hook inside setup |
| -- | -- |
| beforeCreate | Not needed* |
| created | Not needed* |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |
| renderTracked | onRenderTracked |
| renderTriggered | onRenderTriggered |
| activated | onActivated |
| deactivated | onDeactivated |

可以看到beforeCreate和created, 相当于是被包含在了setup当中
换句话说就是, 如果有某些需要在beforeCreate和created中执行的操作, 直接写在setup中即可

```javascript
import { onMounted } from 'vue'

export default {
  setup(props, context) {
    onMounted(() => {
      console.log('组件挂载完毕')
    })
  }
}
```
### 解构赋值
对响应式对象直接进行解构赋值, 会破坏其响应式特性
也就是拿到的只是一个普通对象
```javascript
import { reactive } from 'vue'

export default {
  setup(props, context) {
    const obj = reactive({count:1, name:"123"})
    const valueChange = () => {
      obj.count = obj.count + 1
      obj.name = "456"
    }
    const { name } = obj
    return{
      obj,
      name,
      valueChange
    }
  }
}
```
在上述代码当中, 在执行valueChange时, obj.name当然会改变, 但是name并不会改变
为此, vue3提供了`toRefs`可以来处理这种情况
```javascript
import { reactive, toRefs } from 'vue'

export default {
  setup(props, context) {
    const obj = reactive({count:1, name:"123"})
    const valueChange = () => {
      obj.count = obj.count + 1
      obj.name = "456"
    }
    const { name } = toRefs(obj)
    return{
      obj,
      name,
      valueChange
    }
  }
}
```
toRefs的作用就是把一个响应式对象, 转化为普通对象, 但是同时这个对象中所有属性的值变为响应式对象
此时对obj.name的改变, 就等同于对name的改变了


### 拆分
从上述的内容可以看得出来, 按照setup的用法
基本所有的业务代码都会在setup当中
这也会导致它变得十分冗长
但是它本身作为一个函数, 其中定义的都是这个函数当中的局部变量
这就提供了一种拆分的可能 (在vue2当中, 要对组件内的功能进行拆分, 可以使用mixin)


## 关于sass

最后说一点题外话, 就是vue脚手架初始化创建项目时, CSS预处理器的选择
发现对于sass有两个选项, 分别是`node-sass`和`dart-sass`

![CSS预处理器](/images/前端杂烩/vue/CSS预处理器.png)

大概去了解了一下
官方说法是这样的
> 此次改动是在 Sass 核心团队进行了大量讨论之后，得出的结论，现在是时候正式宣布弃用 LibSass 和基于它构建的包(包括 Node Sass)。多年来，LibSass 显然没有足够的工程带宽来跟上 Sass 语言的最新发展 (例如，最近的语言特性是在 2018 年 11 月添加的)。尽管我们非常希望看到这种情况有所改善，但即使 LibSass 长期贡献者 Michael Mifsud 和 Marcel Greter 的出色工作也无法跟上 CSS 和 Sass 语言开发的快速步伐。

主要包括以下四点说明
+ 不再建议将 LibSass 用于新的 Sass 项目， 改为使用 Dart Sass (opens new window)。
+ 建议所有现有的 LibSass 用户制定计划，最终迁移到 Dart Sass，并且所有 Sass 库都制定计划 最终放弃对 LibSass 的支持。
+ 不再计划向 LibSass 添加任何新功能，包括与新 CSS 功能的兼容性。
+ LibSass 和 Node Sass 将在尽力而为的基础上无限期维护，包括修复主要的错误和安全问题以及与最新的 Node 版本兼容。


概括来说就是官方推荐使用dart-sass, 也就是引入sass作为依赖
而不是使用node-sass
node-sass因为底层使用cpp编写, 安装依赖时需要编译cpp代码
在windows环境上有时会失败, 而且因为国情问题经常装不上


