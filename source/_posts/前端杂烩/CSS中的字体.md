---
title: CSS中的字体
date: 2018-4-7 10:55:37
tags: 
  - 前端
  - css
categories: 
  - 前端杂烩
---

在CSS当中 , 我们通常使用`@font-face`来定义字体
除了可以引入外部字体之外 , 也可以给系统本地的字体定义别名
比如
```css
@font-face {
  font-family : YH;
  src : local("microsoft yahei");
}
.font {
  font-family:YH;
}
```
这样我们就可以在需要使用这个字体的地方直接使用这个别名
<!-- more -->
> 通常不推荐在网页当中引入外部的中文字体包
> 因为中文字体包通常很大 , 会导致严重的加载缓慢

然而在Mac系统当中没有微软雅黑字体 , 我们希望在Mac系统上使用苹方字体 , windows系统上使用微软雅黑字体
```css
@font-face {
  font-family : BASE;
  src: local("PingFang SC"),
    local("Microsoft Yahei");
}
```
这样字体的应用就更加简便了

### unicode-range
这个属性可以给特定的字符指定特定的字体
通过unicode编码去指定字符
比如我们需要给一段文字当中的引号使用宋体 , 其他的文字使用微软雅黑或者苹方字体
可以这样做
```css
@font-face {
  font-family: BASE;
  src: local('PingFang SC'),
       local('Microsoft Yahei');
}
@font-face {
  font-family: quote;
  src: local('SimSun');    
  unicode-range: U+201c, U+201d;
  /* 中文前引号与后引号对应的unicode编码 */
}
.font {
    font-family: quote, BASE;
}
```
![css_font](/images/前端杂烩/css_font.png)

> FireFox浏览器对字体名称的大小写敏感

unicode-range的用法
```css
/* 支持的值 */
unicode-range: U+26;               /* 单个字符编码 */
unicode-range: U+0-7F;
unicode-range: U+0025-00FF;        /* 字符编码区间 */
unicode-range: U+4??;              /* 通配符区间 */
unicode-range: U+0025-00FF, U+4??; /* 多个值 */
```

> **前端领域的字符表示方式总结**
> 1. HTML中字符输出使用`&#x`配上charCode值
> 2. 在JavaScript文件中为防止乱码转义，则是`\u`配上charCode值
> 3. 在CSS文件中，如CSS伪元素的content属性，直接使用`\`配上charCode值
> 4. unicode-range是`U+`配上charCode值

----
### 补充 : **使用千位分隔符表示大数字**
在移动端 , 对于超过一定个数的连续数字 , 系统会默认当做电话号码来处理 , 而不是一个数字
点击这个数字的时候 , 可以触发系统的电话呼叫

如果我们想干掉这个特性 , 通常的做法是使用`<meta>`标签
```xml
<meta name="format-detection" content="telephone=no"
```
这样就意味着本来可以进行便捷呼叫的手机号码 , 变成了一串普通的数字
对于确实表示数字含义的一串数字来说 ( 不是编码或者流水号之类的内容 ) , 只是这样做也是影响体验的
它本身也不方便进行辨识
我们可以考虑将其格式化为包含千位分隔符的一个字符串

处理方式
#### 正则表达式
用法举例
```javascript
String(123456789).replace(/(\d)(?=(\d{3})+$)/g, "$1,");
```
#### 使用`toLocalString()`方法
用法举例
```javascript
(123456789).toLocaleString('en-US');
```
对于中文场景下，toLocaleString('en-US')中的'en-US'理论上是可以缺省的
但是如果产品可能海外用户使用，则保险起见，还是保留'en-US'

在这种情况下 , 如果我们想要美化这个逗号
使用JS进行筛选处理会十分繁琐
我们就可以使用`unicode-range`单独对其中的逗号进行处理