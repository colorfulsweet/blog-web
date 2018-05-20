---
title: expect-交互式命令行自动化执行
date: 2018-1-14 10:45:12
tags: 
  - linux
categories: 
  - linux
---
linux当中存在很多交互式的命令行
简单来说就是执行过程中需要等待用户的输入 , 获得输入内容后继续执行
这种情况下我们可以借助`expect`来实现自动化执行这些命令

> 直接重定向输入流多数情况下是不行的
因为它会将需要输入的内容一次性全部输入 , 而无法做到多次的交互

<!-- more -->
expect本身是一个shell脚本的解释器 , 与bash属于同一类东西
所以我们可以在脚本开头添加
```bash
#!/usr/bin/expect
```
来指定使用该解释器来执行这个脚本 , 运行脚本直接`./test.sh`即可
当然也可以执行`expect test.sh`

#### 安装
```bash
yum install expect.x86_64
```

#### 编写脚本
使用`npm init`初始化项目的时候
需要多次输入项目的相关基本信息 , 这里就用它来做示例
```bash
#!/usr/bin/expect
set timeout -1

cd /root/pro_test
spawn /usr/local/nodejs/bin/npm init
expect "package name:*"
send "\n"
expect "version:*"
send "\n"
expect "description:*"
send "这里是项目的描述信息\n"
expect "entry point:*"
send "main.js\n"
expect "test command:*"
send "\n"
expect "git repository:*"
send "\n"
expect "keywords:*"
send "key1 key2\n"
expect "author:*"
send "Sookie\n"
expect "license:*"
send "MIT\n"
expect "Is this ok?*"
send "yes\n"

expect eof
```
说明:
+ `spawn`和`send`命令是只有在expect解释器当中才有的 , 所以该脚本必须用expect解释执行
+ `spawn`表示启动一个新的进程
+ `expect "xxx"`表示识别的进程输出( 可以使用通配符 )
+ 注意在输入内容的末尾加`\n`

#### interact
如果我们需要让用户在适当的时候手动干预这个过程
就需要执行`interact`
例如
```bash
spawn ftp ftp.test.com
expect "Name"
send "user\n"
expect "Password:"
send "123456\n"
interact
```
下载完ftp文件时，仍然可以停留在ftp命令行状态，以便手动的执行后续命令

#### timeout
执行`set timeout`可以设置等待进行输出信息的超时时间
单位是秒 , 默认是10秒
如果超过了这个时间还未能匹配到输出内容 , 则会跳过这个expect语句继续向下执行
-1则表示没有超时时间 , 也就是未匹配到输出内容会一直等待

#### 多分支模式
有时候程序的输出可能有多种分支路线
所以我们的自动化脚本也不能简单地进行单线匹配
expect还支持多分支模式语法
```bash
expect {
  "hi" { send "You said hi\n" }
  "hello" { 
    send "Hello yourself\n"
    expect {
      "Nice to meet you" { send "Nice to meet you too!" }
      "How is it going" { send "It's good, thank you." }
    }
  }
  "bye" { send "See you\n" }
}
```