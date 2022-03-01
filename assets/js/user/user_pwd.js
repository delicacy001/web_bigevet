$(function() {
    //用户资料表单验证
    var form = layui.form;
    form.verify({
        pwdverify: function(value, item) { //value：表单的值、item：表单的DOM对象
            var ypwd = $('#passFormInfo input[name=oldPwd]').val();
            if (value === ypwd) {
                return '新密码不能与原密码相同！';
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '密码不能包含有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '密码首尾不能出现下划线\'_\'';
            }
            // if (/^\d+\d+\d$/.test(value)) {
            //     return '密码不能全为数字';
            // }
            if (!new RegExp("^[a-zA-Z0-9]{6,12}$").test(value)) {
                return '密码长度必须在6~12个字符之间！';
            }
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('密码不能为敏感词');
                return true;
            }
        },
        repwd: function(value) {
            var pwd = $('#passFormInfo input[name=newPwd]').val();
            if (value !== pwd) {
                return '两次密码输入不一致！';
            }
        }
    });
    // 发送提交修改数据信息
    $('#passFormInfo').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            // url根目录地址（baseApi中统一设置）
            url: '/my/updatepwd',
            // headers请求头配置对象（baseApi中统一设置）
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            data: $('#passFormInfo').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新用户密码失败！");
                }
                console.log(res);
                //调用父页面中的方法，重新渲染用户的头像和用户的信息
                layui.layer.msg('更新用户密码成功！');
                //重置表单
                $('#passFormInfo')[0].reset();
            }
        });
    });

})