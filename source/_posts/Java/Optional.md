---
title: Optional
date: 2018-6-14 21:51:16
categories: 
  - Java
---

java8新增了很多有用的api , `Optional`就是其中之一
首先它可以用来解决空指针的问题
让代码更加简洁 , 而不需要多层的判断
<!-- more -->
比如
```java
class User {
  private String username;
  private Role role;
//getter与setter方法...
}

class Role {
  private String rolename;
//getter与setter方法...
}
```
假如需要获取一个用户的角色名称 , 如果获取不到就返回"无角色"
在以往我们需要这么写
```java
public static String getRoleName(User user) {
  if(user != null && 
      user.getRole() != null &&
      user.getRole().getRolename()!=null) {
    return user.getRole().getRolename();
  } else {
    return "无角色";
  }
}
```
显然为了防止抛出NullPointerException , 需要进行多次判断
在Java8当中 , 配合lamdba表达式 , 可以使用函数式编程的风格让代码更优雅
```java
public static String getRoleName2(User user) {
  return Optional.ofNullable(user)
  .map(u -> u.getRole())
  .map(r -> r.getRolename())
  .orElse("无角色");
}
```
直接调用`Optional.of`当然也是可以的 , 只不过如果最初的user就是null的话 , 还是会抛出NullPointerException 
`Optional.ofNullable`它以一种宽容的方式来构造一个 Optional 实例. 来者不拒, 传 null 进到就得到 **Optional.empty()**, 非 null 就调用 **Optional.of(obj)**

以下摘自jdk1.8源码
```java
public static <T> Optional<T> ofNullable(T value) {
  return value == null ? empty() : of(value);
}
```

`orElse`代表链式调用当中如果出现空值 , 则返回该内容
同一个系列的还有
+ `orElseGet` - 执行某个方法 , 比如 **.orElseGet( () -> getDefaultValue() )**
+ `orElseThrow` - 抛出一个异常 , 比如 **.orElseThrow( () -> new RuntimeException() )**
