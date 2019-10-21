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
<!-- more -->
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

### 创建flutter项目
当Android Studio的flutter插件安装无误之后，就可以创建flutter项目了
![创建flutter项目](/images/flutter/创建flutter项目.png)

新建的是一个flutter的demo项目
包含一个标题栏，一个按钮，和中间区域内的若干文字
点击按钮时进行计数，文字会相应变化
![flutter demo](/images/flutter/flutter_demo.png)

项目当中包含一个main.dart文件
内容如下
```dart
// 引入material样式
import 'package:flutter/material.dart';
// 程序运行入口
void main() => runApp(MyApp());

// App实体类
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // 主题样式
        primarySwatch: Colors.blue,
      ),
      // 首页对象以及首页的标题
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() { // 计数方法
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // 标题栏
        title: Text(widget.title),
      ),
      body: Center( // 居中元素
        // 子元素
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text( 
              'You have pushed the button this many times:',
            ),
            Text( // 文字元素以及样式
              '$_counter',
              style: Theme.of(context).textTheme.display1,
            ),
          ],
        ),
      ),
      // 浮动按钮
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter, // 点击事件
        tooltip: 'Increment',
        child: Icon(Icons.add), // 子元素是一个图标
      ),
    );
  }
}
```
以上代码当中构建对象都省略了new关键字
其中的每个对象都是一个组件（Widget）

### 常用组件
组件以及组件的一些属性，基本算是前端html和css的思想

#### Text组件
这是一个文本组件，可以用于在App当中显示文字
```dart
Text(
  '这是一段文字',
  textAlign: TextAlign.left, // 文本对齐方式(左对齐)
  maxLines: 3, // 最大显示行数
  overflow: TextOverflow.ellipsis, // 文本长度溢出的处理方式(显示为...)
  style: TextStyle(
    color: Color.fromARGB(255, 20, 130, 40), // 文字颜色
    fontSize: 20, // 字号大小
    decoration: TextDecoration.underline, // 下划线
    decorationStyle: TextDecorationStyle.solid // 下划线类型
  )
)
```