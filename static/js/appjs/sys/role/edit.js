var menuIds;

$(function() {
	getMenuTreeData();
	validateRule();
});

$.validator.setDefaults({
	submitHandler : function() {
		getAllSelectNodes();
		update();
	}
});

function loadMenuTree(menuTree) {
	$('#menuTree').jstree({
		"plugins" : [ "wholerow", "checkbox" ],
		'core' : {
			'data' : menuTree
		},
		"checkbox" : {
			//"keep_selected_style" : false,
			//"undetermined" : true
			//"three_state" : false,
			//"cascade" : ' up'
		}
	});
	$('#menuTree').jstree('open_all');
}
function getAllSelectNodes() {
	var ref = $('#menuTree').jstree(true); // 获得整个树
	menuIds = ref.get_selected(); // 获得所有选中节点的，返回值为数组
	$("#menuTree").find(".jstree-undetermined").each(function(i, element){
		menuIds.push($(element).closest('.jstree-node').attr("id"));
	});
	//console.log(menuIds);
}

function getMenuTreeData() {
	var roleId = $('#roleId').val();
	$.ajax({
		type : "GET",
		url : share+"/irobotweb/sys/menu/query/tree/" + roleId,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success : function(data) {
			loadMenuTree(data);
		}
	});
}

function update() {

	$('#menuIds').val(menuIds);
	var role = $('#signupForm').serialize();

	$.ajax({
		cache : true,
		type : "POST",
		url : share+"/irobotweb/sys/role/update",
		data : role,
		async : false,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		error : function(request) {
			alert("Connection error");
			//console.log('打印错')
			//console.log(location ,'12313213错误')
		},
		success : function(r) {
			if (r.code == 200 || r.code == 0) {
				parent.layer.alert("修改成功",function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });
				
				//console.log('打印if')
				//console.log(location ,'12313213')
				// var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				// parent.layer.close(index);

			} else {
				//console.log('打印else');
				parent.layer.msg(r.msg);
			}

		}
	});
}

function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
		rules : {
			roleName : {
				required : true
			}
		},
		messages : {
			roleName : {
				required : icon + "请输入角色名"
			}
		}
	});
}

// $.ajax({
// 	url: share+'/irobotweb/sys/menu/query/listMenuTree/'+'1',
// 	crossDomain: true,
// 	type: "get",
// 	dataType: "json",
// 	async: false,
// 	xhrFields: {
// 		withCredentials: true
// 	},
// 	success: function (json) {
		
// 	}
// });

//console.log(sessionStorage.getItem('editid'));
var keyid = sessionStorage.getItem('editid');

//页面数据加载
$.ajax({
	url: share+'/irobotweb/sys/role/query/ids?id='+keyid,
	type: "get",
	dataType: "json",
	async: false,
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	},
	success: function (json) {
        //console.log('角色编辑页面的信息');
		//console.log(json);
		$("#roleName").val(json.roleName);
		$("#roleId").val(json.roleId);
		$("#remark").val(json.remark);
		//角色类别
		if(json.type==1){
            $("#type_sys").attr("checked",'checked');
		}else if(json.type==2){
            $("#type_developer").attr("checked",'checked');
		}
	}
});