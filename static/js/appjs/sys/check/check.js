

var prefix = "/irobotweb/sys/check"
$(document).ready(function () {
    load();//个人认证
    //enterprise();//企业认证
});
$('#twos').on('click',function(){
    enterprise()
})
// $.ajax({
//     url:'http://192.168.1.11:9090/irobotweb/sys/check/query/list',
//     type:'get',
//     crossDomain: true,
//     xhrFields: {
//         withCredentials: true
//     },
//     success:function(data){
//         console.log(data)
//     }
// })
load();
//enterprise();
function load() {
    $('#exampleTable')
        .bootstrapTable(
            {
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback", 
                    jsonpCallback: "success_jsonpCallback",
                },
                type: 'GET', // 服务器数据的请求方式 get or post
                url: share+'/irobotweb/sys/check/query/list', // 服务器数据的加载地址
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
                sidePagination: "server",
                paginationLoop: false,
                paginationPreText:"上一页",
                paginationNextText:"下一页",
                paginationShowPageGo: true,     //显示跳转
                showJumpto: true,
                height: $(window).height()-147,
                queryParams: function (params) {

                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,                         //页面大小
                        page: params.pageNumber,   //页码
                        sort: 'user_id',      //排序列名
                        sortOrder: 'asc',
                        realName: $.trim($('#realName').val()),//姓名
                        cardnumber: $.trim($('#cardnumber').val())
                    };
                    return temp;
                },
                columns: [
                    {
                        align: 'center',
                        title: '序号',// 列标题
                        width:50,
                        formatter: function (value, row, index) {
                            var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'realName',
                        title: '姓名',
                        valign: 'center',
                        align: 'center',
                        width: 100,
                        witth: 20
                    },
                    {
                        field: 'genid',
                        title: '用户id',
                        align: 'center',
                        valign: 'center',
                        width: 200,
                        witth: 20
                    },
                    {
                        field: 'cardnumber',
                        title: '证件号码',
                        align: 'center',
                        valign: 'center',
                        width: 200,
                        witth: 20
                    },
                    {
                        field: 'isCheck',
                        title: '是否完成审核',
                        align: 'center',
                        width: 50,
                        valign: 'center',
                        formatter: function (value, row, index) {
                            if (value == 'N') {
                                return '<span class="label label-danger">未审核</span>';
                            } else if (value == 'Y') {
                                return '<span class="label label-primary">已审核</span>';
                            }
                        }
                    },
                    {
                        field: 'frontIdcard',
                        title: '身份证正面',
                        width: 50,
                        formatter: function (value, row, index) {
                            // return "<a href='#this onclick='showImage("+value+")' name=\"frontIdcard\">" + "正面" + "</a>";
                            return "<span name='" + value + "' style='color: blue;cursor:pointer'   onclick='showImage(this)' >" + "正面" + "</span>"
                        },
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'behindIdcard',
                        title: '身份证背面',
                        width: 50,
                        formatter: function (value, row, index) {
                            return "<span name='" + value + "' style='color: blue;cursor:pointer'   onclick='showImage(this)' >" + "背面" + "</span>"
                        },
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'isPass',
                        title: '是否通过',
                        align: 'center',
                        width: 50,
                        valign: 'center',
                        formatter: function (value, row, index) {
                            if (value == 'N') {
                                return '<span class="label label-danger">未通过</span>';
                            } else if (value == 'Y') {
                                return '<span class="label label-primary">已通过</span>';
                            }
                        }
                    },
                    {
                        field: 'reason',
                        title: '原因',
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'checkperson',
                        title: '审核人',
                        align: 'center',
                        width: 100,
                    },
                    {
                        field: 'checktime',
                        title: '审核时间',
                        align: 'center',
                        valign: 'center',
                        width: 200,
                    },
                    {
                        title: '操作',
                        field: 'id',
                        width: 100,
                        align: 'center',
                        formatter: function (value, row, index) {
                            var e = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="审核" onclick="edit(\''
                                + row.id + "','1"
                                + '\')"><i class="fa fa-edit "></i></a> ';
                            return e;
                        }
                    }]
            });

}

function enterprise() {
    $('#table')
        .bootstrapTable(
            {
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type: 'GET', // 服务器数据的请求方式 get or post
                url: share+"/irobotweb/sys/check/enterpriselist", // 服务器数据的加载地址
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
                sidePagination: "server",
                paginationLoop: false,
                paginationPreText:"上一页",
                paginationNextText:"下一页",
                paginationShowPageGo: true,     //显示跳转
                showJumpto: true,
                height: $(window).height()-220,
                queryParams: function (params) {

                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,                         //页面大小
                        page: params.pageNumber,   //页码
                        sort: 'user_id',      //排序列名
                        sortOrder: 'asc',
                        realName: $.trim($('#realName').val()),//姓名
                        companyCard: $.trim($('#cardnumber').val())
                    };
                    return temp;
                },
                columns: [
                    {
                        align: 'center',
                        title: '序号',
                        width:50,
                        formatter: function (value, row, index) {
                            var pageSize = $('#table').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#table').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'companyName',
                        title: '姓名',
                        valign: 'center',
                        witth: 20,
                        align: 'center',
                        width: 100,

                    },
                    {
                        field: 'genid',
                        title: '用户id',
                        valign: 'center',
                        witth: 20,
                        align: 'center',
                        width: 200,
                    },
                    {
                        field: 'companyCard',
                        title: '证件号码',
                        valign: 'center',
                        witth: 20,
                        align: 'center',
                        width: 200,
                    },
                    {
                        field: 'isCheck',
                        title: '是否审核',
                        width: 50,
                        align: 'center',
                        valign: 'center',
                        formatter: function (value, row, index) {
                            if (value == 'N') {
                                return '<span class="label label-danger">未审核</span>';
                            } else if (value == 'Y') {
                                return '<span class="label label-primary">已审核</span>';
                            }
                        }
                    },
                    {
                        field: 'enterprisecard',
                        title: '单位证件',
                        width: 50,
                        formatter: function (value, row, index) {
                            return "<span name='" + value + "' style='color: blue;cursor:pointer'   onclick='showImage(this)' >" + "正面" + "</span>"
                        },
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'reFrontIdcard',
                        title: '法人证件正面',
                        width: 50,
                        formatter: function (value, row, index) {
                            return "<span name='" + value + "' style='color: blue;cursor:pointer'   onclick='showImage(value)' >" + "正面" + "</span>"
                        },
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'reBehindIdcard',
                        title: '法人证件背面',
                        width: 50,
                        formatter: function (value, row, index) {
                            return "<span name='" + value + "' style='color: blue;cursor:pointer'   onclick='showImage(value)' >" + "正面" + "</span>"
                        },
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'isPass',
                        title: '是否通过',
                        align: 'center',
                        width: 50,
                        valign: 'center',
                        formatter: function (isPass) {
                            console.log(isPass,'tguobutg1通过')
                            if (isPass == 'N') {
                                return '<span class="label label-danger">未通过</span>';
                            } else if (isPass == 'Y') {
                                return '<span class="label label-primary">已通过</span>';
                            }
                        }
                    },
                    {
                        field: 'reason',
                        title: '原因',
                        align: 'center',
                        valign: 'center',
                    },
                    {
                        field: 'checkperson',
                        title: '审核人',
                        align: 'center',
                        valign: 'center',
                        width: 50,
                    },
                    {
                        field: 'checktime',
                        title: '审核时间',
                        align: 'center',
                        width: 200,
                        valign: 'center',
                    },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        width: 100,
                        formatter: function (value, row, index) {
                            var e = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="审核" onclick="edit(\''
                                + row.id + "','2"
                                + '\')"><i class="fa fa-edit "></i></a> ';
                            return e;
                        }
                    }]
            });
}
$('#checkbtnreload').on('click',function(){
    var type = $('ul .active').index();
   
    if (type == 0) {
        $('#exampleTable').bootstrapTable('destroy');
        load();
    } else if (type == 1) {
        $('#table').bootstrapTable('destroy');
        enterprise();
    }
})

function showImage(a) {
    var headimg = $(a).attr("name");
    // console.log(path,'1232133')
    parent.layer.open({
        type: 2,  
        title: '查看',
        fixed: false, //不固定
        shadeClose: true,
        area: ['800px', '600px'],
        content:headimg
    });
}


//暂时没有用
function edit(id, type) {
    //console.log(id+'id89898',type)
    sessionStorage.setItem('checktype', type);
    sessionStorage.setItem('checkid', id);

    layer.open({
        type: 2,
        title: '审核',
        area: ['1000px', '750px'],
        content: './tocheck.html'
    });
}
{/* <span class="treegrid-expander glyphicon-chevron-down glyphicon"></span>
<span class="treegrid-expander glyphicon-chevron-down glyphicon"></span> */}