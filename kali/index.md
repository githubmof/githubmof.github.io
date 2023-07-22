# Kali


### 常见命令

```bash
whoami  # 当前用户名
pwd  # 显示当前目录
cd  # 切换
ls -a # 显示目录及文件（包括隐藏）
mkdir  # 新建目录
rmdir -r  # 删除目录
rm  # 删除文件
cp [1] [2]  # 复制1到2
mv [1] [2]  # 重命名或移动文件
cat 1  # 查看1
cat 文件名 > 输出文件名  // 合并
grep 'flag' file  # 在file中搜索flag
find . -name filename -print  # 搜索文件 
```

参考：[linux基础命令V2.1 - 飞桨AI Studio (baidu.com)](https://aistudio.baidu.com/aistudio/projectdetail/37491)



### 换源

```bash
sudo vim /etc/apt/sources.list
```

```bash
# 阿里云
deb https://mirrors.aliyun.com/kali kali-rolling main non-free contrib
deb-src https://mirrors.aliyun.com/kali kali-rolling main non-free contrib

# 中科大
deb http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
```

```bash
sudo apt-get dist-upgrade
sudo apt-get update
sudo apt-get upgrade
```



### gcc

```bash
apt-get install gcc
apt-get install gcc-multilib  // 可以在64位机器上运行32位程序
```



### python

```bash
update-alternatives --config python // 切换python版本
// 或者直接使用python2或python3
```



### vim

分为三种模式：命令模式、输入模式和底线命令模式

命令模式： 

- `i`  切换到输入模式
- `x`  删除当前光标所在字符
- `:`  切换到底线命令模式

输入模式：

- `HOME/END`  移动到行首/行末
- `ESC`  切换到命令模式

底线命令模式：

-  `:q`  退出程序
- `:w`  保存文件
- `:wq`  保存并退出

参考：[Kali下常用的Linux编辑器 - Kali's Blog (bbskali.cn)](https://blog.bbskali.cn/2678.html)

其他：[简明 Vim 练级攻略 | 酷 壳 - CoolShell](https://coolshell.cn/articles/5426.html)

[Linux 平台下阅读源码的工具 - 简书 (jianshu.com)](https://www.jianshu.com/p/09e74b05fd5d)

设置

```bash
vim .vimrc
"set tab to 4
set smarttab
set tabstop=4
set shiftwidth=4
set expandtab

"set highlight
syntax on
set hlsearch
```



### gnuplot

```bash
plot “文件名”/函数  // 绘制
```



### ssh

[kali linux 开启ssh服务 - 哎哟，不错哦 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wangjinyu/p/12212536.html)



### tar

```bash
tar -zcvf out.tar.gz 原文件夹  # 压缩
tar -zxvf 1.tar.gz -C ./2/  # 解压
```

```bash
-c 生成档案文件，创建打包文件
-v 列出归档，解档的详细过程
-f 指定档案文件名称，f后一定是.tar文件
-x 解开档案文件
-z 调用gzip执行压缩功能
-C 大写C，解压到指定目录
```



### 7z

```bash
7za X 文件名  // 解压
```



### crunch

字典生成

```bash
crunch <min-len> <max-len> [<charset string>] [option]
crunch 8 8 1234"abcd" -t pass%%%% >> out.txt
# 8位，以pass开头，后面位1234abcd的组合
```



### 创建用户

#### 创建

```bash
useradd [用户名]  # 创建用户
passwd [用户名]  # 设置密码
```

##### 用户目录和启动

```bash
vim /etc/passwd 
```

对应位置（末尾）修改

```bash
用户名:x:1000:1000::/home/用户名:/bin/bash
```

##### sudo权限

```bash
vim /etc/sudoers
```

root用户类似语句下面增添，:wq! 退出保存

```bash
用户名     ALL=(ALL:ALL) ALL
```

##### 命令高亮

```bash
vim /home/用户名/.bashrc
```

找到语句，取消注释（vim中/str搜索str

```bash
force_color_prompt=yes
```

保存退出后

```bash
source /home/用户名/.bashrc
```

#### 切换

```bash
su 用户名
```



### 环境变量

```bash
vim ~/.bashrc
```

```bash
export PATH="yourpath:$PATH"
```

```bash
source ~/.bashrc
```



### 报错

#### update报错

```bash
E: 仓库 “http://mirrors.163.com/debian wheezy Release” 没有 Release 文件。
N: 无法安全地用该源进行更新，所以默认禁用该源。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。
```

```bash
cd /etc/apt/sources.list.d
ls  // docker.list
rm docker.list  // 清除该目录下文件
vim /etc/apt/sources.list  // 如果还无法update，替换源
```



参考：[kail升级报错："E: 仓库 “https://download.docker.com/linux/debian kali-rolling Release” 没有 Release 文件。 - laolao - 博客园 (cnblogs.com)](https://www.cnblogs.com/chrysanthemum/p/14720786.html)

```bash
E: 仓库 “http://http.kali.org/kali kali-rolling InRelease” 没有数字签名。
N: 无法安全地用该源进行更新，所以默认禁用该源。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。
```

```bash
wget archive.kali.org/archive-key.asc   //下载签名
 
apt-key add archive-key.asc   //安装签名
```

[kali linux出现下列签名无效： EXPKEYSIG ED444FF07D8D0BF6 Kali Linux Repository ＜devel@kali.org＞_隔壁山上小道士的博客-CSDN博客](https://blog.csdn.net/weixin_43267605/article/details/116101161)


