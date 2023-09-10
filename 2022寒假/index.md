# 2022寒假


## MISC

### tools
（Hgame 2021 Week2）  

[附件](https://pan.baidu.com/s/1tniM-yY-HXuSt9mHP2cz2A?pwd=qcgr)

1.  从压缩包名字可知图片由F5加密，从图片属性得到密码，f5-steganography解密得到下一层密码(注意解密时密码加' ') 
2.  同理，第二层是steghide
3.  第三层是outguess
4.  第四层是JPHS
5.  将前面四个图片拼图成一个二维码，扫描得到**hgame{Taowa_is_N0T_g00d_but_T001s_is_Useful}** 
### YUSA的小秘密
（西湖论剑 2021）  

[附件](https://pan.baidu.com/s/1ftOvLMb69mLrPuPoS8Luaw?pwd=h9zm)  

YCrCb通道的LSB隐写，利用Python的cv2库进行色彩空间转换并提取通道信息  

可参考ByteCTF 2020的[Hardcore Watermark 01](https://bytectf.feishu.cn/docs/doccnqzpGCWH1hkDf5ljGdjOJYg)

```python
import cv2
img=cv2.imread('D:\IDM download\lsb\lsb.png') #图片路径
src_value=cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
a, b, c = cv2.split(src_value)   #使用cv.split分离通道
#对三个通道中的数据分别根据奇偶做二值化处理，并分别保存为图片
cv2.imwrite('a.png', (a % 2) * 255)   
cv2.imwrite('b.png', (b % 2) * 255)
cv2.imwrite('c.png', (c % 2) * 255)
```
![image-20230910110647556](https://raw.githubusercontent.com/githubmof/img/main/img/202309101106638.png)

从a.png可以清晰得到**DASCTF{2947b683036d49e5681f83f7bc3fbb34}**

### 不起眼压缩包的养成的方法
（Hgame 2021 Week1）  

[附件](https://pan.baidu.com/s/1JUkg8zeM9aXzH0CxyDZdNg?pwd=ugyt)  

一张0x4qE.jpg（圣人惠），备注 Secret hidden IN picture.  

在010 editor打开，发现zip文件头，用kali的binwalk提取压缩包，压缩包备注 Password is picture ID (Up to 8 digits)  

暴力破解得到密码 **70415155**，得到另一个压缩包和一个NO PASSWORD.txt  

发现压缩包中有相同txt，尝试明文破解，结合明文提示，使用winrar采用Store压缩方法将明文压缩成zip（不然用软件明文破解时会报错），再用软件ARCHPR进行明文破解，得到密码 **C8uvP$DP** ，解压后得到flag.zip  

用010 editor查看，发现一串奇怪字符
![image-20230910110751896](https://raw.githubusercontent.com/githubmof/img/main/img/202309101107960.png)
html编码，用[CyberChef](https://gchq.github.io/CyberChef/)解码得到**hgame{2IP_is_Usefu1_and_Me9umi_i5_W0r1d}**

### 内存取证
（V&N 2020公开赛）  

[题目链接](https://buuoj.cn/match/matches/3/challenges#%E5%86%85%E5%AD%98%E5%8F%96%E8%AF%81)  

题目给了一个raw镜像文件，用volatility查看基本信息

```bash
# volatility2在kali中的安装：
git clone https://github.com/volatilityfoundation/volatility
# 直接下载，解压后即可使用,需用python2
# 不过老是会报错无Crypto.Hash模块
```
```bash
sudo python vol.py -f ../mem.raw imageinfo 
# 查看文件的profile Win7SP1x86_23418
sudo python vol.py -f ../mem.raw --profile=Win7SP1x86_23418 filescan | grep flag
# 查看有没有名为flag文件
```
![image-20230910110900470](https://raw.githubusercontent.com/githubmof/img/main/img/202309101109515.png)
```bash
sudo python vol.py -f ../mem.raw --profile=Win7SP1x86_23418 pslist
# 查看运行了哪些进程
```
![image-20230910111018298](https://raw.githubusercontent.com/githubmof/img/main/img/202309101110342.png)
其中有几个关键应用，notepad是文本编辑器，iexplore是ie浏览器，mspaint是xp系统自带的画板。

TrueCrypt是一款免费，开源的支持Windows Vista/XP/2000 and Linux的绿色虚拟加密磁盘工具，可以在硬盘上创建一个或多个虚拟磁盘，所有虚拟磁盘上的文件都被自动加密，需要通过密码来进行访问。 TrueCrypt提供多种加密算法，如AES-256、Blowfish(448-bitkey)、CAST5、Serpent、Triple DES等，其他特性还包括支持FAT32和NTFS分区、隐藏卷标和热键启动。

```bash
sudo python vol.py -f ../mem.raw --profile=Win7SP1x86_23418 iehistory | grep 'https://'
# 查看浏览器记录
```
很明显的是访问了百度网盘
```bash
sudo python vol.py -f ../mem.raw --profile=Win7SP1x86_23418 editbox
# 查看文本编辑器
```
![image-20230910111138222](https://raw.githubusercontent.com/githubmof/img/main/img/202309101111271.png)
给出了百度网盘链接和提取码，不过分享文件取消了，[题目](https://buuoj.cn/match/matches/3/challenges#%E5%86%85%E5%AD%98%E5%8F%96%E8%AF%81)有给附件，是一个VOL文件

```bash
sudo python vol.py -f ../mem.raw --profile=Win7SP1x86_23418 memdump -p 2648 --dump-dir=../
# 通过pid将mspaint这块内存dump下来
```
将2648.dmp后缀改为data，然后用gimp打开（kali中直接用apt-get安装即可），先任意宽度和高度，调节位移出现模糊字迹，再调节宽度至清晰，上下翻转后（可以放到word中翻转）得到**1YxfCQ6goYBD6Q**

![image-20230910111240188](https://raw.githubusercontent.com/githubmof/img/main/img/202309101112235.png)

接下来是TrueCrypt，OVL文件是用TrueCrypt加密后的一个磁盘，需要进行解密  

先将TrueCrypt内存dump下来

```bash
sudo python vol.py -f ../mem.raw --profile=Win7SP1x86_23418 memdump -p 3364 --dump-dir=../
```
再用到软件[Elcomsoft Forensic Disk Decryptor](https://cn.elcomsoft.com/efdd.html)，来破解这个磁盘文件的key值。  

选择 Decrypt or mount disk ==> Image file of disk\partition ==> Memory dump，选择vol和.dmp文件 ==> Mount Disk

然后在E盘（临时分区）得到key值**uOjFdKu1jsbWI8N51jsbWI8N5**  

接下来用软件[VeraCrypt](https://www.veracrypt.fr/en/Downloads.html)挂载磁盘
![image-20230910111911118](https://raw.githubusercontent.com/githubmof/img/main/img/202309101119185.png)
在F盘得到zip加密文件，密码是之前mspaint得到的字符串，解压后得到  

flag**RoarCTF{wm_D0uB1e_TC-cRypt}**  

参考：  

[BUUCTF V&N-misc内存取证 - Pur3 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wrnan/p/12393800.html)  

[内存取证例题 - 不会修电脑 - 博客园 (cnblogs.com)](https://www.cnblogs.com/bhxdn/p/14807898.html)

## WEB
phpstudy在kali的安装：
```bash
sudo wget -O install.sh https://notdocker.xp.cn/install.sh && sudo bash install.sh
```
安装成功后点击内网链接，登录phpstudy，在软件管理中安装MySQL并启动  

配置靶场参考：[kali虚拟机phpstudy 下配置sqli-labs靶场 - HYLUZ](https://www.hyluz.cn/?id=379)  

DVWA靶场配置：[DVWA 靶场环境搭建 - Butterflier - 博客园 (cnblogs.com)](https://www.cnblogs.com/DF-yimeng/p/15847998.html)

