---
title: CSS动画(3)-animation
date: 2018-5-12 18:19:07
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

使用上一节提到的transition已经可以实现相对简单的一些动画效果
但是对于相对复杂一些的效果 , 尤其是其中需要分为多个阶段的 , 就难以实现
CSS3的animation属性 , 就提供了更加强大的动画设计功能
<!-- more -->

#### @keyframes
这个词的意思是`关键帧`
与flash当中的动画制作一样 , 要设计一个完整的动画 , 需要定义其中的几个关键节点的样式
再去自动产生这些节点之间的平滑过渡效果

CSS当中以动画开始的点为`0%` , 以动画结束的点为`100%`
我们可以尝试去定义一组关键帧
```css
@keyframes ANI { /*指定该组关键帧的名称*/
  0% {
    width : 100px;
    background-color:#629411;
  }
  50% {
    width : 150px;
    background-color: darkgoldenrod;
  }
  100% {
    width : 250px;
    background-color: lightgreen;
  }
}
```
0% 也可以写作 `from`
100% 也可以写作 `to`
定义之后我们就可以在DOM元素上调用这组关键帧 , 用来创建动画了
```css
.animation_div {
  /* 就是之前定义的关键帧名称 */
  animation-name : ANI;
  /* 动画持续的时间 */
  animation-duration : 5s;
  /* 和transition-timing-function一样 */
  animation-timing-function : ease-in-out;
  /* 动画延迟时间 */
  animation-delay: 0.5s;
  /* 定义循环次数，infinite为无限次 */
  animation-iteration-count: 3;
  /* 动画执行的方向 */
  animation-direction: alternate;
  /* 当前动画正在播放(running)或者暂停(paused) */
  animation-play-state : running;
}
```
当然动画效果也可以放在`:hover`等伪类当中 , 以创建响应式的效果
前面几项都没什么特别的 , 最后两个属性简单说明一下

#### animation-direction
可以取以下几个值
+ **normal**
每次都正向运行动画，这是默认属性。
+ **alternate**
动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，ease-in 在反向时成为ease-out。
反向动画同样计入次数
例如次数指定为3 , 那么实际就是正向1次 -> 反向1次 -> 正向1次
+ **reverse**
每次都反向运行动画
+ **alternate-reverse**
与alternate的区别是 : 首次是反向动画

#### animation-play-state
控制当前元素上的动画播放与暂停
暂停之后会定格在当前播放的进度上 , 类似于播放器的暂停
我们可以使用一些伪类 , 或者是JS来控制这个属性 , 从而改变动画的播放状态
比如
```css
.animation_div:hover {
  animation-play-state : paused;
}
```
这样可以实现指向该元素的时候暂停动画的播放

> **补充说明**
> 1. 由于每个元素上都可以包含多个动画 , 所以上述的每个属性的取值都可以是单值或者多值
> 2. 可以使用animation这个复合属性来涵盖上面的这些单属性
> ![animation属性](/images/前端杂烩/animation/animation-pro.png)