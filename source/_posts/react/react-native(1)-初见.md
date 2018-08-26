---
title: react-native(1)-初见
date: 2018-8-13 02:31:01
tags: 
  - react native
categories: 
  - react
---
`React Native`是Facebook开源的跨平台移动应用开发框架，是Facebook早先开源的JS框架React在原生移动应用平台的衍生产物，目前支持iOS和安卓两大平台
React Native 使用Javascript语言，类似于HTML的JSX，以及CSS来开发移动应用
因此对于web前端比较熟悉的可以快速上手
同时相比于Hybrid混合开发模式, 并不完全脱离原生开发
从而对于一些在混合模式当中难以解决的设备兼容问题、系统UI改造问题等等, 都可以借助原生开发来解决
更加快速方便地去构建原生APP

<!-- more -->
### 环境搭建
#### 安装react-native-cli
这是一个构建react-native项目的脚手架工具
确保正确安装nodejs之后
可以全局安装这个脚手架工具
```bash
npm install -g react-native-cli
```
#### android-studio
由于react-native项目需要在安卓模拟器当中运行
首先需要 [下载](http://www.android-studio.org/) 安装android-stdio

##### 安装sdk
如果没有安装sdk需要先安装
![安装SDK](/images/react/android_sdk.png)
##### 安装HAXM
![安装HAXM](/images/react/HAXM_install.png)
> 需要确保windows功能当中的Hyper-V没有开启
![Hyper-V不能开启](/images/react/Hyper-V不能开启.png)

##### 创建安卓模拟器
![创建安卓模拟器](/images/react/Android_Virtual_Device.png)

##### 启动安卓模拟器
我们可以直接在android studio里面运行这个刚才创建好的模拟器
也可以在命令行运行
在安装sdk的目录下, 会有一个emulator目录
模拟器的运行程序就在这个目录当中
定位到这个目录
然后执行`emulator -list-avds`可以看到上一步当中创建好的安卓模拟器
可以用`emulator -avd Nexus_6_API_24 -gpu off`来运行它
![启动安卓模拟器](/images/react/启动安卓模拟器.png)
成功运行
![安卓模拟器](/images/react/安卓模拟器.png)
> 比较推荐命令行运行的方式
可以直观看到错误信息
开始的时候缺少HAXM, 以及不能开启Hyper-V 都是从命令行提示信息看到的

### Hello World
首先用react-native-cli来初始化一个项目
```bash
react-native init AwesomeProject
cd AwesomeProject
# 在开启安卓模拟器之后, 可以运行这个项目
react-native run-android
```
启动之后首先会在8081端口启动一个进程, 用于向模拟器当中同步代码
![run-android](/images/react/run-android.png)