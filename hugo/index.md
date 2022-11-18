# Hugo


## Hugo

### go

[Downloads - The Go Programming Language (google.cn)](https://golang.google.cn/dl/)

### hugo

[Releases · gohugoio/hugo (github.com)](https://github.com/gohugoio/hugo/releases)



### 创建

```bash
hugo new site name  # 创建网站文件夹name
hugo new posts/my-first-post.md  # 创建文件my-first-post.md，在contets/posts文件夹下
hugo server -D  # 启动Hugo服务器
hugo -d docs # 打包到docs文件夹
```

### github page

网站源码仓库hugo_blog为私有，发布仓库yourname.github.io为公有

#### token

在 Settings ——> Developer settings ——> Personal access tokens ——> Token(classic) 生成token，选择repo和workflow，记住token

#### Action

在hugo_blog的Settings ——> Secrets ——> Actions中填在上述token

在本地源码仓库新建 .github/workflows/main.yml

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - main  # 博客根目录的默认分支，这里是main，有时也是master
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-20.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.105.0'  # 填写你的hugo版本，可用hugo version查看
          extended: true          # 如果你使用的不是extended版本的hugo，将true改为false

      - name: Build
        run: hugo --minify

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        if: ${{ github.ref == 'refs/heads/main' }}  # 注意填写main或者master
        with:
          personal_token: ${{ secrets.secret}} # secret为添加secrets所设名字
          external_repository: yourname/yourname.github.io # 发布仓库名
          publish_branch: main  # 发布仓库分支main或者master
          publish_dir: ./public
          #cname: www.example.com        # 填写你的自定义域名。如果没有用自定义域名，注释掉这行

```

之后push源码仓库，就会触发Github Action，将public文件夹推送到发布仓库

#### 发布

```bash
hugo -b "https://yourname.github.io"
git add .
git status
git commit -m "message"
git push origin main -f
```



## LoveIt

[LoveIt (hugoloveit.com)](https://hugoloveit.com/zh-cn/)

### 下载

```bash
git init
git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt
```

### 配置

[主题文档 - 基本概念 - LoveIt (hugoloveit.com)](https://hugoloveit.com/zh-cn/theme-documentation-basics/)

config.toml

```toml
baseURL = "http://example.org/"
# [en, zh-cn, fr, ...] 设置默认的语言
defaultContentLanguage = "zh-cn"
# 网站语言, 仅在这里 CN 大写
languageCode = "zh-CN"
# 是否包括中日韩文字
hasCJKLanguage = true
# 网站标题
title = "我的全新 Hugo 网站"

# 更改使用 Hugo 构建网站时使用的默认主题
theme = "LoveIt"

[params]
  # LoveIt 主题版本
  version = "0.2.X"

[menu]
  [[menu.main]]
    identifier = "posts"
    # 你可以在名称 (允许 HTML 格式) 之前添加其他信息, 例如图标
    pre = ""
    # 你可以在名称 (允许 HTML 格式) 之后添加其他信息, 例如图标
    post = ""
    name = "文章"
    url = "/posts/"
    # 当你将鼠标悬停在此菜单链接上时, 将显示的标题
    title = ""
    weight = 1
  [[menu.main]]
    identifier = "tags"
    pre = ""
    post = ""
    name = "标签"
    url = "/tags/"
    title = ""
    weight = 2
  [[menu.main]]
    identifier = "categories"
    pre = ""
    post = ""
    name = "分类"
    url = "/categories/"
    title = ""
    weight = 3

# Hugo 解析文档的配置
[markup]
  # 语法高亮设置 (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    # false 是必要的设置 (https://github.com/dillonzq/LoveIt/issues/158)
    noClasses = false
```

```bash
hugo server --disableFastRender -b http://localhost:1313 -e production
```



## Hugo MEME

[Hugo 主题 MemE 文档 | reuixiy (io-oi.me)](https://io-oi.me/tech/documentation-of-hugo-theme-meme/#hugo)

### 开启不蒜子

[不蒜子 | 不如 (ibruce.info)](http://ibruce.info/2015/04/04/busuanzi/)

在 config.toml 对应位置开启

测试时 hugo server -D --environment production，否则不会显示（试了好久

[希望能在config中开启不算子或者其他方式统计文章访问量统计 · Issue #40 · reuixiy/hugo-theme-meme (github.com)](https://github.com/reuixiy/hugo-theme-meme/issues/40)



### 图床图片显示问题

本地可查看图片，说明图床没问题，问题出现在浏览器方面

解决：在文章头添加

```html
<meta name="referrer" content="no-referrer" />
```

或者在blog下的layouts/partials/custom/post-meta.html添加

参考：[解决hexo博客不能显示图床图片问题 ｜ 客舟听雨 (hj24.life)](https://hj24.life/posts/解决hexo博客不能显示图床图片问题/)


