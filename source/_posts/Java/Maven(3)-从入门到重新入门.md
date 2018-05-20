---
title: Maven(3)-从入门到重新入门
date: 2017-10-18 20:29:31
tags: 
  - maven
categories: 
  - Java
---

`Maven`是基于项目对象模型 ( POM ) , 可以通过描述信息来管理项目的构建 报告 和文档的软件项目管理工具

简而言之 , 使用maven可以帮助我们更高效地管理项目
它也是一套强大的构建工具 , 覆盖了编译 测试 运行 清理 打包部署各项构建周期 
<!-- more -->
#### 修改maven的配置
在maven根目录/conf/setting.xml当中 , 可以修改maven的配置
可以修改本地仓库所在位置 , 比如
```xml
<localRepository>
/Users/Sookie/Documents/maven_lib
</localRepository>
```
由于官方的远程仓库位于国外 , 在国内的访问速度比较捉急
所以也可以配置一个国内的镜像地址
比如在`<mirrors>`节点当中添加阿里云的maven镜像
```xml
<mirror>
 <id>alimaven</id>
 <name>aliyun maven</name>
 <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
 <mirrorOf>central</mirrorOf>
</mirror>
```

#### 创建符合maven项目目录结构的项目
这里需要用到`archetype`这个插件
执行
```bash
mvn archetype:generate
```
来构建一个新的maven项目
执行过程中需要指定archetype的版本 , 使用默认即可
然后输入该项目的groupId , artifactId 等内容

#### maven的常用命令
```bash
#删除项目中的target目录
mvn clean

#项目编译
mvn compile

#运行所有测试用例
mvn test

#打包项目
mvn package

#安装jar包到本地仓库
mvn install
```
安装到本地仓库就意味着其他的项目可以引入这个jar包

#### maven的生命周期
上面提到的几个常用命令 , 其实就是maven的几个生命周期
clean compile test package install
后面的4个统称为**default** , 也叫项目构建的阶段

之所以称之为生命周期 , 是因为在执行后面的操作的时候 , 也会自动执行前面的操作
比如执行`mvn package` , 那么在进行打包之前 , 也会先进行compile和test ( 默认不会进行clean , 如果需要先清理 , 那么可以执行 `mvn clean package` ) 

#### 使用插件
maven提供了可扩展的插件机制 , 除了官方提供的插件之外 , 还有很多第三方开发的插件

这里使用一个官方提供的`source`插件作为示例
使用这个插件可以把项目的源码进行打包

配置
```xml
<project>
  ...
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-source-plugin</artifactId>
        <version>3.0.1</version>
        <configuration>
          <outputDirectory>打包输出的绝对路径</outputDirectory>
          <finalName>文件名</finalName>
          <attach>false</attach>
        </configuration>
      </plugin>
    </plugins>
  </build>
  ...
</project>
```
说明 : 最终输出的文件名是`文件名-source.jar`
执行源码打包的命令

```bash
#打包项目源码包(main目录当中的所有内容)
mvn source:jar

#打包测试源码包(test目录当中的所有内容)
mvn source:test-jar
```

##### 将插件绑定到maven的生命周期
在插件的配置当中加入对maven生命周期的绑定
比如说绑定到package生命周期
那么在执行到该生命周期的时候 , 就会对源码进行打包
```xml
<plugin>
...
<executions>
  <execution>
    <phase>package</phase>
    <goals>
      <goal>jar-no-fork</goal>
    </goals>
  </execution>
</executions>
...
</plugin>
```
