---
title: new关键字做了什么
date: 2018-5-2 20:05:33
tags: 
  - JavaScript
categories: 
  - JavaScript
---
假设说现在要构造若干个"士兵"对象 , 每个士兵都有类型 攻击力 生命值 这些属性
同时有奔跑 攻击 防御 这些可以执行的动作 , 在代码中表现为方法
<!-- more -->
简单粗暴的方式可以这样做
```javascript
var soldiers = [];
for(let i=0 ; i<100 ; i++) {
  let soldier = {
    type : "步兵",
    id : i,
    health : 100,
    run : function(){console.log("奔跑");},
    attack : function(){console.log("攻击");},
    defense : function(){console.log("防御");}
  };
  soldiers.push(soldier);
}
```
这种方式显然存在一个问题 , 就是浪费了大量的内存
因为每个士兵可以执行的行为都是一样的 , 这几个函数完全可以共用
这种方式却给每个对象创建了独立的函数
兵种也是一样的 , 只有id和生命值 , 每个士兵都要具备自己的值

可以给每个对象指定各自的原型对象 , 只要这些共用的方法写在原型对象当中
```javascript
var soldiers = [];
var soldierProto = {
  type : "步兵",
  run : function(){console.log("奔跑")},
  attack : function(){console.log("攻击");},
  defense : function(){console.log("防御");}
}
for(let i=0 ; i<100 ; i++) {
  let soldier = {
    id : i,
    health : 100
  };
  solider.__proto__ = soldierProto;
  soldiers.push(soldier);
}
```

现在把创建士兵的代码放在了两个地方 , 很不优雅
所以可以用一个函数把两者联系起来
```javascript
function createSoldier(id) {
  var _soldier = {}; //临时对象
  _soldier.__proto__ = createSoldier["原型"];
  _soldier.id = id;
  _soldier.health = 100;
  return _soldier;
}
createSoldier["原型"]= {
  type : "士兵",
  attackNum : 5, //攻击力
  run : function(){console.log("奔跑");},
  attack : function(){console.log("攻击");},
  defense : function(){console.log("防御");}
}
```
上面的代码在函数中添加了一个属性 , 叫做"原型"
主要做的就是把需要作为原型的对象保存在函数对象的一个属性当中 , 使调用这个函数的时候可以获取到这个原型对象
new关键字所做的事情 , 其实就相当于是上面代码里面我们自己手动实现的事情
+ 自动创建临时对象 ( 在函数内部使用this可以访问到这个临时对象 )
+ 自动绑定该Function对象的原型 ( 统一叫做`prototype` )
+ 自动return这个临时对象

现在写一个可以用new去调用的纯粹的构造函数
```javascript
function soldier(id) {
  this.id = id;
  this.health = 100;
}
soldier.prototype = {
  type : "士兵",
  attackNum : 5, //攻击力
  run : function(){console.log("奔跑");},
  attack : function(){console.log("攻击");},
  defense : function(){console.log("防御");}
}
```

除此之外 , 为了记录 **临时对象是由哪个函数创建的** , 会在定义这个函数的时候 , 在函数的prototype属性 ( 是Object ) 上面自动添加一个`constructor`属性 , 比如 : 
```javascript
function func(){
  this.name = "Sookie";
}
func.prototype.constructor === func; //true
```
所以如果像上面那样直接给函数的prototype属性赋值一个对象的话 , 这个constructor就没了
所以可以采取下面两种做法
```javascript
//1. 手工把这个属性加上
soldier.prototype = {
  constructor : soldier,
  type : "士兵",
  attackNum : 5, //攻击力
  run : function(){console.log("奔跑");},
  attack : function(){console.log("攻击");},
  defense : function(){console.log("防御");}
}
```
或者
```javascript
//2. 不去覆盖原本的prototype属性对象, 而是直接在上面添加属性
soldier.prototype.type = "士兵";
soldier.prototype.attackNum = 5;
soldier.prototype.run = function(){console.log("奔跑");};
soldier.prototype.attack = function(){console.log("攻击");};
soldier.prototype.defense = function(){console.log("防御");};
```