var prefix = "irobotweb/sys/taskscheduler";

load();

function load() {
    $('#exampleTable').bootstrapTable( {
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",
        },
        type : "POST",
        url: share+'/irobotweb/sys/taskscheduler/query/list',
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
                pagesize: params.pageSize,     //页面大小
                pagenum: params.pageNumber,   //页码
                id: '1',
                sortOrder: 'asc',
                shopName:$.trim($('#shopName').val())

            };
            return temp;
        },

        columns: [
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
                field: 'jobName',
                align: 'center',
                title: '作业名称'
            },
            {
                field: 'taskSerialName',
                align: 'center',
                title: '任务序列名称'
            },
            {
                field: 'robothardwareno',
                align: 'center',
                title: '执行机器人硬件号'
            },
            {
                field: 'robotname',
                align: 'center',
                title: '机器人名称'
            },
            {
                field: 'jobCron',
                align: 'center',
                title: '定时设置'
            },
            {
                field: 'remark',
                align: 'center',
                title: '备注'
            },
            {
                field: 'jobStatus',
                align: 'center',
                title: '运行状态',
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == '0') {
                        return '<span class="label label-primary">运行中</span>';
                    } else if (value == '1') {
                        return '<span class="label label-danger">停止</span>';
                    }
                }
            },

            {
                title: '操作',
                field: 'id',
                align: 'center',
                formatter: function (value, row, index) {

                    var b;
                    if (row.jobStatus == '0') {

                    b= '<a  id="stop_' + row.id  +'" class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="停止" onclick="stop(\''
                        + row.id
                        + '\')"><i class="fa fa-stop" style="color: red"></i></a> ';
                     }
                    if (row.jobStatus == '1') {

                        b= '<a  id="run_' + row.id  +'" class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="启动" onclick="run(\''
                            + row.id
                            + '\')"><i class="fa fa-play "></i></a> ';
                    }

                    var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详细" onclick="show(\''
                        + row.id
                        + '\')"><i class="fa fa-search "></i></a> ';
                    var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="edit(\''
                        + row.id
                        + '\')"><i class="fa fa-edit "></i></a> ';
                    var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                        + row.id
                        + '\')"><i class="fa fa-remove"></i></a> ';
                    return  b+c + e + d ;
                }
            }]
    });
}

//查询点击
$('#btnreload').on('click',function(){
    $('#exampleTable').bootstrapTable('destroy');
    load();
})

//删除
function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/sys/taskscheduler/delete?jobid="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 0) {
                    layer.msg(r.msg);
                    window.location.reload();
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

//执行作业
function run(id) {

        $.ajax({
            url: share+"/irobotweb/sys/taskscheduler/edit/jobstatus/",
            type: "POST",
            crossDomain: true,
            data:{
                "jobid":id,
                "jobstatus":0
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 200) {

                   layer.msg("运行成功",{
                          time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    });
          
              var b= '<a  id="stop_' + id  +'" class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="停止" onclick="stop(\''
                       + id
                       + '\')"><i class="fa fa-stop" style="color: red"></i></a> ';

              var a =document.getElementById("run_"+id);
                 a.outerHTML=b;

                } else {
                    layer.msg(r.msg);
                }
            }
        });

}
//停止作业
function stop(id) {
    
$.ajax({
            url: share+"/irobotweb/sys/taskscheduler/edit/jobstatus/",
            type: "POST",
            data:{
                "jobid":id,
                "jobstatus":1
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                if (r.code == 200) {

                    layer.msg("停止成功",{
                          time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    });

                    var  b= '<a  id="run_' + id  +'" class="btn btn-primary btn-sm ' + '" href="#" mce_href="#" title="启动" onclick="run(\''
                        + id
                        + '\')"><i class="fa fa-play "></i></a> ';
                    var a =document.getElementById("stop_"+id);
                    a.outerHTML=b;

                } else {
                    layer.msg(r.msg);
                }
            }
        });
}

//添加
$('#btnadd').on('click',function(){
    // iframe层
    layer.open({
        type: 2,
        title: '任务添加',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '520px'],
        content: './add.html'
    });
});

//查看详情
function show(id) {
    sessionStorage.setItem('taskschedluerid', id);
    layer.open({
        type: 2,
        title: '查看详情',
        maxmin: true,
        shadeClose: false,
        area: ['1000px', '666px'],
        content:'./show.html'  // iframe的url
    });
}

function edit(id){
    sessionStorage.setItem('taskschedluerid', id);
    layer.open({
        type: 2,
        title: '用户修改',
        maxmin: true,
        shadeClose: false,
        area: ['1000px', '520px'],
        content:'./edit.html'  // iframe的url
    });
}

////////////////////////////////////////////////////////////////////////
//滚动条  显示
//progress   100
//progressbg   大盒子
//文字提示 textmin  textmax

//更多显示
$('#btnmore').on('click',function(){

    var top = document.getElementById("userinfo").style.marginTop;
    document.getElementById("userinfo").style.marginTop=0;

    if (top == "0px"){
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
});

$('#btnsum').on('click',function(){
    $('#exampleTable').bootstrapTable('destroy');
    load();
});




