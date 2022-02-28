//不要添加入口函数，否则iframe访问不到
// $(function() {
// 获取用户基本信息
getUserInfo();

function getUserInfo() {
    $.ajax({
        method: 'GET',
        // url根目录地址（baseApi中统一设置）
        url: '/my/userinfo',
        // headers请求头配置对象（baseApi中统一设置）
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        data: {},
        success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg("获取用户信息失败！");
                }
                // console.log(res);
                // 调用渲染用户头像
                renderAvatar(res.data);
            }
            // ,
            // complete: function(res) {
            //     //无论成功还是失败，都会调用该函数
            //     console.log("执行了complete回调函数！");
            //     //可以使用responseJSON拿到服务器相应的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         //1、强制清空token
            //         localStorage.removeItem('token');
            //         //2、强制跳转到登录页面
            //         location.href = 'login.html';
            //     }
            //     // console.log(res);
            // }
    });
}
//渲染用户的头像
function renderAvatar(user) {
    // 1、获取用户名称
    var name = user.nickname || user.username;
    // 2、设置欢迎的文本
    $('#welcome').html('欢迎您，' + name + '!');
    // 3、按照需要渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像 文字头像隐藏
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 渲染文字头像 图片头像隐藏
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
        $(".layui-nav-img").hide();
    }

}
//点击退出系统按钮
var layer = layui.layer;
$('#btnLogout').on('click', function() {
    //提示用户是否确认退出
    layer.confirm('是否确认退出系统?', { icon: 3, title: '提示' }, function(index) {
        //do something
        //1、清空本地存储的token
        localStorage.removeItem('token');
        //2、重新跳转登陆页面
        location.href = 'login.html';
        //3、关闭confirm询问框
        layer.close(index);
    });
});
// })