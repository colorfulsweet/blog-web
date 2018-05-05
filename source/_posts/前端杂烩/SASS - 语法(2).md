---
title: SASS - 语法(2)
date: 2018-5-13 22:38:32
tags: 
	- 前端
	- sass
categories: 
	- 前端杂烩
---

### 占位符 %
使用占位符定义的代码块 , 它同普通的基类一样可以被继承 , 但是本身在编译后不会产生任何代码 , 可以有效避免代码的冗余

```scss
%base {
	margin : 5px;
}
.btn {
	@extend %base;
}
```
<!-- more -->
编译后会得到
```css
.btn {
	margin : 5px;
}
```

### 数据类型
在sass当中包含以下几种数据类型
+ **数字** , 如 1  2.6  10px
+ **字符串** , 可以有引号 , 也可以无引号
+ **颜色** , 如 blue  #04a3f9  rgba(255,0,0,0.5)
+ **布尔值** , true与false
+ **值列表** , 用空格或者逗号分隔的多个值构成的集合

对于其他css当中支持的标识 , 比如!import声明 , 都被视为无引号字符串

对于有引号字符串 , 当被作为插值使用时 , 会自动变为无引号字符串
```scss
$direction : ('left', "right");

.panel {
  @each $direct in $direction {
    margin-#{$direct} : 10px;
    padding-#{$direct} : 10px;
  }
}
```

### 值列表相关函数

相关的函数比较多 , 这里列举几个常用的
#### `nth(值列表, 索引)`
根据索引获取值列表当中的某一个元素 ( 索引值从1开始 )
```scss
$direction : (left, right);

.panel {
  margin-#{nth($direction, 2)} : 10px;
  padding-#{nth($direction, 1)} : 10px;
}
```
编译后的结果为
```css
.panel { 
	margin-right: 10px; 
	padding-left: 10px; 
}
```
#### `join(值列表1, 值列表2)`
将两个值列表合并为一个值列表 , 并返回合并后的结果
```scss
$num1 : (10px, 30px);
$num2 : (5px, 9px);

.panel {
  margin: join($num1, $num2);
}
```

#### `append(值列表, 新元素)`
将某个元素添加到值列表的末尾 , 并返回新的列表 ( 是产生一个新的列表 , 并不会改变原本的列表 )

```scss
$num1 : (10px, 30px);
.box {
  margin : append($num1, 15px);
  padding : $num1;
}
```
```css
.box {
	margin : 10px 30px 15px;
	padding : 10px 30px;
}
```

+ `length(值列表)` - 返回列表中元素的数量
+ `index(值列表, 元素)` - 返回该元素在值列表当中的位置 , 不存在则返回false

### 运算

#### 长度运算

```scss
$width1 : 30pt;
$width2 : 10px;

.panel {
  width : $width1 + $width2;
}
```
编译后结果
```css
.panel { width: 37.5pt; }
```
> **注意**
> 1. 编译后结果的单位以表达式中第一个有单位的元素的单位为准 , 单位不一致的会自动进行换算
> 2. in cm mm pt pc px等属于绝对单位
> em rem ex 属于相对当前字体的单位
> 不同类型的不能直接进行运算
> 3. 运算符两侧最好加上空格 , 避免与css本身的连接符冲突 ( 减号会存在此问题 )
> 4. 乘法运算当中只能有一个元素存在单位 , 如果有多个元素存在单位则会报错
> 5. 除法运算最好加括号 , 对于两个常量的情况 , 比如`width : 20px/2` , 编译后并不会执行该运算 , 应该写作`width:(20px/2)`

#### 颜色运算
对于颜色类型的变量或者常量 , 都是支持运算的
运算的方式是进行分段运算 , 也就是对 RGB 的值分别进行运算
( 颜色值本身相当于4个数字 , 并不存在单位 , 所以不存在长度运算当中的单位类型不一致无法计算的问题 )
```scss
p {
  color: #010203 + #040506;
}
```
编译后的结果
```css
p { color: #050709; }
```
> **注意**
> 如果使用rgba , 也就是存在透明度的值 , 运算当中的a值必须相等 , 否则无法运算
