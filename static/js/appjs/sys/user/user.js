var prefix = "/irobotweb/sys/user";
load();

$('body').click(function () {

    $(window.parent.document).find('.d-close').removeClass('open');
    $(window.parent.document).find('.J_tabClose').attr('aria-expanded','false');
});

function load() {

    //alert(share+'/irobotweb/sys/user/query/list');
    //alert($('#position').val());

    $('#exampleTable').bootstrapTable( {
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share+'/irobotweb/sys/user/query/list', 
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
                        sort: 'user_id',      //排序列名
                        sortOrder: 'asc',
                        name: $.trim($('#name').val()),//id搜索框 改为姓名
                        email: $.trim($('#email').val()),//邮箱搜索
                        mobile: $.trim($('#mobile').val()),//手机号搜索
                        companyName: $.trim($('#companyname').val()),//企业名称
                        position:$('#position').val() //身份
                    };
                    return temp;
                },
                // //请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数如果
                // queryParamsType = 'limit' ,返回参数必须包含
                // limit, offset, search, sort, order 否则, 需要包含:
                // pageSize, pageNumber, searchText, sortName,
                // sortOrder.
                // 返回false将会终止请求
                columns: [
                    {
                        checkbox: true
                    },
                    {
                        align: 'center',
                        title: '序号',// 列标题
                        formatter: function (value, row, index) {
                            var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'name',
                        align: 'center',
                        title: '姓名'
                    },
                    {
                        field: 'genid',
                        align: 'center',
                        title: '用户ID'
                    },

                    /*{
                        field: 'deptName',
                        align: 'center',
                        title: '部门'

                    },*/

                    {
                        field: 'mobile',
                        align: 'center',
                        title: '手机'
                    },
                    {
                        field: 'email',
                        align: 'center',
                        title: '邮箱'
                    },

                    {
                        field: 'roleName',
                        align: 'center',
                        title: '角色'
                    },

                    {
                        field: 'position',
                        align: 'center',
                        title: '身份',
                        formatter:function (value, row, index) {
                            if(value=='superadmin'){
                               return '超级管理员';
                            }else if(value=='admin'){
                                return '管理员';
                            }else if(value=='developer'){
                                return '开发者';
                            }else if(value=='subdeveloper'){
                                return '子开发者';
                            }else if(value=='shopmanager'){
                                return '用户';
                            }else if(value=='subshopmanager'){
                                return '子用户';
                            }
                        }
                    },

                    {
                        field: 'companyName',
                        align: 'center',
                        title: '企业名'
                    },

                    {
                        field: 'status',
                        align: 'center',
                        title: '状态',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (value == '0') {
                                return '<span class="label label-danger">禁用</span>';
                            } else if (value == '1') {
                                return '<span class="label label-primary">正常</span>';
                            }
                        }
                    },

                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        formatter: function (value, row, index) {
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详情" onclick="show(\''
                                + row.userId
                                + '\')"><i class="fa fa-search "></i></a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                                + row.userId
                                + '\')"><i class="fa fa-edit "></i></a> ';
                            var d = '<a class="btn btn-danger btn-sm" href="#" title="删除"  mce_href="#" onclick="remove(\''
                                + row.userId
                                + '\')"><i class="fa fa-trash fa-fw"></i></a> ';
                            var f = '<a class="btn btn-primary btn-sm '  + '" href="#" title="重置密码"  mce_href="#" onclick="resetPwd(\''
                                + row.userId+','+row.name+ '\')"><i class="fa fa-key fa-fw"></i></a> ';
                            return c + e + f + d;
                        }
                    }]
            });
    //$('#exampleTable').bootstrapTable('hideColumn', 'deptName');
}

//查询
$('#btnreload').on('click',function(){
    // console.log($.trim($('#companyname').val()),'企业名称')
    $('#exampleTable').bootstrapTable('destroy');
    load();
});

//链接至新增页面
$('#btnadd').on('click',function(){
     // iframe层
     layer.open({
        type: 2,
        title: '添加',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './add.html' 
    });
})

//单个删除
function remove(id) {

    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+prefix +"/delete",
            type: "post",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                'id': id
            },
            success: function (r) {
                //console.log(r);
                if (r.code == 200) {
                    //layer.msg(r.msg);
                    //window.location.reload();

                    layer.msg('删除成功');
                    $('#exampleTable').bootstrapTable('destroy');
                    load();

                } else {
                    layer.msg(r.msg);
                }
            }
        });
        
    })
}

//用户详情页面
function show(id) {
    sessionStorage.setItem('usershowid', id);
    console.log(id,'id')
    layer.open({
        type: 2,
        title: '详情',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './show.html'
    });
}

function edit(id) {
    sessionStorage.setItem('usereditid', id);

    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'./edit.html'
    });
}

//重置密码
function resetPwd(id) {
    var index=id.indexOf(',');
    var id_value=id.substring(0,index);
    var name=id.substring(index+1,id.length);
    sessionStorage.setItem('userresetpwdid', id_value);
    sessionStorage.setItem('userresetpwdname', name);

    layer.open({
        type: 2,
        title: '重置密码',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './reset_pwd.html' // iframe的url
    });
}

//删除键
$('#btndel').on('click',function(){
    var rows = $('#exampleTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
    if (rows.length == 0) {
        layer.msg("请选择要删除的数据");
        return;
    }
    layer.confirm("确认要删除选中的'" + rows.length + "'条数据吗?", {
        btn: ['确定', '取消']
        // 按钮
    }, function () {
        var ids = new Array();
        // 遍历所有选择的行数据，取每条数据对应的ID
        $.each(rows, function (i, row) {
            ids[i] = row['userId'];
        });
        //console.log(ids);
        $.ajax({
            type: 'POST',
            data: {
                "ids": ids
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            url: share+prefix + '/delete/list',
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


