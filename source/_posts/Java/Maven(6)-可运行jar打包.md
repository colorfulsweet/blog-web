---
title: Maven(6)-可运行jar打包
date: 2017-12-27 20:42:27
tags: 
  - maven
categories: 
  - Java
---

要让jar包是可运行的
也就是可以执行`java -jar demo.jar`来直接运行
需要满足两个条件
1. 依赖的其他jar包也被一同打包进去
2. jar包当中具备清单文件 , 指定运行的主类
<!-- more -->
在maven项目当中 , 可以借助`maven-shade-plugin`来实现

pom.xml
```xml
<build>
<plugins>
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-shade-plugin</artifactId>
  <version>3.1.1</version>
  <executions>
    <execution>
      <phase>package</phase>
      <goals>
          <goal>shade</goal>
      </goals>
      <configuration>
        <transformers>
          <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.main.Main</mainClass>
          </transformer>
        </transformers>
      </configuration>
    </execution>
  </executions>
</plugin>
...
<plugins>
...
</build>
```

这里的`mainClass`需要指定运行的主类是哪个
之后执行`mvn clean package`打包出的jar包 , 就是直接可运行的jar包了