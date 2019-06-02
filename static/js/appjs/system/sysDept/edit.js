var prefix = "/irobotweb/sys/dept"
$().ready(function() {
	validateRule();
});

$.validator.setDefaults({
	submitHandler : function() {
		update();
	}
});
function update() {
	$.ajax({
		type : "POST",
		url : share+prefix+"/update",
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
			console.log(data,'1232131321312哈哈哈哈哈哈哈哈哈哈')
			if (data.code == 0) {
				parent.layer.msg("操作成功");
				window.parent.location.reload();
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
				required : icon + "请输入名字"
			}
		}
	})
}
var pid =sessionStorage.getItem('depteditid');
$("#parentId").val(pid)
$.ajax({
    url: share+'irobotweb/sys/dept/edit/'+pid,
    type: "get",
    dataType: "json",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
		console.log(json)
		var data = JSON.parse(json[0])
		console.log(data)

// 		delFlag: 1
// ​
// 		deptId: 1000000006008
// 		​
// 		name: "研发二部"
// 		​
// 		orderNum: 2
// 		​
		$('#name').val(data.name)
		$('#orderNum').val(data.orderNum)
		$("#deptId").val(data.deptId);
		$("#parentname").val(json[1]);
		 // delFlag2 禁用
		 if(data.delFlag == 0){
			 $('#delFlag2').attr('checked','checked')
		 }else{
			$('#delFlag1').attr('checked','checked')
		 }
    }

});