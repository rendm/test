var prefix = "/irobotweb/sys/user";

load();
var arr_binded={};

//获取已绑定的子用户
function getBindedUsers(){
    //irobotweb/sys/shop/getshopmanager
     var shopid=sessionStorage.getItem('shopId');
    //开发者 列表
    $.ajax({
        url: share + '/irobotweb/sys/shop/getshopmanager?shopid='+shopid,
        type: "get",
        dataType: "json",
        //cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log('绑定的子用户');
            console.log(data);
            arr_binded=data.data;
        }
    })
}

//判断子用户是否绑定该用户
function getIsBindStatus(shopmanagerid){
    var flag=0;
    if(arr_binded!=null && arr_binded.length!=null && arr_binded.length>0 ){
        for(i=0;i<arr_binded.length;i++){
            if(shopmanagerid==arr_binded[i].shopmanager){
                flag=1;
            }
        }
    }

    return flag;
}


function load() {

    getBindedUsers();


    var shopmanagerId = sessionStorage.getItem('shopmanagerId');

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
                shopmanagerid:shopmanagerId,
                position:'subshopmanager' //身份
            };
            return temp;
        },

        columns: [
            {
                checkbox: true,
                formatter: function (i,row) {
                     var flag=false;
                    $.each(overAllrows,function(index,value){
                        if(row.genid == value.genid)
                        {
                            console.log("存在选中")
                            flag=true;

                        }
                    });

                    if (flag) {
                        return {
                            checked : true               // 存在则选中
                        }
                    }


                    // if($.inArray(row.genid,overAllIds)!=-1){// 因为 判断数组里有没有这个 id
                    //     return {
                    //         checked : true               // 存在则选中
                    //     }
                    // }
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
                field: 'name',
                align: 'center',
                title: '姓名'
            },
            {
                field: 'genid',
                align: 'center',
                title: '用户ID'
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
                title: '企业名称'
            },

            {
                field: 'genid',
                align: 'center',
                title: '是否已绑定该店铺',
                formatter:function (value, row, index) {
                   var flag=getIsBindStatus(value);
                   if(flag==1){
                       return '<span class="label label-primary">已绑定</span>';
                   }
                   else{
                       return '<span class="label label-danger">未绑定</span>';
                   }
                }
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
            }]
    });
}


//绑定
function BindProcess() {

    //alert('绑定方法');


    //debugger
    if (overAllrows.length == 0) {

            layer.msg("请选择要绑定的数据");

        return;
    }


    var select_data_arr = new Array();


    //遍历选中的子用户
    for (var i = 0; i < overAllrows.length; i++) {
      var item={};
        //shopmanager=rows[i].genid;
        item.shopmanager = overAllrows[i].genid;
        item.shopmanagername = overAllrows[i].name;
        item.shopid = sessionStorage.getItem('shopId');
        item.type = "1";
        select_data_arr.push(item);
    }

    var data =JSON.stringify(select_data_arr);


    $.ajax({
        url: share + '/irobotweb/sys/shop/addmanager',
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        data: data,
        success: function (data) {

            if (data.code == 1) {
                parent.layer.msg("更新成功");
                //window.location.reload();
                refresh();
            } else if (data.code == 200){
                layer.alert('更新成功', function () {
                 //   window.location.reload();
                    layer.close(layer.index);
                    refresh();
            });
            }
        },
        error: function (request) {
            console.info('绑定失败');
            console.info(request);
            layer.alert("Connection error");
        },
    });
}

//绑定功能
$('#btnBind').click(function () {
    BindProcess();
});

//解绑功能
$('#btnUnbind').click(function () {



    if (overAllrows.length == 0) {
        layer.msg("请选择要解绑的数据");
        return;
    }



    var select_data_arr = new Array();


    var shopmanager='';
    //遍历选中的子用户
    for (var i = 0; i < overAllrows.length; i++) {
        var item={};

        item.shopmanager = overAllrows[i].genid;
        //item.shopmanagername = rows[i].name;
        item.shopid = sessionStorage.getItem('shopId');
        item.type = 0;
        select_data_arr.push(item);
    }

    var data =JSON.stringify(select_data_arr);

    $.ajax({
        url: share + '/irobotweb/sys/shop/addmanager',
        crossDomain: true,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        data: data,
        success: function (data) {


            if (data.code == 1) {
                parent.layer.msg("更新成功");
               // window.location.reload();
                refresh();
            } else if (data.code == 200){
                layer.alert('更新成功', function () {
                  //  window.location.reload();
                   // var index=layer.getChildFrame(window.name);
                    layer.close(layer.index);
                    refresh();
                });
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });


});

//返回按钮
$('#btnBack').click(function () {
    //window.parent.location.href = "./theMapManagement.html";
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});






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

$('#exampleTable').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){
    var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
    examine2(e.type,datas);                              // 保存到全局 Array() 里
});


var overAllIds = new Array();  //全局数组
var overAllrows = new Array();  //全局行数

function examine(type,datas){
    if(type.indexOf('uncheck')==-1){
        $.each(datas,function(i,v){
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            overAllIds.indexOf(v.genid) == -1 ? overAllIds.push(v.genid) : -1;
        });

    }else{
        $.each(datas,function(i,v){
            overAllIds.splice(overAllIds.indexOf(v.genid),1);    //删除取消选中行
        });
    }

}

function examine2(type,datas){
    if(type.indexOf('uncheck')==-1){
        $.each(datas,function(i,v){
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            if (overAllrows.length>0)
            {   var flag =true ;
                $.each(overAllrows,function(index,value){
                     if(v.genid == value.genid)
                     {
                         flag=false;

                     }
                });
                if(flag)
                {
                    overAllrows.push(v);
                }

            }else {

                overAllrows.push(v);
            }


        });

    }else{

        var deleteids=new Array();
        $.each(datas,function(i,v){

           //删除取消选中行

            $.each(overAllrows,function(index,value){
                if(v.genid == value.genid)
                {

                    deleteids.push(index);
                }
            });

        });

        $.each(deleteids,function(index,value){
            overAllrows.splice(value,1);
        });
    }

    console.log("111",overAllrows);
}



function  refresh() {

    getBindedUsers();
    $('#exampleTable').bootstrapTable('refresh');

}
