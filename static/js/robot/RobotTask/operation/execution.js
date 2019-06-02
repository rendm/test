var exid = sessionStorage.getItem("exid");
console.log(exid,'立即执行id  序列id序列查找  列表机器人列表')
$.ajax({
    url: share+'/irobotweb/sys/taskserial/query/ids?taskserialid='+exid,
    crossDomain: true,
    type: "get",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    success: function (data) {
        var showdata = data.data;
        console.log(showdata)
        //
        $("#taskSerialName").val(showdata.taskSerialName)   
    },
    error: function (request) {
        layer.alert("Connection error");
    },
});

load()
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
                url: share+'/irobotweb/sys/robot/query/list', //
                iconSize: 'outline',
                toolbar: '#exampleToolbar',
                striped: true, // 设置为true会有隔行变色效果
                dataType: "jsonp", // 服务器返回的数据类型
                pagination:  "false", // 设置为true会在底部显示分页条
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
                        robotName: $.trim($('#robotName').val()),//id搜索框
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
                        checkbox: true
                    },
                    {
                        align: 'center',
                        title: '序号',// 列标题
                        formatter: function (value, row, index){
                            var pageSize = $('#exampleTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                            var pageNumber = $('#exampleTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                        }
                    },
                    {
                        field: 'robotName',
                        align: 'center',
                        title: '机器人名称'
                    },
                    {
                        field: 'hardwearNo',
                        align: 'center',
                        title: '机器人硬件地址'
                    },
                ]
            });
}
$("#btnreload").on('click',function(e){
    $('#exampleTable').bootstrapTable('destroy');
    load()
    e.preventDefault()
})

function binding(){
    var number = $("#operationshow").val();
	var rows = $('#exampleTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
	if (rows.length == 0) {
		layer.msg("请选择要执行的任务序列");
		return;
	}
	layer.confirm("确认要执行选中的'" + rows.length + "'条任务序列吗?", {
		btn : [ '确定', '取消' ]
	// 按钮
	}, function(){
		var ids = new Array();
		// 遍历所有选择的行数据，取每条数据对应的ID
		$.each(rows, function(i, row) {
			ids[i] = row['hardwearNo'];
        });
        console.log(rows,ids)
        var datastr = {
            "hardwarenolists":ids,
            "tasksertialid":exid
        }
        console.log(JSON.stringify(datastr))
        // if(number ==1){
        //     console.log('number1')
        //     // /irobotweb/task/control/runtask
        //     $.ajax({
        //         type: "POST",
        //         url: share + "/irobotweb/task/control/runtask",
        //         data:JSON.stringify(datastr),// 你的formid//所有input框 里面的值
        //         crossDomain: true,
        //         //dataType:"json",
        //         contentType:"application/json; charset=utf-8",  
        //         xhrFields: {
        //             withCredentials: true
        //         },
        //         error: function (request){
        //             parent.layer.alert("Connection error");
        //         },
        //         success: function (data) {
        //             console.log(data, 'ajax的请求保存返回')
        //             // if(data.code==200){
        //             //     parent.location.reload(); 
        //             // }else{
                        
        //             // }
        //         }
        //     });
        // }else if(number == 2){
        //     console.log('number2')
        //     //  /irobotweb/task/control/breaktask
        //     $.ajax({
        //         type: "POST",
        //         url: share + "/irobotweb/task/control/breaktask",
        //         data:JSON.stringify(datastr),// 你的formid//所有input框 里面的值
        //         crossDomain: true,
        //         //dataType:"json",
        //         contentType:"application/json; charset=utf-8",  
        //         xhrFields: {
        //             withCredentials: true
        //         },
        //         error: function (request){
        //             parent.layer.alert("Connection error");
        //         },
        //         success: function (data) {
        //             console.log(data, 'ajax的请求保存返回')
        //             // if(data.code==200){
        //             //     parent.location.reload(); 
        //             // }else{
                        
        //             // }
        //         }
        //     });
        // }else if(number == 3){
            console.log('number3')
            //  /irobotweb/task/control/inserttask
            $.ajax({
                type: "POST",
                url: share + "/irobotweb/task/control/inserttask",
                data:JSON.stringify(datastr),// 你的formid//所有input框 里面的值
                crossDomain: true,
                dataType:"json",
                contentType:"application/json; charset=utf-8",  
                xhrFields: {
                    withCredentials: true
                },
                error: function (request){
                    parent.layer.alert("Connection error");
                },
                success: function (data) {
                    console.log(data, 'ajax的请求保存返回')
                    if(data.code==200){
                        parent.location.reload(); 
                    }else{
                        
                    }
                }
            });
        //}
		// $.ajax({
		// 	type : 'POST',
		// 	data : {
		// 		"ids" : ids
		// 	},
		// 	url : prefix + '/batchRemove',
		// 	success : function(r) {
		// 		if (r.code == 0) {
		// 			layer.msg(r.msg);
		// 			reLoad();
		// 		} else {
		// 			layer.msg(r.msg);
		// 		}
		// 	}
		// });
	}, function() {});
}
$("#danger").on('click',function(){
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
})