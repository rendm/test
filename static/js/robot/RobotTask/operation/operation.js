function success_jsonpCallback(json){
    var data = json.rows;
    data.forEach(element => {
       console.log(element.taskSerialName,element.taskSerialId)
       var obj = {
           id:element.taskSerialId,
           name:element.taskSerialName
       }
       Serialarray.push(obj)
       console.log(Serialarray,'通过id找name')
    });
}
var Serialarray =[];
    $.ajax({    //    /irobotweb/sys/taskserial/query/list
        url: share+'/irobotweb/sys/taskserial/query/list',
        type: "get",
        dataType: "jsonp",
        //cache: false,
        jsonpCallback: "success_jsonpCallback",
        crossDomain: true,
        jsonp: "callback",
        xhrFields: {  
            withCredentials: true
        },
        success: function (json){
            console.log(json,'success')
        },
        error:function(json){
            console.log(json,'sjgd')
        }
    })

  //可运行的任务序列
function load() {
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
                url: share+'/irobotweb/sys/taskserial/query/list', //
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
                        rows: params.pageSize,     //页面大小
                        page: params.pageNumber,   //页码
                        sortOrder: 'asc',
                        taskSerialName:$.trim($('#taskSerialName').val())
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
                    // {
                    //     checkbox: true
                    // },
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
                        field: 'taskSerialName',
                        align: 'center',
                        title: '任务序列名称'
                    },
                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    {
                        title: '操作',
                        field: 'taskSerialId',
                        align: 'center',
                        formatter: function (taskSerialId) {
                            console.log(taskSerialId,'看看是啥')
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="立即执行" onclick="execute(\''
                                + taskSerialId
                                + '\')">立即执行</a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="定时执行" onclick="timing(\''
                                + taskSerialId
                                + '\')">定时执行</a> ';
                            // var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="control(\''
                            //     + row.id
                            //     + '\')"><i class="fa fa-remove "></i></a> ';
                                 //未激活
                                return  c + e;
                        }
                    }]
            });
}
   //运行中的任务
function insev(){
    $('#serviceTable').bootstrapTable({
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share+'/irobotweb/sys/task/query/list', //
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
                        rows: params.pageSize,     //页面大小
                        page: params.pageNumber,   //页码
                            //排序列名
                        sortOrder: 'asc',
                         //filename: $.trim($('#genid').val()),//id搜索框
                         taskName: $.trim($("#taskname").val()),//任务名称
                         robothardwareno: $.trim($("#robothardwareno").val()),//机器人硬件地址
                         robotname: $.trim($("#robotName").val()),//机器人名称
                         status:0
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
                    // {
                    //     checkbox: true
                    // },
                    {
                        align: 'center',
                        title: '序号',// 列标题
                        formatter: function (value, row, index){
                            var pageSize = $('#serviceTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#serviceTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;   // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'taskSerialId',
                        align: 'center',
                        title: '任务序列名称',
                        formatter: function (taskSerialId){
                            console.log(taskSerialId,'运行中任务序列id')
                            console.log(Serialarray,'数组')
                            var qw='';
                            Serialarray.forEach(function(element){
                                if(taskSerialId == element.id){
                                    console.log(element.name)
                                    qw+=element.name
                                }
                            })
                            return qw
                        }
                    },
                    {
                        field: 'taskTypeName',
                        align: 'center',
                        title: '任务名称'
                    },
                    {
                        field: 'robothardwareno',
                        align: 'center',
                        title: '任务执行机器人硬件地址'
                    },
                    {
                        field: 'robotname',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    {
                        field: 'status',
                        align: 'center',
                        title: '任务状态',
                        formatter: function (status) {
                            if(status == "0"){
                                // return '<img src="" alt="">'
                                return '<span class ="border-blue">运行中</span>'
                             }else if(status == "1"){
                                 return '<span class ="border-red">待运行</span>'
                             }else if(status == "2"){
                                 return '<span class ="border-orange">结束</span>'
                             }
                        }
                    },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        formatter: function (type, row, index) {
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="暂停" onclick="pause(\''
                                + row.id
                                + '\')">暂停</a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="停止" onclick="stop(\''
                                + row.id
                                + '\')">停止</a> ';
                            // var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="control(\''
                            //     + row.id
                            //     + '\')"><i class="fa fa-remove "></i></a> ';
                                 //未激活
                                return  c + e ;
                             
                            
                        }
                    }]
            });
}
   //已完成的任务
function finish() {
    $('#accomplishTable').bootstrapTable({
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share+'/irobotweb/sys/task/query/list', //
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
                height: $(window).height()-300,
                queryParams: function (params){
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,     //页面大小
                        page: params.pageNumber,   //页码
                            //排序列名
                        sortOrder: 'asc',
                        // filename: $.trim($('#genid').val()),//id搜索框
                        taskName: $.trim($("#taskname").val()),//任务名称
                         robothardwareno: $.trim($("#robothardwareno").val()),//机器人硬件地址
                         robotname: $.trim($("#robotName").val()),//机器人名称
                         status:2
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
                    // {
                    //     checkbox: true
                    // },
                    {
                        align: 'center',
                        title: '序号',// 列标题
                        formatter: function (value, row, index) {
                            var pageSize = $('#accomplishTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#accomplishTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'taskSerialId',
                        align: 'center',
                        title: '任务序列名称',
                        formatter: function (taskSerialId){
                            var namede='';
                            Serialarray.forEach(function(element){
                                if(taskSerialId == element.id){
                                    console.log(element.name)
                                    namede+=element.name
                                }
                            })
                            console.log(namede,'获取到的name·')
                            return namede
                        }
                    },
                    {
                        field: 'taskname',
                        align: 'center',
                        title: '任务名称'
                    },
                    {
                        field: 'robothardwareno',
                        align: 'center',
                        title: '任务执行机器人硬件地址'
                    },
                    {
                        field: 'robotname',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    {
                        field: 'status',
                        align: 'center',
                        title: '任务状态',
                        formatter: function (status){
                            // 0表示图片，1表示音频，2表示视频，3表示其他
                            //console.log(value,'已完成看状态的呀')
                            if(status == "0"){
                               // return '<img src="" alt="">'
                               return '<span class ="border-blue">运行中</span>'
                            }else if(status == "1"){
                                return '<span class ="border-red">待运行</span>'
                            }else if(status == "2"){
                                return '<span class ="border-orange">结束</span>'
                            }
                        }
                    },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        formatter: function (id){
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详细" onclick="show(\''
                                + id
                                + '\')"><i class="fa fa-search "></i></a> ';
                            // var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="setting(\''
                            //     + id
                            //     + '\')"><i class="fa fa-edit "></i></a> ';    
                            // var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="control(\''
                            //     + id
                            //     + '\')"><i class="fa fa-remove "></i></a> ';
                                 //未激活
                                return  c ;
                             
                        }
                    }]
            });
}
//查询判断运行模块                                       
var urlsop = 1;
$("#taskSerial").show()
//三个列表框框
var lilength = $("ul li").length;
for(var i = 0;i<lilength;i++){
    console.log(i,'ul下标')
    $("ul li").eq(i).on('click',function(){
       var distinction = $(this).attr('distinction');
       if(distinction == 'one'){
            urlsop = 1;
            $("#taskSerial").show()
            $("#tasktask").hide()
            $("#tasktaskd").hide()
            $("#tasktaskf").hide()
       }else if(distinction == 'two'){
            urlsop = 2;
            $("#taskSerial").hide()
            $("#tasktask").show()
            $("#tasktaskd").show()
            $("#tasktaskf").show()
       }else if(distinction == 'three'){
            urlsop = 3;
            $("#taskSerial").hide()
            $("#tasktask").show()
            $("#tasktaskd").show()
            $("#tasktaskf").show()
       }
    })
}

//提交搜索
$("#checkbtnreload").on('click',function(e){
    console.log(urlsop,'返回的值')
    if(urlsop == 1){
        // /irobotweb/sys/taskserial/query/ids get
        console.log($.trim($('#taskSerialName').val()))
        $('#exampleTable').bootstrapTable('destroy');
        load()
        e.preventDefault()
    }else if(urlsop == 2 ){
        // /irobotweb/sys/task/query/list  get
        $('#serviceTable').bootstrapTable('destroy');
        insev()
    }else if(urlsop == 3){
         $('#accomplishTable').bootstrapTable('destroy');
         finish()
    }
})
//重置搜索
$("#btnreset").on('click',function(){
    $("#taskSerialName").val('')
    $("#taskname").val('')
    $("#robothardwareno").val('')
    $("#robotName").val('')
})
//查询点击
// $('#btnreload').on('click',function(){
//     $('#exampleTable').bootstrapTable('destroy');
//     load();
// })
// load()
//立即执行
function execute(id){
    sessionStorage.setItem("exid",id)
    layer.open({
        type: 2,
        title: '立即执行',
        maxmin: true,
        shadeClose: false,
        area: ['1000px', '700px'],
        content:'./execution.html'  // iframe的url
    });
}
//定时执行
function timing(){
    layer.open({
        type: 2,
        title: '定时执行',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content:' '  // iframe的url
    });
}
//增加
$('#add').on('click',function(){
    layer.open({
        type: 2,
        title: '增加',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content:'./add.html'  // iframe的url
    });
})
//详情查看
function show(id) {
    sessionStorage.setItem("showid",id)
    console.log('详情id'+id)
    layer.open({
        type: 2,
        title: '详情',
        maxmin: true,
        shadeClose: false,
        area: ['1000px', '550px'],
        content:'./show.html'  // iframe的url
    });
}
//编辑修改
function setting(id) {
    layer.open({
        type: 2,
        title: '运行控制',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '520px'],
        content: './edit.html' 
    });
}

 //更多显示  上面框框显示
 $('#btnmore').on('click',function(){
     console.log("更多显示")
     var top = document.getElementById("userinfo").style.marginTop;
     document.getElementById("userinfo").style.marginTop=0;                                                                                                                                                                                                                                                                                                                                            
    console.log(top,'top')
    if (top == "0px"){
        console.log(123213)
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 })
 //激活页面
function activate(){
    layer.open({
        type: 2,
        title: '激活·',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '520px'],
        content: './control.html' 
    });
}
//可运行的任务序列
load()
$("#ones").on('click',function(){
    load()
})
//运行中的任务
$("#twos").on('click',function(){
    insev()
})
//已完成的任务
$("#threes").on('click',function(){
    finish()
})
//运行中的任务暂停
function pause(id){
//  /irobotweb/task/control/pausetask
    // $.ajax({
    //     type: "POST",
    //     url: share + "/irobotweb/task/control/pausetask",
    //     data: {

    //     },// 你的formid//所有input框 里面的值
    //     crossDomain: true,
    //     //dataType:"json",
    //     contentType: "application/json; charset=utf-8",
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     error: function (request) {
    //         parent.layer.alert("Connection error");
    //     },
    //     success: function (data) {
    //         console.log(data, 'ajax的请求保存返回')
    //         if (data.code == 200) {
    //             parent.location.reload(); 
    //         }
    //     }
    // });
    console.log("运行中的任务暂停")
}
//运行中的任务停止  
function stop(id){
// /irobotweb/task/control/robot/taskcontrol/shutdowntask
console.log("运行中的任务停止")
}