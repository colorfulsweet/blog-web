---
title: Web Components
date: 2020-11-3 17:15:36
tags: 
  - 组件化
categories: 
  - 前端杂烩
---

组件化封装是前端的发展趋势，现在的主流框架比如Vue、React也都实现了这个目标
浏览器也是支持原生组件的，目前在各种浏览器也已经普及，可以在开发当中使用

<!-- more -->

### 基本用法
```javascript
class UserInfo extends HTMLElement {
  constructor() {
    super()
    var p1 = document.createElement('p')
    p1.innerText = 'UserName: Sookie'
    this.appendChild(p1)
    var p2 = document.createElement('p')
    p2.innerText = 'E-mail: colorfulsweet@gmail.com'
    this.appendChild(p2)
  }
}
window.customElements.define('user-info', UserInfo)
```
这里的构造器内部执行的事情就是生成一个DOM树
`customElements.define`表示声明一个自定义组件
这样在页面中直接使用自定义标签`<user-info></user-info>`就可以使用该组件了

#### 组件模板
但是如果组件内DOM结构复杂，上面的写法还是有些过于繁琐了
于是我们可以在页面内声明一个模板
```html
<template id="userInfo">
  <p>UserName: Sookie</p>
  <p>E-mail: colorfulsweet@gmail.com</p>
</template>
```
```javascript
class UserInfo extends HTMLElement {
  constructor() {
    super()
    var templateElem = document.getElementById('userInfo')
    var content = templateElem.content.cloneNode(true)
    this.appendChild(content)
  }
}
window.customElements.define('user-info', UserInfo);
```

![组件template](/images/前端杂烩/web-components/组件template.jpg)

### shadow DOM
独立封装的一段html代码块，其中包含的html标签、CSS样式、js行为都可以隔离、隐藏起来
它就是为组件封装而生的特性，父子组件之间不会互相干扰

其实浏览器本身就有一些内置的shadow DOM
需要打开F12的设置当中的**Show user agent shadow DOM**
就可以看到诸如`<input type="range" />`的内部结构了
![input range](/images/前端杂烩/web-components/input_range.jpg)

可以把它看做浏览器封装的一个组件
如果要把我们的组件也封装为这样的一个结构（虽然可以看到组件中的结构，但是内外隔离，外部无法对内部的DOM进行操作）
可以使用如下的方式

```javascript
class UserInfo extends HTMLElement {
  constructor() {
    super()
    var shadow = this.attachShadow( { mode: 'closed' } )
    var templateElem = document.getElementById('userInfo')
    var content = templateElem.content.cloneNode(true)
    shadow.appendChild(content)
  }
}
window.customElements.define('user-info', UserInfo)
```
![shadow DOM](/images/前端杂烩/web-components/shadow_dom.jpg)
此时在组件内部定义的样式就只应用在该组件内，不会对外部造成影响了

### 组件传参
接收传参的方式就是获取DOM上的属性
```javascript
var templateElem = document.getElementById('userInfo')
var content = templateElem.content.cloneNode(true)
content.querySelector('#name').innerText = this.getAttribute('name')
shadow.appendChild(content)
```