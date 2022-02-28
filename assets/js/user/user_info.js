$(function() {
    //用户资料表单验证
    var form = layui.form;
    form.verify({
        nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]{3,10}$").test(value)) {
                return '昵称长度必须在3~10个字符之间！';
            }
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }
    });

    // 获取并初始化用户基本信息
    initUserInfo();

    function initUserInfo() {
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
                // 设置表单默认用户名
                // $('.initial').val(res.data.username);
                // 设置表单默认用户名 或者使用form.val("filtername",data数据)
                form.val('formUserInfo', res.data);
            }
        });
    }
    // 重置表单数据信息
    $('#btnReset').on('click', function(e) {
            initUserInfo();
        })
        // 发送修改数据表单信息
    $('#btnSubmit').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            // url根目录地址（baseApi中统一设置）
            url: '/my/userinfo',
            // headers请求头配置对象（baseApi中统一设置）
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            data: $('#userFormInfo').serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg("修改用户信息失败！");
                }
                // console.log(res);
                //调用父页面中的方法，重新渲染用户的头像和用户的信息
                parent.window.getUserInfo();
                layui.layer.msg('修改用户信息成功！');
            }
        });
    });

})