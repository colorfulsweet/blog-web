---
title: Git(3)-分支
date: 2018-4-18 09:20:13
tags: 
	- git
	- 版本控制
categories: 
	- Git
---

### 分支操作
在git当中 , 对于每次提交 , git都把他们串成一条时间线
这条时间线就是一个分支 , 默认只有master这一条主分支
HEAD相当于是一个指针 , 指向的是当前操作的分支
<!-- more -->
```bash
#创建分支dev
git branch dev

#切换到分支dev
git checkout dev

git checkout -b dev #相当于同时执行上面两条命令
#创建并切换到该分支

#查看分支
git branch

#合并分支dev到当前分支
git merge dev

#删除分支dev
git branch -d dev
```
通常在参与一个多人开发的项目时 , 需要创建一个分支进行开发 , 完成后把这个分支合并到主分支
![git merge](/images/git/git_merge.png)
这里代表合并成功

#### 解决冲突
如果不同的分支当中对同一个文件进行了修改 , 那么就会产生冲突 , 导致无法直接合并
![分支冲突](/images/git/分支冲突.png)
这里提示的信息是03.txt文件在合并时产生了冲突
查看03.txt文件可以发现
![冲突代码](/images/git/冲突代码.png)

这时候就需要手动去解决冲突
修改03.txt文件之后
在master分支当中执行 ( 此时因为处于处理分支合并冲突的过程当中 , 所以并不能切换分支 )
```bash
git add 03.txt
git commit -a -m "resolve conflict 03"
```
此时 , 这次的分支合并才算完成
子分支当中的修改内容并没有受到影响
