var showid = sessionStorage.getItem("showid")
console.log(showid)
var taskprogress = [];
var exampleTab = [];
$.ajax({
    url: share+'/irobotweb/sys/task/query/ids?taskid='+showid,
    crossDomain: true,
    type: "get",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    success: function (data) {
        var showdata = data.data;
        console.log(showdata)
        $("#robotName").val(showdata.robotname)
        $("#taskName").val(showdata.taskname)
        //$('#taskprogress').bootstrapTable('load', showdata)
        var obj={
            processName:showdata.processName,
            processTime:showdata.processTime,
        }
        taskprogress.push(obj);
        $('#taskprogress').bootstrapTable('load',taskprogress)
        showdata.taskRunParamsDOList.forEach(element => {
            var obj2 = {
                taskPararmsName:element.taskPararmsName,
                value:element.value
            }
            exampleTab.push(obj2)
        });
        $('#exampleTable').bootstrapTable('load',exampleTab)
    },
    error: function (request){
        layer.alert("Connection error");
    },
});




    $('#exampleTable').bootstrapTable( {
                // ajaxOptions: {
                //     xhrFields: {        //跨域
                //         withCredentials: true
                //     },
                //     crossDomain: true,
                //     jsonp: "callback",
                //     jsonpCallback: "success_jsonpCallback",
                // },
                //type : "GET",
                //url: share+'', //
                // iconSize: 'outline',
                // toolbar: '#exampleToolbar',
                // striped: true, // 设置为true会有隔行变色效果
                // dataType: "jsonp", // 服务器返回的数据类型
                // pagination:  "false", // 设置为true会在底部显示分页条
                // singleSelect: false, // 设置为true将禁止多选
                // pageSize: 10, // 如果设置了分页，每页数据条数
                // pageNumber: 1, // 如果设置了分布，首页页码
                // pageList: [10, 25, 50, 100],
                // queryParamsType: '',
                // sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
                // paginationLoop: false,
                // paginationPreText:"上一页",
                // paginationNextText:"下一页",
                // paginationShowPageGo: true,     //显示跳转
                // showJumpto: true,
                // height: $(window).height()-127,
                // queryParams: function (params) {
                //     //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                //     var temp = {
                //         rows: params.pageSize,     //页面大小
                //         page: params.pageNumber,   //页码
                //             //排序列名
                //         sortOrder: 'asc',
                //          filename: $.trim($('#genid').val()),//id搜索框
                //     };
                //     return temp;
                // },
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
                        field: 'taskPararmsName',
                        align: 'center',
                        title: '参数名称'
                    },
                    {
                        field: 'value',
                        align: 'center',
                        title: '参数值'
                    },
                ]
            });



    $('#taskprogress').bootstrapTable( {
                // ajaxOptions: {
                //     xhrFields: {        //跨域
                //         withCredentials: true
                //     },
                //     crossDomain: true,
                //     jsonp: "callback",
                //     jsonpCallback: "success_jsonpCallback",
                // },
                // type : "GET",
                // url: share+'', //
                // iconSize: 'outline',
                // toolbar: '#exampleToolbar',
                // striped: true, // 设置为true会有隔行变色效果
                // dataType: "jsonp", // 服务器返回的数据类型
                // pagination:  "false", // 设置为true会在底部显示分页条
                // singleSelect: false, // 设置为true将禁止多选
                // pageSize: 10, // 如果设置了分页，每页数据条数
                // pageNumber: 1, // 如果设置了分布，首页页码
                // pageList: [10, 25, 50, 100],
                // queryParamsType: '',
                // sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
                // paginationLoop: false,
                // paginationPreText:"上一页",
                // paginationNextText:"下一页",
                // paginationShowPageGo: true,     //显示跳转
                // showJumpto: true,
                // height: $(window).height()-127,
                // queryParams: function (params) {
                //     //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                //     var temp = {
                //         rows: params.pageSize,     //页面大小
                //         page: params.pageNumber,   //页码
                //             //排序列名
                //         sortOrder: 'asc',
                //          filename: $.trim($('#genid').val()),//id搜索框
                //     };
                //     return temp;
                // },
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
                            var pageSize = $('#taskprogress').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#taskprogress').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'processName',
                        align: 'center',
                        title: '任务节点'
                    },
                    {
                        field: 'processTime',
                        align: 'center',
                        title: '任务执行时间'
                    },
                ]
            });

// createTime
// :
// "2019-01-10 19:50:06"
// createUserId
// :
// null
// createUserName
// :
// null
// developerid
// :
// null
// developername
// :
// null
// genid
// :
// null
// id
// :
// 34
// process
// :
// "TEND"
// processName
// :
// "完成"
// processTime
// :
// "2019-01-10 19:50:08"
// remark
// :
// null
// remark0
// :
// null
// remark1
// :
// null
// remark2
// :
// null
// remark3
// :
// null
// remark4
// :
// null
// robotId
// :
// null
// robothardwareno
// :
// "BE:9F:6E:91:42:1A"
// robotname
// :
// null
// shopid
// :
// null
// shopname
// :
// null
// status
// :
// "2"
// taskModelId
// :
// null
// taskRunParamsDOList
// :
// Array(1)
// 0
// :
// Object
// createTime
// :
// "2019-01-10 19:50:06"
// createUserId
// :
// null
// createUserName
// :
// null
// id
// :
// 46
// pararmsType
// :
// null
// remark
// :
// null
// remark0
// :
// null
// remark1
// :
// null
// remark2
// :
// null
// remark3
// :
// null
// remark4
// :
// null
// status
// :
// null
// taskId
// :
// "34"
// taskPararms
// :
// "speak"
// taskPararmsName
// :
// "说话内容"
// updateTime
// :
// null
// updateUserId
// :
// null
// updateUserName
// :
// null
// value
// :
// "谢谢"
// __proto__
// :
// Object
// length
// :
// 1
// __proto__
// :
// Array(0)
// taskSerialId
// :
// null
// taskType
// :
// "speak"
// taskTypeName
// :
// "说话任务"
// taskname
// :
// "说话任务"
// timeout
// :
// null
// updateTime
// :
// "2019-01-10 19:50:08"
// updateUserId
// :
// null
// updateUserName
// :
// null