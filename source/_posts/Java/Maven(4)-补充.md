---
title: Maven(4)-补充
date: 2018-5-9 20:29:31
tags: 
  - maven
categories: 
  - Java
---

maven默认使用的JDK版本是1.5 , 我们可以在配置文件中`<profiles>`标签里加入如下内容 , 将默认JDK改为1.8
<!-- more -->

```xml
<profile>
  <id>jdk-1.8</id>
  <activation>    
    <activeByDefault>true</activeByDefault>
    <jdk>1.8</jdk>
  </activation>
  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
  </properties>
</profile>
```

---
#### 依赖传递
不同的jar包之间可能存在相对复杂的依赖关系
比如A依赖于B , B依赖于C
那么A就是同时依赖于B和C , 这就是依赖传递

如果在A当中只是用到了B当中的部分内容 , 并不需要依赖于C
那么我们可以将C排除
```xml
<dependency>
  <groupId>B-group</groupId>
  <artifactId>B</artifactId>
  <version>1.0</version>
  <exclusions>
    <exclusion>
      <groupId>C-group</groupId>
      <artifactId>C</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```
这样就可以把对C的依赖排除

#### 依赖冲突
由于jar包可以有不同的版本 , 所以在依赖的关系当中就可能出现依赖的冲突
比如A依赖于B , B依赖于C的2.0版本
A依赖于D , D依赖于E , E依赖于C的2.1版本
那么在A当中实际引入的C , 就会出现冲突

maven在处理这种冲突的时候 , 有以下的原则
1. **最短路径优先** - 也就是在依赖链当中到达该jar包的最短路径 , 比如在上面的例子当中 , 显然到达C的2.0版本的路径较短 , 所以A最终引入的就是C的2.0版本
2. **先声明的优先** - 在路径长度相同的情况下 , 根据在pom.xml当中声明的先后顺序 , 优先使用先声明的

#### 变量的声明与使用
对于一个框架 , 比如spring , 要在项目当中使用需要添加多个依赖包
我们需要对这些依赖包指定统一的版本 , 避免版本不一致出现的问题

这种情况下可以在pom.xml当中声明一个公共的变量
比如
```xml
<properties>
  <spring-version>4.3.11.RELEASE</spring-version>
</properties>
...
<dependencies>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>${spring-version}</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>${spring-version}</version>
</dependency>
</dependencies>
```
这样就更加清晰 , 也为统一的修改创造了方便
