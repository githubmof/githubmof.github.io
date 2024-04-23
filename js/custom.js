/* 轮播背景图片 */
$(function () {
	$.backstretch([
      "/images/background/zhuodi.jpg"
	], { duration: 30000, fade: 1500 });
});

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
// runtime();

/* 离开当前页面时修改网页标题，回到当前页面时恢复原来标题 */
window.onload = function() {
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function() {
      if(document.hidden) {
        $('[rel="icon"]').attr('href', "/images/w.ico");
        $('[rel="shortcut icon"]').attr('href', "/images/w.ico");
        document.title = '喔唷，崩溃啦！';
        clearTimeout(titleTime);
      } else {
        $('[rel="icon"]').attr('href', "/images/w.ico");
        $('[rel="shortcut icon"]').attr('href', "/images/w.ico");
        document.title = '咦，页面又好了！';
        titleTime = setTimeout(function() {
          document.title = OriginTitile;
        }, 2000);
      }
    });
  }