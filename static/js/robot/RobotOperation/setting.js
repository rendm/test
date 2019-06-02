$().ready(function() {

    restore();
    validateRule();
});
// /irobotweb/sys/resource/query/list/type?type=0 //资源列表
var robotid = sessionStorage.getItem('settingid');
var monitorModevalue = 0;  //是否监控
var filenamehtmlm = '';  //展示名
var macAddress;

//获取到设置详情

function restore(){
	$("#BigSc").html('')
	filenamehtmlm='';
	$.ajax({
		url: share + '/irobotweb/sys/robotsetting/query/robotid?robotid='+robotid,
		type: "get",
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		dataType:"json",
	contentType:"application/json; charset=utf-8",
		success: function (json){
			// console.log(json.data,'详细信息')
			var getdata = json.data[0];
            macAddress=getdata.macAddress;
			// "batteryLowest": "string", //最低电量
			// "brightness": "string", //亮度
			// "monitorMode": "string", // 监控模式   怎么传值  开启时1  关闭是0
			// "voiceControl":'',//声音大小
			// "name":""
			//亮度
			$("#screen .back-bar div:nth-child(1)").css({'width':getdata.brightness*3+'px'})
			$("#screen .back-bar div:nth-child(4)").css({'left':getdata.brightness*3+'px'})
			$("#screen .back-bar div:nth-child(5)").css({'left':getdata.brightness*3+'px'})
			$("#screen .back-bar div:nth-child(5)").text(getdata.brightness)
			//声音
			$("#voice .back-bar div:nth-child(1)").css({'width':getdata.voiceControl*3+'px'})
			$("#voice .back-bar div:nth-child(4)").css({'left':getdata.voiceControl*3+'px'})
			$("#voice .back-bar div:nth-child(5)").css({'left':getdata.voiceControl*3+'px'})
			$("#voice .back-bar div:nth-child(5)").text(getdata.voiceControl)
			$("#batteryLowest").val(getdata.batteryLowest)
			$('#name').val(getdata.name)
			//monitorMode  是否监控true 1 false 0
			// $("#ck").attr("checked",true)
			if(getdata.monitorMode == 1){
				$(".chooseBtn2").attr("checked",true)
				monitorModevalue =1;
			}else if(getdata.monitorMode == 0){
				$(".chooseBtn2").attr("checked",false)
				monitorModevalue =0;
			}
			$("input[name='vtheta'][value='"+getdata.vtheta+"']").prop("checked", "checked");
			$("input[name='statusLight'][value='"+getdata.statusLight+"']").prop("checked", "checked");
			$("input[name='speed'][value='"+getdata.speed+"']").prop("checked", "checked");
			var datas = getdata.resourceDOList;
			if(datas!=0 && datas.length>0)
			{
                //console.log(datas,'报错上一行')
                $("input[name='typews'][value='"+datas[0].type+"']").prop("checked", "checked");
                for(var i = 0;i<datas.length;i++){
                    filenamehtmlm +='<span class="filenamespan" filenameid = "'+datas[i].id+'">'+
                        datas[i].filename+
                        '<small class="fork">×</small>'+
                        '</span>';
                }
                $("#BigSc").html(filenamehtmlm);
			}

			
		}
	
	});
}

//出厂设置按钮
$(".choose-label").on('click',function(){
	var Whether=$(".chooseBtn[type='checkbox']").is(':checked');
	if(Whether){
		// console.log(1)
	}else{ //启用出厂设置
		// console.log(2)
		restore()
	}
})

// console.log(new FormData($('#file')[0]),'上传的文件')
$('#ok').on('click',function(e){

	var showscrnid = new Array();
        $('.filenamespan').each(function(){
            showscrnid.push($(this).attr('filenameid'));//添加至数组
        });
	 console.log(showscrnid,'filenamespanfilenamespanfilenamespanfilenamespanfilenamespan')
		var datas ={
				"batteryLowest": $('#batteryLowest').val(), //最低电量
				"brightness": $("#screen .back-bar div:nth-child(5)").text(), //亮度
				"monitorMode": monitorModevalue, // 监控模式   怎么传值  开启时1  关闭是0
				"voiceControl":$("#voice .back-bar div:nth-child(5)").text(),//声音大小
				"name":$('#name').val(),
				"robotId":robotid,
				"vtheta":$('input[name="vtheta"]:checked').val(),
				"statusLight":$('input[name="statusLight"]:checked').val(),
				"speed":$('input[name="speed"]:checked').val(),
				"ids":showscrnid,
				"macAddress":macAddress
		};
		var formData = JSON.stringify(datas);
		// console.log(,'最低电量')
		// console.log(,'亮度')
		// console.log(,'充电时间')
		// console.log(,'监控模式')
		$.ajax({
			url : share+"/irobotweb/sys/robotsetting/update",
			type: "POST",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
			data : formData,
			success : function(data){
				// console.log(data,'修改参数返回')
				if (data.code == 200) {
					parent.layer.msg("修改成功");
					var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
					parent.layer.close(index);
                    window.parent.location.reload();
				} else {
					parent.layer.alert('修改失败')
				 }
			},
			error : function(request)                                                                                                                                                                                                            {
				//parent.layer.alert("Connection error");  
			}
		});
		e.preventDefault()
	})


var file = $('#file'),  aim = $('#aim');
           
file.on('change', function( e ){
	//e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
var name = e.currentTarget.files[0].name;
	aim.val( name );
	var theFile =  this.files[0];
	var name =   theFile.name;
	var formData = new FormData();
	formData['myfile']= theFile;
})

$('#danger').on('click',function(){
	window.parent.location.href="./RobotOperation.html"
})
//进度条1
$(".single-slider").jRange({
	from: 0,
	to: 100,
	step: 1,
	scale: [0,     100],
	format: '%s',
	width: 300,
	showLabels: true,
	showScale: false,
	showText:false
	})
//进度条2
$(".single-sliderw").jRange({
	from: 0,
	to: 100,
	step: 1,
	scale: [0,100],
	format: '%s',
	width: 300,
	showLabels: true,
	showScale: false,
	showText:false
	})  
var resource_type = 0;
$("#seekResource").on('click',function(e){
	filenamehtmlm = '';
	$("#BigSc").html(" ");
	resource_type = $('input[name="typews"]:checked').val();
	// console.log('查找资源'+resource_type)
	$("#shaderesource").show();
	$('#resourceTable').bootstrapTable('destroy');
    resourceLoad();
	e.preventDefault();
})


var resource_filename = '';  //资源名称

// console.log(resource_type,'resource_typeresource_typeresource_type')
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
                //排序列名
                // sortOrder: 'asc',
                 filename: resource_filename, //资源名称
                 type: resource_type,         //资源类型
                //userType: resource_userType  //资源用途
            };
            return temp;
        },
        columns: [
            {
                checkbox: true
            },
            // {
            //     align: 'center',
            //     title: '序号',// 列标题
            //     formatter: function (value, row, index) {
            //         var pageSize = $('#resourceTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
            //         var pageNumber = $('#resourceTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
            //         return pageSize * (pageNumber - 1) + index + 1;                              // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
            //     }
            // },
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
                    // console.log(row.type)
                    if(row.type == "0"){
                        return '<img src="'+row.ossurl+'" alt="" style="width:50px;height=auto;">'
                    }else if(row.type == "2"){

                    }
                }
            },
        ]
    });
}

//选中的

$('#resourcebtndel').on('click', function (){ 
	$("#BigSc").html('');
    // console.log($('#resourceTable').bootstrapTable('getSelections'))
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
$('small').on('click',function(){
	comsole.log($(this))
})
$(document).on('click',function(e){
	// console.log($(e.target).attr("class") )
	if($(e.target).attr("class") == 'fork'){
		$(e.target).parent().remove()
	}
})
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            name:{
				required: true, //机器人名称
				maxLength:20
            },
            batteryLowest: {
				required: true, //任务描述
				min: 0
            },
        },
        messages: {
            name:{
				required: icon + "请输入机器人名称",
				maxLength: icon + "不能超过20个字符"
            },
            batteryLowest: {
				required: icon + "请输入最低电量" ,
				min: icon + "数值不能小于0"
            },
        }
    })
}