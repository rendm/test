

var task_set_resource_type='';
var task_set_resourceinfo='';
var overAllIds = new Array();  //全局数组
var overAllrows = new Array();  //全局行数
var overAllrows_video = new Array();  //全局行数-视频
var task_set_resource_type=0;


$(function () {

    //$("#shaderesource").show();
     //alert(333);
    load();

    //展示-选中
    $('#resourcebtndel').on('click', function (){

        var rows = $('#resourceTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组



        // if (rows.length == 0){
        //     layer.msg("请选择要展示的数据!");
        //     return;
        // }else if(rows.length > 6){
        //     layer.msg("最多只能选择六条数据!");
        //     return;
        // }

        var tips_text='';
        if(task_set_resource_type==0){ //资源类型-图片
            if (overAllrows.length == 0) {
                layer.msg("请选择要展示的数据");
                return;
            }else{
                tips_text="确认要展示选中的" + overAllrows.length + "条数据吗?";
            }
        }else{

            if (overAllrows_video.length == 0) {
                layer.msg("请选择要展示的数据");
                return;
            }else{
                tips_text="确认要展示选中的数据吗?";
            }
        }

        layer.confirm(tips_text, {
            btn: ['确定', '取消']
            // 按钮
        }, function () {
            var ids = new Array();
            var filename = new Array();

            if(task_set_resource_type==0){
                // 遍历所有选择的行数据，取每条数据对应的ID
                $.each(overAllrows, function (i, row) {
                    ids[i] = row['id'];
                    filename[i] = row['filename'];
                });
            }else{
                // 遍历所有选择的行数据，取每条数据对应的ID
                $.each(overAllrows_video, function (i, row) {
                    ids[i] = row['id'];
                    filename[i] = row['filename'];
                });
            }

            for(var i = 0;i<filename.length;i++){
                task_set_resourceinfo +='<span class="filenamespan" filenameid = "'+ids[i]+'">'+
                    filename[i]+
                    '<small class="fork">×</small>'+
                    '</span>';
            }

            //console.info('filenamehtmlm'); console.info(task_set_resourceinfo);
            sessionStorage.setItem('task_set_resourceinfo', task_set_resourceinfo);
            closeCurrentLayer();
        }, function(){

        });
    });

    //资源选择点击取消
    $("#resourcedanger").on('click',function(){
        closeCurrentLayer();
    });

    $('#resourceTable').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table',function(e,rows){

        var datas = $.isArray(rows) ? rows : [rows];        // 点击时获取选中的行或取消选中的行
        if(task_set_resource_type==0){
            examine2(e.type,datas);                              // 选择的图片保存到全局 Array() 里
        }else{
            examineVideo(e.type,datas);                              // 选择的视频保存到全局 Array() 里
        }
    });
});

function examineVideo(type,datas){
    if(type.indexOf('uncheck')==-1){

        // alert(111);
        // alert(overAllrows.length);
        $.each(datas,function(i,v){
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            overAllrows_video.length=0;//先清空
            overAllrows_video.push(v);
        });
    }
}

function examine2(type,datas){

    if(type.indexOf('uncheck')==-1){

        // alert(111);
        // alert(overAllrows.length);
        $.each(datas,function(i,v){
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            if (overAllrows.length>0)
            {   var flag =true ;
                $.each(overAllrows,function(index,value){
                    if(v.id == value.id)
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

        //alert('移除');
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

    //console.log("111",overAllrows);
}

//加载数据
function load() {
    $("#shaderesource").show();
    $('#resourceTable').bootstrapTable('destroy');
    task_set_resource_type=sessionStorage.getItem('task_set_resource_type');//选中的资源类型
    //alert(task_set_resource_type);

    if(task_set_resource_type==0){
        $('#resourceTable').bootstrapTable({
            ajaxOptions: {
                xhrFields: {        //跨域
                    withCredentials: true
                },
                crossDomain: true,
                jsonp: "callback",
                jsonpCallback: "success_jsonpCallback",
            },
            type: "GET",
            url: share + '/irobotweb/sys/resource/query/list',
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
                    //filename: task_resource_filename,     //资源名称
                    type: task_set_resource_type,         //资源类型
                    //userType: resource_userType         //资源用途
                };
                return temp;
            },
            columns: [
                {
                    checkbox: true,
                    formatter: function (i,row) {
                        var flag=false;

                        $.each(overAllrows,function(index,value){
                            if(row.id == value.id)
                            {
                                flag=true;
                            }
                        });

                        if (flag) {
                            return {
                                checked : true
                            }
                        }
                    }
                },
                {
                    field: 'filename',
                    align: 'center',
                    title: '文件名称'
                },
                {
                    field: 'row',
                    align: 'center',
                    title: '资源展示',
                    formatter: function (value, row, index) {
                        // 0表示图片，1表示音频，2表示视频，3表示其他

                        if(row.type == "0"){
                            return '<img src="'+row.ossurl+'" alt="" style="width:50px;height=auto;">'
                        }else if(row.type == "2"){

                        }
                    }
                },
            ]
        });
    }else{
        $('#resourceTable').bootstrapTable({
            ajaxOptions: {
                xhrFields: {        //跨域
                    withCredentials: true
                },
                crossDomain: true,
                jsonp: "callback",
                jsonpCallback: "success_jsonpCallback",
            },
            type: "GET",
            url: share + '/irobotweb/sys/resource/query/list',
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
                    //filename: task_resource_filename,     //资源名称
                    type: task_set_resource_type,         //资源类型
                    //userType: resource_userType         //资源用途
                };
                return temp;
            },
            columns: [
                {
                    // checkbox: true,
                    radio:true,

                    formatter: function (i,row) {
                        var flag=false;

                        $.each(overAllrows,function(index,value){
                            if(row.id == value.id)
                            {
                                flag=true;
                            }
                        });

                        if (flag) {
                            return {
                                checked : true
                            }
                        }
                    }
                },
                {
                    field: 'filename',
                    align: 'center',
                    title: '文件名称'
                },
                {
                    field: 'row',
                    align: 'center',
                    title: '资源展示',
                    formatter: function (value, row, index) {
                        // 0表示图片，1表示音频，2表示视频，3表示其他

                        if(row.type == "0"){
                            return '<img src="'+row.ossurl+'" alt="" style="width:50px;height=auto;">'
                        }else if(row.type == "2"){

                        }
                    }
                },
            ]
        });
    }
}

//关闭当前的弹窗
function closeCurrentLayer() {
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
}



