
load();

var task_type_name='';  //任务类型名称

function load() {

   //alert(task_type_name);

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
                url: share+'/irobotweb/sys/tasktype/query/list', //
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
                        rows: params.pageSize, //页面大小
                        page: params.pageNumber,   //页码
                            //排序列名
                        sortOrder: 'asc',
                        taskTypeName: task_type_name,// 任务类型名称
                        taskType:$.trim($('#tasktypecode').val())

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
                        field: 'taskTypeName',
                        align: 'center',
                        title: '任务类型'
                    },
                    {
                        field: 'taskType',
                        align: 'center',
                        title: '任务类型代码'
                    },
                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    {
                        title: '操作',
                        field: 'taskTypeId',
                        align: 'center',
                        formatter: function (taskTypeId) {
                            console.log(taskTypeId)
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详细" onclick="show(\''
                                + taskTypeId
                                + '\')"><i class="fa fa-search "></i></a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="setting(\''
                                + taskTypeId
                                + '\')"><i class="fa fa-edit "></i></a> ';    
                            var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="control(\''
                                + taskTypeId
                                + '\')"><i class="fa fa-remove "></i></a> ';
                                 //未激活
                                return  c + e + d ;
                        }
                    }]
            });
}

//查询点击
$('#btnreload').on('click',function(){
    task_type_name=$.trim($('#genid').val());
    $('#exampleTable').bootstrapTable('destroy');
    load();
});

//增加
$('#add').on('click',function(){
    layer.open({
        type: 2,
        title: '增加',
        maxmin: true,
        shadeClose: false,
        area: ['1200px', '600px'],
        content:'./add.html'  // iframe的url
    });
});

//详情查看
function show(id) {
    sessionStorage.setItem("manageshowid",id)
    layer.open({
        type: 2,
        title: '详情',
        maxmin: true,
        shadeClose: false,
        area: ['1200px', '600px'],
        content:'./show.html'  // iframe的url
    });
}

//编辑修改
function setting(id) {
    sessionStorage.setItem("manageeditid",id)
    layer.open({
        type: 2,
        title: '修改',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['1200px', '600px'],
        content: './edit.html' 
    });
}
//删除
function control(id){
    //console.log('删除键啦');
    //sessionStorage.setItem("manageremoveid",id)
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function (){
        $.ajax({
            url: share+"/irobotweb/sys/tasktype/delete?tasktypeid="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                console.log(r)
                if (r.code == 200) {
                    layer.msg(r.msg);
                    window.location.reload()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

 //更多显示  上面框框显示
 $('#btnmore').on('click',function(){
     //console.log("更多显示");
     var top = document.getElementById("userinfo").style.marginTop;
     document.getElementById("userinfo").style.marginTop=0;                                                                                                                                                                                                                                                                                                                                            
    console.log(top,'top')
    if (top == "0px"){
        //console.log(123213);
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 })

 //提交
$('#btnsum').on('click', function () {

    task_type_name=$.trim($('#tasktypename_more').val());
    $('#exampleTable').bootstrapTable('destroy');
    load();
});

//重置 清空查询框里的条件数据
$('#btnreset').click(function () {
    var input_arr = $('.layui-input');
    $.each(input_arr, function () {
        $(this).val('');
    });
});

 //激活页面
// /** 主键  task_type_id **/
// private String taskTypeId;

// /** 任务类型名称  task_type_name **/
// private String taskTypeName;

// /** 任务类型  task_type **/
// private String taskType;

// /** 默认值  default_value **/
// private String defaultValue;

// /** 创建时间  create_time **/
// private String createTime;

// /** 创建人ID  create_user_id **/
// private String createUserId;

// /** 创建人姓名  create_user_name **/
// private String createUserName;

// /** 修改时间  update_time **/
// private String updateTime;

// /** 修改人ID  update_user_id **/
// private String updateUserId;

// /** 修改人姓名  update_user_name **/
// private String updateUserName;

// /** 状态  status **/
// private String status;

// /** 备注  remark **/
// private String remark;