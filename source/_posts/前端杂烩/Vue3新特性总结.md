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

### 生命周期


### setup
在vue2当中, 使用的方式是`选项式API`
也就是在一个vue组件的定义当中, 可以包含 data、computed、methods 等等这些


### 关于sass

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


