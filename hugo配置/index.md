# Hugo配置


环境：

- hugo：hugo v0.105.0+extended windows/amd64

- theme：LoveIt

## 配置

参考：[Hugo系列(3.0) - LoveIt主题美化与博客功能增强](https://lewky.cn/posts/hugo-3.html/)

### 侧目录

config.toml

```toml
# 目录配置
    [params.page.toc]
      # 是否使用目录
      enable = true
      # 是否保持使用文章前面的静态目录
      keepStatic = false
      # 是否使侧边目录自动折叠展开
      auto = true
```

### 搜索

采用[Algolia](https://www.algolia.com/)，创建新的Application(free)，记住index，appID和searchAPI，填入下面对应位置

将public内的index.json上传到Algolia：Search ——> index ——> Add records ——> Upload file

config.toml

```toml
[params.search]
	enable = true
	# 搜索引擎的类型 ("lunr", "algolia")
	type = "algolia"
	# 文章内容最长索引长度
	contentLength = 4000
	# 搜索框的占位提示语
	placeholder = ""
	# 最大结果数目
	maxResultLength = 10
	# 结果内容片段长度
	snippetLength = 50
	# 搜索结果中高亮部分的 HTML 标签
	highlightTag = "em"
	# 是否在搜索索引中使用基于 baseURL 的绝对路径
	absoluteURL = false
	[params.search.algolia]
	  index = ""
	  appID = ""
	  searchKey = ""
```

存在问题：需要手动上传json

### github corners

theme内对应文件复制到此位置

layout\partials\header.htnl

在`<div class="header-wrapper">`的下一行添加，更改yourname

```html
<a href="https://github.com/yourname" class="github-corner" target="_blank" title="Follow me on GitHub" aria-label="Follow me on GitHub"><svg width="3.5rem" height="3.5rem" viewBox="0 0 250 250" style="fill:#70B7FD; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1);" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
```

assets\css\\_custom.css

```css
/* Github Corner */
.github-corner:hover .octo-arm {
	animation: octocat-wave 560ms ease-in-out
}

@keyframes octocat-wave {
	0%,100% {
		transform: rotate(0)
	}

	20%,60% {
		transform: rotate(-25deg)
	}

	40%,80% {
		transform: rotate(10deg)
	}
}

@media (max-width:500px) {
	.github-corner:hover .octo-arm {
		animation: none
	}

	.github-corner .octo-arm {
		animation: octocat-wave 560ms ease-in-out
	}
}
```

其他样式：[GitHub Corners项目地址](https://tholman.com/github-corners/)

### 子菜单

layouts/partials/header.html

```html
{{- range .Site.Menus.main -}}
    {{- $url := .URL | relLangURL -}}
    {{- with .Page -}}
        {{- $url = .RelPermalink -}}
    {{- end -}}
    <a class="menu-item{{ if $.IsMenuCurrent `main` . | or ($.HasMenuCurrent `main` .) | or (eq $.RelPermalink $url) }} active{{ end }}" href="{{ $url }}"{{ with .Title }} title="{{ . }}"{{ end }}{{ if (urls.Parse $url).Host }} rel="noopener noreffer" target="_blank"{{ end }}>
        {{- .Pre | safeHTML }} {{ .Name }} {{ .Post | safeHTML -}}
    </a>
{{- end -}}
```

改为：

```html
{{- range .Site.Menus.main -}}
	{{ if .HasChildren }}
		<div class="dropdown">
			<a {{ if .URL }}href="{{ .URL }}"{{ else }}href="javascript:void(0);"{{ end }} class="menu-item menu-more dropbtn" title="{{ .Title }}" {{ if eq .Post "_blank" }}target="_blank" rel="noopener"{{ end }}>
				{{- .Pre | safeHTML }} {{ .Name }} {{ if ne .Post "_blank" }}{{ .Post | safeHTML -}}{{ end }}
			</a>
			<div class="menu-more-content dropdown-content">
				{{- range .Children -}}
					{{- $url := .URL | relLangURL -}}
					{{- with .Page -}}
						{{- $url = .RelPermalink -}}
					{{- end -}}
						<a href="{{ $url }}" title="{{ .Title }}" {{ if eq .Post "_blank" }}target="_blank" rel="noopener"{{ end }}>{{- .Pre | safeHTML }} {{ .Name }} {{ if ne .Post "_blank" }}{{ .Post | safeHTML -}}{{ end }}</a>
				{{- end -}}
			</div>
		</div>
	{{ else }}
		{{- $url := .URL | relLangURL -}}
		{{- with .Page -}}
			{{- $url = .RelPermalink -}}
		{{- end -}}
		<a class="menu-item{{ if $.IsMenuCurrent `main` . | or ($.HasMenuCurrent `main` .) | or (eq $.RelPermalink $url) }} active{{ end }}" href="{{ $url }}"{{ with .Title }} title="{{ . }}"{{ end }}{{ if (urls.Parse $url).Host }} rel="noopener noreffer" target="_blank"{{ end }}>
			{{- .Pre | safeHTML }} {{ .Name }} {{ if ne .Post "_blank" }}{{ .Post | safeHTML -}}{{ end }}
		</a>
	{{- end -}}
{{- end -}}
```

assets\css\\_custom.css

```css
/* 子菜单栏 */
.dropdown {
  display: inline-block;
}

/* 子菜单的内容 (默认隐藏) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  line-height: 1.3rem;
}

/* 子菜单的链接 */
.dropdown-content a {
  padding: 10px 18px 10px 14px;
  text-decoration: none;
  display: block;
  & i {
    margin-right: 3px;
  }
}

/* 鼠标移上去后修改子菜单链接颜色 */
.dropdown-content a:hover {
  background-color: #f1f1f1;
  border-radius: 4px;
}
/* 鼠标移上去后修改子菜单链接颜色 */
[theme=dark] .dropdown-content a:hover {
  background-color: #6c9dda;
  border-radius: 4px;
}

/* 在鼠标移上去后显示子菜单 */
.dropdown:hover .dropdown-content {
  display: block;
}

@media screen and (max-width: 680px) {
    .dropdown {
      display: inline;
    }
  .dropdown:hover .dropdown-content {
    display: inline;
    z-index: 1;
    margin-top: -2em;
    margin-left: 3em;
  }
  .dropdown-content a:hover {
    background-color: transparent;
  }
}
```

config.toml

```toml
[[menu.main]]
  parent = "<idetifier>"
  post = "_blank"  # 新窗口
```

### 更新时间

直接在文档头加lastmod信息

或者在config.toml添加

```toml
[frontmatter]
  lastmod = [":fileModTime", "lastmod"]
```

### 自定义js

\static\js\custom.js为自定义js

\layouts\partials\assets.html（复制theme下同文件

在`{{- partial "plugin/analytics.html" . -}}`上一行添加

```js
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery@2.1.3/dist/jquery.min.js"></script>

{{- /* 自定义的js文件 */ -}}
<script type="text/javascript" src="/js/custom.js"></script>
```

第一行为引入jQuery

## shortcode

### typeit

{{< typeit >}}
这一个带有基于 [TypeIt](https://typeitjs.com/) 的 **打字动画** 的 *段落*...
{{< /typeit >}}



### bilibili

layouts/shortcodes/bilibili.html

```html
<style>
.aspect-ratio {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 75%;
    }
      
.aspect-ratio iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    }
</style>
      

<div align=center class="aspect-ratio">
    <iframe  src="https://player.bilibili.com/player.html?bvid={{.Get 0 }}&page={{ if .Get 1 }}{{.Get 1}}{{ else }}1&high_quality=1&danmaku=0{{end}}"
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    allowfullscreen="true" 
	sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"> 
    </iframe>
</div>
```

存在问题：切换清晰度后无法播放

{{< bilibili BV15D4y197NU>}}



### music

参数：

- server [`netease`, `tencent`, `kugou`, `xiami`, `baidu`]
- type [`song`, `playlist`, `album`, `search`, `artist`]
- id 

{{< music server="netease" type="playlist" id="3131254747" >}}



### image

{{< image src="/images/w.jpg" height="300">}}

{{< image src="https://raw.githubusercontent.com/githubmof/Img/main/img/w(%E5%B0%8F).jpg" height="300">}}

存在问题：缩放后无法居中



### admonition

{{< admonition >}}
一个 **注意** 横幅
{{< /admonition >}}



### 抓猫游戏

项目：[ganlvtech/phaser-catch-the-cat: An HTML5 game 'Catch The Cat' powered by Phaser 3 ](https://github.com/ganlvtech/phaser-catch-the-cat)

md文件直接引用js无效，选择创建shortcode

layouts\shortcodes\catch-the-cat

```html
<script src="/js/catch-the-cat/phaser.min.js"></script>
<script src="/js/catch-the-cat/catch-the-cat.js"></script>
<div id="catch-the-cat"></div>
<script>
    window.game = new CatchTheCatGame({
        w: 11,
        h: 11,
        r: 20,
        backgroundColor: 0xeeeeee,
        parent: 'catch-the-cat',
        statusBarAlign: 'center',
        credit: 'github.com/ganlvtech'
    });
</script>
```

将phaser.min.js和catch-the-cat.js保存到static\js\catch-the-cat\下

content\catch-the-cat\index.md

```markdown
---
title: "逮住那只猫!"

---

## 游戏规则

1. 点击小圆点，围住小猫。
2. 你点击一次，小猫走一次。
3. 直到你把小猫围住（赢），或者小猫走到边界并逃跑（输）。

---

{\{< catch-the-cat >}}
```

（去掉括号中间斜杆）

在config.toml的menu引入即可



### 其他

[主题文档 - 扩展 Shortcodes - LoveIt (hugoloveit.com)](https://hugoloveit.com/zh-cn/theme-documentation-extended-shortcodes/)

