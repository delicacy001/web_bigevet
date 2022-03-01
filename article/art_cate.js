$(function() {
    var layer = layui.layer;
    var form = layui.form;
    //获取后台文章分类数据
    // 初始化列表
    initCatorrList();

    function initCatorrList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章分类数据获取失败！');
                }
                var strHtml = template('sample', res);
                $("#catTbody").empty().html(strHtml);
            }
        });
        // //定义过滤器
        // template.defaults.imports.idStrFormat = function(idStr) {
        //     return '"' + idStr + '"';
        // }

    }

    //添加文章分类 弹出层效果
    $('#btnAddCate').on('click', function() {
        var index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialogAdd').html()
        });
        $('#diaFormInfo').on('submit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                // url根目录地址（baseApi中统一设置）
                url: '/my/article/addcates',
                // headers请求头配置对象（baseApi中统一设置）
                // headers: {
                //     Authorization: localStorage.getItem('token')
                // },
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("新增文章分类失败！");
                    }
                    // console.log(res);
                    layer.msg("新增文章分类成功！");
                    layer.close(index);
                    initCatorrList();
                }
            });
        })

    });
    //编辑分类 删除分类
    $('#catTbody').on('click', '.btnEdit', function() {
        console.log($(this));
        var id = $(this).attr("id");
        console.log(id);
        var index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialogEdit').html()
        });
        // 初始化弹出层基本信息
        //初始化弹出层页面数据
        initEditDialog(id);

        function initEditDialog(id) {
            $.ajax({
                method: 'GET',
                // url根目录地址（baseApi中统一设置）
                url: '/my/article/cates/' + id,
                // headers请求头配置对象（baseApi中统一设置）
                // headers: {
                //     Authorization: localStorage.getItem('token')
                // },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("获取文章分类数据失败！");
                    }
                    // console.log(res);
                    // 设置表单默认用户名 或者使用form.val("filtername",data数据)
                    form.val('formEditInfo', res.data);
                }
            });
        }
        $('#diaEditFormInfo').on('submit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                //注意id值为number
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类信息失败！');
                    }
                    layer.close(index);
                    layer.msg('更新分类信息成功！');
                    initCatorrList();
                }
            });
        });
        $('#diaUpReset').on('click', function(e) {
            e.preventDefault();
            initEditDialog(id);
        });
    });
    //删除分类
    $('#catTbody').on('click', '.btnDel', function() {
        console.log($(this));
        var id = $(this).attr("idn");
        console.log(id);
        //初始化弹出层页面数据
        $.ajax({
            method: 'GET',
            // url根目录地址（baseApi中统一设置）
            url: '/my/article/deletecate/' + id,
            // headers请求头配置对象（baseApi中统一设置）
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("删除文章分类失败！");
                }
                layer.msg("删除文章分类成功！");
                initCatorrList();
            }
        });

    });
})