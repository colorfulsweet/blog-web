---
title: dart初见(1)
date: 2019-09-28 12:08:40
tags: 
  - dart
categories: 
  - dart
---

Flutter是谷歌推出的跨平台移动端开发框架
它使用dart这门小众语言作为开发语言
想到自己在移动端开发这块的技能还相对薄弱，所以最近学习了一下这门语言，为学习Flutter框架稍作准备

<!-- more -->
dart的代码语句末尾必须写分号
学习一门编程语言，当然要先了解这门语言的基础设施

### 变量与数据类型
dart语言有类型推导机制，但仍然是强类型语言
未初始化的变量值均为null，如果一个变量未在定义时被初始化，那么它的类型就不会被确定
可以指向任意类型的对象
```dart
void main() {
  var num1 = 10;
  num1 = 'hello'; // 错误
  print(num1);

  var num2;
  num2 = 10;
  num2 = 'hello'; // 正确
  print(num1);
}
```
用`var`来定义变量会执行类型推导
也可以用`int`等类型名称直接声明变量类型，比如`int a = 10;`

#### 内置的数据类型
+ **数值型-Number** - 用`num`表示，包含`int`和`double`两种子类型，分别表示整数和浮点数
+ **字符串-String** - 用`String`表示
+ **布尔型-Boolean** - 用`bool`表示，分为true和false
+ **列表-List** - 用`List`表示，用诸如 **\[10,'ab',15.9\]** 的形式声明一个列表(类似python)
前面加const表示不可变的List
+ **无序集合-Set** - 用`Set`表示，用诸如 **{10,'ab',15.9}** 的形式声明一个无序集合，集合中的元素是唯一的
+ **键值对-Map** - 用`Map`表示，用诸如 **{'a':10, 'b':20}** 的形式声明一个键值对的集合
+ Runes、Symbols

这些本质上都是dart内置的类，比如int和double这两个类就是继承自num类的

#### final与const
用final修饰的变量，必须在定义时将其初始化，其值在初始化后不可改变；const用来定义常量

它们的区别在于，const比final更加严格。final只是要求变量在初始化后值不变，但通过final，我们无法在编译时（运行之前）知道这个变量的值
而const所修饰的是编译时常量，我们在编译时就已经知道了它的值，显然，它的值也是不可改变的。
```dart
void main() {
  final int m1 = 60;
  final int m2 = func(); // 正确
  const int n1 = 42;
  const int n2 = func(); // 错误
}

int func() {
  return 500;
}
```
上面的例子当中，显然编译期是无法知道func函数的执行结果的，所以无法用const变量接收其返回值

### 数值型操作

针对数值的运算符，大部分都和其他语言差不多
有差别的是多一个`~/`运算符，它表示取整的除法，直接使用`/`是保留小数部分的
`%`取余运算是不取整的

常用属性
+ `isNaN` - 0/0的运算会得到一个NaN，可以用来做判断
+ `isEven` - 是否是偶数
+ `isOdd` - 是否是奇数

常用方法
+ `abs()` - 取绝对值
+ `round()` - 四舍五入
+ `floor()` - 向下取整
+ `ceil()` - 向上取整
+ `toInt()` - 转换为int类型
+ `toDouble()` - 转换为double类型

### 字符串操作
1. 使用单引号或双引号来表示字符串常量
2. 三个单引号或双引号可以表示多行字符串
3. 使用`r`创建原始raw字符串

前两种都很简单，和js也类似
第三种的意思是是否对转义字符进行处理
```dart
String str1 = 'a\nb';
String str2 = r'a\nb';

print(str1); // a       b
print(str2); // a\tb
```
第一个转义字符是起作用的，第二个则不会对转义字符进行处理

运算符
+ `+` - 字符串拼接(注意字符串不能与非字符串类型的常量或变量进行拼接)
+ `*` - 后面跟的是次数，表示把该字符串重复若干次
+ `==` - 判断是否相同
+ `[]` - 获取字符串指定索引位置的字符(从0开始)

插值表达式`${expression}`
```dart
int a = 10;
int b = 20;
print('a=$a'); // 如果只是一个变量 也可以不写大括号
print('a+b=${a+b}');
```
常用属性
+ `length` - 字符串长度
+ `isEmpty` - 是否是空串
+ `isNotEmpty` - 是否不是空串

常用方法
+ `contains(str)`,`subString(start,end)` - 是否包含某个子串，取子串(end不传则截取到末尾)
+ `startWith(str)`,`endsWith(str)` - 是否以某个字符串开头/结尾
+ `indexOf(str)`,`lastIndexOf(str)` - 子串第一次/最后一次出现的位置
+ `toUpperCase()`,`toLowerCase()` - 转换为大写/小写
+ `trim()`,`trimLeft()`,`trimRight()` - 去除首/尾的空白字符
+ `split(str)` - 分割字符串，得到一个List对象
+ `replaceAll(form,str)` - 正则替换
replace有一系列的方法
第一个参数可以是字符串也可以是正则对象
```dart
String str1 = 'ab123cd45';
RegExp numReg = new RegExp(r'\d+'); // 也可以写 '\\d+'
print(str1.replaceAll(numReg, '..')); // ab..cd..
```

### List操作
一个List在定义之后，可以使用类似数组操作的方式用`[]`获取指定下标的元素以及修改指定元素
使用`length`属性获取List的长度
但是不能像js那样对越界的下标直接赋值

常用方法
+ `add(value)`,`insert(index,value)` - 添加元素/在指定位置添加元素
+ `remove(value)`,`removeAt(index)` - 移除指定元素/指定位置的元素
+ `indexOf(value)`,`lastIndexOf(value)` - 查找元素第一次/最后一次出现的位置，找不到返回-1
+ `sort(func)` - 以指定规则排序
> dart同样支持函数式编程
sort就需要传入一个函数对象，这个函数需要返回一个整数
正数表示大于，负数表示小于，0表示等于
```dart
List list1 = ['aa','b','cccc','ddd'];
list1.sort((a,b) => a.length.compareTo(b.length));//[b, aa, ddd, cccc]
```
+ `shuffle()` - 随机乱序
+ `asMap()` - 转换为下标为key，元素为value的键值对集合
+ `forEach(func)` - 对List执行遍历(传入一个函数)

### Map操作
使用`[]`的方式获取或修改Map当中的元素
`length`可以获取Map的键值对数量
`keys`和`values`可以获取键和值的集合


常用方法
+ `isEmpty()`,`isNotEmpty()` - 判断是否(不)为空
+ `containsKey(key)`,`containsValue(value)` - 是否包含某个键/值
+ `remove(key)` - 按照key移除某个键值对
+ `forEach(func)` - 遍历Map


### dynamic与泛型
dart语言当中使用`dynamic`来表示动态类型
```dart
var a;
a = 10;
a = 'abc'; // a就相当于是dynamic类型的一个变量
// 也可以这样定义变量
dynamic b = 20;
b = 'cde';
```
对于集合类型，可以指定泛型，或者使用dynamic来表示任意类型
比如
```dart
Map<String, dynamic> map = new Map();
```
就表示这个Map的key必须是字符串，value可以是任意类型


### 条件表达式与运算符
dart当中除了常规的赋值与三目运算符之外
还有`??`运算符以及`??=`赋值运算符

```dart
int a = 10;
a ??= 20;
print(a); // 10

int b;
int c = b ?? 30;
print(c); // 30
```
+ `??=` 代表为左值空的时候就执行赋值，否则就什么都不做
+ `expr1 ?? expr2` 代表判断expr1是否为null，如果为null就取expr2的值，否则就取expr1的值

### switch语句的差异
dart当中的switch与其他语言的用法基本一致
有一点差别就是
> 不是switch当中的最后一个case
其最后一个语句必须是下列关键字其中之一
`break`, `continue`, `rethrow`, `return` or `throw`

+ `continue`后面必须跟一个label的名称，label必须是在这个switch当中某个位置指定的标签
```dart
void func(String name) {
  switch(name) {
    case 'Sookie' :
      print(1);
      continue label1;
    case 'Alice' :
      print(2);
      break;
    label1:
    case 'Lily' :
      print(3);
  }
}
```
+ `rethrow`可以写在catch块当中，代表在捕获异常的同时进行传播