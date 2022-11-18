# KapCup2021


## MISC

### check in

> flag in rules

签到题，在答题界面的RULES中发现 **Kap0k{this_is_a_sample_flag}**



### 点击

[下载](https://pan.baidu.com/s/1IVVkJS3vuOlDKIYeer9gsQ)

> 听说点66666次就有flag

下载解压后有个exe文件，直接运行，提示点击66666次就会出现flag，用连点器点击或者python脚本，得到**Kap0k{amaz1ng_y0u_d1d_1t}**

也可通过修改文件（之后试试



### 歪比巴卜 

> 密文：比歪巴卜比巴歪比比卜歪歪歪卜歪歪比巴巴卜比卜巴卜比巴比歪比巴歪比比巴巴比比巴比巴比卜比比比比卜卜比巴比比比巴卜巴比巴歪卜比巴卜卜比巴比歪比巴比比比比卜卜比卜比歪比巴巴歪比巴比比比比卜卜比巴比巴比巴卜歪比巴歪比比巴比卜比卜卜比

1.一共有112个字，每4个一组，共28组，根据flag的要求，判断前六组和最后一组应表示 Kap0k{ 和 } ，对比ASCII值，发现比对应01，歪对应00，巴对应10，卜对应11

2.直接在users的CrzZ分享的[网站](https://cloud.jeffz.cn/)中找到[戴夫编码](https://cloud.jeffz.cn/websites/daifu/)

3.在GitHub/Gitee上搜索[戴夫编码](https://github.com/Jeffz615/daifu)（吃了搜索引擎的亏

得到 **Kap0k{daifu_encode_the_flag}**



### 多拉贡

> {{< image src="/images/kapCup2021/dragon.png" >}}

一张奇怪符号的图，看到多拉贡，想到日语的龙，应该是龙语，找到龙语对应表

{{< image src="/images/kapCup2021/dictionary.jpg">}}

翻译后为：

```txt
ah b ur aa ir j ii j ur b ir
b ah ur ur f ur e ir ah uu f
ah ah ir ei ur aa ur ir ur f ur
e ur ei ur f ir ei ur e ir d
```

再根据[字典](https://www.thuum.org/learn/grammar/alphabet.php#0)

```txt
aa ei ii ah uu ur ir oo ey
1  2  3  4  5  6  7  8  9
```

翻译为(上述的j对应的图像找不到，在字典对应为0)

```
4b6170306b7b466f6e745f447261676f6e626f726e7d
```

最后hex解码得到 **Kap0k{Font_Dragonborn}**

参考：[龙语指南 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/56226568)



### pvz

[下载](https://pan.baidu.com/s/1gcZNayieq-brOnTQmomV9Q)

> 热爱学习的msk想要阻止你玩植物大战僵尸，他能成功吗？

1. 直接玩

2. 修改器跳关 1-9 2-9 3-9 4-9 5-9

3. 使用[Pvztoolkit](https://github.com/lmintlcx/pvztoolkit/releases)解压main.pak，在图片里找到flag的各部分

   [工具下载](https://pan.baidu.com/s/1q1lClhMHZJ3Nrc3aLmPdBw)

得到 **Kap0k{pVz_1s_A_g00d_g4m3_And_U_d0_well}**



### 藏了东西？

[下载](https://pan.baidu.com/s/10evyykk2bKpZ89TyikKWwg)

> 套套套
>
> Hint： http://www.hiencode.com/cvencode.html
>
> https://www.qqxiuzi.cn/bianma/zhalanmima.php

下载解压后有张png，“听说最后的64能变成图片”，无法查看，用010editor打开后发现zip文件的头文件名，于是将图片后缀改为zip，解压发现有一个蜜雪冰城宣传片的mp4和一个“套娃”txt，文本只有. - 和 / ，~~本来以为是摩斯密码，发现位数不对，视频也看不出什么头绪~~

是中文的摩斯密码，与英文的位数不同（哭

根据hint，然后用社会主义核心价值观编码，得到一串字符

再用栅栏编码解码，试出秘钥为4

然后base64转图片，得到一张二维码，扫码得

**Kap0p{We1c0Me_y0u!}**



## CRYPTO

### Just a ^

> Cix8cs[afodmWjq|mWpgzu
>

题目的^，想到按位异或运算符，应该是异或运算解密，用[在线工具](http://www.atoolbox.net/Tool.php?Id=857)，试出秘钥是8，得到 **Kap0k{Single_byte_xor}**



### MD2016

> 全栈的K2016跟ver讨教之后学会了口算MD5的能力，但是每次只能对flag的2个字节进行计算，计算出来的结果也有缺失，精通密码学的你能恢复出原文吗？
>

```txt
****************e93fbc13f4d2273e 
****************e00c54316adbf083 
****************609607cc8d69a97d 
****************41be06278689dc63 
****************046d1b2674a52bd3 
****************0821f9e81d0cdb2c 
****************910cfad17d0051b3 
****************3a84aa94c166b05d 
****************1f1a016bfa72c073 
****************899c0d4756848ee4 
****************a1da0bca241abda1 
****************0524ecc85a76f8bd 
****************876ea857f92e319b 
****************0bf489821c21fc3b 
****************654dde3968d3440d 
****************15d46a824d09313b 
```

一个MD5加密文本，用在线工具对每部分解密，结合得到 **Kap0k{K2016_1s_G00d_at_hashing!}**

网站推荐：[md5在线解密破解,md5解密加密 (cmd5.com)](https://cmd5.com/)

​                    [MD5解密-BeJSON.com](https://www.bejson.com/enc/md5dsc/)



### RSA Seed

[下载](https://pan.baidu.com/s/1ux7tB32DhNU80LR_Qp8UUg)

txt有密文，py文件的随机数种子固定为 0xdeafbeaf ，因此p，q固定

用RSA解密工具或脚本得到原文 

```txt
m=7938505641654112737445626671872570412903835783544432933
038852367485 
```

再用python的long_to_bytes得到 **Kap0k{R5A_w1th_A_magic_s33d}**

（后面补上



### Easy_RSA

[下载](https://pan.baidu.com/s/1JyiwzDQ8WRhcsBAcFjIEZw)

> Hint: 你知道 factordb 吗

n直接用[factordb](http://www.factordb.com/index.php?query=)分解，n可分解为多素数，欧拉函数φ为各素数减一的乘积

```Python
from Crypto.Util.number import *
c = 19058649698448481327662288309014996437867089462467854213754064625062843172369865409619757925980270306508954454575425020730394903327631423606016748053972987211810416884623295545122983993611757755308351931692127072347269425901209881662573091894988643016755340465009769014399775458735295274870361434346356899050
e = 65537
n = 23378807335526587719932898568664877863691922548813365610136714858831801042593820623006820689996660098664381214241181100244763895901736042928097423931935422683414906390744676513787322268393233577645714190413146647948613667557460677357799960251407929860849183858131635574782534182923253726488348395893326594517
p = 4365755866205443899755782721562411311150215750809669260400498460989033152542880660227954988353345455300725395146921131480718728248373888358088627476435681
q = 5355042300119863584337012303033836486850261699285503389259299491614714002509331394489960019492668217514952524559224304164598830770603903540883989045264757

p0 =  1571309773645429525824424503538811175321426121623539717924793739200025118947101278610432986391353227229895933545828811999494839297593376963231547

phi = (6-1)*(11351-1)*(27197-1)*(p0-1)*(q-1)

d = inverse(e,phi)

print(long_to_bytes(pow(c,d,n)))
```

得到 **Kap0k{f@ct0R_dB_1s-u53fu1}**



### FlagGenerator

[下载](https://pan.baidu.com/s/12hgKu-JWW4NsREcsOt4tmw)

> Hint：Python的随机数是怎么产生的？

（后补



## 总结

1. 多换个搜索引擎查，必应、谷歌、百度
1. 密码学原理
1. python脚本使用

