# Python


## 版本切换

### Windows

更改python目录下python.exe和pythonw.exe的名称

pip切换，python2  -m pip install --upgrade pip --force-reinstall 为python2安装pip2，pip3类似

### linux

```bash
update-alternatives --config python  # 切换python版本
# 或者直接使用python2或python3
```



## 报错

TypeError: Unicode-objects must be encoded before hashing  

在Unicode对象进行hash前要编码，加上.encode('utf-8')



## Anaconda

miniconda、miniforge操作类似

### 安装

[Index of /anaconda/archive/ | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/?C=N&O=A)

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-5.3.1-Linux-x86_64.sh  # 下载
bash Anaconda3-5.3.1-Linux-x86_64.sh  # 安装
vim ~/.bashrc  # 添加环境变量
```

```bash
export PATH=/home/用户名/anaconda3/bin:$PATH
```

```bash
source ~/.bashrc
conda --version  # 测试
```

### 换源

[anaconda | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/anaconda/)

源：https://mdnice.com/writing/a8a3a65f87ec4835ace74cd356f1aa72

```bash
vim .condarc
```

```bash
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

```bash
conda clean -i
```

报错https，就把链接改为http

### 创建

```bash
conda create -n [环境名] python=
source activate [环境名]
```

```bash
conda list  # 查看安装包
conda install [安装包]
conda env list  # 查看虚拟环境
conda update conda  # 更新
conda remove -n [环境名] [包名]  # --all 删除环境
```

### 卸载

```
rm -rf anaconda3  # 目录安装删除
rm .condarc  # 删除配置文件 
vim .bashrc  # 删除环境变量
source .bashrc
```

### 报错

CondaSSLError: OpenSSL appears to be unavailable on this machine. OpenSSL is required to
download and install packages.

安装openssl https://slproweb.com/products/Win32OpenSSL.html

Windows powershell activate失败

```bash
conda install -n root -c pscondaenvs pscondaenvs
# 管理员打开powershell运行
Set-ExecutionPolicy RemoteSigned  
conda config --set auto_activate_base False  # 取消自动activate
conda init  
# 重启terminal
```




