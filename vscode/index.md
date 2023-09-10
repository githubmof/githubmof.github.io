# vscode


## IDE配置

### python

python 插件，选择python路径

### C++

[挑把趁手的兵器——VSCode配置C/C++学习环境（小白向） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/147366852)

### php

配合phpstudy

参考：[VScode+phpStudy搭建php代码调试环境_lceFIre的博客-CSDN博客_vscode+phpstudy](https://blog.csdn.net/weixin_44937674/article/details/104696857)

xdebug2（3比较麻烦

![image-20230910112433021](https://raw.githubusercontent.com/githubmof/img/main/img/202309101124054.png)

php.ini添加

```bash
xdebug.remote_enable=1
xdebug.remote_autostart = 1
```

vscode安装php debug，并在设置-->扩展-->php的settings.json中添加

```basic
"php.validate.executablePath": "E:\\web\\phpstudy_pro\\Extensions\\php\\php7.3.4nts\\php.exe"
```

F5调试生成配置，将端口改为phpstudy中xdebug端口

![image-20230910112615805](https://raw.githubusercontent.com/githubmof/img/main/img/202309101126840.png)

启动phpstudy，vscode断点启动调试，浏览器打开调试php

（不debug，直接运行，可以选择，环境变量添加php.exe路径，配合vscode的扩展code runner）

### composer

https://pkg.xyz/#how-to-install-composer

在项目目录下安装包，php中引用包

```php
<?php
require 'vendor/autoload.php';
```

### html/css/js

不太算

### go

[配置 Visual Studio Code for Go 开发 | Microsoft Docs](https://docs.microsoft.com/zh-cn/azure/developer/go/configure-visual-studio-code)

[vs code配置go开发环境 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/262984879)

重启vscode再安装插件；得在当前文件夹下的文件夹中运行

### C#

[用VS Code写C# - springsnow - 博客园 (cnblogs.com)](https://www.cnblogs.com/springsnow/p/12881499.html)
