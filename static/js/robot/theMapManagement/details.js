$().ready(function() {
	
});
//http://192.168.0.113:9090/irobotweb/sys/user/query/developer   //  开发者接口  developerid  "name  不传"
//http://192.168.0.113:9090/irobotweb/sys/user/query/shop       //店铺接口shopId  shopName

//加载开发者信息
$.ajax({
	url: share+'/irobotweb/sys/user/query/developer',
	type: "get",
	dataType: "json",
	//cache: false,
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	},
	success: function (json) {
		console.log(json,'开发者name');
		var op = '';

		// for(var i=0;i<json.length;i++){
        //     op +='<option value="'+json[i].developerid+'">'+json[i].name+'</option>';
		// }

		json.data.forEach(function(item){
			op +='<option value="'+item.developerid+'">'+item.name+'</option>';
		});

		$("#developerid").html(op);
	}
});

//加载店铺信息
$.ajax({
	url: share+'/irobotweb/sys/user/query/shop',
	type: "get",
	dataType: "json",
	//cache: false,
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	},
	success: function (json) {
		console.log(json,'店铺shopName');
		var oph = '';

		// json.forEach(function(item){
		// 	oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
		// });

        for(var i=0;i<json.length;i++){
            op +='<option value="'+json[i].shopId+'">'+json[i].name+'</option>';
        }

		$("#shopid").html(oph);
	}
});

// http://192.168.0.113:9090/irobotweb/sys/map/get?mapid=1   //根据id查
var mapid = sessionStorage.getItem('mapid');

setTimeout(function(){
	$.ajax({
		url: share+'/irobotweb/sys/map/get?mapid='+mapid,
		crossDomain: true,
		type: "get",
		dataType: "json",
		xhrFields: {
			withCredentials: true
		},
		success: function (data){ 
			var datajson = data.data;

            //console.log('详情信息');console.log(datajson);

			$("#mapName").val(datajson.mapName);
			$("#resolution").val(datajson.resolution);
			$("#height").val(datajson.height);
			$("#width").val(datajson.width);
            $("#shopname").val(datajson.shopname);
            $("#developername").val(datajson.developername);

			$('#developerid option').attr('selected', false);
			$('#developerid option[value='+datajson.developerid+']').attr('selected', true);
			$('#shopid option').attr('selected', false);
			$('#shopid option[value='+datajson.shopid+']').attr('selected', true);

            $("#shopid").val(datajson.shopid);          //所属店铺id
            $("#developerid").val(datajson.developerid);//所属开发者id  showMapFile
			$("#remark").val(datajson.remark);
			// document.getElementById('mapfile').setAttribute('src', 'data:image/png;base64,' + datajson.mapfile);
			// document.getElementById('showMapFile').setAttribute('src', 'data:image/png;base64,' + datajson.showMapFile);
            $('#mapfile').attr('src','data:image/png;base64,' + datajson.mapfile).attr('width','200px').attr('height','200px');
            $('#showMapFile').attr('src','data:image/png;base64,' + datajson.showMapFile).attr('width','200px').attr('height','200px');
		},
		error: function (request) {
			layer.alert("Connection error");
		},
	});
},0);

function getCheckedRoles() {
	var adIds = "";
	$("input:checkbox[name=role]:checked").each(function(i) {
		if (0 == i) {
			adIds = $(this).val();
		} else {
			adIds += ("," + $(this).val());
		}
	});
	return adIds;
}

$('#ok').on('click',function() {
		var file = $("#file").files;

		var formData = new FormData();
		formData.append('avatar_file',file);
		var json ={
			genid : $("#name").val(),//开发者
			shopId:$("#username").val(),//店铺|
			filename: $("#username").val(),//资源名称
			type: $("#type").val(),//资源类型
			userType :$("#usertype").val(),//用途
		};
	
		var jsonStr = JSON.stringify(json);
      

        formData.append('resourceDO',new Blob([jsonStr],
            {
            type: "application/json"
        }
        ));

		//console.log(formData,'上传的文件信息');
		$("#roleIds").val(getCheckedRoles());
		$.ajax({
			cache : true,
			type : "POST",
			url : share+"/irobotweb/sys/rescoure/add",
			data : formData,// 你的formid
			async : false,
			processData: false,
			dataType:'JSON',
			contentType:false,
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			error : function(request) {
				parent.layer.alert("Connection error");  
			},
			success : function(data) {
				//console.log(data,'asjgakjsdgq');
				if (data.code == 0) {
					parent.layer.msg("操作成功");
					window.parent.location.reload()
					var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
					parent.layer.close(index);
				} else {
					parent.layer.alert(data.msg)
				}
	
			}
		});
	
	});

var file = $('#file'),  aim = $('#aim');
           
file.on('change', function( e ){
	//e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
	var name = e.currentTarget.files[0].name;
	aim.val( name );
	var theFile =  this.files[0];
	var name =   theFile.name;
	var formData = new FormData();
	formData['myfile']= theFile;
});

$('#danger').on('click',function(){
	window.parent.location.href="./RobotOperation.html";
});

//进度条
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
	});

$(".single-sliderw").jRange({
	from: 0,
	to: 100,
	step: 1,
	scale: [0,     100],
	format: '%s',
	width: 300,
	showLabels: true,
	showScale: false,
	showText:false
	});

//开关按钮
$(".checkbox").bootstrapSwitch({  
        onText:"启动",
		offText:"停止",
		onColor:"success",
		offColor:"info",
		size:"small",
		onSwitchChange:function(event,state){
			if(state==true){
				$(this).val("1");
			}else{
				$(this).val("2");
			}  
        }
});

$(".checkbox2").bootstrapSwitch({  
    onText:"启动",
	offText:"停止",
	onColor:"success",
	offColor:"info",
	size:"small",
	onSwitchChange:function(event,state){
		if(state==true){
			$(this).val("1");
		}else{
			$(this).val("2");
		}  
    }
}); 
