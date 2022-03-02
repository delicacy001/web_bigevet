$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    var layer = layui.layer;
    // var form = layui.form;
    //创建变量sear来接受window.location.search的值
    var idStr = window.location.search; //即为"?id=1511411"
    // console.log("idStr为：" + idStr);
    if (idStr.indexOf('?') !== -1) {
        idStr = idStr.split('=')[1];
    }
    $.ajax({
        method: 'GET',
        url: '/my/article/' + idStr,
        data: {},
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取文章信息失败！');
            }
            console.log("看看对应分类历史的id");
            console.log(res);
            console.log("看看对应分类历史的id");
            // 设置表单默认用户名 或者使用form.val("filtername",data数据)
            // form.val('formEditInfo', res.data);
            editInit(res.data);
            layer.msg('获取文章信息成功！');
        }
    });

    function editInit(data) {
        $("[name=title]").val(data.title);
        //文章分类渲染
        initSelect(data.cate_id);
        // 初始化富文本编辑器
        initEditor();
        $("#textAreaCon").val(data.content);
        //试图重现封面内容
        sendRequest(data.cover_img);
    }
    //定义sendRequest方法：目的是获取服务器端图片
    function sendRequest(url) {
        var xhr = new XMLHttpRequest();
        // 设置Authorialization属性（固定写法）
        xhr.open('get', 'http://www.liulongbin.top:3007' + url, true);
        xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        xhr.responseType = 'blob';
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var blob = this.response;
                //loadImage_file()方法与前面相同
                loadImage_file(blob);
            } else {
                console.log('error');
            }
        }
        xhr.send(null);
    }

    function loadImage_file(blob) {
        var fr = new FileReader();
        fr.readAsDataURL(blob);
        // $("fileHidden").val(fr);
        fr.onload = function(e) {
            // var preview = document.getElementById('image');
            // preview.src = e.target.result;
            $image[0].src = e.target.result;
            // 1.2 配置选项
            const options = {
                    // 纵横比
                    aspectRatio: 400 / 280,
                    // 指定预览区域
                    preview: '.img-preview'
                }
                // 1.3 创建裁剪区域
            $image.cropper(options);
        }
    }

    function initSelect(cateId) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                console.log("看看历史的id");
                console.log(res);
                console.log("看看历史的id");
                renderSelect(res.data, cateId);
            }
        });
    }

    //使用layui的方法可以成功渲染
    function renderSelect(data, cateId) {
        var html = '<option value="">请选择文章类别</option>'
        for (var i = 0; i < data.length; i++) {
            var id = parseInt(data[i].Id);
            if (id == cateId) {
                html += "<option value=" + id + " selected>" + data[i].name + "</option>";
                continue;
            }
            html += '<option value=' + id + '>' + data[i].name + '</option>';
        }
        $('#selectList').html(html);
        layui.form.render("select");
    }
    // 封面图片部分js代码
    //2、实现图片文件上传功能
    //首先，需要为选择封面按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        $('#file').click();
    });
    //其次，需要为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        // 2.1获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg("请选择要上传的照片！");
        }
        // 2.2根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(filelist[0]);
        // 2.3先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        // 销毁旧的裁剪区域
        // 重新设置图片路径
        // 重新初始化裁剪区域
        $image.cropper('destroy').attr('src', newImgURL).cropper(options);
    });
    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件
    $('#btnSaveFor').on("click", function(e) {
        art_state = '草稿';
        layer.msg("亲，继续点击发布按钮保存为草稿！");
        e.preventDefault();
    });
    // 为表单绑定submit提交事件
    $('#pubForm').on("submit", function(e) {
        // 1、阻止表单默认提交行为
        e.preventDefault();
        // 2、基于表单创建FormData对象
        var fd = new FormData($(this)[0]);
        // 3、将文章的发布状态存到fd中
        fd.append('state', art_state);
        fd.append('Id', parseInt(idStr));
        // 4、将图片blob文件存到fd中
        // 将裁剪后的图片，输出为 文件对象
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log("打印一下formdata对象");
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // });
        // console.log("打印一下formdata对象");
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // console.log("打印一下blob对象");
            // console.log(blob);
            // console.log("打印一下blob对象");
            // fd['cover_img'] = blob;
            fd.append('cover_img', blob);
            // console.log("打印一下formdata对象");
            // fd.forEach(function(v, k) {
            //     console.log(k, v);
            // });
            // console.log("打印一下formdata对象");
            // 发送ajax请求
            publishArticle(fd);
        })
    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            //注意：如果向服务器提交FormData格式数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    // console.log("失败");
                    return layer.msg('修改文章失败！');
                }
                layer.msg('修改文章成功！');
                //发布文章成功后，跳转到文章列表
                location.href = 'art_list.html';
            }
        });
    }
})