---
title: Flutter初见
date: 2019-10-21 22:38:25
tags: 
  - flutter
  - dart
categories: 
  - flutter
---

### 搭建开发环境
1. 下载解压Flutter的sdk，并且将其中的bin目录配置到环境变量
2. Android Studio安装安卓SDK，通常启动时如果未安装过都会自动执行下载安装
3. Android Studio安装Flutter的插件
![Android Studio flutter插件](/images/flutter/android-studio_flutter插件.png)
安装flutter插件时会自动安装其依赖的dart插件
4. 在Android Studio的`AVD Manager`当中创建模拟器（需要选择屏幕尺寸以及安卓系统版本，当前系统中不存在的版本需要下载）
如果使用真机调试运行，该步骤可以跳过


执行`flutter doctor`可以检验当前环境当中存在的问题
![flutter doctor](/images/flutter/flutter_doctor.png)
可以看到IDEA也是支持的，但是我们不打算使用IDEA来进行开发，所以就不在IDEA当中安装插件了
No devices available代表还未启动虚拟机或者连接真机
其余几项都是校验通过的

