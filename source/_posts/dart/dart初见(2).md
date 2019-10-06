---
title: dart初见(2)
date: 2019-10-06 21:08:37
tags: 
  - dart
categories: 
  - dart
---

### 函数相关
dart当中函数也是一个对象，具备共同的抽象类`Function`
因为是抽象类，所以不能直接用其执行new创建对象
<!-- more -->

#### 可选参数
dart在定义函数的时候可以在形参表的末尾添加可选参数
有命名参数和匿名参数两种形式
```dart
void main() {
  func1('Sookie', c: true, b: 10);
  func2('Sookie', 20, false);
}
// 命名可选参数
void func1(String a, {int b, bool c}) {
  print('a=${a},b=${b},c=${c}');
}
// 匿名可选参数
void func2(String a, [int b = 100 ,bool c]) {
  // 可以给可选参数指定默认值
  print('a=${a},b=${b},c=${c}');
}
```
命名的可选参数因为传参时指定形参名称，所以就不会强制顺序的匹配了
可选参数的声明必须在形参表的末尾


#### 匿名函数和箭头函数
**匿名函数**
```
(参数1, 参数2 ...) {
  函数体
}
```
匿名函数不能声明返回值类型，或者说它的返回值是任意类型的，相当于是`dynamic`
> dynamic并不算一种类型，只是作为一个关键字表示动态类型
就像var也是关键字，但是会执行类型推导

**箭头函数**
```
(参数1, 参数2 ...) => 返回值
```
箭头函数只能有一个表达式作为返回值，而不能有其他语句
函数对象都可以使用变量进行接收

#### 级联调用
dart当中使用`..`来实现级联调用
```dart
List list1 = [10,15,20];
list1..add(19)..remove(10);
// 相当于
List list2 = [10,15,20];
list2.add(19);
list2.remove(10);
```

### 面向对象
使用`class`关键字来声明一个类，创建对象时`new`关键字可以省略
dart中不支持函数重载

可以使用`.`来访问对象的成员
当然如果变量是null会报空指针的错误
可以判断是否为null
也可以使用`?.`操作符，相当于自带判断是否为null，如果是null就不执行调用

类如果实现了`call`函数，那么它的实例就可以直接当做函数来执行调用
```dart
void main() {
  Demo demo = new Demo();
  demo('hello');
}

class Demo{
  void call(String msg) {
    print(msg);
  }
}
```
#### 计算属性
对于不是固定值，而是需要使用一些逻辑获得计算结果的情况
我们可以将其定义为类当中的一个函数，也可以使用计算属性

计算属性分为`get`和`set`两种
```dart
void main() {
  Rectangle rect = new Rectangle();
  rect.width = 10.9;
  rect.height = 20.3;
  print(rect.area); // 221.27

  rect.area = 100;
  print(rect.width); // 5.0
}

class Rectangle {
  num width, height;

  num get area {
    return width * height;
  }
  void set area(num value) {
    this.height = 20;
    this.width = value / 20;
  }
}

```
> 它本身当然是个函数，也可以使用箭头函数的写法

#### 构造函数
定义一个类时，如果不写构造函数，会默认提供一个无参的构造函数
支持匿名构造函数与命名构造函数两种
构造函数也不能被重载，如果要实现一个类有多个构造函数，就必须使用命名构造函数
```dart
class Person {
  String name;
  int age;
  // 匿名构造函数
  Person(String name, int age) {
    this.name = name;
    this.age = age;
  }
  // 也可以写作
//  Person(this.name, this.age);

  // 命名构造函数
  Person.withName(String name) {
    this.name = name;
  }
}
```
命名构造函数调用时写作 **new Person.withName('sookie')**

对于`final`修饰的类属性，想要在构造函数进行初始化，只能使用这种语法糖的形式来写
```dart
class Person {
  final String name;
  int age;
  
  Person(this.name, this.age);
  Person.withName(this.name);
  // 下面的方式是报错的
//  Person(String name, int age) {
//    this.name = name;
//    this.age = age;
//  }
  // 这种方式当然也报错
//  Person.withName(String name) {
//    this.name = name;
//  }
}
```
##### 常量对象
```dart
void main() {
  const Person p = const Person('Sookie', 18);
  print(p.name);
}

class Person {
  final String name;
  final int age;
  const Person(this.name, this.age);
}
```
##### 工厂构造方法
dart自带了工厂设计模式的实现，工厂构造方法需要返回该类的实例对象
```dart
class Logger {
  String name;
  static final Map<String, Logger> _cache = new Map();
  factory Logger(String name) {
    if(!_cache.containsKey(name)) {
      _cache[name] = new Logger(name);
    }
    return _cache[name];
  }
}
```

#### 类型转换
使用`as`进行强制类型转换
使用`is`和`is!`来判断是否属于某种类型
```dart
dynamic a = 'abc';
if(a is String) {
  print((a as String).toUpperCase());
}
```
如果不执行强制类型转换，就不能直接调用String上的方法，因为此时a还是动态类型


#### 继承
dart当中的继承与java基本类似
+ 使用`extends`关键字实现继承，只能单继承，具备多态特性
+ 子类会继承父类可见的成员，不会继承构造方法
+ 子类可以重写父类的方法（重写的方法上可以添加`@override`注解）
+ 所有类都有公共的基类`Object`

##### 构造函数
子类的构造函数会默认隐式调用父类无名无参的构造函数
如果父类当中没有，则需要使用super显式调用
```dart
class Demo1{
  String name;
  Demo1(String name) {
    print('Demo1:${name}');
  }
  Demo1.withName(String name) {
    this.name = name;
  }
}

class Demo2 extends Demo1 {
  // 显式调用父类的匿名构造函数
  Demo2(String name):super(name) {
    print('Demo2:${name}');
  }
  // 显式调用父类的命名构造函数
  Demo2.withName(String name):super.withName(name) {
    this.name = name;
  }
}
```
#### 抽象类与接口
抽象类使用`abstract`修饰，跟Java基本一样，可以定义抽象方法或者有具体实现的方法（抽象方法并不需要再加abstract修饰）
但是并不存在interface关键字
一个类本身就可以当做接口来使用
```dart
class Demo{
  String name;
  void test(String msg) {
    print(msg);
  }
}
// 如果作为接口使用，就必须重写所有的属性与方法
class Demo1 implements Demo {
  @override
  String name;

  @override
  void test(String msg) {
    // TODO: implement test
  }
}
```
当然这是非常冗余的，至少属性没什么好重写的
所以实际开发当中通常把抽象类当做以往意义上的接口来使用

#### Mixins
使用extends只能实现单继承，Mixins就是多继承的一种实现方式
使一个类同时拥有多个类的成员
```dart
class A {
  void a() {
    print('A.a');
  }
}
class B {
  void b() {
    print('B.b');
  }
}
class C with A,B {
  //这个类中同时具备A,B两个类的成员
}
// 如果类中不需要添加其他成员,也可以使用如下简写方式
class D = A with B;
```
如果A和B当中存在同名方法，那么就是根据**with之后的声明顺序**
A在前B在后，所以C中实际具备的是B当中的该方法

需要注意的是with后面跟的类
1. **不能**有显式声明的构造函数
2. **只能**直接继承自Object(可以省略 extends Object)
3. 可以使用implements实现接口

### 模块化
+ 可见性以`library`(库)为单位，差不多可以理解为JavaScript当中的模块
+ 每一个dart文件就是一个库
+ 以`_`开头声明的类或者函数是在当前库当中私有的，即使其他库引入了该库，也无法在其他库中使用
+ 使用`import`来引入一个库文件
+ dart的sdk有自带的一套类库，`dart.core`是默认被引入的
