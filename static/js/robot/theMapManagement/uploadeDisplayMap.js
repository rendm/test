$().ready(function() {

    load_developer();
    load_shop();
    load_data();
    validateRule();


});
var mapid= sessionStorage.getItem('mapid');
var map_file_base64='';

//console.log(mapid,'这是一个id');

//加载所属开发者
function load_developer() {
    $.ajax({
        url: share+'/irobotweb/sys/user/query/developer',
        type: "get",
        dataType: "json",
        async : false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
			console.log(json,'开发者name');
			var data = json.data;
            var op = '';
            data.forEach(function(item){
                //console.log(item.name);
                op +='<option value="'+item.developerid+'">'+item.name+'</option>';
            });
            $("#developerid").html(op);
        }
    });
}

//加载所属店铺
function load_shop(){
    $.ajax({
        url: share+'/irobotweb/sys/user/query/shop',
        type: "get",
        dataType: "json",
        async : false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            console.log(json,'店铺shopName');
            // var oph = '';
            // json.forEach(function(item){
            //     //console.log(item.shopName)
            //     oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
            // });
            // $("#shopId").html(oph);
        }
    });
}

//加载页面数据-从设置页面拷贝过来的
function load_data(){
    $.ajax({
        url: share+'/irobotweb/sys/map/get?mapid='+mapid,
        crossDomain: true,

        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {

            var datajson = data.data;
            //console.log('加载的信息');console.log(datajson);

            $("#mapName").val(datajson.mapName);
            $("#remark").val(datajson.remark);
            $("#shopId").val(datajson.shopid);          //所属店铺id
            $("#developerid").val(datajson.developerid);//所属开发者id
            $("#developername").val(datajson.developername);
            $("#shopname").val(datajson.shopname);
            map_file_base64=datajson.showMapFile;       //base64图片

        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}


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

var resource_formData = new FormData();

$('#ok').on('click',function() {

    //alert($('#aim').val());

    if($('#aim').val()==''){
        layer.msg('请选择展示图');
        return false;
    }

    if(!$("#signupForm").valid()){
        //alert('验证不通过');
        return false;
    }
    else{
        //alert('验证通过');
    }

	   var file=$('input[type="file"]');
	   //console.log(file,'文件');
	   //var formData = new FormData();
	   //formData.append('avatar_file', file);
		//resource_formData.append("mapName", $("#mapName").val());
		//resource_formData.append("developerid", $("#developerid").val());
		//resource_formData.append("developername", $("#developername").text());
		//resource_formData.append("shopid", $("#shopId").val());
		//resource_formData.append("shopname", $("#shopname").text());
		//resource_formData.append("remark", $("#remark").val());
		//resource_formData.append("mapId",mapid );
		//console.log(mapid,'mapid');

	    var update_obj={};
        update_obj.mapId=mapid;
        update_obj.remark=$("#remark").val();
        update_obj.showMapFile=map_file_base64;
        var jsonStr = JSON.stringify(update_obj);

        //console.info('修改的信息');
        //console.info(jsonStr);

		$("#roleIds").val(getCheckedRoles());
		$.ajax({
			cache : true,
			type : "POST",
			url : share+"/irobotweb/sys/map/addmap",
			data : jsonStr,
			async : false,
			processData: false,
			dataType:'JSON',
            contentType:"application/json; charset=utf-8",
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			error : function(request) {
				parent.layer.alert("Connection error");
			},
			success : function(data) {
				 //console.log(data,'asjgakjsdgq');
				if (data.code == 200) {
					/*parent.layer.msg("操作成功");
					window.parent.location.reload()
					var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
					parent.layer.close(index);*/

					//console.info('上传展示图信息');console.info(data);

                    parent.layer.alert("上传成功",function () {
                        window.parent.location.reload();
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    });

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
	//formData['myfile']= theFile;
	//resource_formData.append('avatar_file', theFile);

    //console.info('base64文件1');
    //console.info(theFile);
});

//使用base64格式来保存，不再使用FormData
$('input[type=file]').on('change',function () {
	var reader=new FileReader();
	reader.onload=function (e) {
        map_file_base64=reader.result.substr(23,reader.result.length-24);
    };
    reader.readAsDataURL(this.files[0]);
});

$('#select_img').hover(function () {
    //$("#select_img").css("cursor", "pointer");
});

//取消按钮
$('#danger').on('click',function(){
	//window.parent.location.href="./resource.html"
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});

//页面验证
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
		onfocusout: function(element) { $(element).valid(); },
		rules : {
            showmapname : {
				required : true
			}
		},
		messages : {
            showmapname : {
				required : icon + "请选择展示地图"
			}
		}
	})
}

/** 地图唯一id  map_id **/
// private Integer mapId;

// /** 上传机器人id  robot_id **/
// private String robotId;

// /**   robot_name **/
// private String robotName;

// /** 地图名称  map_name **/
// private String mapName;

// /** 版本  version **/
// private String version;

// /** md5验证  md5 **/
// private String md5;

// /** 地图 uuid  uuid **/
// private String uuid;

// /** md5地图文件  mapfile **/
// private String mapfile;   、、原始图base码

// /** 地图创建时间  map_create_time **/
// private String mapCreateTime;

// /**  地图分辨率，浮点类型  resolution **/
// private String resolution;

// /** 地图宽（像素）   width **/
// private String width;

// /** 地图高（像素）   height **/
// private String height;

// /**  不可通行区域（障碍物）颜色阈值  occupied_color_thresh **/
// private String occupiedColorThresh;

// /** 默认无信息区域颜色   no_information_color **/
// private String noInformationColor;

// /** 自由通行区域的颜色阈值   free_color_thresh **/
// private String freeColorThresh;

// /** 是否当前在用(0不可用，1可用)  is_use **/
// private String isUse;

// /** 展示地图名称  show_mapname **/
// private String showMapname;

// /** 展示地图分辨率  show_map_resolution **/
// private String showMapResolution;

// /** 展示地图宽度  show_map_width **/
// private String showMapWidth;

// /** 展示地图高度  show_map_height **/
// private String showMapHeight;

// /** 展示地图文件  show_map_file **/
// private String showMapFile;   展示图照片base码

// /** 创建时间  create_time **/
// private Date createTime;

// /** 创建人ID  create_user_id **/
// private String createUserId;

// /** 创建人姓名  create_user_name **/
// private String createUserName;

// /** 修改时间  update_time **/
// private Date updateTime;

// /** 修改人ID  update_user_id **/
// private String updateUserId;

// /** 修改人姓名  update_user_name **/
// private String updateUserName;

// /** 扫图状态(-1开始扫图，0扫图中，1完成扫图）  map_status **/
// private Integer mapStatus;

// /** 状态  status **/
// private Integer status;

// /** 备注  remark **/
// private String remark;

// /** 备用字段1  remark0 **/
// private String remark0;

// /** 备用字段2  remark1 **/
// private String remark1;

// /** 备用字段3  remark2 **/
// private String remark2;

// /** 备用字段4  remark3 **/
// private String remark3;

// /** 备用字段5  remark4 **/
// private String remark4;

// /**   shopid **/
// private String shopid;

// /**   shopname **/
// private String shopname;

// /**   developer
