---
title: Git(4) - 远程仓库
date: 2018-4-19 00:20:13
tags: 
	- git
	- 版本控制
categories: 
	- Git
---

在多人的协作开发当中 , 我们需要一个公共的远程库 , 每个人都可以从远程库把项目clone到自己的电脑上进行开发 , 之后把自己编写的代码推送到远程库
完全可以自己搭建一台运行的Git服务器 , 或者利用GitHub这种公共的Git托管服务
<!-- more -->
这里用[GitLab](https://gitlab.com/)来进行测试

#### 创建SSH key
由于本地和远程仓库之间的传输是通过SSH加密的 ( 这个取决于Git托管服务本身的架构 , 如果不是的话可以跳过这个步骤 )
```bash
ssh-keygen -t rsa -C "email地址"
```
执行完成后在本地的用户主目录里面找到`.ssh`目录 , 里面有`id_rsa`和 `id_rsa.public`
前一个是密钥 , 后一个是公钥
把公钥的内容添加到自己账号的SSH keys的设置当中
![gitlab ssh](/images/git/gitlab_ssh.png)
Title是自己看的  随便写即可

#### 添加远程库
在GitLab上创建一个名为git_learn的远程库
我的账号对应的SSH链接就是`git@gitlab.com:sookie/git_learn.git`
在本地的git仓库里面执行
```bash
#添加远程库
git remote add origin git@gitlab.com:sookie/git_learn.git
```
origin是本地仓库中给这个远程库起的名字
一个本地仓库可以对应多个远程库

然后就可以把本地库的所有内容推送到远程库上
```bash
#把master分支推送到名为origin的远程库
git push -u origin master
```
第一次推送的时候需要加`-u`参数
之后只需要执行`git push origin master`即可

#### 克隆远程库
如果需要从一个远程库克隆出一个本地库
需要使用
```bash
git clone git@gitlab.com:sookie/git_learn.git
```
如果有多个人协作开发，那么每个人各自从远程克隆一份就可以了。
> 对于远程库的地址 , 还有`https://gitlab.com/sookie/git_learn.git`这样的地址
> 这是由于Git支持多种协议
> 如果服务器只开放了http端口 ,  那么就不能使用ssh协议而只能用https
> 原生的git协议速度比较快
