---
title: Three.js初见(2)
date: 2022-04-10 22:02:34
tags: 
  - 前端
  - Three.js
categories: 
  - 前端杂烩
---

## 自定义几何体

Three.js当中的几何体都是由若干个三角形构成的
哪怕是球形、圆柱形这些立体图形，也不存在真正的曲面，只不过这些三角形越是细小，拼凑起来越接近曲面的效果

<!-- more -->

![网格-球形](/images/前端杂烩/three.js/网格-球形.png)

基于这种方式，我们可以构造自定义的图形
需要使用类型化数组`TypedArray`

```javascript
const geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
// 类型数组创建顶点数据
const vertices = new Uint8Array([
  0, 0, 0, // 顶点1坐标
  10, 0, 0, // 顶点2坐标
  0, 20, 0, // 顶点3坐标
  0, 0, 10, // 顶点4坐标
  0, 0, 1, // 顶点5坐标
  20, 0, 1, // 顶点6坐标
])
// 创建属性缓冲区对象
const attribue = new THREE.BufferAttribute(vertices, 3) // 3个为一组，表示一个顶点的xyz坐标
// 设置几何体的位置属性
geometry.setAttribute('position', attribue)
// 三角面(网格)渲染模式
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff, // 三角面颜色
  side: THREE.DoubleSide // 两面可见
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
```
![自定义图形](/images/前端杂烩/three.js/自定义图形.png)

上面的代码中使用的是`Uint8Array`, 实际上可以使用任何一种类型数组

### 点材质和线材质
上面的例子当中使用的是**网格材质**
threejs还提供了**点材质**和**线材质**
```javascript
// 点材质
const material = new THREE.PointsMaterial({
  color: 0x0000ff,
  size: 2
})
const points = new THREE.Points(geometry, material)
scene.add(points)
```
![点材质](/images/前端杂烩/three.js/点材质.png)

```javascript
// 线材质
const material = new THREE.LineBasicMaterial({
  color: 0x0000ff // 线条颜色
})
const line = new THREE.Line(geometry, material) // 线条模型对象
scene.add(line) // 线条对象添加到场景中
```
![线材质](/images/前端杂烩/three.js/线材质.png)


### 设置每个顶点的颜色
```javascript
const geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
// 类型数组创建顶点数据
const vertices = new Uint8Array([
  0, 0, 0, // 顶点1坐标
  10, 0, 0, // 顶点2坐标
  0, 20, 0, // 顶点3坐标
  0, 0, 10, // 顶点4坐标
  0, 0, 1, // 顶点5坐标
  20, 0, 1, // 顶点6坐标
])
// 创建属性缓冲区对象
const attribue = new THREE.BufferAttribute(vertices, 3) // 3个为一组，表示一个顶点的xyz坐标
// 设置几何体的位置属性
geometry.setAttribute('position', attribue)

// 点材质
const material = new THREE.PointsMaterial({
  // color: 0x0000ff,
  vertexColors: THREE.VertexColors, //以顶点颜色为准
  size: 2
})
const pointColors = new Uint8Array([
  1, 0, 0, //顶点1颜色
  0, 1, 0, //顶点2颜色
  0, 0, 1, //顶点3颜色
  1, 1, 0, //顶点4颜色
  0, 1, 1, //顶点5颜色
  1, 0, 1, //顶点6颜色
])
geometry.attributes.color = new THREE.BufferAttribute(pointColors, 3) // 3个为一组代表一个顶点的RGB值
const points = new THREE.Points(geometry, material)
scene.add(points)
```
![点材质颜色](/images/前端杂烩/three.js/点材质颜色.png)

这个例子当中与上面的区别除了指定每个顶点的颜色之外
还需要给材质的`vertexColors`设置为`THREE.VertexColors`
该属性的默认值是`THREE.NoColors`, 意思就是模型的颜色取决于材质的color

如果把上述的方式使用到**三角面材质**上
可以得到渐变色的面
![三角面-渐变色](/images/前端杂烩/three.js/三角面-渐变色.png)

### 顶点坐标复用
由于threejs当中的图形都是由若干个三角形拼接而成
所以实际应用当中, 肯定是多个相邻三角形的顶点重合
如果每个三角形都要分别指定3个顶点的坐标, 数据肯定是非常冗余的
所以可以进行顶点坐标的复用
同时也不受限于坐标定义的顺序

```javascript
const geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
// 类型数组创建顶点数据
const vertices = new Int8Array([
  0, 0, 0,
  10, 0, 0,
  10, 10, 0,
  0, 10, 0,
  -10, 10, 0,
  -10, 0, 0,
])
// 创建属性缓冲区对象
const attribue = new THREE.BufferAttribute(vertices, 3) // 3个为一组，表示一个顶点的xyz坐标
// 设置几何体的位置属性
geometry.setAttribute('position', attribue)
// Uint16Array类型数组创建顶点索引数据
const indexes = new Uint8Array([
  // 0对应第1个顶点
  // 索引值3个为一组，表示一个三角形的3个顶点
  0, 1, 2,
  0, 2, 3,
  0, 3, 4,
  0, 4, 5,
])
// 索引数据赋值给几何体的index属性
geometry.index = new THREE.BufferAttribute(indexes, 1) //1个为一组
```
![顶点坐标复用](/images/前端杂烩/three.js/顶点坐标复用.png)

### Vector3和Color

除了使用`BufferGeometry`之外, 我们也可以使用`Vector3`和`Color`来创建自定义几何体
它们是基于`Geometry`这个API进行使用的
Threejs渲染的时候会先把 Geometry 转化为 BufferGeometry 再解析几何体顶点数据进行渲染

**Vector3**表示三维向量, 也可以理解为点的坐标

```javascript
const geometry = new THREE.Geometry()
// 类型数组创建顶点数据
geometry.vertices.push(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(0, 20, 0),
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(20, 0, 1),
)
geometry.colors.push(
  new THREE.Color(0xff0000),
  new THREE.Color(0x00ff00),
  new THREE.Color(0x0000ff),
  new THREE.Color(0xffff00),
  new THREE.Color(0x00ffff),
  new THREE.Color(0xff00ff),
)
// 点材质
const material = new THREE.PointsMaterial({
  vertexColors: THREE.VertexColors, //以顶点颜色为准
})
const points = new THREE.Points(geometry, material)
scene.add(points)
```