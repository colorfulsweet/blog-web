---
title: Hexo服务器静态化部署
date: 2018-7-2 14:52:16
tags: 
  - Hexo
categories: 
  - 前端杂烩
---

hexo自带静态化发布功能, 可以发布到github pages等第三方提供的静态站点服务
<!-- more -->
### 发布在github pages
#### 安装hexo-deployer-git
首先需要在博客项目目录当中安装`hexo-deployer-git`
```
npm install hexo-deployer-git --save-dev
```
#### 创建github仓库
仓库的名字必须是`[github用户名].github.io`
比如我的github用户名是sookie2010
那么就应该创建名为 **sookie2010.github.io** 的仓库

#### 添加配置项
在`_config.yml`当中配置
```yaml
deploy:
  type: git
  repo: git@github.com:[github用户名]/[github用户名].github.io.git
  branch: master
```
比如我的github用户名是sookie2010
那么repo就是 ` git@github.com:sookie2010/sookie2010.github.io.git`

#### 静态化与发布
```bash
# 清空之前生成过的静态化页面
hexo clean

# 生成静态化页面
hexo generate
# 或者 hexo g

# 发布到git远程仓库
hexo deploy
# 或者 hexo d
```
> + 如果出现错误, 可以尝试手动删除`.git_deploy`, `public`, `db.json`
然后重新执行生成和发布操作
+ 如果发布过程提示出现 **Permission denied**
可以对git远程仓库尝试换用https协议
也就是`https://github.com/[github用户名]/[github用户名].github.io.git`

#### 尝试访问
地址是`https://[github用户名].github.io`


### 在自己服务器上静态化部署
上述方式是将静态化之后的代码托管在github pages, 如果要在自己的服务器上实现静态化的部署
那么就需要在服务器上创建一个git的远程仓库

#### 创建裸仓库
```bash
mkdir /git-repo && cd /git-repo
git init --bare blog.git
```
创建的裸仓库名称是blog.git

然后还需要创建一个存放静态页面文件的根目录
```
mkdir -p /www/website
```

#### 编写git hooks
git钩子简单来说就是能在特定的重要动作发生时触发自定义脚本
类似于回调
现在我们需要在提交代码到这个裸仓库的时候触发我们自定义的脚本
```bash
cd hooks
vim post-update
# 内容如下

#!/bin/sh
git --work-tree=/www/website --git-dir=/git-repo/blog.git checkout -f
```
每次这个裸仓库收到 git 更新时会把文件更新到 worktree

#### 创建用户与授权
为了安全起见, 最好是给git提交操作创建单独的linux用户
```bash
# 创建用户
adduser git
# 设置密码(有些linux发行版本会在创建用户时要求设置密码, 则该步骤可跳过)
passwd git

# 相关目录的授权
chown -R git:git /git-repo
chmod 755 /git-repo

chown -R git:git /www/website
chmod 755 /www/website
```
为了安全起见, 最好是限制用户git的shell登录权限, 只能通过git-shell登录
需要修改`/etc/passwd`文件
将
```
git:x:1001:1001::/home/git:/bin/bash
```
修改为
```
git:x:1001:1001::/home/git:/usr/bin/git-shell
```
#### 修改配置文件
现在可以把`_config.yml`当中的远程仓库地址修改为自己服务器上的仓库地址了
```yaml
deploy:
  type: git
  repo: git@[服务器IP]:/git-repo/blog.git
  branch: master
```
> 注意 : 
+ 如果服务器上sshd进程所在的端口不是22
那么需要这样写`ssh://git@[服务器IP]:[端口号]/git-repo/blog.git`
+ @前面的git实际上就是刚才创建的用户名, 如果使用其他用户名, 这里需要与之对应

#### 静态化与发布
与上面发布到github pages要执行的命令完全相同
```bash
hexo clean && hexo g && hexo d
```
但是在windows环境当中最好在git bash当中执行, 而不要在windows自己的cmd中执行
执行时应该会出现输入密码提示框

![输入git用户的密码](/images/前端杂烩/git_password.jpg)

### 启动web服务器
因为是静态页面, 所以部署就十分简单了, 使用nginx或者apache都可以
将站点的根目录设置为`/www/website`即可

在nginx当中就是
```
location / {
  root  /www/website;
  index  index.html index.htm;
}
```
在apache当中就是
```
DocumentRoot "/www/website"
```