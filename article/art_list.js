$(function() {
    var layer = layui.layer;
    // var form = layui.form;
    //获取后台文章分类数据
    // 初始化列表
    initArticleList();

    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: {
                pagenum: 1,
                pagesize: 5
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                console.log(res);
                layer.msg('获取文章列表成功！');
                var strHtml = template('listFormat', res);
                $("#listTbody").empty().html(strHtml);
            }
        });
        // //定义过滤器
        // template.defaults.imports.idStrFormat = function(idStr) {
        //     return '"' + idStr + '"';
        // }

    }
})