---
title: gcc与nodejs的编译安装
date: 2019-1-19 23:58:29
tags: 
  - linux
categories: 
  - linux
---

编译新版nodejs的时候提示要求使用新版gcc
![nodejs warning](/images/linux/nodejs_warning.png)
但是使用yum安装的gcc, 最高版本只能获得4.8.5
所以只好自己编译安装gcc
<!-- more -->
## 编译安装gcc

[gcc源码包下载](http://ftp.gnu.org/gnu/gcc/gcc-8.2.0/gcc-8.2.0.tar.xz)

> 必须首先安装有低版本的gcc和g++, 因为编译gcc的源码也是需要使用gcc的
如果没有的话先用yum安装 `yum install -y gcc gcc-c++`
![gcc](/images/linux/gcc-v.png)

### 源码包解压
```bash
xz -d gcc-8.2.0.tar.xz
tar -xvf gcc-8.2.0.tar
cd gcc-8.2.0
```

### 编译
```bash
# 下载、配置、安装需要的依赖库
./contrib/download_prerequisites

# 创建并进入编译目录
mkdir build
cd build

# 编译配置, 生成makefile文件
../configure --enable-checking=release --enable-languages=c,c++ --disable-multilib

# 执行编译
make
```
编译的过程时间比较长
编译完成之后, 执行
```bash
# 删除低版本的gcc
yum remove gcc gcc-c++
# 安装
make install
```
如果此时还是找不到新安装的gcc, 可以执行一下`source /etc/profile`

### 常见问题与解决方案
1. 安装依赖库时缺少bzip2
![缺少bzip2](/images/linux/缺少bzip2.png)
解决办法: `yum install -y bzip2`

2. g++: internal compiler error: Killed
编译进程被终止
这种情况一般是内存不足的问题
可以临时创建交换分区

```bash
dd if=/dev/zero of=/swapfile bs=64M count=16

mkswap /swapfile

swapon /swapfile
```
编译完成之后, 可以删除掉这个交换分区文件
```bash
swapoff /swapfile

rm /swapfile
```


## 编译安装nodejs

[nodejs源码包下载](https://nodejs.org/dist/v11.7.0/node-v11.7.0.tar.gz)
执行`tar -zxvf node-v11.7.0.tar.gz`解压

### 编译
```bash
cd node-v11.7.0
# 安装配置, prefix指定安装的目标位置
./configure --prefix=/usr/local/nodejs

make && make install
```

