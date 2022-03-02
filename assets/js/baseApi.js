//注意：每次调用$.get\$.post\$.ajax之前会调用
//ajaxPrefilter()函数
$.ajaxPrefilter(function(options) {
    // 在发送请求之前修改url参数$.get\$.post\$.ajax之前会调用
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    //统一为有权限的接口访问设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        };
        //统一为有权限的接口，设置complete,设置权限控制
        options.complete = function(res) {
            //无论成功还是失败，都会调用该函数
            // console.log("执行了complete回调函数！");
            //可以使用responseJSON拿到服务器相应的数据
            // console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //1、强制清空token
                localStorage.removeItem('token');
                //2、强制跳转到登录页面
                location.href = 'login.html';
            }

        }
    }

});