# 远程桌面


## 阿里云ECS配置远程桌面

### 初始设置

[开发者成长计划 (aliyun.com)](https://developer.aliyun.com/plan/grow-up)

完成新生任务，申请ECS，选择linux系统，我的是ubuntu_18_04_x64，其他配置随意。（后面改成centos系统了

在“云服务器ECS”——> “实例与镜像”——> “实例”选择应实例，查看公有IP地址，在“操作”——> ”实例属性“——> ”重置实例密码“ 重置密码，用于后续连接操作

在“云服务器ECS”——> “网络与安全”——> “安全组”选择上述实例所属安全组，进行修改，或者创建新的安全组，再回到实例操作中替换安全组

在“配置规则”中添加入方向，端口范围看后续要求，也可直接设为全部，源为0.0.0.0/0

选择实例后进行远程连接，选择Workbench远程连接，输入信息后登录



### frp内网穿透

#### 服务端

下载frp对应文件

[fatedier/frp: A fast reverse proxy to help you expose a local server behind a NAT or firewall to the internet. (github.com)](https://github.com/fatedier/frp)

```bash
cd /usr/local  # 选择安装位置
wget clone https://github.com/fatedier/frp/releases/download/v0.44.0/frp_0.44.0_linux_amd64.tar.gz  # 下载对应版本
tar -zxvf frp_0.44.0_linux_amd64.tar.gz  # 解压
mv frp_0.44.0_linux_amd64 frp  # 重命名
rm frp_0.44.0_linux_amd64.tar.gz  # 删除
cd frp  # 进入文件夹
vim frps.ini  # 配置文件
```

```bash
[common]
bind_port = 7000  # 监听端口
dashboard_port = 7500  # 控制页面端口
token =  # 连接服务器密码 
dashboard_user =  # 控制页面用户 
dashboard_pwd =  # 控制页面密码
```

端口可自行设置，需要在安全组开放对应端口，全开了就不用管了；如果有设置防火墙也需开放对应端口。

测试

```bash
./frps -c frps.ini
```

正常运行不中断，再访问 IP:7500 ，输入用户名和密码后，成功访问

接下来进行frp开机自启动

```bash
cd /etc/systemd/system
vim frp.service
```

```bash
[Unit]
Description=frp service
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/frp/frps -c /usr/local/frp/frps.ini
Restart=on-failure # or always, on-abort, etc

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable frp
```

然后可以通过`systemctl status frp`查看状态和运行日志，`systemctl restart frp`、`systemctl stop frp`进行开启或关闭frp

查看和删除进程

```bash
ps -aux
kill -9 [pid]
```

#### 客户端

windows10

下载对应版本，解压，进入文件夹，配置frpc.ini

```bash
[common]
server_addr = 服务器IP
server_port = 服务器监听接口
token = 连接服务器密码
tls_enable = true

[rdp]  # 配置远程桌面的接口，Windows的RD Client一般为3389接口
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 3389

[smb]  # 这里是配置网络文件共享系統，直接照抄即可
type = tcp
local_ip = 127.0.0.1
local_port = 445
remote_port = 7002

[ssh]  # 配置ssh接口
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000
```

remote_port可以自己设置，需要在安全组和防火墙（如果有）开放对应端口

tls_enable设置是为了解决运行时出现 i/o time out 的错误

参考：https://github.com/fatedier/frp/issues/2865

打开终端运行

```bash
.\frpc.exe -c frpc.ini
```

正常运行不中断

设置后台运行，创建 frp.bat

```bash
@echo off
if "%1" == "h" goto begin
mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin
REM
cd D:\frp_0.44.0_windows_amd64
frpc -c frpc.ini
exit
```

双击即可运行，可在任务管理器查看是否运行，再到服务器查看日志，是否连接成功

可将 frp.bat 快捷方式 放到 C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp 路径下实现开机自启动



### 远程桌面

#### 被控端设置

windows10专业版，在“设置”——>“远程桌面”启动远程桌面，在“显示设置”启用网络发现，在“高级设置”启用网络验证，在“用户账号”中添加可访问的用户

#### 控制端设置

##### WIndows

直接搜索打开远程桌面连接，输入IP连接，输入被控端的用户和密码即可连接

##### Android

下载安装 Microsoft Remote Desktop，点击右上角加号，点击 DESKTOP，输入IP和用户密码进入，可在DISPLAY设置分辨率和缩放。

其他设备同理

