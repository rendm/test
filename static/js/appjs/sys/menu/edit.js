var prefix = "/irobotweb/sys/menu"
var menueditid = sessionStorage.getItem('menueditid')
$.ajax({
	url: share+'/irobotweb/sys/menu/edit/'+menueditid,
	type: "get",
	dataType: "json",
	//cache: false,
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	},
	success: function (json) {
		console.log(json[0],'这里打印的是父级菜单')
		var parentname = json[0];
		// for(var i = 0;i<json.length;i++){
		// 	console.log(json,i+"239832572037509823750")
		// }
		// var hu = {"menuId":109,"name":"实名认证","orderNum":3,"parentId":1,"type":1,"url":"/account/auth.html"};
		// console.log(hu.url)
		var six = JSON.parse(json[json.length-1]);
		$('#name').val(six.name)// 
		$('#url').val(six.url)//
		$('#perms').val(six.perms)//
		$('#orderNum').val(six.orderNum)//
		$('#icon').val(six.icon)//
		$('#pnamed').val(parentname)
		console.log(six.type,'显示type')
		if(six.type == 0){
			$("#catalog").attr("checked","checked")
		}else if(six.type == 1){
			$("#menucd").attr("checked","checked")
		}else if(six.type == 2){
			$("#btn").attr("checked","checked")
		}
	}
})
$(function() {
	validateRule();
	//打开图标列表
    $("#ico-btn").click(function(){
        layer.open({
            type: 2,
			title:'图标列表',
            content: '../../../public/FontIcoList.html',
            area: ['480px', '90%'],
            success: function(layero, index){
                //var body = layer.getChildFrame('.ico-list', index);
                //console.log(layero, index);
            }
        });
    });

});

$("#caveedit").on('click',function(){
	$.ajax({
		cache : true,
		type : "POST",
		url :share+ prefix + "/update",
		data : {
			menuId:menueditid,
			pName:$('#pnamed').val(),//上级菜单
			name:$('#name').val(),// 
			url:$('#url').val(),//
			perms:$('#perms').val(),//
			orderNum:$('#orderNum').val(),//
			icon:$('#icon').val(),//
		},
		async : false,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		error : function(request) {
			laryer.alert("Connection error");
		},
		success : function(data) {
			console.log(data,'返回的')
			if (data.code == 0 || data.code == 200) {
			    //alert(data.msg);
				parent.layer.alert("添加成功",function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });
				// var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				// parent.layer.close(index);
			} else {
				layer.alert(data.msg)
			}

		}
	});
})
function validate(){
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
        onfocusout: function(element) { $(element).valid(); },
		rules : {
			name : {
				required : true
			},
			type : {
				required : true
			}
		},
		messages : {
			name : {
				required : icon + "请输入菜单名"
			},
			type : {
				required : icon + "请选择菜单类型"
			}
		}
	})
}
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
        onfocusout: function(element) { $(element).valid(); },
		rules : {
			name : {
				required : true
			},
			type : {
				required : true
			}
		},
		messages : {
			name : {
				required : icon + "请输入菜单名"
			},
			type : {
				required : icon + "请选择菜单类型"
			}
		}
	})
}
/////irobotweb/sys/menu/edit/{id}
//sessionStorage.setItem('menueditid', id);

