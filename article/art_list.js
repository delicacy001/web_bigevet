$(function() {
    var layer = layui.layer;
    //执行一个laypage实例
    var laypage = layui.laypage;
    // var form = layui.form;
    //定义一个查询的参数对象，将来请求数据的对象
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 10, //每页显示几条数据
        cate_id: '', //文章分类的Id默认为空
        state: '' //文章的发布状态
    };
    //初始化筛选表单分类项目
    //使用layui的方法可以成功渲染
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

    function renderSelect(data) {
        var html = '<option value="">所有分类</option>'
        for (var i = 0; i < data.length; i++) {
            html += '<option value=' + parseInt(data[i].Id) + '>' + data[i].name + '</option>';
        }
        $('#cateList').html(html);
        layui.form.render("select");
    }
    //获取后台文章分类数据
    // 初始化列表
    initArticleList(q);

    function initArticleList(q) {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                console.log(res);
                layer.msg('获取文章列表成功！');
                var strHtml = template('listFormat', res);
                $("#listTbody").empty().html(strHtml);
                //渲染分页数据
                renderPage(res.total);
            }
        });
        // //定义过滤器
        //定义过滤器
        template.defaults.imports.dateFormat = function(dateStr) {
            // console.log(date);
            var dt = new Date(dateStr);
            var y = dt.getFullYear();
            var m = padZero(dt.getMonth() + 1);
            var d = padZero(dt.getDate());
            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getMinutes());
            var ss = padZero(dt.getSeconds());
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
            // var dt = new Date(dateStr);
            // var y = dt.getFullYear();
            // var m = dt.getMonth() + 1;
            // var d = dt.getDate();
            // var hh = dt.getHours();
            // var mm = dt.getMinutes();
            // var ss = dt.getSeconds();
            // return y + '年' + m + '月' + d + '日' + ' ' + hh + '点' + mm + '分' + ss + '秒';
            //注意，过滤器最后一定要return一个值
        };
        //定义补零函数 给小于10的数字补0
        function padZero(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        }
    }
    //为筛选按钮注册点击事件
    $('#filterForm').on("submit", function(e) {
            e.preventDefault();
            var fd = new FormData($(this)[0]);
            fd.forEach(function(v, k) {
                q[k] = v;
            });
            initArticleList(q);
        })
        //定义实现删除操作的方法
        // 1、首先，为删除按钮注册点击事件
    $('#listTbody').on("click", ".btnDel", function() {
        var id = $(this).attr('idn');
        // 你们几点几分
        $.ajax({
            method: 'GET',
            url: '/my/article/delete/' + id,
            data: {},
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章失败！');
                }
                // console.log(res);
                layer.msg('删除文章列表成功！');
            }
        });
        //刷新文章列表
        initArticleList(q);
    });
    //定义实现编辑操作的方法
    // 1、首先，为编辑按钮注册点击事件
    $('#listTbody').on("click", ".btnEdit", function() {
        var id = $(this).attr('id');
        location.href = 'art_edit.html?id=' + id;
    });
    //定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
        //开启location.hash的记录
        laypage.render({
            elem: 'pageSplit',
            count: total,
            //指定默认显示几条数据
            limit: q.pagesize,
            limits: [10, 15, 18, 20],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            //指定默认显示第几页
            curr: q.pagenum,
            //触发jump的方式有两种：点击切换页面或者只要调用laypage.render方法就会触发jump
            jump: function(obj, first) {
                //首次不执行,否则会出现死循环 
                // 因为只要调用laypage.render方法就会触发jump
                //解决办法就是把代码放到if (!first) {}里面
                if (!first) {
                    //do something
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    initArticleList(q);
                }
            }

        });
    }
})