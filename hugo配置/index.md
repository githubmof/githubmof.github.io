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

assets\css\\_custom.scss

```scss
/* 目录 */
.toc {
  background: white;
opacity: .95;
}
[theme=dark] .toc {
  background: #2f2e2e;
}
[theme=dark] #toc-auto {
  border-left-color: #6c9dda;
}

.toc .toc-content {
  font-size: .8rem;
}

.toc .toc-content code {
  border: none;
  color: #f7ab01;
  font-size: 1em;
}

nav#TableOfContents ol {
  padding-inline-start: 30px;

  & ol {
      padding-inline-start: 15px;
      font-size: .75rem;
      display: none;
  }

  & li.has-active ol {
      display: block;
  }
}
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

assets\css\\_custom.scss

```scss
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



### 背景图片轮换

这个功能需要引入图片轮播插件`jquery-backstretch`的cdn，并且该插件依赖于jQuery

layouts\partials\assets.html

在引入custom.js前添加

```js
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery@2.1.3/dist/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jquery-backstretch@2.1.18/jquery.backstretch.min.js"></script>
```

static\js\custom.js

```js
/* 轮播背景图片 */
$(function () {
	$.backstretch([
		  "/images/background/saber1.jpg",
		  "/images/background/saber2.jpg",
		  "/images/background/wlop.jpg"
	], { duration: 60000, fade: 1500 });
});
```

assets\css\\_custom.scss

包含对各页面的调整

```scss
/* 首页头部 */
.home[posts] .home-profile {
  padding-top: 0;
}

.home-avatar {
  padding-top: 2rem !important;
}

.home-profile {
  margin-left: -1rem;
  margin-right: -1rem;
  background: white;
  opacity: .85;
}

[theme=dark] .home-profile {
  background: #3a3535;
  opacity: .8;
}

.home .home-profile .home-title {
  margin-top: .67em;
}

/* 首页文章摘要 */
.summary {
  margin-bottom: .1rem;
  margin-left: -1rem;
  margin-right: -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background: white;
  opacity: .95;
}

[theme=dark] .summary {
  background: #3a3535;
}

/* 首页的分页页码 */
.pagination {
  margin-top: .1rem;
  margin-bottom: 0;
  margin-left: -1rem;
  margin-right: 1rem;
  padding: 1rem 2rem .5rem 0;
  background: white;
  opacity: .95;
}

[theme=dark] .pagination {
  background: #3a3535;
}


/* 首页的阅读全文按钮 */
.single.summary .post-footer a:first-child {
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: -0.25em;
    right: -0.25em;
    background-color: hsla(341, 66%, 74%, 0.75);
    transform-origin: center right;
    transform: scaleX(0);
    transition: transform 0.2s ease-in-out;
  }

  &:hover::before {
    transform: scaleX(1);
    transform-origin: center left;
  }
}

/* 文章正文 */
.page.single .content p {
  margin: 1rem 0;
  padding: 0 1rem;
}

/* 文章脚部 */
.page.single .post-footer {
  margin-top: 0;
  margin-bottom: 1rem;
}

/* 文章元数据meta */
.post-meta .post-meta-line:nth-child(2) i:nth-child(1) {
  margin-left: 0;
}

.post-meta .post-meta-line:nth-child(2) i {
  margin-left: 0.3rem;
}

.post-meta .post-meta-line:nth-child(2) span i {
  margin-left: 0.3rem !important;
}

.post-meta a#post-meta-vcount {
  color: #a9a9b3;

  &:hover {
    color: #2d96bd;
  }
}


/* 文章的标签 */
.post-tags a {
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #fc2f70;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }

  &::before {
    top: 0;
    transform-origin: center right;
  }

  &:hover::before {
    transform-origin: center left;
    transform: scaleX(1);
  }

  &::after {
    bottom: 0;
    transform-origin: center left;
  }

  &:hover::after {
    transform-origin: center right;
    transform: scaleX(1);
  }

}


/* 页面脚部 */
.footer {
  display: block;
  border-top-width: 3px;
  border-top-style: solid;
  border-top-color: #a166ab;
  position: relative;
  z-index: -1;
  max-width: 800px;
  width: 60%;
  margin: .1rem auto 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  background: white;
  opacity: .95;
}

[theme=dark] .footer {
  background: #3a3535;
}

@media only screen and (max-width: 1440px) {
  .footer {
    width: 54.5%
  }
}

@media only screen and (max-width: 1200px) {
  .footer {
    width: 50.5%
  }
}

@media only screen and (max-width: 960px) {
  .footer {
    width: 77%
  }
}

@media only screen and (max-width: 680px) {
  .footer {
    width: 95%
  }
}

/* 分隔线 */
hr {
  border: none;
  border-bottom: 2px dashed #7a7a7a !important;
}

/* 标题 */
.page.single h2 {
  box-shadow: rgb(95, 90, 75) 0px 0px 0px 1px, rgba(10, 10, 0, 0.5) 1px 1px 6px 1px;
  color: rgb(255, 255, 255);
  font-family: 微软雅黑, 宋体, 黑体, Arial;
  font-weight: bold;
  line-height: 1.3;
  text-shadow: rgb(34, 34, 34) 2px 2px 3px;
  background: rgb(43, 102, 149);
  border-radius: 6px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  padding: 7px;
  margin: 18px 0px 18px -5px !important;
}

/* 归档、标签、分类、特殊页面 */
.page.archive,
.page.single,
.page.single.special {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  background: white;
  opacity: .95;
}

[theme=dark] .page.archive,
[theme=dark] .page.single,
[theme=dark] .page.single.special {
  background: #3a3535;
}

.archive-item-date2 {
  color: #a9a9b3;
}

[theme=dark] .archive .archive-item-date {
  color: #a9a9b3;
}

.page.single.special .single-title.animated.pulse.faster {
  padding-right: 1rem;
}

.archive .card-item-title a sup {
  color: #a9a9b3;
  font-weight: initial;
}

.archive .group-title sup {
  color: #a9a9b3;
  font-weight: initial;
}

.archive .single-title.animated.pulse.faster sup {
  margin-left: .4rem;
  color: #a9a9b3;
  font-weight: initial;
}

[theme=dark] .archive .tag-cloud-tags a sup {
  color: #a9a9b3;
}

/* 分类页面 */
.archive .categories-card {
  margin-top: 1rem;

  & .card-item {
    margin-top: 1rem;
  }
}

/* 标题里的代码块样式 */
.page.single .content>h2 code {
  color: #f7ab01;
  background: transparent !important;
  border: none;
}
```

### 文章加密

layouts\posts\single.html

在`{{- $params := .Scratch.Get "params" -}}`的下一行添加

```html
{{- $password := $params.password | default "" -}}
{{- if ne $password "" -}}
	<script>
		(function(){
			if({{ $password }}){
				if (prompt('请输入文章密码') != {{ $password }}){
					alert('密码错误！');
					if (history.length === 1) {
						window.opener = null;
						window.open('', '_self');
						window.close();
					} else {
						history.back();
					}
				}
			}
		})();
	</script>
{{- end -}}
```

文章头部加上password属性即可加密



### 拉姆雷姆跳转

layouts\_default\baseof.html

在`{{- /* Load JavaScript scripts and CSS */ -}}`的上面一行添加

```html
<div class="sidebar_wo">
  <div id="leimu">
	<img src="https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/leimuA.png" alt="雷姆" 
	onmouseover="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/leimuB.png'" 
	onmouseout="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/leimuA.png'" title="回到顶部">
  </div>
  <div class="sidebar_wo" id="lamu">
	<img src="https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/lamuA.png" alt="雷姆" 
	onmouseover="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/lamuB.png'" 
	onmouseout="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/lamuA.png'" title="回到底部">
  </div>
</div>
```

assets\css\\_custom.scss

```scss
<div class="sidebar_wo">
  <div id="leimu">
	<img src="https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/leimuA.png" alt="雷姆" 
	onmouseover="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/leimuB.png'" 
	onmouseout="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/leimuA.png'" title="回到顶部">
  </div>
  <div class="sidebar_wo" id="lamu">
	<img src="https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/lamuA.png" alt="雷姆" 
	onmouseover="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/lamuB.png'" 
	onmouseout="this.src='https://cdn.jsdelivr.net/gh/lewky/lewky.github.io@master/images/b2t/lamuA.png'" title="回到底部">
  </div>
</div>
```

static\js\custom.js

需引入jQuery

```js
/* 拉姆蕾姆回到顶部或底部按钮 */
$(function() {
	$("#lamu img").eq(0).click(function() {
		$("html,body").animate({scrollTop:$(document).height()},800);
		return false;
	});
	$("#leimu img").eq(0).click(function() {
		$("html,body").animate({scrollTop:0},800);
		return false;
	});
});
```



### 添加文章数量统计

layouts\taxonomy\list.html

```html
{{- if eq $taxonomy "category" -}}
    <i class="far fa-folder-open fa-fw"></i>&nbsp;{{ .Title }}
{{- else if eq $taxonomy "tag" -}}
    <i class="fas fa-tag fa-fw"></i>&nbsp;{{ .Title }}
{{- else -}}
```

改为：

```html
{{- if eq $taxonomy "category" -}}
    <i class="far fa-folder-open fa-fw"></i>&nbsp;{{ .Title }}<sup>{{ len .Pages }}</sup>
{{- else if eq $taxonomy "tag" -}}
    <i class="fas fa-tag fa-fw"></i>&nbsp;{{ .Title }}<sup>{{ len .Pages }}</sup>
{{- else -}}
```

```html
{{- range $pages.PageGroups -}}
    <h3 class="group-title">{{ .Key }}</h3>
```

改为：

```html
{{- range $pages.PageGroups -}}
    <h3 class="group-title">{{ .Key }} <sup>{{ len .Pages }}</sup></h3>
```

改为按月份分组

```html
{{- /* Paginate */ -}}
{{- if .Pages -}}
    {{- $pages := .Pages.GroupByDate "2006" -}}
```

改为：

```html
{{- /* Paginate */ -}}
{{- if .Pages -}}
    {{- $pages := .Pages.GroupByDate "2006-01" -}}
```

layouts\taxonomy\terms.html

```html
<div class="page archive">
    {{- /* Title */ -}}
    <h2 class="single-title animated pulse faster">
        {{- .Params.Title | default (T $taxonomies) | default $taxonomies | dict "Some" | T "allSome" -}}
    </h2>
```

改为：

```html
<div class="page archive">
    {{- /* Title */ -}}
    <h2 class="single-title animated pulse faster">
        {{- .Params.Title | default (T $taxonomies) | default $taxonomies | dict "Some" | T "allSome" -}}<sup>{{ len .Pages }}</sup>
    </h2>
```

```html
<h3 class="card-item-title">
    <a href="{{ .RelPermalink }}">
        <i class="far fa-folder fa-fw"></i>&nbsp;{{ .Page.Title }}
    </a>
</h3>
```

改为：

```html
<h3 class="card-item-title">
    <a href="{{ .RelPermalink }}">
        <i class="far fa-folder fa-fw"></i>&nbsp;{{ .Page.Title }} <sup>{{ len .Pages }}</sup>
    </a>
</h3>
```

layouts\_default\section.html

```html
<div class="page archive">
    {{- /* Title */ -}}
    <h2 class="single-title animated pulse faster">
        {{- .Params.Title | default (T .Section) | default .Section | dict "Some" | T "allSome" -}}
    </h2>
```

改为：

```html
<div class="page archive">
    {{- /* Title */ -}}
    <h2 class="single-title animated pulse faster">
        {{- .Params.Title | default (T .Section) | default .Section | dict "Some" | T "allSome" -}}<sup>{{ len .Pages }}</sup>
    </h2>
```

```html
{{- range $pages.PageGroups -}}
            <h3 class="group-title">{{ .Key }}</h3>
```

改为：

```html
{{- range $pages.PageGroups -}}
    <h3 class="group-title">{{ .Key }} <sup>{{ len .Pages }}</sup></h3>
```

按月份分组

```html
{{- /* Paginate */ -}}
{{- if .Pages -}}
    {{- $pages := .Pages.GroupByDate "2006" -}}
```

改为：

```html
{{- /* Paginate */ -}}
{{- if .Pages -}}
    {{- $pages := .Pages.GroupByDate "2006-01" -}}
```



### 站点运行时间

layouts\partials\footer.html

在`<div class="footer-container">`的下方添加

```html
<div class="footer-line">
	<span id="run-time"></span>
</div>
```

static\js\custom.js

```js
/* 站点运行时间 */
function runtime() {
	window.setTimeout("runtime()", 1000);
	/* 请修改这里的起始时间 */
    let startTime = new Date('12/1/2021 15:00:00');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '本站已运行<i class="far fa-clock fa-fw"></i> '
        + ((days < 10) ? '0' : '') + days + ' 天 '
        + ((hours < 10) ? '0' : '') + hours + ' 时 '
        + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
        + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
}
runtime();
```



### 其他

assets\css\\_custom.scss

```scss
/* 滚动条 */
::-webkit-scrollbar {
  width: 0.7rem;
}

/* 右下角按钮 */
.fixed-button {
  margin-bottom: 5rem;
}

/* 图片 */
figcaption {
  display: none !important;
}

img[data-sizes="auto"] {
  display: block;
  /*    width: 50%;*/
}
```



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

{{</* catch-the-cat */>}}
```

在config.toml的menu引入即可



### 其他

[主题文档 - 扩展 Shortcodes - LoveIt (hugoloveit.com)](https://hugoloveit.com/zh-cn/theme-documentation-extended-shortcodes/)

