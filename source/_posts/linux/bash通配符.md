---
title: bash通配符
date: 2018-9-26 15:08:08
tags: 
  - linux
  - shell
categories: 
  - linux
---

bash当中的通配符可以看做是原始的正则表达式
不如之后出现的正则表达式功能强大, 规则相对简单一些
可以在命令行或者shell编程当中使用

<!-- more -->
### ? 字符
代表任意的单个字符
比如
```bash
ls a?.txt
```
也就是筛选文件名是两个字符, 扩展名是txt, 且第一个字符为a的

### * 字符
代表任意数量的任意字符
比如
```bash
ls a*.txt
```
也就是筛选文件名第一个字符为a的, 扩展名是txt的文件

### [...] 模式
匹配方括号当中的任意 **一个字符**
或者一个连续的范围当中的 **一个字符**
```bash
# 匹配文件 ab.txt ac.txt
ls a[bc].txt
# 注意是 一个字符 , 所以abc.txt并不匹配

# 匹配文件 ab.txt ac.txt ad.txt
ls a[b-d].txt
```
连续范围根据字符编码确定

### [^...]和[!...]
表示匹配不在方括号当中的 **一个字符**
```bash
# 匹配文件 ac.txt ad.txt等
ls a[^b].txt
```
也可以使用连续的范围, 方式同上

### {...}模式
可以匹配大括号当中所有的模式, 模式之间用逗号分隔
```bash
ls a{a,b,c,d,ee}.txt
```
![shell通配符{}](/images/linux/shell通配符1.png)
可以看到是匹配所有的模式, 而不是其中任意一个
使用ls会提示无法找到该文件
而使用echo会直接输出这些模式的匹配结果
![shell通配符{}](/images/linux/shell通配符2.png)

```bash
# 大括号可以进行嵌套
echo {j{p,pe}g,png}
# jpg jpeg png
```

{...}与[...]有一个很重要的区别。如果匹配的文件不存在，[...]会失去模式的功能，变成一个单纯的字符串，而{...}依然可以展开。

```bash
# 不存在 a.txt 和 b.txt
ls [ab].txt
# ls: [ab].txt: No such file or directory

ls {a,b}.txt
# ls: a.txt: No such file or directory
# ls: b.txt: No such file or directory
```

### {start..end} 模式
匹配连续范围的所有情况 ( 注意中间是两个点 )
比如
```bash
# 匹配a.txt b.txt c.txt
ls {a..c}.txt

# 对于整数有特殊处理
echo {10..20}
# 输出从10到20的所有整数
```