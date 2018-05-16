---
title: CSS动画(2)-transition
date: 2018-5-12 18:16:24
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

CSS的`transition`允许CSS的属性值在一定的时间区间内平滑地过渡
这种效果可以在鼠标点击 获得焦点 或对元素的任何改变中触发
并圆滑的以动画效果改变CSS的属性值
<!-- more -->
**语法**
transition本身也是一个复合属性 , 主要包含4个属性值
1. 执行变换的属性 `transition-property`
2. 变换延续的时间 `transition-duration`
3. 在变换时间内 , 变换的速率变化 `transition-timing-function`
4. 变换的延迟时间 `transition-delay`

对于多组值 , 它们之间使用逗号分隔

#### transition-property
用来指定哪个CSS属性在变换的过程中应用动画效果
可以取值 `none` , `all` 或者具体的属性名称
all代表任何可以实现动画变换的属性 , 在变换时都会应用动画效果 , 它是默认值

#### transition-duration
用于指定元素转换过程的持续时间 , 单位可以是`s`或者`ms`
例如 0.5s , 或者也可以写作 .5s
默认值为0

#### transition-timing-function
这个属性值的本身是一个**贝塞尔曲线**
有几个预定义的值 , 或者也可以自定义一个曲线
![cubic bezier](/images/前端杂烩/animation/cubic-bezier.png)
如图所示 , 起点和终点也就是P<sub>0</sub>和P<sub>3</sub>的位置是固定的
只需要指定P<sub>1</sub>和P<sub>2</sub>的坐标 , 即可决定该曲线的曲率变化
曲线上每个点的切线斜率代表在该时间点的变换速率

P<sub>1</sub>(x1,y1) 
P<sub>2</sub>(x2,y2)
所以自定义贝塞尔曲线的方式就是 `cubic-bezier(x1,y1,x2,y2)`
当然x的值需要在[0,1]的区间内 , 否则无效
y的值可以超过1或者小于0 , 比如构造一个来回的缓冲效果

![贝塞尔曲线](/images/前端杂烩/animation/bezier.png)

预定义的贝塞尔曲线
1. **ease**：（逐渐变慢）默认值，ease函数等同于贝塞尔曲线(0.25, 0.1, 0.25, 1.0).
2. **linear**：（匀速），linear 函数等同于贝塞尔曲线(0.0, 0.0, 1.0, 1.0).
3. **ease-in**：(加速)，ease-in 函数等同于贝塞尔曲线(0.42, 0, 1.0, 1.0).
4. **ease-out**：（减速），ease-out 函数等同于贝塞尔曲线(0, 0, 0.58, 1.0).
5. **ease-in-out**：（加速然后减速），ease-in-out 函数等同于贝塞尔曲线(0.42, 0, 0.58, 1.0)

#### transition-delay
指定一个动画开始的延迟时间 , 默认为0

> 补充说明 : 
> 在transition当中 , 这4个单属性值其中的每个都是可以省略的
> 但通常不会省略持续时间 , 因为省略之后就看不到动画的效果了


----
#### 兼容性
为了兼容旧版本的浏览器 , 我们通常需要给transition属性加上前缀
```css
box {
  -moz-transition:color 0.5s ease-in;
  -webkit-transition:color 0.5s ease-in;
  -o-transition:color 0.5s ease-in;
  transition : color 0.5s ease-in;
}
```
或者也可以使用**postcss**这种预处理工具 , 来自动添加属性的前缀
