---
title: Maven(2)-搭建web项目
date: 2018-5-9 20:25:23
tags: 
	- maven
categories: 
	- Java
---

在Maven当中创建一个web项目的步骤如下
<!-- more -->
##### (1) 新建maven项目
打包方式选择`war`
![Alt text](/images/Java/maven_web1.png)

##### (2) 设置项目属性
![Alt text](/images/Java/maven_web2.png)
点击上图中箭头所指链接

![Alt text](/images/Java/maven_web3.png)
将webapp作为web项目的根目录
![Alt text](/images/Java/maven_web4.png)
> 此时webapp下面就已经生成了web项目的基本结构
![Alt text](/images/Java/maven_web5.png)

##### (3) 修改发布规则
> 由于web项目需要发布到tomcat运行
所以需要指定发布的规则 , 也就是把哪个目录下的文件发布到tomcat当中

项目属性 -> Deployment Assembly
![Alt text](/images/Java/maven_web6.png)
表示将webapp目录下的文件发布到tomcat中对应项目文件夹的根目录下
将maven引入的jar包发布到WEB-INF/lib目录下
> 这里可以将两个 test 源码文件夹去掉 , 单元测试代码可以不需要发布