# 图床




### 选择

gitee 容量小，上传图片只能小于1mb，国内速度快

github 容量大，国内速度慢

github问题比较多，再加上图片不大，故选择gitee



### 搭建

#### gitee

创建公开仓库，其他配置随意

设置 ==> 安全设置 ==> 私人令牌 ==> 生成新令牌，选择user_info和projects，提交，复制令牌

#### nodejs和PicGo

[Node.js (nodejs.org)](https://nodejs.org/en/)

[Releases · Molunerfinn/PicGo (github.com)](https://github.com/Molunerfinn/PicGo/releases)

PicGo插件设置中安装gitee-uploader（按照不了，考虑网络或管理员运行

在图床设置的gitee中填写信息，repo是用户名/仓库名，branch默认master，token为上述令牌，path为文件夹名

PicGo可在设置选择时间戳重命名

#### Typora

在“偏好设置”的“图像” 中“插入图片时”选择上传图片，“上传服务”选择PicGo（app），选择软件路径，检验



#### github

仓库的令牌在 Setting ==> Developer settings ==> Personal access tokens，点击generate new token，选择repo，生成后复制令牌

在PicGo的github图床设置填写信息，分支默认main，其他同上

默认github图床不支持同步删除，可选择插件picgo-plugin-github-plus
