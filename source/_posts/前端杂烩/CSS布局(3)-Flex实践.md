---
title: CSS布局(3)-Flex实践
date: 2017-9-15 21:33:57
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---


熟悉flex布局方式以后 , 就会发现flex布局十分灵活
19.1当中提到的多列布局
使用flex都可以以十分简洁的代码搞定
<!-- more -->
DOM结构
```xml
<div class="layout">
    <aside class="layout_aside">侧边栏宽度固定</aside>
    <div class="layout_main">主内容栏宽度自适应</div>
</div>
<div class="layout">
    <div class="layout_main">主内容栏宽度自适应</div>
    <aside class="layout_aside">侧边栏宽度固定</aside>
</div>
<div class="layout">
    <aside class="layout_aside">左侧边栏宽度固定</aside>
    <div class="layout_main">主内容栏宽度自适应</div>
    <aside class="layout_aside">右侧边栏宽度固定</aside>
</div>
<div class="layout">
    <aside class="layout_aside">第1个侧边栏宽度固定</aside>
    <aside class="layout_aside">第2个侧边栏宽度固定</aside>
    <div class="layout_main">主内容栏宽度自适应</div>
</div>
<div class="layout">
    <div class="layout_main">主内容栏宽度自适应</div>
    <aside class="layout_aside">第1个侧边栏宽度固定</aside>
    <aside class="layout_aside">第2个侧边栏宽度固定</aside>
</div>
```

css样式
```css
.layout {
  height : 200px;
  display: flex;
}
.layout > .layout_aside {
  background-color: pink;
  width : 100px;
}
.layout > .layout_main {
  background-color: #ccc;
  flex-grow: 1;
}
```
无论结构是什么样子 , 只要让main区域自动放大 , 侧边栏的宽度固定即可

---
对于常见的 上 左下 右下 将整个窗口区域分为3部分 , 并且外部区域没有滚动条的布局 ( 通常右下作为主内容显示区 , 这部分可以有自己的纵向滚动条 )
使用flex实现起来也十分简单 , 不需要使用js获取可视区域的尺寸进行控制

DOM结构
```xml
<div id="main">
  <div class="top">我是顶部条</div>
  <div class="down">
    <div class="left">我是侧边栏</div>
    <div class="content">我是主面板</div>
  </div>
</div>
```
main是最外层的flex容器 , 其中包含top和down两个项目
down本身也是一个flex容器 , 其中包含left和content两个项目

CSS样式
```css
* {
  margin: 0;
  padding : 0;
}
#main {
  height : 100%;
  display: flex;
  flex-direction: column;
}
#main > .top{
  height : 50px;
  background-color: blue;
}
#main > .down {
  display: flex;
  flex-grow: 1;
}
#main > .down > .left{
  width : 200px;
  background-color: yellow;
}
#main > .down > .content {
  flex-grow: 1;
  background-color: pink;
}
```