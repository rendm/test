var prefix = "/irobotweb/sys/user";

var shopName = '';  //店铺名称
var shopmanagerId = '', shopcontacts = '', mobile = '', email = '', address = '', parentShopId = '', username = '';

var arr_shopids_shopmanagers = {};//店铺及店铺管理者数组
getShopIdShopmanagers();
load();
//loadShowMore();

//获取所有店铺id及店铺管理人
function getShopIdShopmanagers() {
    //irobotweb/sys/shop/getallshopmanager
    //开发者 列表
    $.ajax({
        url: share + '/irobotweb/sys/shop/getallshopmanager',
        type: "get",
        dataType: "json",
        //cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            //console.log('获取的数据');
            //console.log(data);
            arr_shopids_shopmanagers = data.data;
        }
    })
}

function load() {
    var currentPageNumbe;


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
        url: share + '/irobotweb/sys/shop/query/list',
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true,            //设置为true会有隔行变色效果
        dataType: "jsonp",        //服务器返回的数据类型
        pagination: true,         //设置为true会在底部显示分页条
        singleSelect: false,      //设置为true将禁止多选
        pageSize: 10,             //如果设置了分页，每页数据条数
        pageNumber: 1,            //如果设置了分布，首页页码
        pageList: [10, 25, 50, 100],
        queryParamsType: '',
        sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
        paginationLoop: false,
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        paginationShowPageGo: true,     //显示跳转
        async: false,
        showJumpto: true,
        height: $(window).height() - 127,
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                sortOrder: 'asc',
                shopName: shopName,            //店铺名称
                shopmanagerId: shopmanagerId,  //店铺管理者
                shopcontacts: shopcontacts,    //店铺联系人
                mobile: mobile,                //联系人手机
                email: email,                  //店铺邮箱
                address: address,              //店铺地址
                parentShopId: parentShopId,    //上级店铺名称
                username: username,            //所属开发者
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
                align: 'center',
                title: '序号',// 列标题
                formatter: function (value, row, index) {
                    var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;                              // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                field: 'shopName',
                align: 'center',
                title: '店铺名称'
            },
            {
                field: 'shopId',//shopmanagerId
                align: 'center',
                title: '店铺管理者',
                class:  'colStyle',
                formatter: function (value, row, index) {


                    result = processShopmanager(value);
                    var title = result.substring(0, 20);
                    var span = document.createElement('span');
                    span.setAttribute('title', result);
                    //  span.setAttribute('class','colStyle');
                    span.innerHTML = title;



                    return span.outerHTML;
                }
            },
            {
                field: 'shopcontacts',
                align: 'center',
                title: '店铺联系人'
            },
            {
                field: 'mobile',
                align: 'center',
                title: '店铺联系手机'
            },
            {
                field: 'phone',
                align: 'center',
                title: '店铺座机'
            },
            {
                field: 'address',
                align: 'center',
                title: '店铺地址'
            },

            /*{
                field: 'parentShopId',   //parentShopName
                align: 'center',
                title: '上级店铺'
            },*/

            {
                field: 'shopuserName',
                align: 'center',
                title: '所属用户姓名'
            },

            {
                field: 'userEnterprise',
                align: 'center',
                title: '所属用户企业'
            },

            {
                field: 'developerName',
                align: 'center',
                title: '所属开发者姓名'
            },

            {
                field: 'developerEnterprise',
                align: 'center',
                title: '所属开发者企业'
            },

            /*{
                field: 'deviceDeveloperId',
                align: 'center',
                title: '所属开发者'
            },*/

            {
                field: 'status',
                align: 'center',
                title: '是否可用',
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
                    var c = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="详细" onclick="show(\''
                        + row.shopId
                        + '\')"><i class="fa fa-search "></i></a> ';
                    var e = '<a  class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                        + row.shopId
                        + '\')"><i class="fa fa-edit "></i></a> ';
                    var d = '<a class="btn btn-danger btn-sm ' + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                        + row.shopId
                        + '\')"><i class="fa fa-trash fa-fw"></i></a> ';

                    var f = '<a class="btn btn-primary btn-sm ' + '" href="#" title="绑定机器人"  mce_href="#" onclick="equipment(\''
                        + row.shopId
                        + '\')"><i class="fa fa-android fa-fw"></i></a> ';

                    var g = '<a class="btn btn-primary btn-sm  ' + '" href="#" title="管理者设置"  mce_href="#" onclick="managerset(\''
                        + row.shopmanagerId + ',' + row.shopId
                        + '\')"><i class="fa fa-cog  fa-fw"></i></a> ';
                    return c + e + f + g + d;
                }
            }]
    });
}


//查询点击
$('#btnreload').on('click', function () {
    getShopIdShopmanagers();
    //店铺名称
    shopName = $.trim($('#shopName').val());
    //店铺管理者
    shopmanagerId = $.trim($('#shopmanagerId').val());
    //店铺联系人
    shopcontacts = $.trim($('#shopcontacts').val());
    //联系人手机
    mobile = $.trim($('#mobile').val());
    //店铺邮箱
    email = $.trim($('#email').val());
    //店铺地址
    address = $.trim($('#address').val());
    //上级店铺名称
    parentShopId = $.trim($('#parentShopId').val());
    //所属开发者
    username = $.trim($('#username').val());
    $('#exampleTable').bootstrapTable('destroy');
    load();
    console.log(shopName, '//店铺名称')
})


//添加
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

//获取店铺管理者，可能有多个
function processShopmanager(shopid) {

    var name_str = '', result = '';

    if (arr_shopids_shopmanagers != null && arr_shopids_shopmanagers.length > 0) {
        for (i = 0; i < arr_shopids_shopmanagers.length; i++) {
            if (shopid == arr_shopids_shopmanagers[i].shopid) {
                name_str += arr_shopids_shopmanagers[i].shopmanagername + ',';
            }
        }

        if (name_str != '') { //杨帆,杨柳,
            //console.log('店铺管理者1');
            //console.log(name_str);
            var last_index = name_str.lastIndexOf(',');
            result = name_str.substring(0, last_index);
        }

        //console.log('店铺管理者');
        //console.log(result);

        return result;
    }
}


//删除
function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share + "/irobotweb/sys/shop/delete?shopid=" + id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0 || r.code == 200) {
                    layer.msg(r.msg);
                    $('#exampleTable').bootstrapTable('destroy');
                    load();
                } else {
                    layer.msg(r.msg);
                }
            }
        });

    })
}

//查看详情
function show(id) {
    sessionStorage.setItem('shopshowid', id);
    layer.open({
        type: 2,
        title: '详情',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './show.html'  // iframe的url
    });
}

function edit(id) {
    sessionStorage.setItem('shopeditid', id);
    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './edit.html'  // iframe的url
    });
}

//跳转至机器人绑定页面
function equipment(id) {
    sessionStorage.setItem('equipmenteditid', id);//店铺id
    layer.open({
        type: 2,
        title: '绑定机器人',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './equipment.html'  // iframe的url
    });
}

//管理者设置页面
function managerset(id) {
    sessionStorage.setItem('equipmenteditid', id);//店铺id
    //alert(id);
    var index = id.indexOf(',');
    var shopmanagerId = id.substring(0, index);
    var shopId = id.substring(index + 1, id.length);

    sessionStorage.setItem('shopmanagerId', shopmanagerId);
    sessionStorage.setItem('shopId', shopId);

    layer.open({
        type: 2,
        title: '管理者设置',
        shadeClose: false,
        area: ['1000px', '750px'],
        content: './managerset.html',
        end: function () {
            //location.reload();
            refresh();
        }
    });
}

////////////////////////////////////////////////////////////////////////
//滚动条  显示
//progress   100
//progressbg   大盒子  
//文字提示 textmin  textmax


//更多显示
$('#btnmore').on('click', function () {

    var top = document.getElementById("userinfo").style.marginTop;
    document.getElementById("userinfo").style.marginTop = 0;
    if (top == "0px") {
        document.getElementById("userinfo").style.marginTop = -200 + 'px';
    }
})

//加载时显示更多
function loadShowMore() {
    var top = document.getElementById("userinfo").style.marginTop;
    document.getElementById("userinfo").style.marginTop = 0;
    if (top == "0px") {
        document.getElementById("userinfo").style.marginTop = -200 + 'px';
    }
}


function refresh() {

    getShopIdShopmanagers();
    $('#exampleTable').bootstrapTable('refresh');
    //

    // _table.bootstrapTable('refresh',{
    //     pageNumber: 1,
    // });
}

