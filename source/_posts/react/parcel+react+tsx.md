---
title: parcel+react+tsx
date: 2021-4-6 12:01:13
tags: 
  - react
categories: 
  - react
---

熟悉一下react，使用`parcel`作为打包工具，使用`ant-design`作为组件库

<!-- more -->
### 添加依赖
```json
"devDependencies": {
  "@types/react": "^17.0.3",
  "parcel-bundler": "^1.12.5",
  "typescript": "^4.2.3"
},
"dependencies": {
  "@tensorflow/tfjs": "^3.3.0",
  "antd": "^4.15.0",
  "dayjs": "^1.10.4",
  "react": "^17.0.2",
  "react-dom": "^17.0.2"
}
```
其中`react`和`react-dom`是使用react构建项目必须的
如果需要使用typescript编写代码，还需要引入`@types/react`
另外dayjs是antd要求引入的依赖

### 模板页面
```html
<!DOCTYPE html>
<html>
  <head>
    <title>测试页面</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="app"></div>
    <script src="./index.tsx"></script>
  </body>
</html>
```
添加一个id为app的div作为根元素
并且引入入口文件index.tsx

### tsconfig.json配置文件
```json
{
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true
  }
}
```

### 编写根组件
```tsx
// App.tsx
import React, { PureComponent }from 'react'
import { Button, DatePicker } from 'antd'
import 'antd/dist/antd.css'

class App extends PureComponent {
  private model: tf.LayersModel;
  async componentDidMount() {
    console.log('mount生命周期')
  }
  render() {
    return ( // 使用ant-design的组件
      <div>
        <Button type="primary">我是一个按钮</Button>
        <DatePicker onChange={this.onChange} />
      </div>
    )
  }
  onChange(date, dateString: string) {
    console.log(date, dateString)
  }
}

export default App
```

### 编写入口文件
```tsx
// index.tsx
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

ReactDom.render(<App/>, document.querySelector('#app'))
```
这里的操作就是将上一步编写的根组件加载到根元素当中

### 开发模式与打包
开发模式
```
parcel src/index.html
```
打包构建
```
parcel build src/index.html
```

### react组件生命周期

组件的生命周期可分成三个状态：
+ **Mounting**：已插入真实 DOM
+ **Updating**：正在被重新渲染
+ **Unmounting**：已移出真实 DOM

生命周期的方法

+ **componentWillMount** 在渲染前调用,在客户端也在服务端。
+ **componentDidMount** 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问。
+ **componentWillReceiveProps** 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
+ **shouldComponentUpdate** 返回一个布尔值。在组件接收到新的props或者state时被调用。在初始化时或者使用forceUpdate时不被调用。
可以在你确认不需要更新组件时使用。
+ **componentWillUpdate** 在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用。
+ **componentDidUpdate** 在组件完成更新后立即调用。在初始化时不会被调用。
+ **componentWillUnmount** 在组件从 DOM 中移除之前立刻被调用。

### 路由
引入依赖
```
npm install react-router-dom --save
npm install @types/react-router-dom --save-dev
```
> `react-router`与`react-router-dom`
> 前者实现了路由的核心功能
> 后者基于react-router，加入了在浏览器运行环境下的一些功能
> 引入后者相当于间接引入了前者

编写路由页面

```tsx
import React, { PureComponent } from 'react'
import { NavLink, Route, HashRouter } from 'react-router-dom'

class APage extends PureComponent {
  render() {
    return (
      <div>我是A页面</div>
    )
  }
}
class BPage extends PureComponent {
  render() {
    return (
      <div>我是B页面</div>
    )
  }
}
class App extends PureComponent {
  render() {
    return (
      <HashRouter>
      <div>
        <span>这里是主页面</span>
        <ul>
          <li><NavLink to='/a' activeClassName="active">A页面</NavLink></li>
          <li><NavLink to='/b' activeClassName="active">B页面</NavLink></li>
        </ul>
        <Route path='/a' component={APage}></Route>
        <Route path='/b' component={BPage}></Route>
      </div>
      </HashRouter>
    )
  }
}

export default App
```

+ 路由分为`HashRouter`和`BrowserRouter`两种
相当于vue-router当中的**hash**和**history**两种模式
+ `NavLink`会被渲染为一个a标签，作为路由跳转的链接
与`Link`相比多了一些属性，比如**activeClassName**，便于样式的调整
+ `Route`就是路由对应的页面