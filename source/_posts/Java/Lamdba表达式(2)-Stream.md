---
title: Lamdba表达式(2)-Stream
date: 2018-5-9 20:46:13
categories: 
	- Java
---

有了Lamdba表达式 , Java就具有了进行函数式编程的条件
但是作为彻底的面向对象语言 , 并不支持函数的独立存在
所以JDK1.8添加了`Stream`以及一些相关的接口
<!-- more -->
Stream的特点可以概括如下
1. Stream是元素的序列 , 看起来有点类似Iterator
2. 可以支持顺序和并行聚合的操作

可以把Stream看成一个高级版本的Iterator
Iterator只能逐个对元素进行遍历 , 然后执行某些操作
对于Stream , 只需要给出对元素进行处理的回调函数
就可以对这个元素序列进行一些操作
> 可以参考underscore对数组或者对象进行处理的一些方法
> 编程方式上十分类似

```java
List<Integer> nums = Lists.newArrayList(5,2,1,0,null,56);
Stream<Integer> stream = nums.stream();
//过滤掉序列中的null值 并获得剩余元素的数量
long count = stream.filter(num -> num!=null).count();
System.out.println(count);//5
```
Lists是`Guava`当中的一个工具类 , 这里用它来产生一个List对象

> Stream当中的很多**非聚合**方法 , 都是返回Stream对象 , 可以进行连缀
> 但是**注意** : 每次调用后的结果 , 都是产生一个新的Stream对象 , 而不再是原Stream对象
> 此时如果再对原对象进行任何操作 , 都会抛出异常

#### 创建Stream
有两种方式可以创建一个Stream对象
1. 通过Stream接口当中的静态工厂方法
2. 通过Collection接口的默认方法`stream()` , 上面的例子用的就是这种方式

**Stream接口中的静态工厂方法**
+ `of方法` - 有两个重载形式 , 一个是接收单一值 , 一个是接收多个值
```java
Stream<Integer> intStream = Stream.of(10,20,30);
Stream<String> strStream = Stream.of("test");
```
+ `generate方法` - 获得一个生成器
这个方法产生的Stream是一个**惰性序列** , 也就是它并不保存这个序列中所有的内容 , 每次需要获取的时候 , 再去生成
通过这种方式 , 可以节约大量的内存 , 也可以获得一个无限长的序列
```java
Stream<Integer> randomNums = Stream.generate(()->(int)(Math.random()*1000));
randomNums.limit(20).forEach(System.out::println);
```

#### 常用的非聚合操作
+ `distinct` - 去除序列中的重复元素 ( 依赖元素的equals方法 )
+ `filter` - 对于实参函数执行结果为false的 , 从序列中去除
+ `map` - 对于元素逐个使用实参函数进行处理 , 并将返回值组装成一个新的序列
+ `peek` - 克隆原Stream产生一个新的Stream , 并提供一个消费函数 , 当新Stream中的每个元素被消费的时候都会调用该函数
+ `limit` - 截取前若干个元素
+ `skip` - 丢弃前若干个元素
+ `sorted` - 对序列中的元素进行排序 ( 可以指定Comparator )

#### 常用的聚合操作
**聚合操作**（也称为折叠）接受一个元素序列为输入，反复使用某个合并操作，把序列中的元素合并成一个汇总的结果。

+ `collect` - 将所有的元素放入到一个Collection容器当中 ( 属于可变聚合 )
+ `reduce` - 将前两个元素使用指定函数进行聚合 , 将结果与第三个元素进行聚合 , 依次进行下去
+ `count` - 获得序列中元素的数量

----
Stream当中的方法大部分都可以根据名称猜出意思
就不一一介绍了 , 详细内容参阅JDK源码