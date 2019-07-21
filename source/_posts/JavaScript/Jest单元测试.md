---
title: Jest单元测试
date: 2019-07-21 00:41:10
tags: 
  - JavaScript
  - 单元测试
categories: 
  - JavaScript
---

`Jest`是由Facebook开源的一个测试框架，它集成了断言库、mock、快照测试、覆盖率报告等功能。它非常适合用来测试React代码，但不仅仅如此，所有的js代码都可以使用Jest进行单元测试

<!-- more -->
### 安装
直接执行`yarn add jest --dev`或者`npm install jest --save-dev`来安装到nodejs项目
会附带同时安装jest-cli这个命令行工具
可以在命令行直接执行jest命令运行单元测试代码

所以可以在package.json当中添加
```json
"scripts": {
  "test": "jest"
}
```
运行测试的时候直接执行`yarn test`或者`npm run test`即可
当然也可以用npx, 也就是`npx jest`

### Hello World
如果我们编写了一个函数, 要测试它的执行是否能达到预期结果
```javascript
// main.js
function sum(a, b) {
  return a + b
}
module.exports = { sum }
```
jest会递归查找项目当中所有的名为`*.test.js`以及`*.spec.js`
通常是把单元测试文件与源码文件同名(不是必须)
```javascript
// main.test.js
const { sum } = require('../main')

test('Adding 2 + 3 equals 5', () => {
  expect(sum(2, 3)).toBe(5)
})
```
> 这里虽然使用了jest提供的一些函数，但是测试代码当中并不需要进行引入
jest会帮我们引入这些
test也可以用it，完全一样，没有差别

![运行jest](/images/JavaScript/运行jest.png)

test是运行一个测试用例，第一个参数是对该测试的描述，会在执行结果中打印出来
在此代码中，`expect(sum(2, 3))`返回一个“期望”对象，`.toBe(2)`是匹配器。匹配器将期望的结果（实际值）与自己的参数（期望值）进行比较
当Jest运行时，它会跟踪所有失败的匹配器，并打印出错误信息

常用的匹配器
+ `toBe` 使用 Object.is 判断是否严格相等。
+ `toEqual` 递归检查对象或数组的每个字段。
+ `toBeNull` 只匹配 null。
+ `toBeUndefined` 只匹配 undefined。
+ `toBeDefined` 只匹配非 undefined。
+ `toBeTruthy` 只匹配真。
+ `toBeFalsy` 只匹配假。
+ `toBeGreaterThan` 实际值大于期望。
+ `toBeGreaterThanOrEqual` 实际值大于或等于期望值
+ `toBeLessThan` 实际值小于期望值。
+ `toBeLessThanOrEqual` 实际值小于或等于期望值。
+ `toBeCloseTo` 比较浮点数的值，避免误差。
+ `toMatch` 正则匹配。
+ `toContain` 判断数组中是否包含指定项。
+ `toHaveProperty(keyPath, value)` 判断对象中是否包含指定属性。
+ `toThrow` 判断是否抛出指定的异常。
+ `toBeInstanceOf` 判断对象是否是某个类的实例，底层使用 instanceof。

所有的匹配器均可以使用`.not`取反
比如
```javascript
test('Adding 2 + 3 not equals 10', () => {
  expect(sum(2, 3)).not.toBe(10)
})
```

### Promise对象
当然实际情况一般没有这么简单，很多需要异步操作的函数返回的都是Promise对象
```javascript
const func1 = async () => {
  return Promise.resolve('success')
}
const func2 = async () => {
  return Promise.reject('failed')
}
```
测试代码
```javascript
test('the func1 should resolve success', () => {
  return expect(func1()).resolves.toBe('success')
})
test('the func1 should reject failed', () => {
  return expect(func2()).rejects.toBe('failed')
})
```
也可以使用await
```javascript
test('the func1 should resolve success', async () => {
  const result = await func1()
  expect(result).toBe('success')
})

test('the func2 should reject failed', async () => {
  try {
    await func2()
  } catch (err) {
    expect(err).toBe('failed')
  }
})
```

### 抛出错误的匹配
可以使用`toThrow`或者`toThrowError`(并没发现这两者的不同)来校验函数抛出了指定的错误
```javascript
const func3 = () => {
  throw new Error('this error')
}

test('the func3 throw Error', () =>{ 
  function func3Wrapper() {
    func3()
  }
  expect(func3Wrapper).toThrowError()
  expect(func3Wrapper).toThrowError('this error')
  expect(func3Wrapper).toThrowError(/^this/)
  expect(func3Wrapper).toThrowError(new Error('this error'));
})
```
需要注意的是，抛出异常的方法**必须放在包装函数**内
也就是给expect传递一个函数，而不是目标函数的执行结果
否则无法捕获异常，也就无法判断抛出的异常是否匹配
参数是可选的，可以是
+ 字符串 - 与Error对象的message完全一致
+ 正则对象 - 与Error对象的message可以匹配
+ Error对象 - 与抛出的Error对象一致

### 钩子函数
Jest提供了四个测试用例的钩子：**beforeAll、afterAll、beforeEach、afterEach**。
`beforeAll` 和 `afterAll` 会在所有测试用例之前和所有测试用例之后执行一次。
`beforeEach` 和 `afterEach` 会在每个测试用例之前和之后执行。

如果测试用例较多，可以用`describe`将测试用例分组
在describe块中的钩子函数只作用于块内的测试用例：
```javascript
beforeAll(() => console.log('out - beforeAll')) // 1
afterAll(() => console.log('out - afterAll')) // 12
beforeEach(() => console.log('out - beforeEach')) // 2,6
afterEach(() => console.log('out - afterEach')) // 4,10
test('', () => console.log('out - test')) // 3
describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('in - beforeAll')) // 5
  afterAll(() => console.log('in - afterAll')) // 11
  beforeEach(() => console.log('in - beforeEach')) // 7
  afterEach(() => console.log('in - afterEach')) // 9
  test('', () => console.log('in - test')) // 8
})
```
外部的beforeAll会先于所有分组内的执行
外部的afterAll会在所有分组执行完毕后执行

外部的beforeEach会在所有测试用例执行前执行，并且先于分组内的beforeEach
外部的afterEach会在所有测试用例执行后执行，晚于分组内的beforeEach

这些钩子函数通常用于测试用例执行前后一些资源的初始化和销毁操作

### Mock函数
调用`jest.fn()`即可获得一个mock函数。 Mock函数有一个特殊的mock属性，保存着函数的调用信息
比如我们需要测试多组数据，并提供入参和返回值的期望
```javascript
function sum(a, b) {
  return a + b
}

test('test forEach function', () => {
  const sumCallback = jest.fn(sum)
  const testData = [
    [[1,2], 3],
    [[2,3], 5],
    [[3,5], 8],
    [[101,102], 203]
  ]
  testData.forEach(item => {
    sumCallback.apply(null, item[0])
  })
  expect(sumCallback.mock.calls.length).toBe(testData.length)
  testData.forEach((item,index) => {
    // 通过calls属性可以拿到每次调用的入参(数组形式)
    expect(sumCallback.mock.calls[index]).toEqual(item[0])
    // 通过results属性可以拿到每次调用的返回值
    expect(sumCallback.mock.results[index].value).toBe(item[1])
  })
})
```

### Jest配置
Jest可以在package.json当中通过`jest`属性来指定配置项
或者默认引入`jest.config.js`(如果存在)
也可以通过`--config`参数指定配置文件，该配置文件可以是json格式或者js格式
js格式需要使用`module.exports`来暴露出配置内容对象，供jest获取

执行`jest --init`可以初始化一个配置文件，包含多数配置项的默认值

其他常用参数
+ `--watch` 以监视模式启动
+ `--coverage` 生成覆盖率报告