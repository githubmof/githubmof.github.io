# Git


## Git

### 常用命令

`git init` 初始化

`git remote add origin git@github.com:yourname/respositoryname.git`  连接远程仓库（ssh）

`git remote add origin https://github.com/yourname/respositoryname.git` 连接远程仓库（https）

`git add .`  添加

`git status`  查看状态

`git commit -m "yourtext"`  提交

`git push origin main` 推送到远程仓库的main分支

`git branch -M main`  切换为main分支，推送报错使用



`git log --pretty=oneline`  查询版本ID

`git reset --hard ID`  恢复历史版本

`git push -f -u origin`  推送



清空仓库：pull后删除再push



### ssh

用git bash

```bash
cd C:\Users\Administrator
ssh-keygen -t rsa -C "youremail@example.com"
```

三次回车，复制.ssh目录下的id_rsa.pub内容

打开github，在settings的SSH and GPG keys中添加

```bash
 ssh -T git@github.com  # 测试
```

```bash
git config --global http.sslVerify "false"  # 取消ssl验证
git config --global http.sslVerify "true" # 开启ssl验证
```



### 子模块

```bash
git submodule add [address]  # 添加子模块
git clone --recursive [adress]  # 子项目一起clone
git submodule update --init  # 或者clone后更新
```

fatal: 'xxx' already exists in the index

```bash
git rm -r --cached xxx
```



### 代理

[一文让你了解如何为 Git 设置代理 - Eric (ericclose.github.io)](https://ericclose.github.io/git-proxy-config.html)

特定域名代理

#### http代理

7890为clash http代理端口

```bash
git config --global http.https://github.com.proxy http://127.0.0.1:7890
```

#### ssh代理

在~/.ssh/.config

windows

```bash
Host github.com
    User git
    ProxyCommand nc -X connect -x 127.0.0.1:7890 %h %p
```

linux

```bash
Host github.com
    User git
    ProxyCommand nc -X connect -x 127.0.0.1:7890 %h %p
```

```bash
ssh -T git@github.com  # 测试
```

#### 取消代理

在文件~/.gitconfig 和 ~/.ssh/.config 对应位置删除或注释


