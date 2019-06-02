var serial_name='';
load()
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
                            //排序列名
                        sortOrder: 'asc',
                        taskSerialName:serial_name,//任务序列名
                        developername:$.trim($('#developername').val()),//所属开发者
                        shopname:$.trim($('#shopname').val()),//所属店铺
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
                        field: 'shopname',
                        align: 'center',
                        title: '所属店铺'
                    },
                    {
                        field: 'developername',
                        align: 'center',
                        title: '所属开发者'
                    },
                    {
                        field: 'remark',
                        align: 'center',
                        title: '备注'
                    },
                    // {
                    //     field: 'status',
                    //     align: 'center',
                    //     title: '否可用',
                    //     formatter: function (status) {
                    //         // 0表示图片，1表示音频，2表示视频，3表示其他
                    //         console.log(status,'看状态的呀')
                    //         if(status == "0"){
                    //            // return '<img src="" alt="">'
                    //            return '<span class ="border-green">正常</span>'
                    //         }else if(status == "1"){
                    //             return '<span class ="border-red">不可用</span>'
                    //         }
                    //     }
                    // },
                    {
                        title: '操作',
                        field: 'taskSerialId',
                        align: 'center',
                        formatter: function (taskSerialId) {
                            console.log(taskSerialId)
                            var c = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="详细" onclick="show(\''
                                + taskSerialId
                                + '\')"><i class="fa fa-search "></i></a> ';
                            var e = '<a  class="btn btn-primary btn-sm '  + '" href="#" mce_href="#" title="编辑" onclick="setting(\''
                                + taskSerialId
                                + '\')"><i class="fa fa-edit "></i></a> ';    
                            var d = '<a class="btn btn-warning btn-sm '  + '" href="#" title="删除"  mce_href="#" onclick="remove(\''
                                + taskSerialId
                                + '\')"><i class="fa fa-remove "></i></a> ';
                                 //未激活
                                return  c + e + d ;
                        }
                    }]
            });
}
$('#add').on('click',function(){
    layer.open({
        type: 2,
        title: '增加',
        maxmin: true,
        shadeClose: false,
        area: ['1100px', '600px'],
        content:'./add.html'  // iframe的url
    });
})
//详情查看
function show(id) {
    sessionStorage.setItem('showid',id);
    console.log(id,'查询id')
    layer.open({
        type: 2,
        title: '详情',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '500px'],
        content:'./show.html'  // iframe的url
    });
}
//编辑修改
function setting(id) {
    sessionStorage.setItem('editid',id);
    console.log(id,'编辑修改id')
    layer.open({
        type: 2,
        title: '任务序列编辑',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['1200px', '800px'],
        content: './edit.html' 
    });
}

 //更多显示  上面框框显示
 $('#btnmore').on('click',function(){
     var top = document.getElementById("userinfo").style.marginTop;
     document.getElementById("userinfo").style.marginTop=0;                                                                                                                                                                                                                                                                                                                                            
    console.log(top,'top')
    if (top == "0px"){
        document.getElementById("userinfo").style.marginTop=-200+'px';
    }
 })
//删除键
 function remove(id) {
    layer.confirm('确定要删除选中的记录？', {
        btn: ['确定', '取消']
    }, function () {
        $.ajax({
            url: share+"/irobotweb/sys/taskserial/delete?taskserialid="+id,
            type: "DELETE",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                console.log(r)
                if (r.code == 200){
                    layer.msg('删除成功');
                    $('#exampleTable').bootstrapTable('destroy');
                    load()
                } else {
                    layer.msg(r.msg);
                }
            }
        });
    })
}

// 1	点位任务	POINT_TASK   
// 2	亮灯任务	ShlingsTask   
// 3	说话任务	SpeakTask   
// 4	视频任务	VideoTask   
// 5	表情任务	EMOJI_TASK
// 6	图片任务	PICTURE_TASK
// 7	送货任务	SONGHUO_TASK
// 8	驻留任务	STAY_TASK
//查询提交
$("#btnsum").on('click',function(){
    serial_name=$.trim($('#taskSerialName').val())
    $('#exampleTable').bootstrapTable('destroy');
    load()
})
//重置
$("#btnreset").on('click',function(){
     $('#taskSerialName').val('') //任务序列名
     $('#developername').val('') //所属开发者
     $('#shopname').val('') //所属店铺
})
//查询
$("#btnreload").on('click',function(){
    serial_name=$.trim($('#genid').val())
    $('#exampleTable').bootstrapTable('destroy');
    load()
    $('#genid').val('')
})
//http://bootstrap-table.wenzhixin.net.cn/zh-cn/document

