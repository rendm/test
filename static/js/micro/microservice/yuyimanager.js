load();
function load() {
    $('#table').bootstrapTable( {
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type : "GET",
        url: share+'/irobotweb/speech/voicedb/list',
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true, // 设置为true会有隔行变色效果
        dataType: "jsonp", // 服务器返回的数据类型
        pagination: true, // 设置为true会在底部显示分页条
        singleSelect: false, // 设置为true将禁止多选
        pageSize: 10, // 如果设置了分页，每页数据条数
        pageNumber: 1, // 如果设置了分布，首页页码
        pageList: [10, 25, 50, 100],
        queryParamsType: '',
        sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
        paginationLoop: false,
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        paginationShowPageGo: true, //显示跳转
        showJumpto: true,
        height: $(window).height()-127,
        queryParams: function (params){
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                //排序列名
                sortOrder: 'asc',
               // voicedbname: $.trim($('#genid').val()),//id搜索框
            };
            return temp;
        },

        columns: [

            {
                align: 'center',
                title: '序号',// 列标题
                formatter: function (value, row, index) {
                    var pageSize = $('#table').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#table').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                field: 'voicedbname',
                align: 'center',
                title: '名称'
            },
            {
                field: 'remark',
                align: 'center',
                title: '描述'
            },
            {
                title: '操作',
                field: 'id',
                align: '',
                formatter: function (value, row, index) {

                    var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                        + row.id
                        + '\')"><i class="fa fa-edit "></i></a> ';

                    var f = '<a  class="btn btn-warning btn-sm '  + '" href="#" mce_href="#" title="删除" onclick="remove(\''
                        + row.id
                        + '\')"><i class="fa fa-remove "></i></a> ';

                    var g = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#"  title="语义库管理" onclick="yuyikumanager(\''
                        + row.id
                        + '\')">语义库管理</a> ';

                    return  e+f +g;
                }
            }]
    });
}



//编辑
function edit(id) {
    sessionStorage.setItem('editid', id);
    console.log()
    layer.open({
        type: 2,
        title: '详情',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '620px'],
        content:'./edit.html'  // iframe的url
    });
}

//语义库管理
function yuyikumanager(id) {
    sessionStorage.setItem('editid', id);
    console.log()
    layer.open({
        type: 2,
        title: '语义库管理',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '620px'],
        content:'../yuyiku/yuyiku.html?id='+id    // iframe的url
    });
}

//删除
function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/speech/voicedb/delete?id="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 200) {
                    layer.msg(r.msg);
                    window.location.reload();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}



$("#btnadd").on('click',function(){
    layer.open({
        type: 2,
        title: '增加',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '530px'],
        content: './yuyimanageradd.html'
    });
})