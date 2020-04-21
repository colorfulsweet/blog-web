---
title: Vue项目改造Typescript
date: 2020-4-21 09:07:33
tags: 
  - 前端
  - TypeScript
categories: 
  - 前端杂烩
---

在Vue中使用TypeScript可以增强开发体验，主要是TS的类型检查可以在编译阶段检查出一些隐藏的编码错误
这是实践过程中将JavaScript编写的Vue项目改造为TypeScript的踩坑记录
<!-- more -->

### 添加依赖
最主要的是需要添加`typescript`、`ts-loader`的依赖
还可以添加上`vue-class-component`和`vue-property-decorator`用于增强
这两个库当中包含一些注解（装饰器），之前的Vue对象中的一些成员可以使用注解进行声明
后者相当于是前者的超集

### 打包配置修改
需要在`vue.config.js`当中添加webpack的配置
设置入口文件为main.ts文件，并且对于ts文件使用`ts-loader`进行处理
```javascript
module.exports = {
  // ...省略其他配置
  configureWebpack: { // 这里是webpack的配置
    entry: './src/main.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        }
      ]
    },
    resolve: { // 这里是指定引入模块省略扩展名时的查找顺序
      extensions: ['.ts', '.js', '.css', '.json', '.vue']
    }
  },
}
```
### TypeScript配置
项目根目录下创建`tsconfig.json`文件
这里的配置可以根据实际需要创建
例如
```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
```
### main.ts
需要把原本的main.js文件改造为main.ts
内容的改造根据具体情况而定，主要是添加好符合ts语法的类型声明

除此之外，如果使用了vue-router和vuex，也需要改造为对应的ts文件

> 因为已经在webpack的配置当中添加了`extensions`的查找顺序
比如引入store.ts的时候就可以直接写`import store from './store'`

### 添加对Vue的声明
在src目录下创建文件`shims-vue.d.ts`
```typescript
declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}
```

需要注意的是如果在Vue原型当中添加了属性
也需要添加对应的声明
但是由于vue-router和vuex这种是作为Vue插件来使用的
(也就是按`Vue.use(Router)`这种方式来使用)
并且都已经支持TypeScript，所以并不需要单独来编写声明了

但是像axios这种并不是按Vue插件使用
需要用下面的方式添加到Vue原型当中
```javascript
Vue.prototype.$http = axios
```
那么使用了TypeScript之后，就需要对该属性进行声明
否则ts编译的过程就会认为该属性不存在

在src目录下创建`index.d.ts`
```typescript
import { AxiosInstance } from 'axios'

declare module 'vue/types/vue' {
  interface Vue {
    $http: AxiosInstance
  }
}
```

### Vue组件改造
示例
```typescript
import { Component, Vue } from 'vue-property-decorator'
import { Button } from 'view-design'
@Component({components: { Button }})
export default class App extends Vue{
  @Prop() formData?: object
  msg: string | null = null
  test() {
    console.log(this.msg)
  }
  @Emit('reset')
  resetCount() {
    this.msg = null
    return 0
  }
}
```
相当于之前的写法
```javascript
import { Button } from 'view-design'
export default {
  components: { Button },
  props: {
    formData: Object
  },
  data() {
    return {
      msg: null
    }
  },
  methods: {
    test() {
      console.log(this.msg)
    },
    resetCount() {
      this.msg = null
      this.$emit('reset', 0)
    }
  }
}
```
主要的效果就是组件代码的编写更加扁平化，减少了层级嵌套
