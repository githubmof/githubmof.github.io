# Jupyter notebook


## Jupyter notebook

基于前面的阿里云ECS，创建jupyter

用Anaconda、miniconda安装，或pip安装，操作类似

直接用root用户安装会警告

解决方案：用普通用户；python的env虚拟环境；conda/mamba虚拟环境

c++内核xeus-cling必须用到conda，同时为了方便管理不同环境配置，采取mambaforge安装



### mambaforge

[conda-forge/miniforge: A conda-forge distribution. (github.com)](https://github.com/conda-forge/miniforge)

```bash
wget "https://github.com/conda-forge/miniforge/releases/latest/download/Mambaforge-$(uname)-$(uname -m).sh"
  # 选择对应版本
bash Mambaforge-$(uname)-$(uname -m).sh  # 安装
vim ~/.bashrc  # 环境变量
```

```bash
export PATH="/home/用户名/miniforge3/bin:$PATH"
```

```bash
source ~/.bashrc
```

```bash
conda config --set auto_activate_base false  # 不自动激活环境
mamba activate  # 进入base虚拟环境
# 换源后安装
```



### jupyter

#### 安装

```bash
mamba install jupyter notebook
```

#### 密码

```bash
python
>>> from notebook.auth import passwd
>>> passwd()
>>> exit()
```

输入密码，保存输出单引号内的内容

#### 配置

```bash
jupyter notebook --generate-config
cd ~/.jupyter
vim jupyter_notebook_config.py
```

找到对应语句修改

```bash
c.NotebookApp.allow_origin = '*'
c.NotebookApp.allow_remote_access = True
c.NotebookApp.ip = '127.0.0.1' # 除非 IP 裸连否则不要改成 '*'
c.NotebookApp.notebook_dir = '/home/用户名/projects' # jupyter项目存放位置
c.NotebookApp.password = 'xxxxxx' # 设置密码保存的内容
c.NotebookApp.open_browser = False # 服务器不打开浏览器
c.NotebookApp.port = 2333 # 端口
```

#### 启动

```bash
jupyter notebook
nohup jupyter notebook > jupyter.log 2>&1 &  # 后台运行
```

域名加端口访问

#### 报错

500 : Internal Server Error

nbconvert版本不兼容

```bash
mamba install nbconvert==5.4.1
```

matplotlib 字体

[(5条消息) SimHei字体（永久有效）_jlb1024的博客-CSDN博客_simhei字体官网](https://blog.csdn.net/jlb1024/article/details/98037525)

[(5条消息) 解决Linux环境下Jupyter中matplotlib中文乱码问题_啊啊啊狗哥的博客-CSDN博客_jupyter matplotlib 中文](https://blog.csdn.net/GouGe_CSDN/article/details/105382920)

扩展插件

```bash
mamba install jupyter_contrib_nbextensions
jupyter contrib nbextension install
mamba install jupyter_nbextensions_configurator
```

启动后在浏览器就能看到插件目录

Hinterland 自动补全

#### 主题样式

[jupyter-themes](https://github.com/dunovank/jupyter-themes/blob/master/README.md)

```bash
mamba install jupyterthemes
```

```bash
jt -l  # 显示主题
jt []  # 设置
jt -r  # 重置
```

样例

```bash
jt -t oceans16 -f fira -nf robotosans -tf robotosans -N -T -cellw 90% -fs 10 -nfs 12 -tfs 12 -dfs 10 -ofs -9
```



#### 技巧

%%time 运行时间

shift+tab 打开函数说明文档

双击单元格左边 隐藏输出结果

#### 内核

```bash
jupyter kernelspec list  # 查看内核
jupyter kernelspec remove [内核名字]  # 删除内核
```



##### python2

```bash
python2 -m pip install ipykernel
python2 -m ipykernel install --name=kernelname --display-name showname
```

##### C++

https://github.com/jupyter-xeus/xeus-cling

https://xeus-cling.readthedocs.io/en/latest/installation.html#installing-the-kernel-spec

```bash
mamba create -n cling
source activate cling
mamba install xeus-cling -c conda-forge

jupyter kernelspec install mambaforge/envs/cling/share/jupyter/kernels/xcpp11 --sys-prefix
jupyter kernelspec install mambaforge/envs/cling/share/jupyter/kernels/xcpp14 --sys-prefix
jupyter kernelspec install mambaforge/envs/cling/share/jupyter/kernels/xcpp17 --sys-prefix
```

要在cling环境下启动jupyter才能正常使用

在同一个块包含两个头文件 会报内核重启错误，分块写就好了（不懂




