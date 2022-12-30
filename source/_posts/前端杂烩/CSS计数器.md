---
title: CSS计数器
date: 2022-12-30 14:53:47
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

### 有序列表
HTML具备原生支持的计数器功能，也就是有序列表`<ol>`
```html
<ol class="normal">
  <li>aaa</li>
  <li>aaa</li>
  <li>AAA
    <ol class="roman"><li>bbb</li><li>bbb</li></ol>
  </li>
</ol>
```
<!-- more -->
对于有序列表来说，可以去指定`list-style-type`来使用预置的序列，比如字母、罗马数字等，默认是**decimal**(数字)
也可以给`::marker`伪元素指定样式
```less
ol.roman {
  list-style-type: lower-roman;
  li::marker {
    color: red;
    font-size: 20px;
  }
}
```
实际效果如下
![有序列表](/images/前端杂烩/CSS计数器/有序列表.png)

这样的有序列表有一定的局限性
1. 不能指定起始值，每个`<ol>`当中的`<li>`都是从1开始的
2. 不能指定步长，一定是每次递增1

### CSS计数器
如果需要对序列的控制更灵活一些，可以使用`CSS计数器`
```html
<div class="container">
  <div class="counter">第一章</div>
  <div class="counter">第二章</div>
  <div class="counter">第三章</div>
</div>
```
```less
.container {
  counter-reset: counter1 0;
  > .counter::before {
    counter-increment: counter1 1;
    content: counter(counter1,decimal) '. ';
  }
}
```
效果如下
![counter](/images/前端杂烩/CSS计数器/counter.png)

1. `counter-reset`代表在这个层级重置指定计数器的值，默认置为0。可以指定多个例如**counter-reset: counter1 0 counter2 10**
无论在何处，只要有它，对应的计数器的值都会**重置**，所以通常会将它给到列表的**父元素**
2. `counter-increment`代表计数器增加，默认增加1。与counter-reset类似也可以指定多个
无论在何处，只要有它，对应的计数器的值都会**增加**，所以通常会将它给到列表的**子元素**
3. `counter`函数指定使用该计数器，可以用于伪元素的content，它相当于是执行输出
这个函数可以有2个参数`counter(name,style)`，style就是跟**list-style-type**一样，可以指定不同的序号风格

#### 嵌套计数
实际使用当中我们可以用计数器生成目录树结构
可能需要有多个层级
但是如果层级数量是不确定的，基本的计数器就无法满足了，这种情况下就需要用到`嵌套计数`

```html
<div class="reset">
  <div class="counters">第一章
    <div class="reset">
      <div class="counters">第1节</div>
      <div class="counters">第2节
        <div class="reset">
          <div class="counters">第1小节</div>
          <div class="counters">第2小节</div>
          <div class="counters">第3小节</div>
        </div>
      </div>
      <div class="counters">第3节</div>
    </div>
  </div>
  <div class="counters">第二章</div>
  <div class="counters">第三章
    <div class="reset">
      <div class="counters">第1节</div>
    </div>
  </div>
</div>
```
```less
.reset {
  padding-left: 20px;
  counter-reset: counter2;
  .counters::before {
    counter-increment: counter2;
    content: counters(counter2, '-') '. ';
    font-weight: bold;
  }
}
```
效果如下
![counters](/images/前端杂烩/CSS计数器/counters.png)
与基本计数器的区别就在于使用`counters`函数，形式为`counters(name, string, style)`
name和style与基本计数器中的含义相同，**string**为拼接使用的字符串

#### 其他特性
如果其中存在使用`display:none`隐藏掉元素，则计数器的值不会增加
实际显示的序列仍然是正确的
如果使用`visibility:hidden`隐藏，计数器的值会增加
这一点与有序列表是一样的
