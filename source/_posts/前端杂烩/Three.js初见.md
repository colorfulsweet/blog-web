---
title: Three.js初见(1)
date: 2022-04-03 10:54:35
tags: 
  - 前端
  - Three.js
categories: 
  - 前端杂烩
---

Three.js是基于原生WebGL封装运行的三维引擎，在所有WebGL引擎中，Three.js是国内文资料最多、使用最广泛的三维引擎。

<!-- more -->

## 页面结构
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Three.js DEMO</title>
    <style>
      body { margin: 0; }
			canvas { width: 100%; height: 100% }
    </style>
  </head>
  <body>
    <script src="./js/lib/three.js"></script>
    <script src="./js/index.js"></script>
  </body>
</html>
```

在脚手架项目当中
也可以使用`npm install three`来添加依赖

## Hello World
index.js
```javascript
(function(){
// 创建场景
const scene = new THREE.Scene()

// 创建相机
// 1.视野角度  2.长宽比  3.远剪切面  4.近剪切面
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 创建WebGL渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
// 将canvas添加到页面当中
document.body.appendChild(renderer.domElement)

// 创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x92d667 })
// 创建网格, 可以将材质和立方体放入其中
// 网格可以直接放入场景中, 并让它在场景中自由移动
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 将摄像机向外移动一些  防止与物体重叠
camera.position.z = 5

// 使用渲染器 渲染到场景当中
renderer.render(scene, camera)
})()

```

> 添加到场景中的几何体默认位于场景的坐标原点(0, 0, 0)

### 添加多个几何体
```javascript
// 圆柱网格模型
const geometry2 = new THREE.CylinderGeometry( 8, 8, 8, 100 )
const material2 = new THREE.MeshBasicMaterial({ color: 0x92d667 })
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.translateY(20) // 向Y轴正方向移动20
scene.add(mesh2)
```
为防止几何体重叠无法看到, 可以调整网格的位置

### 循环渲染
上面的代码, 已经可以显示出一个立方体
如果要让它有一个动画效果
需要改变网格的旋转
并且进行循环渲染

```javascript
// 循环渲染
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
	renderer.render(scene, camera)
}
animate()
```
`requestAnimationFrame`主要的好处是当前页面隐藏时不会进行渲染
如果是使用定时器
那么它在后台也会一直执行, 占用的资源比较多
其次是它执行的频率由屏幕刷新率决定, 效果可以更加流畅


## 场景控制
要使用鼠标或键盘控制三维场景, 可以使用`OrbitControls`控件
首先引入它
```html
<script src="./js/lib/OrbitControls.js"></script>
```
调用方式
```javascript
// 创建控件对象
const controls = new THREE.OrbitControls(camera, renderer.domElement)
// 监听鼠标、键盘事件
controls.addEventListener('change', function(){
  renderer.render(scene, camera)
})
```

场景操作

+ 缩放：滚动—鼠标中键
+ 旋转：拖动—鼠标左键
+ 平移：拖动—鼠标右键

> 如果代码中通过`requestAnimationFrame`实现渲染器渲染方法`render`的周期性调用，当通过OrbitControls操作改变相机状态的时候，没必要在通过`controls.addEventListener('change', render)`监听鼠标事件调用渲染函数，因为`requestAnimationFrame`就会不停的调用渲染函数。

## 辅助坐标系

为了方便调试预览threejs提供了一个辅助三维坐标系`AxesHelper`

```javascript
// 辅助坐标系  参数代表轴的线段长度，可以根据场景大小去设置
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
```
![辅助坐标系](/images/前端杂烩/three.js/辅助坐标系.png)

> 红色代表 X 轴, 绿色代表 Y 轴, 蓝色代表 Z 轴

## 材质与光源
除了基本的材质类型之外, three还提供了多种材质效果

| 材质类型 | 功能 |
| -- | -- |
| MeshBasicMaterial	| 基础网格材质，不受光照影响的材质 |
| MeshLambertMaterial | Lambert网格材质，与光照有反应，漫反射 |
| MeshPhongMaterial | 高光Phong材质，与光照有反应 |
| MeshStandardMaterial | PBR物理材质，相比较高光Phong材质可以更好的模拟金属、玻璃等效果 |

```javascript
// 创建一个球体
const geometry1 = new THREE.SphereGeometry(6, 40, 40)
const material1 = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  specular: 0x4488ee, // 高光颜色
  shininess: 12, // 高亮程度
})
const mesh1 = new THREE.Mesh(geometry1, material1)
scene.add(mesh1)

// 创建一个圆柱
const geometry2 = new THREE.CylinderGeometry( 8, 8, 8, 100 )
const material2 = new THREE.MeshLambertMaterial({ 
  color: 0xffffff,
})
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.translateY(20) // 向Y轴正方向移动20
scene.add(mesh2)
```

`MeshLambertMaterial`和`MeshPhongMaterial`都是对光照有反应的
但是此时我们还需要添加一个光源, 才能看到效果

```javascript
// 点光源
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(100, 100, 0) // 点光源位置
scene.add(pointLight) // 点光源添加到场景中
```

![材质与光源](/images/前端杂烩/three.js/材质与光源.png)