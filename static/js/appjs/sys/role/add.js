//var menuTree;

var menuIds;
$(function() {
	var user =$.user();
	if("admin"==user.position ||"superadmin"==user.position)
	{
		$("#type").css('display','block');//显示
		
	}
	if("developer"==user.position)
	{
	    var html =  '<div class="form-group" hidden><label class="col-sm-3 control-label ">所属开发者：</label>' +
		'<div class="col-sm-8">' +
		'<select id="developerid" name="developerid" class="form-control"  >' +
		   '<option value="'+user.developerid+'">'+user.developerid +'</option>'
		'</select>' +
		'</div></div>';    
		$('#developer').append(html);

	}
    
	getMenuTreeData();
	validateRule();
});

$.validator.setDefaults({
	submitHandler : function() {
		getAllSelectNodes();
		save();
	}
});




function getAllSelectNodes() {
	var ref = $('#menuTree').jstree(true); // 获得整个树
		console.log(ref)
	menuIds = ref.get_selected(); // 获得所有选中节点的，返回值为数组

	$("#menuTree").find(".jstree-undetermined").each(function(i, element) {
		menuIds.push($(element).closest('.jstree-node').attr("id"));
	});
}
function getMenuTreeData() {
	$.ajax({
		type : "GET",
		url : share+"/irobotweb/sys/menu/query/tree",
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		success : function(menuTree) {
			loadMenuTree(menuTree);
		}
	});
}
function loadMenuTree(menuTree) {
	$('#menuTree').jstree({
		'core' : {
			'data' : menuTree
		},
		"checkbox" : {
			"three_state" : true,
		},
		"plugins" : [ "wholerow", "checkbox" ]
	});
	//$('#menuTree').jstree("open_all");

}

function save() {
	$('#menuIds').val(menuIds);
	var role = $('#signupForm').serialize();
	console.log(role,'传进去的数据')


	$.ajax({
		cache : true,
		type : "POST",
		url : share+"/irobotweb/sys/role/add",
		//contentType: "application/json",
		data : role, // 你的formid
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		async : false,
		error : function(request) {
			alert("Connection error");
		},
		success : function(data) {
			console.log(data)
			if (data.code == 0) {
				//parent.layer.msg("操作成功");
				window.parent.location.href='./role.html'
				//var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				//parent.layer.close(index);                 
			} else {
				parent.layer.msg(data.msg);
			}
		}
	});
}

function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
        onfocusout: function(element) { $(element).valid(); },
		rules : {
			roleName : {
				required : true
			},
			maxLength:20
		},
		messages : {
			roleName : {
				required : icon + "请输入角色名",
				maxLength: icon + "不能多于20个字"
			}
		}
	});
}



//地图变更
$(document).on("change", "#typeid", function() {

    var selected = $(this).children("option:selected").val();
	if(selected=="1")
	{
	//	$("#developer").css('display','block');//显示隐藏下拉菜单
		$('#developer').append(load_developer());

           

	}
	if(selected=="0")
	{
		
		$('#developer').html("");

	}
		
});



load_developer =function() {
	var html ="";

		$.ajax({
			url: share+'/irobotweb/sys/user/query/developer',
			type: "get",
			async : false,
			dataType: "json",
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			success: function (json) {
				if(json.code==200)
				{
					var op = '';
					json.data.forEach(function(item){
		
						op +='<option value="'+item.genid+'">'+item.name+'</option>';
					});
					 
					 html =html + '<div class="form-group"><label class="col-sm-3 control-label">所属开发者：</label>' +
					'<div class="col-sm-8">' +
					'<select id="developerid" name="developerid" class="form-control"  >' +
					op+  
					'</select>' +
					'</div></div>';         
					return ;
				}

			}
		});

	


return html;
}