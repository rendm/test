var prefix = "/irobotweb/sys/role";
load();

//http://192.168.1.11:9090/irobotweb/sys/role/query/ids
function load() {
    //alert(share+'/irobotweb/sys/role/query/list');

    $('#exampleTable').bootstrapTable({
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share+'/irobotweb/sys/role/query/list', 
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
                paginationShowPageGo: true,     //显示跳转
                showJumpto: true,
                height: $(window).height()-127,
                queryParams: function (params) {
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,                         //页面大小
                        page: params.pageNumber,   //页码
                        sort: 'role_id',      //排序列名
                        sortOrder: 'asc', //排位命令（desc，asc）
                        roleName: $.trim($('#searchName').val()),//角色名
                        roleName:$.trim($('#accountNo').val()),//账号名
                    };
                    return temp;
                },
                columns: [
                    { // 列配置项
                        // 数据类型，详细参数配置参见文档http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/
                        checkbox: true
                        // 列表中显示复选框
                    },
                    {
                        align: 'center',
                        title: '序号', // 列标题
                        formatter: function (value, row, index) {
                            var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'roleName',
                        align: 'center',
                        title: '角色名'
                    },
                    {
                        field: 'type',
                        align: 'center',
                        title: '类别',
                        formatter: function (value, row, index) {
                            if(value==1){
                                return '系统';
                            }else if(value==2){
                                return '开发者';
                            }
                        }
                    },

                    {
                        field: 'roleName',
                        align: 'center',
                        title: '账号名',
                        // visible: false
                    },

                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    /*{
                        field: 'deptName',
                        align: 'center',
                        title: '部门名称'
                    },*/
                    {
                        title: '操作',
                        field: 'roleId',
                        align: 'center',
                        formatter: function (value, row, index) {
                            var c = '<a class="btn btn-primary btn-sm " href="#" mce_href="#"  title="详情" id ="" onclick="show(\''
                                + row.roleId
                                + '\')"><i class="fa fa-search"></i></a> ';
                            var e = '<a class="btn btn-primary btn-sm " href="#" mce_href="#" data-attribute='+row.roleId+' title="编辑"  onclick="edit(\''
                                + row.roleId
                                + '\')"><i class="fa fa-edit"></i></a> ';
                            var d = '<a class="btn btn-danger btn-sm " href="#" title="删除"  mce_href="#" onclick="remove(\''
                                + row.roleId
                                + '\')"><i class="fa fa-trash fa-fw"></i></a> ';
                            return c + e + d;
                        }
                    }]
            });
}
$('#rolebtnreload').on('click',function(){
    $('#exampleTable').bootstrapTable('destroy');
    load();
})
$('#rolebtnadd').on('click',function(){
     // iframe层
     layer.open({
        type: 2,
        title: '添加',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './add.html' // iframe的url
    });
})

function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+prefix + "/delete",
            type: "post",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'id': id
            },
            success: function (r) {
                if (r.code === 200) {
                    layer.msg("删除成功");
                    window.location.reload()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })

}

function show(id) {
    sessionStorage.setItem('showid', id);
    layer.open({
        type: 2,
        title: '详情',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content:'./show.html' // iframe的url
    });
}

function edit(id) {
    console.log(id)
    sessionStorage.setItem('editid', id);
    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content:'./edit.html' // iframe的url
    });
}
$("#rolebtnremove").on('click',function(){
    var rows = $('#exampleTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
    if (rows.length == 0) {
        layer.msg("请选择要删除的数据");
        return;
    }
    layer.confirm("确认要删除选中的'" + rows.length + "'条数据吗?", {
        btn: ['确定', '取消']
    }, function () {
        var ids = new Array();
        $.each(rows, function (i, row) {
            ids[i] = row['roleId'];
        });
        console.log(ids);
        $.ajax({
            url:share+ prefix + '/delete/list',
            type: 'POST',
            data: {
                "ids": ids
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 200) {
                    layer.msg(r.msg);
                    window.location.reload()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    }, function () {

    });
})



  