---
title: Git(2)-基础操作
date: 2017-11-18 08:22:24
tags: 
  - git
  - 版本控制
categories: 
  - Git
---


### 版本库的基础操作

版本库也可以称为`仓库`, 也就是一个目录 , 这个目录里面的所有文件都被Git管理起来 , 每个文件的修改 删除等 , Git都能追踪
<!-- more -->
#### 创建版本库
```bash
#定位到需要创建仓库的目录下执行
git init
```
执行以后就把这个目录变为git可以管理的仓库
该目录下就会多了一个**.git**目录 , 这个目录是git用来追踪管理版本的 , 勿手动修改

#### 添加文件到版本库
```bash
#添加全部暂存区和历史区不存在的或者有更改的.c文件
git add *.c

#添加全部暂存区和历史区不存在或者有更改的文件
git add .

#添加指定文件到版本库
git add test.c
```
使用`git status`可以查看当前版本库的状态
例如
![git status](/images/git/git_status.png)
这个版本库当中有01.txt是已经添加到版本库但是没有提交的新文件 ( 该文件当前的状态就是`staged - 已暂存` )
使用`git rm --cached 01.txt`可以从暂存库当中移除01.txt , 相当于是add的逆操作
02.txt是没有添加到版本库的文件

#### 提交文件
提交操作针对的是暂存区当中的文件 ( 或者说是已暂存状态的文件 )
```bash
#提交暂存区所有的内容到版本库
git commit -a

#提交暂存区中指定的文件到版本库
git commit 01.txt
```
> 提交时可以直接使用-m参数来添加提交的注释
> 例如 `git commit -a -m "我是注释"`
> 如果未添加 , 提交时则会自动调用vi编辑器来编辑提交注释信息
> 也可以修改core.edit来设定喜欢的编辑器

如果提交01.txt完毕以后 , 再次修改了01.txt
![modified](/images/git/git_modified.png)
此时该文件的状态就是`modified - 已修改`
使用`git add`可以将其添加到暂存区

#### 比较差异
`git diff`命令用于比较指定文件的差异
```bash
#查看所有有变动的文件
git diff

#查看指定文件的变动
git diff 01.txt

#查看暂存区中文件的变动
git diff --staged
```
![git diff](/images/git/git_diff.png)

#### 查看提交历史记录

使用`git log`可以按照提交时间列出所有的提交
```bash
#仅显示最近x次的提交 git log -x
git log -2 #查看最近2次的提交

#简略显示每次提交的内容变动
git log --stat

# --pretty对展示内容进行格式化
git log --pretty=oneline #在一行内仅显示每次提交的hash码与注释

#自定义格式化
git log --pretty=format:"%h - %an,%ar : %s"
```
format当中的占位符含义

| 选项 | 说明 |
|----|-----|
|%H|提交对象（commit）的完整哈希字串|
|%h|提交对象的简短哈希字串|
|%T|树对象（tree）的完整哈希字串|
|%t|树对象的简短哈希字串|
|%P|父对象（parent）的完整哈希字串|
|%p|父对象的简短哈希字串|
|%an|作者（author）的名字|
|%ae|作者的电子邮件地址|
|%ad|作者修订日期（可以用 –date= 选项定制格式）|
|%ar|作者修订日期，按多久以前的方式显示|
|%cn|提交者(committer)的名字|
|%ce|提交者的电子邮件地址|
|%cd|提交日期|
|%cr|提交日期，按多久以前的方式显示|
|%s|提交说明|

#### 撤销操作
##### 重新提交
如果执行`git commit`之后发现了漏掉了一个文件 , 再进行一次提交又显得多余
这时候可以使用**amend**进行重新提交
```bash
git commit --amend
```
##### 取消暂存
执行了git add 之后 , 如果要进行撤销
( 与git rm作用类似 )
```bash
git reset HEAD 03.txt
```
但是reset还可以对已提交的内容进行版本的回退
```bash
#回退当上一个版本
git reset --hard HEAD^
```
> 如果要回退当上上个版本就是HEAD^^
也可以使用简便写法`git reset --hard HEAD~100`表示回退到100个版本之前

此时执行了回退 , 我们发现最后一次提交所做的修改已经没有了
如果还想找回来 , 可以执行`git reflog`来查看操作记录 , 找到最后一次提交的版本号
![git reflog](/images/git/git_reflog.png)
执行以后发现是8725f93
于是执行`git reset --hard 8725F93`
即可再次恢复到最新版本

##### 撤销修改
当文件被修改 , 但还没有git add到暂存区 ( 或者从暂存区当中撤销回到工作区也一样 )
```bash
git checkout -- filename
```
> 注意 : 该操作会导致修改彻底丢失 , 无法恢复
