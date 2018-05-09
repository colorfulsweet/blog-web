---
title: Maven(5)-jetty-plugin
date: 2018-5-9 20:32:31
tags: 
	- maven
categories: 
	- Java
---

与tomcat类似 , jetty也是一个servlet容器 , 为例如jsp和servlet提供运行环境

这里我们使用`jetty-maven-plugin`来部署运行一个web项目
关于如何把普通的maven项目改造为web项目 , 可以参考 [Maven(2)-搭建web项目][web_url]
<!-- more -->
在之前 , 我们仍然需要把这个项目去发布到tomcat然后运行tomcat
这里使用插件来实现把jetty嵌入到项目当中

#### 配置插件
首先需要在pom.xml当中配置这个插件
```xml
<build>
...
<plugins>
	<plugin>
		<groupId>org.eclipse.jetty</groupId>
		<artifactId>jetty-maven-plugin</artifactId>
		<version>9.4.7.RC0</version>
		<configuration>
			<jettyXml>jetty.xml</jettyXml>
			<webAppSourceDirectory>src/main/webapp</webAppSourceDirectory>
			<scanIntervalSeconds>3</scanIntervalSeconds>
			<contextPath>/</contextPath>
		</configuration>
	</plugin>
</plugins>
...
</build>
```

#### 创建jetty配置文件
上面的配置指定了jetty.xml作为jetty的配置文件
当然如果配置比较简单 , 也可以直接写在这个插件的`<configuration>`当中

jetty.xml ( 直接放在项目的根目录下 )
```xml
<?xml version="1.0"?>
<!DOCTYPE Configure PUBLIC "-//Jetty//Configure//EN" "http://www.eclipse.org/jetty/configure.dtd">

<Configure id="Server" class="org.eclipse.jetty.server.Server">

    <Arg name="threadpool">  
      <New id="threadpool" class="org.eclipse.jetty.util.thread.QueuedThreadPool">  
        <Arg name="minThreads" type="int">10</Arg>  
        <Arg name="maxThreads" type="int">200</Arg>  
        <Arg name="idleTimeout" type="int">60000</Arg>  
        <Set name="detailedDump">false</Set>  
      </New>  
    </Arg>  
    
    <Call name="addBean">  
      <Arg>  
        <New class="org.eclipse.jetty.util.thread.ScheduledExecutorScheduler"/>  
      </Arg>  
    </Call>  
  
    <New id="httpConfig" class="org.eclipse.jetty.server.HttpConfiguration">  
      <Set name="secureScheme">https</Set>  
      <Set name="securePort"><Property name="jetty.secure.port" default="8443" /></Set>  
      <Set name="outputBufferSize">32768</Set>  
      <Set name="requestHeaderSize">8192</Set>  
      <Set name="responseHeaderSize">8192</Set>  
      <Set name="sendServerVersion">true</Set>  
      <Set name="sendDateHeader">false</Set>  
      <Set name="headerCacheSize">512</Set>  
    </New>  
      
    <Call name="addConnector">  
    <Arg>  
      <New class="org.eclipse.jetty.server.ServerConnector">  
        <Arg name="server"><Ref refid="Server" /></Arg>  
        <Arg name="factories">  
          <Array type="org.eclipse.jetty.server.ConnectionFactory">  
            <Item>  
              <New class="org.eclipse.jetty.server.HttpConnectionFactory">  
                <Arg name="config"><Ref refid="httpConfig" /></Arg>  
              </New>  
            </Item>  
          </Array>  
        </Arg>  
        <Set name="host"><Property name="jetty.host" /></Set>  
        <Set name="port"><Property name="jetty.port" default="8080" /></Set>  
        <Set name="idleTimeout">30000</Set>  
      </New>  
    </Arg>  
  </Call>
  
    <Set name="stopAtShutdown">true</Set>  
    <Set name="stopTimeout">5000</Set>  
    <Set name="dumpAfterStart">false</Set>  
    <Set name="dumpBeforeStop">false</Set>  
  
</Configure>  
```

#### 启动运行
直接在项目目录下执行命令
```bash
mvn jetty:run -e
```
加上`-e`参数 , 如果运行有报错会在控制台打印堆栈信息
之后项目启动成功 , 就可以在浏览器当中根据配置的端口访问了

![maven-jetty-plugin](/images/Java/maven-jetty-plugin.png)


[web_url]: /Java/Maven(2)-搭建web项目/