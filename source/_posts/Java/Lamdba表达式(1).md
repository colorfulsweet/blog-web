---
title: Lamdba表达式(1)
date: 2018-5-9 20:45:52
categories: 
	- Java
---

`Lamdba表达式`是Java8的一项重要的新特性
它是基于匿名内部类演化出的一种更加抽象的语法形式
由编译器去推断并包装为常规的代码
<!-- more -->
官方的解释为
> 一个不用被绑定到一个标识符上，并且可能被调用的函数

可以理解为是 一段带有输入参数的可执行语句块
```java
List<String> names = new ArrayList<String>();
//在List当中加入若干元素
Collections.sort(names, (o1,o2)->o1.compareTo(o2));
```
上述代码中用到的Lamdba表达式其实就是相当于构建了一个实现了Comparator接口的匿名内部类
等价于以下代码
```java
Collections.sort(names, new Comparator<String>() {
	@Override
	public int compare(String o1, String o2) {
		return o1.compareTo(o2);
	}
});
```
也许下面的代码能更好地体现Lamdba表达式就是匿名类的另外一种写法
```java
public class Main {
	public static void main(String[] args) {
		Demo d = ()->{return "aa";};
		d.func();
	}
}

interface Demo {
	public String func();
}
```
---
#### Lamdba表达式语法
```java
(Type1 param1, Type2 params,...,TypeN paramN) -> {
	//若干语句...
	return 表达式;
}
```
这是一般语法 , 也就是最完整的一种语法
但是通常用到Lamdba表达式的时候 , 都是方法中的语句并不复杂 , 逻辑简单的情况
否则会造成代码可读性很差
所以Lamdba就有很多种简化版 , 实际用的也多是简化版
1. 编译器可以根据上下文推断参数的类型 , 大多数情况下参数类型可以省略
```java
(param1, params,...,paramN) -> {
	//若干语句...
	return 表达式;
}
```
2. 当参数只有一个 , 可以省略小括号
```java
param -> {
	//若干语句...
	return 表达式;
}
```
3. 当方法中只包含一条语句 , 可以省略大括号 return 和 最后的分号
```java
param -> 表达式
```
---
其他要点
+ 与匿名类中的方法一样 , Lamdba可以访问其所在的外部类的成员 , 也可以访问其所在方法中的局部变量
+ Lamdba表达式中的this指向的并不是这个匿名类对象 , 而是指向其外部类对象
所以如果是在一个静态方法中 , 则不能使用this

---
#### 方法引用
`方法引用`可以在某些条件成立的情况下 , 更加简化Lamdba表达式的声明 , 格式有以下3种
+ **对象名称 :: 非静态方法**
+ **类名称 :: 静态方法**
+ **类名称 :: 非静态方法**

前两种方式类似
例如`System.out::println`
等价于`x->System.out.println(x);`

最后一种方式 , 相当于把Lamdba表达式的第一个参数当做该方法的目标对象
例如`String::toLowerCase`
等价于`x->x.toLowerCase();`
#### 构造器引用
语法是
+ **类名 :: new**

例如 `BigDecimal::new`
等价于`x->new BigDecimal(x)`