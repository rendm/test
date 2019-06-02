var prefix = "/irobotweb/sys/user";

load();

function load() {

    var user=$.user();
    var shopmanagerid= user.shopmanagerid;

    var equipmenteditid = sessionStorage.getItem('equipmenteditid');
    //alert(editid);

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
                url: share+'/irobotweb/sys/robot/query/list', 
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
                        shopmanagerid: shopmanagerid,
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
                        field: 'robotName',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'shopname',
                        align: 'center',
                        title: '所属店铺'
                    },

                    {
                        field: 'shopmanagername',
                        align: 'center',
                        title: '所属用户'
                    },


                    {
                        field: 'status',
                        align: 'center',
                        title: '状态',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if(row.shopid !== '' && row.shopid !== null){
                                return '<span class ="label label-primary">已绑定</span>'
                            }else {
                                return '<span class ="label label-danger">未绑定</span>'
                            }
                        }
                    }
                ]
            });
}

//查询点击
$('#btnreload').on('click',function(){
    $('#exampleTable').bootstrapTable('destroy');
    load();
})

//添加
$('#btnadd').on('click',function(){
     // iframe层
     layer.open({
        type: 2,
        title: '增加用户',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['1400px', '700px'],
        content: './add.html' 
    });
})

//批量删除
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
                if (r.code == 0) {
                    layer.msg(r.msg);
                    window.location.reload()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//绑定
function BindingShop() {
    var data = {};
    var rows = $('#exampleTable').bootstrapTable("getSelections");

    if (rows.length == 0) {
            layer.msg("请选择要绑定的数据");
        return;
    }

    var pId = new Array();
    for (var i = 0; i < rows.length; i++) {
        pId.push(rows[i].id)
    }

    data.ids = pId;
    data.shopid = sessionStorage.getItem('equipmenteditid');

    $.ajax({
        url: share + '/irobotweb/sys/robot/bindingshop',
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        data: data,
        success: function (data) {

            if (data.code == 1) {
                parent.layer.msg("更新成功");
                window.location.reload();
            } else if (data.code == 200){
                layer.alert('更新成功', function () {
                    window.location.reload();
                });               
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}


//解绑
function unBindingShop() {
    var data = {};
    var rows = $('#exampleTable').bootstrapTable("getSelections");

    if (rows.length == 0) {
        layer.msg("请选择要解绑的数据");
        return;
    }

    var pId = new Array();
    for (var i = 0; i < rows.length; i++) {
        pId.push(rows[i].id)
    }

    data.ids = pId;

    $.ajax({
        url: share + '/irobotweb/sys/robot/unbindingshop',
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        data: data,
        success: function (data) {

            if (data.code == 1) {
                parent.layer.msg("更新成功");
                window.location.reload();
            } else if (data.code == 200){
                layer.alert('更新成功', function () {
                    window.location.reload();
                });
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}

//绑定功能
$('#btnBind').click(function () {
    BindingShop();
});

//解绑功能
$('#btnUnbind').click(function () {
    unBindingShop();
});

//返回按钮
$('#btnBack').click(function () {
    //window.parent.location.href = "./theMapManagement.html";
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});

//查看详情
function show(id) {
    layer.open({
        type: 2,
        title: '用户修改',
        maxmin: true,
        shadeClose: false,
        area: ['1400px', '750px'],
        content:'./show.html'  // iframe的url
    });
}

function edit(id){
    layer.open({
        type: 2,
        title: '用户修改',
        maxmin: true,
        shadeClose: false,
        area: ['1400px', '750px'],
        content:'./edit.html'  // iframe的url
    });
}

function equipment(id){
    layer.open({
        type: 2,
        title: '用户修改',
        maxmin: true,
        shadeClose: false,
        area: ['1400px', '750px'],
        content:'./equipment.html'  // iframe的url
    });
}

//id删除键
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
        console.log(ids)
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
                if (r.code == 0) {
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

////////////////////////////////////////////////////////////////////////
//滚动条  显示
//progress   100
//progressbg   大盒子  
//文字提示 textmin  textmax


 //更多显示
 $('#btnmore').on('click',function(){
     //console.log("更多显示")
     var top = document.getElementById("userinfo").style.marginTop;     
     document.getElementById("userinfo").style.marginTop = 0;

    //console.log(top,'top')
    if (top == "0px"){
        //console.log(123213)
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 })