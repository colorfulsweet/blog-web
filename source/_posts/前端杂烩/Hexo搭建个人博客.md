---
title: Hexo搭建个人博客
date: 2018-1-9 09:43:01
tags: 
  - Hexo
categories: 
  - 前端杂烩
---

> Hexo 是一个快速、简洁且高效的博客框架，需要nodejs环境运行
使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可生成静态网页。

<!-- more -->
### 安装nodejs
由于hexo是使用JavaScript编写
所以首先需要nodejs环境 , 可以在官网下载运行包, 或者下载源代码在linux下编译

### 安装脚手架工具与初始化
```bash
npm install -g hexo-cli
hexo init my_blog
```
这是hexo官方提供的脚手架工具 , 可以实现快速生成一个博客模板
其中的`_config.yml`是博客的基础配置文件

### 启动服务
服务默认在4000端口启动 , 如果要修改启动端口 , 需要在`config.yml`当中添加
```yml
server:
  port: 6603
  compress: true
  header: true
```
启动服务
```bash
hexo server
```
![hexo server](/images/前端杂烩/hexo_server.png)
之后就可以用浏览器访问了

### 编写文章
Hexo 有三种默认布局：post、page 和 draft，它们分别对应不同的路径

| 布局 | 路径 |
|----|-----|
|post|source/_posts|
|page|source|
|draft|source/_drafts|

博客目录初始化完成之后 , 其中的source就是文章目录
我们可以直接在其中创建文件 , `_posts`里面就是正式提交的文章
实际访问的路径可以在_config.yml当中的`permalink`定义
可以有下列值

| 变量 | 描述 |
| -- | -- |
| :title | 标题（小写，空格将会被替换为短杠） |
| :year | 建立的年份，比如， 2015 |
| :month | 建立的月份（有前导零），比如， 04 |
| :i_month | 建立的月份（无前导零），比如， 4 |
| :day | 建立的日期（有前导零），比如， 07 |
| :i_day | 建立的日期（无前导零），比如， 7 |

创建一篇新文章
```bash
hexo new [layout] <title>
#比如
hexo new post 测试文章
```
执行之后会自动在_posts下面创建一个新文件`测试文章.md`
> 这里的操作只是创建一个文件 , 我们当然也可以手动创建文件

这里实际是使用`scaffolds`里面的`post.md`模板来创建文件的
我们可以修改这个模板的内容 , 或者创建自定义的布局模板


#### 自定义页面
可以在source当中创建一个目录作为自定义的目录
比如创建一个about目录 , 其中写一个`index.md`文件
实际访问的路径就是`http://localhost:4000/about/`

#### 图片引用
可以把图片直接放在source下面的某个目录当中
比如有图片`source/image/test.png`
就可以在md文件中这样引用
```markdown
![test](/images/test.png)
```
在实际访问的时候就能产生正确的图片访问路径

#### 标签与分类
在每篇文章开头的描述信息当中 , 除了标题 日期之外 , 可以指定该文章的分类和标签 ( 注意开头不能有空行 )
```yml
---
title: 测试文章
date: 2018-5-9 09:43:01
tags: 
  - 标签1
  - 标签2
categories: 
  - 分类1
  - 子分类
---
```
hexo不支持多个同级分类 , 分类当中若有多项会被处理成子分类

### 主题
hexo支持自定义主题 , 官方有很多开源的主题
可以直接放在`themes`目录下
然后在_config.yml当中修改`theme`为对应的名称即可