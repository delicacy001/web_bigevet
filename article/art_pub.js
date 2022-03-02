$(function() {
    //文章分类渲染
    initSelect();

    function initSelect() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                console.log(res);
                renderSelect(res.data);
                // var strHtml = template('tplSelect', res);
                // $("#selectList").empty().html(strHtml);
                // layer.msg('获取文章分类列表成功！');
            }
        });
    }
    // 初始化富文本编辑器
    initEditor();
    //使用layui的方法可以成功渲染
    function renderSelect(data) {
        var html = '<option value="">请选择文章类别</option>'
        for (var i = 0; i < data.length; i++) {
            html += '<option value=' + parseInt(data[i].Id) + '>' + data[i].name + '</option>';
        }
        $('#selectList').html(html);
        layui.form.render("select");
    }
    // 封面图片部分js代码
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
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
        // 4、将图片blob文件存到fd中
        // 将裁剪后的图片，输出为 文件对象
        // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log("打印一下formdata对象");
        // console.log(fd['cover_img']);
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
            // console.log(fd['cover_img']);
            // console.log("打印一下formdata对象");
            // 发送ajax请求
            publishArticle(fd);
        })



    });

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交FormData格式数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    console.log("失败");
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                //发布文章成功后，跳转到文章列表
                location.href = 'art_list.html';
            }
        });
    }
})