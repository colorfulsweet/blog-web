---
title: Flutter路由
date: 2019-11-10 10:06:41
tags: 
  - flutter
  - dart
categories: 
  - flutter
---

使用`MaterialPageRoute`也就是页面路由，可以实现不同Widget之间的跳转
页面只是一个全屏的Widget

<!-- more -->
先写好另一个页面的Widget
```dart
class DetailPage extends StatefulWidget {
  DetailPage({Key key, this.title}) : super(key: key);
  final String title;
  @override
  _DetailPageState createState() => _DetailPageState();
}

class _DetailPageState extends State<DetailPage> {
  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Text('这里是另一个页面')
    );
  }
}
```
简单的页面跳转
```dart
Navigator.push(context, MaterialPageRoute(builder: (_){
  return DetailPage(title: 'detail page');
}));
```
既然是push，那么就是个栈模型了，跳转到另一个页面相当于入栈
如果要返回到上一级页面可以这样做，pop相当于是出栈
```dart
Navigator.pop(context);
```
### 命名路由
可以在MaterialApp当中传入routes参数，该参数是一个Map对象
key是路由名称，value是返回组件对象的函数
```dart
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.brown,
      ),
      routes: {
        '/' : (context) => MyHomePage(title: 'Flutter Demo Home Page'),
        '/detail' : (context) => DetailPage(title: 'detail page')
      },
      initialRoute: '/',
    );
  }
}
```
> 通常的习惯当然是把routes这部分封装在一个单独的模块当中引入使用

命名路由的跳转
```dart
Navigator.pushNamed(context, '/detail');
```
这种方式不需要反复构建和销毁组件对象，相对来讲是更好的一种方式

### 路由传参
基本的**Navigator.push**的方式是构建组件，当然可以给组件的构造方法传入参数，比如上面传入的title
这个就不需要特别的传参方式了，如果使用命名路由跳转
可以传入第三个可选参数arguments
```dart
Navigator.pushNamed(context, '/detail', arguments: {'id': 1001});
```
arguments可以是任意的Object

接收参数方式
```dart
ModalRoute.of(context).settings.arguments
```
当然不论传入的是什么，此时获取到的还是Object类型，需要使用`as Map<String, int>`(取决于传入的类型而执行的类型推导)
进行强制类型转换


### 组件之间的共享状态
除了组件之间的传参，以及路由的传参之外，组件之间通常需要有一些状态需要共享
比如一个常见的需求是用户登录之后，在每个页面上都能看到当前登录的用户是什么名字

需要使用到的是`provider`这个第三方模块

先定义Model
```dart
// user.dart
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
    User({this.username, this.createdAt, this.updatedAt});

    String username;
    String createdAt;
    String updatedAt;
    
    factory User.fromJson(Map<String,dynamic> json) => _$UserFromJson(json);
    Map<String, dynamic> toJson() => _$UserToJson(this);
}
```
还有
```dart
// user.g.dart
part of 'user.dart';

User _$UserFromJson(Map<String, dynamic> json) {
  return User(
    username: json['username'] as String,
    createdAt: json['createdAt'] as String,
    updatedAt: json['updatedAt'] as String,
  );
}

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
  'username': instance.username,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};
```
为了能够在启动时读取上次运行的缓存
需要使用`shared_preferences`这个第三方模块

定义全局对象
```dart
// global.dart
class Global {
  static SharedPreferences _prefs;
  static Profile profile = Profile();

  // 是否为release版
  static bool get isRelease => bool.fromEnvironment("dart.vm.product");

  //初始化全局信息，会在APP启动时执行
  static Future init() async {
    _prefs = await SharedPreferences.getInstance();
    var _profile = _prefs.getString("profile");
    if (_profile != null) {
      try {
        profile = Profile.fromJson(jsonDecode(_profile));
      } catch (e) {
        print(e);
      }
    }

    // 如果没有缓存策略，设置默认缓存策略
    profile.cache = profile.cache ?? CacheConfig()
      ..enable = true
      ..maxAge = 3600
      ..maxCount = 100;
  }

  // 持久化Profile信息
  static saveProfile() =>
      _prefs.setString("profile", jsonEncode(profile.toJson()));
}

// profile.dart
@JsonSerializable()
class Profile {
  Profile({this.user, this.token, this.theme, this.cache, this.lastLogin,
      this.locale});

  User user;
  String token;
  CacheConfig cache;
  String lastLogin;
  String locale;
  
  factory Profile.fromJson(Map<String,dynamic> json) => _$ProfileFromJson(json);
  Map<String, dynamic> toJson() => _$ProfileToJson(this);
}
```
profile当中可以持有User对象
这种情况下就需要在应用启动时就初始化Global对象
```dart
void main() => Global.init().then((e) => runApp(MyApp()));
```
自定义Notifier
```dart
class ProfileChangeNotifier extends ChangeNotifier {
  Profile get _profile => Global.profile;

  @override
  void notifyListeners() {
    Global.saveProfile(); //保存Profile变更
    super.notifyListeners(); //通知依赖的Widget更新
  }
}

/// 用户状态在登录状态发生变化时更新、通知其依赖项
class UserModel extends ProfileChangeNotifier {
  User get user => _profile.user;

  // APP是否登录(如果有用户信息，则证明登录过)
  bool get isLogin => user != null;

  //用户信息发生变化，更新用户信息并通知依赖它的子孙Widgets更新
  set user(User user) {
    if (user?.username != _profile.user?.username) {
      _profile.lastLogin = _profile.user?.username;
      _profile.user = user;
      notifyListeners();
    }
  }
}
```
根组件需要使用InheritedProvider进行包装
```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return InheritedProvider<UserModel>(
      value: UserModel(),
      child: MaterialApp(
        title: 'My App',
        theme: ThemeData(
          primarySwatch: Colors.pink,
        ),
        routes: {
          'login' : (context) => Login(title: '登录'),
          'home' : (context) => Home(title: '首页')
        },
        initialRoute: 'login',
      ),
    );
  }
}
```

共享状态的更新，比如在登录时，需要把当前用户的信息写入profile，并且传播到各个组件当中
这里简单写入一个username作为例子
```dart
Provider.of<UserModel>(context).user = User.fromJson({'username': _usernameController.text});
```