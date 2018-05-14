---
title: crontab-定时任务
date: 2018-5-14 15:16:46
tags: 
  - linux
categories: 
  - linux
---

linux下创建定时任务通常使用`crontab`命令
使用`cron表达式`来指定执行的定时规则
使用shell脚本编写需要执行的内容
> 脚本中涉及的文件路径是要写 **绝对路径**
<!-- more -->

执行`crontab -e`编辑当前用户crontab服务文件

#### cron语法
crontab的定时任务只能精确到分钟 , 而无法精确到秒
所以cron表达式只有5个值
```
分     小时     日      月     星期     命令
0-59   0-23   1-31   1-12     0-6     command
```
0表示周日(也可以用英文来表示，sun表示星期天，mon表示星期一)
一般一行对应一个任务

+ `*`代表任意值
+ `/`代表 **每**
+ `-`代表连续的时间段(从xx到xx)
+ `,`代表不连续的时间点(xx和xx)

常见的用法举例
```
5  * * * * command    指定每小时的第5分钟执行一次
30 5 * * * command    指定每天的 5:30 执行
30 7 8 * * command    指定每月8号的7：30分执行
30 5 8 6 * command    指定每年的6月8日5：30执行
30 6 * * 0 command    指定每星期日的6:30执行
30 3 10,20 * * command    每月10号及20号的3：30执行
25 8-11 * * * command    每天8-11点的第25分钟执行
*/15 * * * * command    每15分钟执行一次 [即每个小时的第0 15 30 45 60分钟执行]
30 6 */10 * * command    每个月中，每隔10天6:30执行一次 [即每月的1、11、21、31日的6：30执行]
```


#### 其他用法
+ `crontab -l` - 列出某个用户cron服务的详细内容
+ `crontab -u <username>` - 设定某个用户的cron服务，一般root用户在执行这个命令的时候需要此参数  
+ `crontab -r` - 删除某个用户的cron服务

#### 全局配置
cron的主配置文件是`/etc/crontab`
![crontab config](/images/linux/crontab_config.jpg)
在这个文件里面也可以配置定时任务的执行规则

这里这个PATH并不会在实际的脚本运行当中生效
如果脚本单独运行没问题 , 但是在定时任务当中出现命令找不到的情况

比如是在`/etc/profile`当中配置的环境变量
可以用下面的方式指定定时任务规则
```bash
* * * * * . /etc/profile; command
```

#### 服务相关的操作
+ `serivce crond start` - 启动
+ `serivce crond stop` - 停止
+ `service crond restart` - 重启
+ `service crond status` - 查看运行情况
