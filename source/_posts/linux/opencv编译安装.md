---
title: opencv编译安装
date: 2018-5-10 09:24:53
tags: 
  - linux
  - opencv
categories: 
  - linux
---

### 依赖库安装

#### ubuntu系统
```bash
apt-get install build-essential
apt-get install cmake libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
apt-get install python-dev python-numpy libtbb2 libtbb-dev  libjasper-dev libdc1394-22-dev
```
(上面大部分的库ubuntu都自带的 , 安装有问题就跳过)
如果需要用java开发
则需要安装ant
apt-get install ant
<!-- more -->

#### centos系统
```bash
yum -y install epel-release
yum install gcc gcc-c++  
yum install cmake  
yum install python-devel numpy  
yum install gtk2-devel  
yum install libdc1394-devel  
yum install libv4l-devel  
yum install gstreamer-plugins-base-devel 
```
如果需要用java开发
则需要安装ant
```bash
yum install ant
```
创建install-ffmpeg.sh
授权chmod +x install-ffmpeg.sh
并执行./install-ffmpeg.sh
内容如下
```bash
sudo rpm –import /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7 
yum repolist 
sudo rpm –import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro 
sudo rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-1.el7.nux.noarch.rpm 
yum repolist 
yum update -y 
yum install -y ffmpeg 
ffmpeg -version
```
yum install ffmpeg-devel

### 编译与安装
> 注意 : 上面在安装ant的过程 , 会自动安装`openjdk-jre`
但是此时只有jre , 没有jdk , 要编译出java程序可用的jar包和原生库 , 必须有jdk才行
通过apt安装openjdk的jdk可以 , 下载oracle的jdk也可以 , 不过后者需要手动加入到环境变量

```bash
mkdir build
mkdir install
cd build
cmake -D CMAKE_BUILD_TYPE=Release -D CMAKE_INSTALL_PREFIX=/root/opencv-3.4.1/install -DBUILD_TESTS=OFF ..
make && make install
```
> 如果ANT和JNI都有值的话就没问题 , JNI没有值的话可能是因为没装jdk , 或者没有加入环境变量PATH当中
编译也不会报错 , 只不过编译后不会生成jar包和opencv_java341.so的原生库
CMAKE_INSTALL_PREFIX表示安装的目标位置

如果执行过程中
`ippicv_2017u3_lnx_intel64_general_20170822.tgz`
下载过慢或失败
可以手动下载这个包放到.cache/ippicv目录下
文件名需要加上md5 ( 可以使用md5sum命令得到 )
也就是
4e0352ce96473837b1d671ce87f17359-ippicv_2017u3_lnx_intel64_general_20170822.tgz

### java调用C/C++模块
#### linux
程序运行前需要添加环境变量
```bash
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/native
```
(就是编译后的安装目录里面lib(或者是lib64)当中所有.so文件 以及libopencv_java341.so 都放在该目录下)
之后创建并执行如下shell脚本
```bash
native_folder=/usr/local/native
for so_file in ${native_folder}/*
do
  file_name=`basename ${so_file}`
  if [ ${file_name} = "libopencv_java341.so" ];then
    continue
  fi
  `ln -s ${so_file} ${so_file}.3.4`
  echo "已创建软连接${so_file}.3.4"
done
```
native_folder就是放置.so文件的目录 , 根据实际情况而定

#### windows
需要把`opencv_java341.dll`文件放到`%JAVA_HOME%/jre/bin`里面

### maven本地安装jar包
要在maven项目当中引入这个jar包使用 , 并且保证打包过程正确加入这个jar包
可以手动安装到本地maven仓库
```
mvn install:install-file -Dfile=opencv-341.jar -DgroupId=org.opencv -DartifactId=opencv -Dversion=3.4.1 -Dpackaging=jar
```
当然也可以选择不安装到本地仓库
而是直接放进项目里面 , 比如说放在了项目里的lib目录下
```xml
<dependency>  
  <groupId>org.opencv</groupId>
  <artifactId>opencv</artifactId>
  <version>3.4.1</version>
  <scope>system</scope>
  <systemPath>${pom.basedir}/lib/opencv-341.jar</systemPath>
</dependency>
```