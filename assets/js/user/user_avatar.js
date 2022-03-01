$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);
    //2、实现图片文件上传功能
    //首先，需要为上传按钮绑定点击事件
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

        $('#btnConfirm').on('click', function() {
            // 3. 将裁剪后的图片，输出为 base64 格式的字符串
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            var dataURL = $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            }).toDataURL('image/png');
            $.ajax({
                method: 'POST',
                // url根目录地址（baseApi中统一设置）
                url: '/my/update/avatar',
                // headers请求头配置对象（baseApi中统一设置）
                // headers: {
                //     Authorization: localStorage.getItem('token')
                // },
                data: { avatar: dataURL },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("更换头像失败！");
                    }
                    // console.log(res);
                    layer.msg('更换头像成功！');
                    //调用父页面中的方法，重新渲染用户的头像和用户的信息
                    parent.window.getUserInfo();

                }
            });
        });
    });

})