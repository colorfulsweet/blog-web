---
title: Flutter踩坑记录
date: 2019-11-30 22:31:53
tags: 
  - flutter
  - dart
categories: 
  - flutter
---

### 数据绑定
使用`setState`方法对底层数据进行修改并且动态渲染视图
比如需要从接口获取数据显示到页面当中
<!-- more -->

```dart
Response response = await http.get('common/items');
setState((){
  this.loading = false;
  this.items = response.data;
});
```
采用这种方式进行赋值才可以执行动态绑定
否则不会进行视图的重新渲染
该方法继承自抽象类`State`

### 获取屏幕的尺寸
```dart
final Size screenSize = MediaQuery.of(context).size;
```
Size对象当中包含width和height属性，可以用于根据屏幕的高度控制控件的大小

### 下拉刷新与滚动更新
下拉刷新直接使用`RefreshIndicator`控件包装
当滚动到顶部并且进行下滑动作时就可以执行指定方法
```dart
RefreshIndicator(
  onRefresh: (){
    return http.get('common/photos').then((response) {
      setState((){
        this.loading = false;
        this.items = response.data
      });
    });
  },
  child: Container(/*省略内部子组件代码*/),
),
```
需要注意的是`onRefresh`函数的返回值必须是`Future<void>`类型，用于执行异步回调

**滚动更新**需要给组件绑定`ScrollController`
并且在组件初始化时绑定滚动监听
```dart
// 滚动控制器
ScrollController _scrollController = ScrollController();

ListView(
  controller: this._scrollController,
),
// 省略其他代码...

@override
void initState() {
  super.initState();
  _scrollController.addListener(() { // 绑定滚动监听事件
    if (_scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
      // TODO 滚动到底部需要执行的操作
    }
  });
}
```

### 区分开发环境与生产环境
```dart
bool.fromEnvironment('dart.vm.product');
```
true代表是生产环境，false代表开发环境

### 弹性布局
Flutter也实现了类似于CSS当中的flex弹性容器布局
可以按照比例分配子元素的宽度或高度
```dart
Flex(children: <Widget>[
  Expanded(
    flex: 1,
    child:Text('内容', style: TextStyle(fontSize: 18), textAlign: TextAlign.center)
  ),
  Expanded(
    flex: 4,
    child: TextFormField(
      validator: (v) {
        return v.trim().isNotEmpty ? null : '必须输入内容';
      },
      onChanged: (value) {
        this.fromData['content'] = value;
      },
    ),
  )
],
direction: Axis.horizontal
)
```
这是一个常规的表单项的结构，分为一个标题和一个输入框
并且指定子元素排列方向为横向
两者的宽度之比为1:4

