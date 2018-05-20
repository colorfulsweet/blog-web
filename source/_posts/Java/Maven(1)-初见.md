---
title: Maven(1)-初见
date: 2017-10-9 20:18:14
tags: 
  - maven
categories: 
  - Java
---

我们在工作中可能会在IDE当中有很多项目
这些项目多数需要引用一些第三方的jar包
但是对于相同类型的项目 , 引用的jar包很可能是重复的

在以往 , 我们需要在每个项目中都拷贝一份这些jar包 , 以保证这些项目可以独立运行 , 这样显然不好
而且对于同一个jar包来说 , 它也会存在不同的版本 , 缺乏统一的管理
<!-- more -->
对于较为复杂的项目 , 可能会有主项目和若干个子项目 , 他们之间的依赖关系也难以维护

`Maven`就是用来解决项目管理中遇到的这些问题
它引入了`仓库`的概念 , 实现了对jar包的统一管理

#### 安装与配置

1. 解压存放到一个固定的目录当中
然后配置环境变量 , 例如
`MAVEN_HOME=D:/maven-3.3.9`
在PATH当中添加
`%MAVEN_HOME%/bin`
> Mac平台直接修改 .bash_profile文件

在控制台输入`mvn -version`正确显示maven的版本代表配置正确

2. 修改maven目录下conf/setting.xml文件
添加本地仓库位置 , 例如
```xml
<localRepository>/Users/Sookie/Documents/apache-maven-3.3.9/mavenLib</localRepository>
```

3. 在myeclipse/eclipse当中配置maven
![Alt text](/images/Java/maven1.png)
点击Add选择到Maven的根目录即可
![Alt text](/images/Java/maven2.png)
然后在User Setting里面设置setting.xml文件的根目录( 就是上一步当中修改的setting.xml文件 )

#### 第一个Maven项目
在myeclipse当中新建一个maven项目
结构如下
![Alt text](/images/Java/maven3.png)
`src/main/java`用于存放源代码
`src/main/test`用于存放测试代码
`target`目录用于存放编译 打包后的输出文件
这是maven项目的通用约定

如果要引入第三方jar包 , 需要编辑pom.xml文件
> 这里在引入jar包的时候 , 如果本地仓库中没有 , 则会去maven官方的服务器上去下载
> 下载后保存到本地仓库
> 如果官方没有这个jar包 , 也可以自己放进仓库里

这里尝试引入几个jar包
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>maven_demo</groupId>
  <artifactId>hello_maven</artifactId>
  <version>0.0.1-SNAPSHOT</version>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.2</version>
    </dependency>
    <dependency>
      <groupId>mongo</groupId>
      <artifactId>mongo-java-driver</artifactId>
      <version>3.2.2</version>
    </dependency>
    <dependency>
      <groupId>mongo</groupId>
      <artifactId>morphia</artifactId>
      <version>1.2.3</version>
    </dependency>
  </dependencies>
</project>
```

观察本地仓库的目录结构就可以发现 , 从左到右依次是groupId  artifactId  version
![Alt text](/images/Java/maven4.png)
如果要放入自己的jar包 , 按照这个结构去创建目录即可

引入以后 , 刷新项目 , 引入的jar包就会出现在这里
![Alt text](/images/Java/maven5.png)
在代码中可以直接使用
