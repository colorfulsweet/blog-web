---
title: Flutter动态列表
date: 2019-11-06 20:59:37
tags: 
  - flutter
  - dart
categories: 
  - flutter
---

ListView提供了`ListView.builder`构造方法用来动态构建列表
<!-- more -->

```dart
class MyList extends StatelessWidget {
  final List<String> items;
  MyList({@required this.items});
  @override
  Widget build(BuildContext context) {
    return Container(child:
      ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) {
          return ListTile(title: Text(items[index]));
        }
      ),
    );
  }
}
```
`@required`注解表示该参数是必须要传的
这里创建一个List&lt;String&gt;类型的属性来存放数据

调用时可以使用`List.generate`这个List的命名构造方法来快速创建一个列表
比如
```dart
List<String>.generate(100, (index) => 'item $index')
```

### 网格布局
网格布局需要使用`GridView`组件，类似于css当中的grid布局方式
```dart
GridView.builder(
  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 4, // 横轴元素数量
    mainAxisSpacing: 5, // 纵轴间距
    crossAxisSpacing: 10 // 横轴间距
  ),
  itemBuilder: (context, index){
    return Text(this.items[index]);
  },
  itemCount: this.items.length,
),
```
可以得到一个网格布局
![GridView](/images/flutter/GridView.png)
`SliverGridDelegateWithFixedCrossAxisCount`其实就是固定横轴元素数量的布局方式
crossAxisCount是其必传参数
还有一种是指定列宽度根据容器大小自适应的布局`SliverGridDelegateWithMaxCrossAxisExtent`
maxCrossAxisExtent是其必传参数

### 交互操作
处理手势可以使用`GestureDetector`组件，它是可以添加手势的一个widget
其中包含所有的交互方式，比如触碰 长按 滑动等等
这个组件当中包含的子组件就可以响应该组件上定义的交互事件
```dart
GestureDetector(
  onTap: (){
    print('onTap');
  },
  child: Container(
    height: 100,
    width: 200,
    color: Colors.pinkAccent,
  ),
)
```
这样点击这个Container元素的时候，就可以执行指定的函数


### 接口调用
Flutter项目当中根目录下有一个`pubspec.yaml`文件，是对该项目的描述，以及一些依赖的引入
类似于nodejs项目的package.json文件的作用

dart的第三方模块可以到[Dart Package](https://pub.dev/)搜索
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^0.12.0+2 # 加入http模块的引入
  # The following adds the Cupertino Icons font to your application.
  # Use with the CupertinoIcons class for iOS style icons.
  cupertino_icons: ^0.1.2
```
之后可以在代码当中使用该模块
```dart
import 'package:http/http.dart' as http;

void httpGet(Function callback, [Function errCallback]) async {
  try {
    http.Response response = await http.get('https://www.example.com/');
    if(callback != null) {
      callback(response.body);
    }
  } catch (err) {
    if(errCallback != null) {
      errCallback(err);
    }
  }
}
```
**http.get** 返回的是一个Future&lt;String&gt;
dart语言的执行本身也是单线程的，与js非常类似
所以也需要进行异步回调，内部包含await的函数需要声明为async
post的调用方式如下
```dart
http.Response res = await http.post(url, body: params);
```
