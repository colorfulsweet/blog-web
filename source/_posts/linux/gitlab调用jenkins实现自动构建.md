---
title: gitlab调用jenkins实现自动构建
date: 2019-03-31 13:01:42
tags: 
  - linux
  - jenkins
categories: 
  - linux
---
gitlab本身支持**webhook**功能, 也就是在代码托管的一些生命周期内
在指定阶段执行若干回调
利用这一点, 我们就可以在push操作的时候, 直接触发jenkins任务构建
从而实现自动化构建
<!-- more -->

操作步骤
### 1.安装插件
首先需要在jenkins里面安装`GitLab Plugin`
![GitLab插件](/images/linux/jenkins/gitlab插件.png)
简介里面也有说明, 这个插件允许GitLab去触发jenkins构建

### 2.生成API Token
登陆gitlab, 进入个人设置, 生成Access Token
![Access Token](/images/linux/jenkins/API_Token.png)
生成之后记下这个token
(这个token只在这里显示一次, 之后无法查到)

### 3.添加凭据
回到jenkins当中, 添加凭据
![添加凭据](/images/linux/jenkins/添加凭据.png)
类型选择`GitLab API token` ( 如果第1步中的插件正确安装就会有这一项, 如果没有可以检查一下插件情况 )
API token粘贴从第2步中获得的token
ID可以不写, 描述自定

### 4.系统设置
之后进入系统设置, 配置gitlab连接
![gitlab连接设置](/images/linux/jenkins/gitlab连接设置.png)
这里的gitlab地址我使用的是官方的地址, 如果是自己搭建的gitlab环境, 写自己的地址即可
下面的凭据就选第3步当中添加的

之后可以执行一下 Test Connection, 显示SUCCESS则表示token无误, 可以使用

### 5.配置任务
对要进行触发构建的任务进行配置
在**构建触发器**一栏勾选`Build when a change is pushed to GitLab`
详细勾选项如下, 大部分都是默认的
![构建触发器](/images/linux/jenkins/构建触发器.png)
这里可以拿到一个`webhook URL`, 记下来
下方可以点击Generate生成一个`Secret token`, 记下来

Allowed branches可以设定哪个分支的代码推送可以触发构建, 也可以是所有分支都触发

### 6.设置webhook
回到gitlab, 设置仓库级的webhook
进入到需要触发构建的仓库
![设置webhook](/images/linux/jenkins/设置webhook.png)
这里的URL和Secret Token, 分别填入在第5步当中获得的`webhook URL`和`Secret token`
下面默认勾选的是push event, 也就是在推送提交到仓库的时候触发, 正好符合我们的需求

下面有Enable SSL verification, 如果jenkins所在的地址添加了合法的ssl可以勾选这项, 否则就不必勾选
之后`Add webhook`即可

### 7.验证
至此已经配置完成, 我们可以尝试提交代码到第6步中设置的仓库里
之后到jenkins里面, 可以看到该任务已经自动触发了构建
![验证](/images/linux/jenkins/验证.png)