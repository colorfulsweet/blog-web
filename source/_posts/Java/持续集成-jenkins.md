---
title: 持续集成-jenkins
date: 2018-11-7 10:08:13
categories: 
  - Java
tags:
  - 持续集成
---
Jenkins是一款由Java编写的开源的**持续集成**工具
持续集成是用于解决频繁迭代带来的运维方面的工作, 使这些工作可以使用脚本自动完成
包括拉取代码更新、编译打包、部署运行等

<!-- more -->

### 环境搭建
#### 使用war包
可以从[官网](https://jenkins.io/)下载war包
执行
```bash
java -jar jenkins.war
```
默认在8080端口运行
运行之后访问可以进行初始化操作
输入首次运行时生成的初始化密码
![初始化密码](/images/Java/jenkins/init_password.jpg)
之后安装推荐插件, 设定管理员用户名和密码, 即可开始使用

#### 使用Docker镜像
```bash
# 拉取镜像
docker pull jenkins/jenkins:lts

# 运行容器
docker run -d -p 8080:8080 --name jenkins jenkins/jenkins:lts
```
之后`docker logs [containerId]`查看容器的运行日志可以看到初始化密码
初始化的操作同上

### 创建远程节点
初始化完毕之后, 已经有一个默认节点, 是jenkins程序运行所在的主机
如果要对其他主机进行远程操作, 则需要创建节点

系统管理 → 节点管理 → 新建节点
配置新节点的信息

![初始化密码](/images/Java/jenkins/配置远程节点.jpg)
这里使用SSH连接, 并且设定用户名和密码

### 创建任务
首页点击`新建任务`
勾选**限制项目的运行节点**, 并且输入刚才创建的节点名称
![限制项目的运行节点](/images/Java/jenkins/限制项目的运行节点.jpg)

源码管理当中设定远程仓库的地址
(如果是私有仓库需要设置凭据)
![源码管理](/images/Java/jenkins/源码管理.jpg)

编写构建shell
```bash
# BUILD_ID设定后可以保持server进程持续运行
BUILD_ID=DONTKILLME

export TOMCAT_PATH=/root/apache-tomcat-9.0.12

bash /root/deploy.sh
```
### 编写deploy.sh
上面的构建脚本当中执行的是deploy.sh
我们需要在这个脚本当中编写停止tomcat进程 maven打包 拷贝程序包 启动tomcat这些步骤
```bash
#!/bin/bash
#编译+部署
# 输入你的环境上tomcat的全路径
# export TOMCAT_PATH=tomcat在部署机器上的路径

### base 函数
killTomcat()
{
    pid=`ps -ef|grep tomcat|grep java|awk '{print $2}'`
    echo "tomcat Id list :$pid"
    if [ "$pid" = "" ]
    then
      echo "no tomcat pid alive"
    else
      kill -9 $pid
    fi
}
mvn clean package

# 停tomcat进程
killTomcat

# 删除原有工程
rm -rf $TOMCAT_PATH/webapps/ROOT
rm -f $TOMCAT_PATH/webapps/ROOT.war
rm -f $TOMCAT_PATH/webapps/order.war

# 复制新的工程
cp ./target/order.war $TOMCAT_PATH/webapps/
# 重命名
mv $TOMCAT_PATH/webapps/order.war $TOMCAT_PATH/webapps/ROOT.war

# 启动Tomcat
sh $TOMCAT_PATH/bin/startup.sh
```

之后执行`立即构建`
