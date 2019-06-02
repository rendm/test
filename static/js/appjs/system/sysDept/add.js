var prefix = "/irobotweb/sys/dept"



$().ready(function() {

    
var deadd = sessionStorage.getItem('deptaddid');//传过来的app
$("#parentId").val(deadd)

if(deadd ==1000000000){
	$("#pName").val('英特雷真')
}else{
	$.ajax({
	    url: share+'irobotweb/sys/dept/add/'+deadd,
	    type: "get",
		crossDomain: true,
		async:false,
	    xhrFields: {
	        withCredentials: true
	    },
	    success: function (json) {
			$("#pName").val(json)
			console.log(json,'787878')
	    }

	 });
}


	validateRule();
});

$.validator.setDefaults({
	submitHandler : function() {
		save();
	}
});
function save() {
	$.ajax({
		type : "POST",
		url : share+prefix+"/add",
		data : $('#signupForm').serialize(),// 你的formid
		async : false,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		error : function(request) {
			parent.layer.alert("Connection error");
		},
		success : function(data) {
			console.log(data)
			if (data.code == 0) {
				parent.layer.msg("操作成功");
				parent.reLoad();
				var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				parent.layer.close(index);
			} else {
				parent.layer.alert(data.msg)   
			}

		}
	});

}
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
		rules : {
			name : {
				required : true
			}
		},
		messages : {
			name : {
				required : icon + "请输入姓名"
			}
		}
	})
}