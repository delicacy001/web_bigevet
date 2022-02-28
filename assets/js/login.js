$(function() {
    //点击 去注册
    $('#link_reg').on("click", function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //点击 去登录
    $('#link_login').on("click", function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    //自定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }

                //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
                if (value === 'xxx') {
                    alert('用户名不能为敏感词');
                    return true;
                }
            }
            //我们既支持上述函数式的方式，也支持下述数组的形式
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            ,
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            // 校验两次密码是否一致
            // 通过形参拿到的是确认密码中的值 还需要拿到密码框中的值 然后进行比较
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return '两次密码输入不一致！';
            }
        }
    });
    // 监听注册表单的注册事件
    $('#form_reg').on("submit", function(e) {
        //阻止默认提交行为
        e.preventDefault();
        //发起ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // console.log(res.message);
                layer.msg("注册成功，请登录！");
                // 注册成功之后，模拟点击跳转登陆页面
                $('#link_login').click();
            }
        });
    });
    // 监听登录表单的登录事件
    $('#form_login').on("submit", function(e) {
        //阻止默认提交行为
        e.preventDefault();
        //发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // console.log(res.message);
                layer.msg("登录成功！");
                //将得到的token字符串保存到localstorage
                localStorage.setItem('token', res.token);
                // console.log(res.token);
                // 登录成功之后，跳转到后台主页
                // $('#link_login').click();
                location.href = 'index.html';
            }
        });
    });
})