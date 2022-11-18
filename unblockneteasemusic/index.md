# UnblockNeteaseMusic


### 项目

[Release 0.25.3 · nondanee/UnblockNeteaseMusic (github.com)](https://github.com/nondanee/UnblockNeteaseMusic/releases/tag/v0.25.3)

```bash
git clone https://github.com/nondanee/UnblockNeteaseMusic.git
```

### nodejs

[Download | Node.js (nodejs.org)](https://nodejs.org/en/download/)

#### windows

直接下载对应版本安装

```bash
node -v  # 测试
npm -v
```

更改npm配置

```
npm config set prefix 路径/node_global
npm config set cache 路径/node_cache
npm list -global  # 查看
npm install express -g  # 安装，测试cache路径（安装不了以管理员打开
npm list -g
```

更改环境变量

用户环境变量npm路径改为node_global路径

系统变量新建变量名NODE_PATH，值为路径\node_global\node_modules

#### linux

下载source code后解压就好（版本过高困难会报错

### 部署

#### windows

本地

```bash
node app.js -p 5000:5002 -e http://music.163.com
```

bat脚本

```bash
@echo off

tasklist | findstr -i "cloudmusic.exe"

if ERRORLEVEL 1 (
	echo Ready to run
	start "" "D:\CloudMusic296\cloudmusic.exe"
)else (
	echo Is running
)

node app.js -p 5000:5002 -e http://music.163.com
```

#### linux

云服务器 centos

```bash
vim /etc/systemd/system/UnblockNeteaseMusic.service
```

```bash
[Unit]
Description=UnblockNeteaseMusic service
After=network.target
Wants=network.target

[Service]
Type=simple
ExecStart=/usr/local/lib/nodejs/bin/node /usr/local/UnblockNeteaseMusic-0.25.3/app.js -p 5000:5002 -e http://music.163.com -s
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 设置开机自启动
systemctl daemon-reload
systemctl enable UnblockNeteaseMusic
# 操作
systemctl restart UnblockNeteaseMusic  # 重启
systemctl status UnblockNeteaseMusic -l  # 显示状态
systemctl stop UnblockNeteaseMusic  # 暂停
```

服务器断开后node停止运行，选择pm2管理

参考：[UnblockNeteaseMusic 使用方法 – 如风 (desperadoj.com)](https://desperadoj.com/17.html)

```bash
npm config set registry https://registry.npm.taobao.org  # 换源
npm install -g pm2  # 安装pm2
pm2 -v
```

```bash
pm2 start app.js -- -s -p 5000:5002  # 启动
pm2 save  # 保存
pm2 startup  # 设置开机自启
```

pm2常见命令

```bash
pm2 start []
pm2 stop
pm2 restart
pm2 list
pm2 delete
pm2 show []
```



### 使用

#### pc

网易云音乐软件 设置 ——> 工具 ——> 自定义代理，填写服务器ip（本地 127.0.0.1）和端口（5000），测试，确定

#### 安卓

参考：[redn3ck/unblockNeteaseMusic: yaml for unblockNeteaseMusic (github.com)](https://github.com/redn3ck/unblockNeteaseMusic)

[UnblockNeteaseMusic 使用方法 – 如风 (desperadoj.com)](https://desperadoj.com/17.html)

### 注意

- 软件只能用旧版的，新版代理不了
- http://music.163.com和https://music.163.com看情况换
- UnblockNeteaseMusic.service中的node和app.js用决定路径
