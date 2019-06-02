$().ready(function() {
	resourceLoad()
});
// /irobotweb/sys/resource/query/list/type?type=0 //资源列表
var filenamehtmlm = '';
var resource_type = 0;
//点击选择资源
$("#seekResource").on('click',function(e){
	filenamehtmlm = '';
	$("#BigSc").html(" ");
	resource_type = $('input[name="typews"]:checked').val();
	console.log('查找资源'+resource_type)
	$("#shaderesource").show();
	$('#resourceTable').bootstrapTable('destroy');
    resourceLoad();
    e.preventDefault();
})

function resourceLoad() {
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
        url: share + '/irobotweb/sys/resource/query/list', //
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
        height: $(window).height() - 327,
        queryParams: function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                type: resource_type,         //资源类型
            };
            return temp;
        },
        columns: [
            {
                checkbox: true
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
                    console.log(row.type)
                    if(row.type == "0"){
                        return '<img src="'+row.ossurl+'" alt="" style="width:50px;height=auto;">'
                    }else if(row.type == "2"){

                    }
                }
            },
        ]
    });
}

//点击展示
$('#resourcebtndel').on('click', function (){ 
    console.log($('#resourceTable').bootstrapTable('getSelections'))
    var rows = $('#resourceTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
    if (rows.length == 0){
        layer.msg("请选择要展示的数据");
        return;
    }else if(rows.length > 6){
        layer.msg("只能选择六条数据奥");
        return;
    }
    layer.confirm("确认要展示选中的'" + rows.length + "'条数据吗?", {
        btn: ['确定', '取消']
        // 按钮
    }, function () {
		var ids = new Array();
		var filename = new Array();
        // 遍历所有选择的行数据，取每条数据对应的ID
        $.each(rows, function (i, row) {
			ids[i] = row['id'];
			filename[i] = row['filename'];
		});
		for(var i = 0;i<filename.length;i++){
			filenamehtmlm +='<span class="filenamespan" filenameid = "'+ids[i]+'">'+
			filename[i]+
			'<small class="fork">×</small>'+
		'</span>';
		}
		$("#BigSc").html(filenamehtmlm);
		layer.close(layer.index);	
		$("#shaderesource").hide();
    }, function(){
		
    });
})
//资源选择点击取消
$("#resourcedanger").on('click',function(){
	$("#shaderesource").hide();
})
//点击小叉叉  、、.filenamespan small
$(document).on('click',function(e){
	console.log($(e.target).attr("class") )
	if($(e.target).attr("class") == 'fork'){
		$(e.target).parent().remove()
	}
})
