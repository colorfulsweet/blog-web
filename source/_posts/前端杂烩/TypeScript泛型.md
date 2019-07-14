---
title: TypeScript泛型
date: 2019-07-13 15:11:53
tags: 
  - TypeScript
categories: 
  - 前端杂烩
---

大部分的编译型语言都有`泛型`
可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。这样用户就可以以自己的数据类型来使用组件。

<!-- more -->
### 泛型
在TS当中, 泛型可以用于方法也可以用于类
#### 用于函数的泛型
```typescript
function test<T>(arg: T):T {
  return arg
}
let str1: string = test<string>('abc')
let str2: string = test('abc')
```
这种情况下调用该函数时就可以明确知道该函数的返回值类型与传入的第一个参数是相同的
上面的代码当中第二次调用函数时并未指定泛型, 这种情况下就是利用TS类型推断的机制, 根据第一个参数的类型来进行推断

#### 函数类型的表示方法
如果要为一个变量指定为函数类型, 由于函数包含多种要素, 有参数类型, 返回值类型, 还可能包含泛型
比如上面的test函数, 要用一个变量来接收这个函数的话就是

```typescript
let t1: {<T>(arg: T): T} = test
// 也可以这样写
let t2: <U>(arg: U) => U = test
```
泛型的参数名并不要求必须一致

#### 用于类的泛型
```typescript
class Demo<T> {
  value?: T
  test(x: T, y: T): void {
    console.log(x, y)
  }
}
let d = new Demo<string>()
```
> 类的静态成员不能使用泛型

#### 泛型约束
上面的方式写的泛型, 实际使用的时候相当于any, 也就是该泛型可以是任意类型
如果要约束这个泛型的类型范围
和Java当中一样, 也是使用`extends`关键字 ( 并没有super )
```typescript
class Demo1{ 
  test(): void {
    console.log('demo1')
  }
}
class Demo2<T extends Demo1> {
  value?: T
}
```
> **注意** : 这里的`T extends Demo1`只是代表传入的泛型必须具备Demo1所有的成员
而不是必须是Demo1或者以extends Demo1来声明的类
比如有如下代码

```typescript
class Test {
  // 这里的Test类具备一个名为test, 且无形参的函数成员(返回值不重要)
  test(): void { console.log('Test') }
}
class Demo<T extends Test> { }

class Demo1 { }
class Demo2 {
  test(str: string) { }
}
class Demo3 {
  test() {}
}
let d1: Demo<Demo1> = new Demo() // ERROR: Demo1不具备test函数成员
let d2: Demo<Demo2> = new Demo() // ERROR: Demo2具备test函数成员, 但形参表不同
let d3: Demo<Demo3> = new Demo() // 正确
```
可以看到上述的几个类都没有继承自Test, 但是如果具备与Test相同的成员, 即可指定为Demo类的泛型

#### 查找类型
查找类型是 TS2.1 引入的新语法, 与之相关的关键字就是`keyof`和`type`
使用它获得的结果是一个**union**, 可以在泛型当中使用
(关于TS当中的union, 后面会提到)
```typescript
interface Demo {
  name: string
  value: number
}

function test<T extends keyof Demo>(arg: T) { }
test('foo') // ERROR: Argument of type '"foo"' is not assignable to parameter of type '"name" | "value"'.
test('name') // 正确

type a = Demo['name'] // a就代表string类型
function test2(arg: a):void { }
//test2第一个参数必须是string类型
```
keyof 后面跟的是一个类型(可以是类或者接口)
返回的是这个类型当中所有成员的名称

使用type关键字可以获取一个类或者接口当中指定成员的类型
当然不只是适用于自定义的类
比如
```typescript
type b = string['charAt']
// 等价于
// type b = (pos: number) => string
```
### union
如果需要表示多种类型或值的组合, 可以使用`union`
它是一种**类型**, 可以用在任何需要使用类型的地方
这个类型中可以包含类型或者具体的对象
```typescript
type myType = string | 0
// 这种类型可以是任意字符串或者数字0
let a: myType = 'ab' // 正确
let b: myType = 0 // 正确
let c: myType = 1 // 错误, 只能是字符串或者数字0

function test(arg: number | 'none') {
  // 该函数调用可以传入任意数字或者'none'字符串
  console.log(arg)
}
```

### 元组(Tuple)
第一次知道这种结构还是在python当中
当然原生JS没有元组了, TS实现了`元组(Tuple)`, 目的是合并不同类型的对象
而数组合并的是相同类型的对象
```typescript
let t: [string, number, Date] = ['123', 10, new Date()]
console.log(t[0].length)
```
其实完全可以把它看做一个数组, 实际的用法也和数组一样

### 枚举
TS也具备枚举类型, 与其他语言一样, 枚举可以用于清晰地表达意图或创建一组有区别的元素
比起直接使用数字表示, 代码更加清晰易读
```typescript
// 不指定数字, 从0开始的连续序列
enum Color1 {
  RED, GREEN, BLUE
}
// 指定数字, 之后的依次递增
enum Color2 {
  RED, GREEN=20, BLUE
}
// 指定初始化值, 则该成员就没有对应数字, 之后的必须也指定初始化值
enum Color3 {
  RED, GREEN='green', BLUE='blue'
  // 如果BLUE没有指定为'blue'就会报错
}
```
翻译后的JavaScript代码
```javascript
"use strict";
var Color1;
(function (Color1) {
  Color1[Color1["RED"] = 0] = "RED";
  Color1[Color1["GREEN"] = 1] = "GREEN";
  Color1[Color1["BLUE"] = 2] = "BLUE";
})(Color1 || (Color1 = {}));
var Color2;
(function (Color2) {
  Color2[Color2["RED"] = 0] = "RED";
  Color2[Color2["GREEN"] = 20] = "GREEN";
  Color2[Color2["BLUE"] = 21] = "BLUE";
})(Color2 || (Color2 = {}));
var Color3;
(function (Color3) {
  Color3[Color3["RED"] = 0] = "RED";
  Color3["GREEN"] = "green";
  Color3["BLUE"] = "blue";
})(Color3 || (Color3 = {}));
```
可以看到它依然是用JS的键值对结构对象模拟实现的, 但是更多的时候我们不需要管这些
只需要按照熟知的枚举特点去使用
比如它是有固定数量实例的一种类型, 可以用于switch语句等等

