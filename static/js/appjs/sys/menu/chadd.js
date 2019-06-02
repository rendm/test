
var menueditid = sessionStorage.getItem('menuchaddid')
$.ajax({
	url: share+'/irobotweb/sys/menu/edit/'+menueditid,
	type: "get",
	dataType: "json",
	contentType:"application/json; charset=utf-8",
	//cache: false,
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	},
	success: function (json){
		var parentname = json[0];
		for(var i = 0;i<json.length;i++){
		}
		var hu = {"menuId":109,"name":"实名认证","orderNum":3,"parentId":1,"type":1,"url":"/account/auth.html"};
		console.log(hu.url)
		var six = JSON.parse(json[json.length-1]);
		$('#pnamed').val(six.name)
		console.log(six.type,'显示type')
		if(six.type == 0){
			$("#catalog").attr("disabled","true")
		}else if(six.type == 1){
            $("#menucd").attr("disabled","true")
            $("#catalog").attr("disabled","true") 
		}else if(six.type == 2){
            $("#menucd").attr("disabled","true")
            $("#catalog").attr("disabled","true")
			$("#btn").attr("disabled","true")
		}
	}
})

var pid =sessionStorage.getItem('menuchaddid');
$("#parentId").val(pid)
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
$("#chaddok").on('click',function(e){
	var dx = $('input:radio[name="type"]:checked').val();
	console.log(dx,'单选选择')
	var dataforme ={
		"parentId":$("#parentId").val(),
		"type":dx,
		"name":$("#name").val(),
		"url":$("#url").val(),
		"perms":$("#perms").val(),
		"orderNum":$("#orderNum").val(),
		"icon":$("#icon").val()
	}
	$.ajax({
		cache : true,
		type : "POST",
		url : share+ "/irobotweb/sys/menu/add",
		data :dataforme ,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		error : function(request) {
			laryer.alert("Connection error");
		},
		success : function(data) {
            console.log(data,'菜单添加返回')
			if (data.code == 0 || data.code == 200) {
				parent.layer.alert("添加成功",function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });
			} else {
				layer.alert(data.msg)
			}
		}
	});
	e.preventDefault();
})

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