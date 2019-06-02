$("#back").hide();
load();
var resource_filename = '';  //资源名称
var resource_type = '';      //资源类型
var resource_userType = '';  //资源用途
var userJsonStr = sessionStorage.getItem('user');
var user = JSON.parse(userJsonStr);
console.log(user,'用户身份')
var upperlimit;

function load() {
    //$.get(share + '/irobotweb/sys/resource/query/list', function (data) {
        //alert("Data Loaded: " + data);
    //});
    //$.get(URL, data, function (data, status, xhr), dataType);
    $('#exampleTable').bootstrapTable({
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type: "GET",
        url: share + '/irobotweb/sys/resource/query/list', //
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
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        paginationShowPageGo: true,     //显示跳转
        showJumpto: true,
        height: $(window).height() - 127,
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                //排序列名
                sortOrder: 'asc',
                filename: resource_filename, //资源名称
                type: resource_type,         //资源类型
                userType: resource_userType  //资源用途

                // // email: $.trim($('#email').val()),//邮箱搜索
                // // mobile: $.trim($('#mobile').val())//手机号搜索
                // type:$.trim($('#type').val()),//资源类型搜索   狂不对
                // userType:$.trim($('#userType').val()),//资源用途搜索   狂不对 
            };
            return temp;
        },
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
                    return pageSize * (pageNumber - 1) + index + 1;                              // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                field: 'filename',
                align: 'center',
                title: '资源名称'
            },
            {
                field: 'type',
                align: 'center',
                title: '资源类型',
                formatter: function (value, row, index) {
                    // 0表示图片，1表示音频，2表示视频，3表示其他
                    if (value == "0") {
                        return "图片"
                    } else if (value == "1") {
                        return "音频"
                    } else if (value == "2") {
                        return "视频"
                    } else if (value == "3") {
                        return "其他"
                    }
                }
            },
            // {
            //     field: 'userType',
            //     align: 'center',
            //     title: '资源用途',
            //     formatter: function (value, row, index) {
            //         // 0表示头像，1表示图标，2表示通用
            //         if (value == "0") {
            //             return "头像"
            //         } else if (value == "1") {
            //             return "图标"
            //         } else if (value == "2") {
            //             return "通用"
            //         }
            //     }
            // },
            {
                field: 'filesize',
                align: 'center',
                title: '资源大小'
            },
            // {
            //     field: 'email',
            //     align: 'center',
            //     title: '所属店铺'
            // },
            // {
            //     field: 'roleName',
            //     align: 'center',
            //     title: '所属开发者'
            // },
            {
                field: 'crateTime',
                align: 'center',
                title: '上传时间',
            },
            {
                field: 'cuername',
                align: 'center',
                title: '上传人'
            },
            {
                title: '操作',
                field: 'id',
                align: 'center',
                formatter: function (value, row, index) {
                    var a = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                                + row.id
                                + '\')"><i class="fa fa-edit "></i></a> ';
                    var e = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="详情" onclick="show(\''
                        + row.type +'\',\'' + row.ossurl
                        + '\')"><i class="fa fa-search "></i></a> ';
                    var d = '<a class="btn btn-danger btn-sm ' + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                        + row.id
                        + '\')"><i class="fa fa-trash fa-fw"></i></a> ';
                    return a + e + d;
                }
            }]
    });
}

//查询点击
$('#btnreload').on('click', function () {
    resource_filename = $.trim($('#genid').val());
    resource_type=$.trim($('#type').val());
    getParamIndex();
    $('#exampleTable').bootstrapTable('destroy');
    load();
})

//获取资源类型和资源用途的索引值
function getParamIndex() {
    var type = $.trim($('#type').val());
    var userType = $.trim($('#userType').val());

    if (type =='图片') {
        resource_type = 0;
    } else if (type == '音频') {
        resource_type = 1;
    } else if (type == '视频') {
        resource_type = 2;
    } else if (type == '其他') {
        resource_type = 3;
    }

    if (userType == '头像') {
        resource_userType = 0;
    } else if (userType == '图标') {
        resource_userType = 1;
    } else if (userType == '通用') {
        resource_userType = 2;
    } 
}


//提交-更多的查询条件
$('#btnsum').on('click', function () {    
    resource_filename = $.trim($('#filename').val());
    getParamIndex();
    $('#exampleTable').bootstrapTable('destroy');
    load();
});


$('#btnadd').on('click', function () {
    // iframe层
    layer.open({
        type: 2,
        title: '添加',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './add.html'
    });
})

//重置 清空查询框里的条件数据
$('#btnreset').click(function () {
    var input_arr = $('.layui-input');
    $.each(input_arr, function () {
        $(this).val('');
    });
});

function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share + "/irobotweb/sys/resource/delete",
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
                    $('#exampleTable').bootstrapTable('destroy');
                    load()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//查看显示的内容  音频  视频  图片

//查看详情
function show(type,url) {

    sessionStorage.setItem('url', url);
    sessionStorage.setItem('type', type);
    layer.open({
        type: 2,
        title: '详情',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './show.html'  // iframe的url
    });
}
//查看修改
function edit(id) {
    sessionStorage.setItem('resourceeditid', id);
    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './edit.html'  // iframe的url
    });
}
//删除键
$('#btndel').on('click', function () {
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
            ids[i] = row['id'];
        });
        //console.log(ids, 'sadgjadg')
        $.ajax({
            type: 'POST',
            data: {
                "ids": ids
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            url: share + '/irobotweb/sys/resource/delete/list',
            success: function (r) {
                //console.log(r, '报错')
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
function progress(min, max){
    var prowidth = document.getElementsByClassName('progress')[0];
    //console.log(prowidth);
    prowidth.style.width = (min / max) * 150 + 'px';
    prowidth.innerHTML = (min / max) * 150 + '%';
    if(min==null || min==''){
        min=0;
    }

    document.getElementsByClassName('textmin')[0].innerHTML = min+"M";
    document.getElementsByClassName('textmax')[0].innerHTML = max+"M";
    // $(".textmin").html(2642146)
}
///irobotweb/sys/resource/sum 

$.ajax({
    url: share + 'irobotweb/sys/resource/sum',
    type: "get",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
        console.log(json,'(json');
        console.log(user.position,'用户身份22')
        if(!isNaN(json)){
            if(user.position == 'superadmin'){
                //console.log('超级管理员无上限')
                upperlimit = '无上限';
            }else if(user.position == 'admin'){
                upperlimit = 1024;
                var num = json/upperlimit*100;
                $(".percentage").html('('+num.toFixed(2)+'%'+')')
                progress(json, 1024)
                $("#back").show()
                
            }else{
                upperlimit = 500;
                var num = json/upperlimit*100;
                $(".percentage").html('('+num.toFixed(2)+'%'+')')
                progress(json, 500)
                $("#back").show()
            }
            sessionStorage.setItem("upperlimit",upperlimit)
        }else{
            $("#back").show()
            $("#back").html(json.msg)
        }
       
    }
    
});

//更多显示  上面框框显示
$('#btnmore').on('click', function(){
    var top = document.getElementById("userinfo").style.marginTop;
    document.getElementById("userinfo").style.marginTop = 0;
    if (top == "0px") {
        document.getElementById("userinfo").style.marginTop = -200 + 'px';
    }
})

 ///irobotweb/sys/rescoure/query/list

//  $.ajax({
//     url: share+'/irobotweb/sys/resource/query/list',
//     type: "get",
//     dataType: "json",
//     cache: false,
//     crossDomain: true,
//     xhrFields: {
//         withCredentials: true
//     },
//     success: function (json) {
// 		console.log(json,'列表数据')
//     }
// });