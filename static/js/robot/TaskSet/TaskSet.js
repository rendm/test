
var TaskSetMapId='';
var robot_name='';
var timing_mapid;

$(function () {


    if(TaskSetMapId!=null && TaskSetMapId!='' && TaskSetMapId!='null'){

        $('#smallmap').show();
        $(".ibox").show();
        loadMapFile(TaskSetMapId);
        load();

    }
    else{

        // layer.alert('请选择地图!');
        $("#content-show").hide()
    }



    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var activeTab = $(e.target).attr("id");
        //var cc = $('#myTab').find("li.active a").attr("id")
        if(TaskSetMapId!=null && TaskSetMapId!='' && TaskSetMapId!='null'){
            refresh(activeTab);

        }
        else{

            $("#content-show").hide()
        }


    })

});

//打开页面后，如果缓存中的mapid还没有清除，则重新加载地图信息  51660369108434
function loadMapFile(TaskSetMapId){

    $.ajax({
        url: share + 'irobotweb/sys/map/get?mapid='+TaskSetMapId,
        type: "get",
        cache: false,
        async:false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            var data =json.data;

            //console.log('页面加载的数据');
            //console.log(data);

            if(json.code == 200){
                //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + data.mapfile);
                var img_src='data:image/png;base64,' + data.mapfile;
                var img_width=data.width==null?0:data.width;
                var img_height=data.height==null?0:data.height;
                var img_name=data.mapName;
                var imgph='<img src="'+img_src+'" alt="">';

                $("#smallmapdl dt").html(imgph);
                $("#smallmapdl dt").css('background','rgba(100, 184, 240, 0.12)');

                var zsimghtml = '<span>地图名:'+img_name+'</span>'+
                    '<span>地图宽:'+img_width+'px</span>'+
                    '<span>地图高:'+img_height+'px</span>';
                $("#smallmapdl dd").html(zsimghtml);

            }else{

            }
        }

    });
}





function refresh(activeTab) {
   if ("ones" ==activeTab)
   {
       load();
   }else if("twos"==activeTab){
       reloadtimeingtask();
   }
}


//功能任务加载
function load() {
    $('#exampleTableqw').bootstrapTable('destroy');
    //功能任务加载
    $('#exampleTableqw').bootstrapTable( {
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            cache:false,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type : "GET",
        url: share+'irobotweb/sys/robottask/query/list?taskName='+$.trim($('#taskName').val())+'&taskType='+$.trim($('#taskType').val())+'&mapid='+TaskSetMapId,
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true, // 设置为true会有隔行变色效果
        dataType: "jsonp", // 服务器返回的数据类型-
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
        height: $(window).height()-330,
        queryParams: function (params){
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                //排序列名
                sortOrder: 'asc',
            };
            return temp;
        },
        columns: [
            // {
            //     checkbox: true
            // },
            {
                align: 'center',
                title: '序号',// 列标题
                formatter: function (value, row, index){
                    var pageSize = $('#exampleTableqw').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#exampleTableqw').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            // {
            //     field: 'id',
            //     align: 'center',
            //     title: '任务编号'
            // },
            {
                field: 'taskName',
                align: 'center',
                title: '任务名称'
            },
            {
                field: 'taskType',
                align: 'center',
                title: '任务类型',
                formatter:function (v) {
                   if(v=='wlcm_task'){
                       return '迎宾任务';
                   }else if(v=='ex_task'){
                       return '定点讲解任务';
                   }else if(v=='sending_task'){
                       return '送物任务';
                   }else if(v=='ad_task'){
                       return '广告任务';
                   }
                }
            },
            {
                field: 'createUserName',
                align: 'center',
                title: '创建者'
            },
            {
                field: 'createTime',
                align: 'center',
                title: '创建日期'
            },
            {
                title: '操作',
                field: 'isActive',
                align: 'center',
                formatter: function (isActive, id, index){
                    var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="setting(\''
                        + id.id+','+id.taskType
                        + '\')"><i class="fa fa-edit "></i></a> ';
                     var d = '<a class="btn btn-danger btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                        + id.id
                        + '\')"><i class="fa fa-trash fa-fw"></i></a> ';
                    //console.log(isActive);
                    return e+d;
                }
            }]
    });
}

//查询点击
$('#btnreload').on('click',function(){
    robot_name=$.trim($('#robotName').val());
    load();
});

//查看详情
function showcontent(id) {
    sessionStorage.setItem('showid', id);
    layer.open({
        type: 2,
        title: '详情',
        shadeClose: false,
        area: ['1000px', '750Px'],
        content:'./show.html'  // iframe的url
    });
}

//编辑
function setting(id){
    //console.info('id'); console.info(id);
    //alert(id);
   
    var index=id.indexOf(',');
    var ids_value=id.substring(0,index);
    var taskType=id.substring(index+1,id.length);
    var title='编辑',url='';
    console.log(ids_value,'编辑id')
    sessionStorage.setItem('TaskSetMapId',TaskSetMapId);
    //alert(taskType);
    if(taskType=='wlcm_task'){
        url='./WelcomeGuest.html?editid='+ ids_value;
    }else if(taskType=='ex_task'){
        url='./FixedPointexplanation.html?editid='+ ids_value;
    }else if(taskType=='sending_task'){
        url='./Sending.html?editid='+ ids_value;
    }else if(taskType=='ad_task'){
        url='./ad.html?editid='+ ids_value;
    }
    layer.open({
        type: 2,
        title: title,
        shadeClose: false,
        area: ['1000px', '750Px'],
        content:url
    });
}

//删除数据
function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/sys/robottask/delete?taskid="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0 || r.code == 200) {
                    //layer.msg(r.msg);
                    layer.msg('删除成功');
                    $('#exampleTableqw').bootstrapTable('destroy');
                    load();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//点击不同的任务类型，跳转至对应的任务页面
function taskmenuclick(t) {

    if(TaskSetMapId==null || TaskSetMapId=='' || TaskSetMapId=='null')
    {
        layer.alert('请选择地图!');
        return;
    }

var title='添加',url='./WelcomeGuest.html';

if(t==2){
    url='./FixedPointexplanation.html';
}else if(t==3){
    url='./ad.html';

}else if(t==4){
    url='./Sending.html';
}
    layer.open({
        type: 2,
        title:title,
        shadeClose: false,
        area: ['1000px', '750Px'],
        content:url
    });
}

//定时任务
function timingload() {
    $('#timingtaskTable').bootstrapTable({
                ajaxOptions: {
                    xhrFields: {        //跨域
                        withCredentials: true
                    },
                    crossDomain: true,
                    cache:false,
                    jsonp: "callback",
                    jsonpCallback: "success_jsonpCallback",
                },
                type : "GET",
                url: share+'/irobotweb/sys/cronjob/query/list', //irobotweb/sys/robot/query/list
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
                height: $(window).height()-330,
                queryParams: function (params){
                    //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    var temp = {
                        rows: params.pageSize,     //页面大小 
                        page: params.pageNumber,   //页码
                            //排序列名
                        // sortOrder: 'asc',
                        robotname: $('#timingscheme').val(),                                 //机器人名称搜索框
                        // hardwearNo: $.trim($('#robothardwareno').val()),  //机器人硬件地址
                        // shopName: $.trim($('#shopname').val()),                //所属店铺名称
                        // developerName: $.trim($('#developername').val()),      //所属开发者
                        mapid:TaskSetMapId,
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
                            var pageSize = $('#timingtaskTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#timingtaskTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'cronname',
                        align: 'center',
                        title: '方案名称'
                    },
                    {
                        field: 'robotname',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'mapname',
                        align: 'center',
                        title: '机器人地图'
                    },
                    {
                        field: 'status',
                        align: 'center',
                        title: '运行状态',
                        formatter: function (isActive,row,index) {
                            console.log(row.cronStatus,'运行状态')
                            // 
                            if(row.cronStatus == 1){
                               return '<span class ="label label-primary">运行中</span>'
                            }else if(row.cronStatus == 0){
                                return '<span class ="label label-danger">停止的</span>'
                            }
                        }
                    },
                    {
                        title: '操作',
                        field: 'id',
                        align: 'center',
                        formatter: function (isActive, id, index) {
                            var c = '<a  class="btn btn-danger btn-sm '  + '" href="#" mce_href="#" title="停止" onclick="timingstop(\''
                                + id.id
                                + '\')"><i class="fa fa-stop fa-fw "></i></a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="timingcompile(\''
                                + id.id
                                + '\')"><i class="fa fa-edit "></i></a> ';    
                            var d = '<a class="btn btn-primary btn-sm '  + '" href="#" title="运行"  mce_href="#" onclick="control(\''
                                + id.id
                                + '\')"><i class="fa fa-play fa-fw "></i></a> ';
                            var f = '<a class="btn btn-danger btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="timingdelete(\''
                                + id.id
                                + '\')"><i class="fa fa-trash fa-fw "></i></a> ';
                                console.log(id.cronStatus);
                            if(id.cronStatus == "1"){
                                // 运行中
                                return c ;
                             }else if(id.cronStatus == "0"){
                                 //停止
                                return  d + e + f ;
                             }
                            
                        }
                    }]
            });
}

//查询点击
$('#timingbtnreload').on('click',function(){

    reloadtimeingtask();
});

// 定时添加
$("#timingadd").on('click',function(){
    if(TaskSetMapId==null || TaskSetMapId=='' || TaskSetMapId=='null')
    {
        layer.alert('请选择地图!');
        return;
    }else
    {
        layer.open({
            type: 2,
            title: '添加',
            shadeClose: false,
            area: ['1000px', '750px'],
            content:'./timingadd.html'  // iframe的url
        });

    };


})

// 定时编辑
function timingcompile(id){
    console.log('编辑',id)
    sessionStorage.setItem('timingeditid', id);
    layer.open({
        type: 2,
        title: '编辑',
        shadeClose: false,
        area: ['1000px', '750px'],
        content:'./timingcompile.html'  // iframe的url
    });
}

//定时删除
function timingdelete(id){
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/sys/cronjob/delete?id="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0 || r.code == 200) {
                    //layer.msg(r.msg);
                    layer.msg('删除成功');
                    $('#timingtaskTable').bootstrapTable('destroy');
                    timingload();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//定时停止
function timingstop(id){
   // /irobotweb/sys/cronjob/stopjob
   $.ajax({
    url : share+"/irobotweb/sys/cronjob/stopjob?id="+id,
    type: "POST",
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    // data : JSON.stringify(dsid),
    success : function(r){
        console.log(r)
        if (r.code == 0 || r.code == 200) {
            //layer.msg(r.msg);
            layer.msg('停止运行');
            $('#timingtaskTable').bootstrapTable('destroy');
            timingload();
        } else {
            layer.msg(r.msg);
        }

    },
    error : function(request){  
    //parent.layer.alert("Connection error");  
    }
});
}

//定时运行
function control(id){
    $.ajax({
     url : share+"/irobotweb/sys/cronjob/startjob?id="+id,
     type: "POST",
     crossDomain: true,
     xhrFields: {
         withCredentials: true
     },
     dataType: "json",
     contentType: "application/json; charset=utf-8",
    //  data : JSON.stringify(yxid),
     success : function(r){
        if (r.code == 0 || r.code == 200) {
            //layer.msg(r.msg);
            layer.msg('启动运行');
            $('#timingtaskTable').bootstrapTable('destroy');
            timingload();
        } else {
            layer.msg(r.msg);
        }
     },
     error : function(request) {  
     //parent.layer.alert("Connection error");  
     }
 });
}

//地图列表
function success_jsonpCallback(data){
    //console.log(data,'地图列表')
    var datajsonimg = data.rows;
    var imghtml='';
    //  document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + data.mapfile);
    for(var i=0;i<datajsonimg.length;i++){
        imghtml +='<dl class="smallmapshow">'+
                        '<dt class="dtimg" widthd="'+datajsonimg[i].width+'" heightd="'+datajsonimg[i].height+'">'+
                            '<img src="data:image/png;base64,'+datajsonimg[i].mapfile+'"  ondragstart="return false;"   alt="">'+
                        '</dt>'+
                        '<dd>'+
                            '<span sdival="'+datajsonimg[i].mapId+'">'+datajsonimg[i].mapName+'</span>'+
                        '</dd>'+
                    '</dl>'
    }
    $(".imgbx").html(imghtml)

}

// 点击缩略图框框  imgbx
// 点击页面元素
$(document).on('click',function(e){

	var  smallmapshow= $(e.target).parent().parent().attr("class");

	 if('smallmapshow' == smallmapshow  ){
        $(e.target).parent().parent('.smallmapshow').siblings().removeClass('selectmapbg');
        $(e.target).parent().parent('.smallmapshow').toggleClass('selectmapbg');
        //console.log($(".selectmapbg"),'是不是选中的图片')
    }
})


//点击选择地图按钮  显示遮罩层
$("#select-btn-m").on('click',function(){
    $(".imgbx").html('')//没有数据的时候情
    $.ajax({
        url: share+"/irobotweb/sys/map/query/list",
        type: "GET",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback", 
        dataType: "jsonp", 
        success: function (data) {
            //console.log(data,'datadatadatadatadata')
        }
    });
    $(".outer-box").show()
})
//themap
$(".themap").on('click',function(){
    $(".imgbx").html('')//没有数据的时候情
    $.ajax({
        url: share+"/irobotweb/sys/map/query/list",
        type: "GET",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        jsonp: "callback",
        jsonpCallback: "success_jsonpCallback", 
        dataType: "jsonp", 
        success: function (data) {
            //console.log(data,'datadatadatadatadata')
        }
    });
    $(".outer-box").show()
})
// 弹层取消按钮
$(".cancelbtn").on('click',function(){
    $(".outer-box").hide()
});

// 选中图片点击确定.confirmbtn
$(".confirmbtn").on('click',function(){

    if($('.selectmapbg').length == 0){
        layer.msg("请选择地图");
        return;
    }
    $("#select-map").hide()
    $("#content-show").show()
    mapid = $(".selectmapbg span").attr('sdival');

    TaskSetMapId= mapid;
    var imgph='<img src="'+$(".selectmapbg img").attr('src')+'" alt="">';
    $("#smallmap").html(imgph);
    $(".mapname").html("当前地图:"+$(".selectmapbg span").text())
    $(".outer-box").hide();
    $(".ibox").show();
    var cc = $('#myTab').find("li.active a").attr("id")
    refresh(cc);
})
// 查看当前地图
//mapimgsmall
$(".mapname").on('click',function(){
    $("#mapimgsmall").show()
})
//
$("#mapimgsmall").on('click',function(){
    $("#mapimgsmall").hide()
})

function  reloadtimeingtask() {

    if(TaskSetMapId!=null && TaskSetMapId!='' && TaskSetMapId!='null'){

        $('#timingtaskTable').bootstrapTable('destroy');
        timingload();


    }
    else{

        $("#content-show").hide()
    }

}



function getSelectedTabIndex()
{
    var retIndex = $("#myTab").tabs('option', 'active');
    return retIndex;
}