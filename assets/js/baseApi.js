//注意：每次调用$.get\$.post\$.ajax之前会调用
//ajaxPrefilter()函数
$.ajaxPrefilter(function(options) {
    // 在发送请求之前修改url参数$.get\$.post\$.ajax之前会调用
    options.url = 'http://www.liulongbin.top:3007' + options.url;
});