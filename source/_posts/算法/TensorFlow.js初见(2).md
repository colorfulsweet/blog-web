---
title: TensorFlow.js初见(2)
date: 2021-04-27 17:13:57
tags: 
  - TensorFlow
  - 机器学习
categories: 
  - 算法
---

模型训练好之后，就可以使用该模型进行预测了
代码依然是nodejs环境的运行方式

<!-- more -->

```typescript
import * as tf from '@tensorflow/tfjs-node'
import * as fs from 'fs'

(async function(){
  // 加载之前训练好的模型
  const model = await tf.loadLayersModel('http://localhost:8080/model.json')
  // 打印模型的摘要信息
  model.summary()

  const imgBuffer = fs.readFileSync(`${process.cwd()}/resource/test/可回收物-帆布鞋.jpg`)
  // 对图片数据的处理方式和训练的过程一样
  const x = img2x(imgBuffer)
  // 执行预测
  const pred = <tf.Tensor>model.predict(x)
  pred.print()
  console.log(pred.arraySync()[0])
})()

/**
 * 图片数据处理
 * @param buffer 图片数据Buffer
 * @returns 
 */
 const img2x = (buffer: Buffer) => {
  // tf.tidy 执行后就会清除所有的中间张量，并释放它们的GPU内存(相当于优化运行过程, 这一层包装也可以不要)
  return tf.tidy(() => {
    // 图片格式转换
    const imgTs = tf.node.decodeImage(new Uint8Array(buffer))
    // 图片尺寸转换
    const imgTsResized = tf.image.resizeBilinear(imgTs, [224, 224])
    // 将像素值归一化到[-1, 1]
    /**
     * 图片像素值是[0, 255]
     * 先减去 255 / 2, 此时区间是[-127.5, 127.5]
     * 再除以 255 / 2, 此时区间是[-1, 1]
     * reshape进行模型转换
     * 224,224代表尺寸 3代表RGB图片 1代表把图片放在数字1(拓展一维)
     */
    return imgTsResized.toFloat().sub(255 / 2).div(255 / 2).reshape([1, 224, 224, 3])
  })
}
```
这里在本地使用`http-server`启动了一个HTTP服务，方便加载模型
上面代码最后输出的执行结果是
```
[
  0.03434975817799568,
  0.001036567147821188,
  0.9645556211471558,
  0.00005802588930237107
]
```
与4种类型相对应
```
["其他垃圾","厨余垃圾","可回收物","有害垃圾"]
```
显然与可回收物的匹配度较高，其他几种的匹配度较低
> 实际预测的结果与模型的设定以及训练的素材数量相关