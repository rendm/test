//console.log('顾客管理')
var prefix = "/irobotweb/sys/user";

var customer_list_formData = new FormData();       //定义全局的FormData对象-批量上传文件 
var customer_image_list_formData = new FormData(); //定义全局的FormData对象-批量上传图像
var customer_name='',customer_mobile='',customer_shopname='';

$(function () {
    load();
});



//页面加载
function load() {

    //var realName = $.trim($('#genid').val());
    //alert('realName=' + realName);
    //console.info('名称');console.info(customer_name);
    //console.info('手机');console.info(customer_mobile);
    //console.info('店铺名称');console.info(customer_shopname);

    $('#exampleTable').bootstrapTable('destroy');
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
        url: share+'/irobotweb/sys/guest/query/list',
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true,     // 设置为true会有隔行变色效果
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
                sortOrder: 'asc',
                realName: customer_name,
                mobile:customer_mobile,
                shopName:customer_shopname
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
                checkbox: true,
                formatter: function (i,row) {

                    if($.inArray(row.guestId,overAllIds)!=-1){// 因为 判断数组里有没有这个 id
                        return {
                            checked : true               // 存在则选中
                        }
                    }
                }
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
                field: 'realName',
                align: 'center',
                title: '姓名'
            },
            {
                field: 'gender',
                align: 'center',
                title: '性别',
                formatter: function (value) {
                    //(0女 1男)
                    if(value == 0){
                        return "女";
                    }else if(value == 1){
                        return "男";
                    }else if(value == -1){
                        return "保密";
                    }

                }
            },

            {
                field: 'birthday',
                align: 'center',
                title: '生日',
                formatter: function (value) {
                    //(0女 1男)
                    if(value!=null && value!=''){
                        return value.substr(0,10);
                    }
                    else{
                        return '';
                    }
                }
            },

            {
                field: 'mobile',
                align: 'center',
                title: '手机'
            },
            {
                field: 'address',
                align: 'center',
                title: '地址'
            },
            {
                field: 'shopName',
                align: 'center',
                title: '店铺名称'
            },
            {
                field: 'headFeaturePath',
                align: 'center',
                title: '头像特征是否上传',
                formatter: function (value) {
                   // console.log(value,'是否上传')
                    if (value!='' && value!=null) {
                        return '<span class="label label-primary">已上传</span>';
                    } else{
                        return '<span class="label label-danger">未上传</span>';
                    }
                }
            },

            /*{
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
            },*/

            {
                title: '操作',
                field: 'facefeature',
                align: 'center',
                formatter: function (value, row, index) {
                    var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详情" onclick="show(\''
                        + row.guestId
                        + '\')"><i class="fa fa-search"></i></a> ';
                    var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                        + row.guestId
                        + '\')"><i class="fa fa-edit "></i></a> ';
                    var d = '<a class="btn btn-danger btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                        + row.guestId
                        + '\')"><i class="fa fa-trash fa-fw"></i></a> ';

                   

                    var f = '<span class="btn btn-primary fileinput-button btn-sm"><span><i class="fa fa-upload fa-fw"></i></span><input title="上传头像" id="img_file_one" onchange="uploadIMG_row(\''
                        + row.guestId + '\')" type="file" class="file" style="z-index:2; opacity:0;margin:0; cursor: pointer;" name="filesUploadOne" /></span>';

                    // var g='<a class="btn btn-primary btn-sm '  + '" href="#" title="上传头像"  mce_href="#" onclick="uploadIMG_row(\''
                    //     + row.guestId
                    //     + '\')"><i class="fa fa-upload fa-fw"></i></a> ';

                        if (row.facefeature!='' && row.facefeature!=null) {
                            return  c + e + d;
                        } else{
                            return  c + e + f + d;
                        }
                }
            }]
    });
}

//查询点击
$('#btnreload').on('click', function () {

    customer_name = $.trim($('#genid').val());//顾客名称
    customer_mobile = $.trim($('#mobile').val());//手机
    customer_shopname = $.trim($('#shopName').val());//店铺名称

    load();
})

// 详情
function show(id){
    //console.log(id)
    sessionStorage.setItem('customershowid', id);
    layer.open({
        type: 2,
        title: '详情', // 原来 顾客添加
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './show.html' 
    });
}

//编辑修改
function edit(id) {
    sessionStorage.setItem('customereditid', id);
    layer.open({
        type: 2,
        title: '编辑', //原来 顾客修改
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'./edit.html'  // iframe的url
    });
} 

//上传头像
function uploadIMG(id){

    sessionStorage.setItem('usereditid', id);

    layer.open({
        type: 2,
        title: '顾客修改',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content:'./uploadIMG.html'  // iframe的url
    });
}

//上传头像-改进后的方法
function uploadIMG_row(id) {

    var event = event ? event : window.event;
    var obj = event.srcElement ? event.srcElement : event.target;    
    var customer_imgOne_formData = new FormData();
    customer_imgOne_formData.append('avatar_file', obj.files[0]);
    customer_imgOne_formData.append('guestid', id);

    //上传文件 
    $.ajax({
        url: share + "/irobotweb/sys/guest/upload",
        crossDomain: true,
        type: "POST",
        processData: false,
        dataType: 'JSON',
        contentType: false,
        async: false,
        xhrFields: {
            withCredentials: true
        },
        data: customer_imgOne_formData,

        success: function (data) {
            //jsondata =JSON.parse(data);

            if (data.code ==200 ) {
                parent.layer.msg("更新成功");
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
                window.location.reload();
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}


//添加
function add(){
    parent.layer.open({
        type: 2,
        title: '添加',
        //fixed: false, //不固定
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'shop/customerManagement/add.html'  // iframe的url
    });
}

$('#btnadd').on('click',function(){
     // iframe层
     parent.layer.open({
        type: 2,
        title: '添加',//原来 增加用户
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './add.html',
         end: function () {
             //location.reload();
             //刷新页面
         }
    });
})

//bulkImport 批量导入
$("#bulkImport").on('click', function () {

    $.ajax({
        url: share+"/irobotweb/sys/guest/upload/excel",
        type: "post",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        data: {
            
        },
        success: function (r) {
            if (r.code == 0 || r.code==200) {
                layer.msg(r.msg);
                window.location.reload();
            } else {
                layer.msg(r.msg);
            }
        }
    });
})

//批量上传文件
var file_batch = $('#file_batch'), img_file_batch = $('#img_file_batch'),aim = $('#aim');//img_file_batch

file_batch.on('change', function (e) {
    //alert(22);
    var theFile = e.currentTarget.files[0];
    customer_list_formData.append('avatar_file', theFile);
    //console.log(customer_list_formData.get("avatar_file"));

    //上传文件
    $.ajax({
        url: share + "/irobotweb/sys/guest/upload/excel",
        crossDomain: true,
        type: "POST",

        contentType: false,
        processData: false,
        async: false,

        xhrFields: {
            withCredentials: true
        },
        data: customer_list_formData,

        success: function (data) {
            if (data.code == 1 || data.code ==200 ) {
                parent.layer.msg("更新成功");
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
                window.location.reload();
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
});

//头像批量上传
img_file_batch.on('change', function (e) {

    //var file_arr = new Array();

    for (var i = 0; i < e.currentTarget.files.length; i++) {
        //上传多张图片的写法
        //此处直接使用FormData对象append即可
        customer_image_list_formData.append('files', e.currentTarget.files[i]);
    }

    //上传文件
    $.ajax({
        url: share + "/irobotweb/sys/guest/upload/list",
        crossDomain: true,
        type: "POST",

        contentType: false,
        processData: false,
        async: false,

        xhrFields: {
            withCredentials: true
        },
        data: customer_image_list_formData,

        success: function (data) {
           // console.log(data,'批量上传')
            if (data.code == 1 ||data.code ==200) {
                parent.layer.msg("更新成功");
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
                window.location.reload();
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
});


//图片导入imageImg
$("#imageImg").on('click',function(){   
    // /irobotweb/sys/guest/upload/list

    $.ajax({
        url: share+"/irobotweb/sys/guest/upload/list",
        type: "post",
        crossDomain: true,
        dataType:"JSON",
        xhrFields: {
            withCredentials: true
        },
        data: {
            
        },
        success: function (r) {
            jsondata =JSON.stringify(r);

            if (jsondata.code == 0 || jsondata.code ==200  ) {
                layer.msg(jsondata.msg);

                window.location.reload();
            } else {
                layer.msg(jsondata.msg);
            }
        }
    });
})

//模板下载template
$("#template").on('click',function(){
   
    window.location.href= share+'/irobotweb/sys/guest/upload/getmodel'; //点击下载
 })


function remove(id) {
    //console.log(id,'删除')
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/sys/guest/delete?guestid="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0 ||r.code==200) {
                    layer.msg(r.msg);
                    window.location.reload();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//删除键
$('#btndel').on('click',function(){
  //  var rows = $('#exampleTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
    if (overAllIds.length == 0) {
        layer.msg("请选择要删除的数据");
        return;
    }
    layer.confirm("确认要删除选中的'" + overAllIds.length + "'条数据吗?", {
        btn: ['确定', '取消']
        // 按钮
    }, function () {


        $.ajax({
            url: share+"/irobotweb/sys/guest/delete/list" +"?guestids="+overAllIds,
            type:"DELETE",
           // contentType:"application/json",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                //console.log(r)
                if (r.code == 0 ||r.code == 200) {
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




$('#exampleTable').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
    var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
    examine(e.type,datas);                              // 保存到全局 Array() 里
});


var overAllIds = new Array();  //全局数组
var overAllrows = new Array();  //全局行数

function examine(type,datas){
    if(type.indexOf('uncheck')==-1){
        $.each(datas,function(i,v){
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            overAllIds.indexOf(v.guestId) == -1 ? overAllIds.push(v.guestId) : -1;
        });

    }else{
        $.each(datas,function(i,v){
            overAllIds.splice(overAllIds.indexOf(v.guestId),1);    //删除取消选中行
        });
    }

}

