var iddom = sessionStorage.getItem('activateid');
$("#id").val(iddom);
validateRule();

$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
    if (o[this.name] !== undefined) {
    if (!o[this.name].push) {
    o[this.name] = [o[this.name]];
    }
    o[this.name].push(this.value || '');
    } else {
    o[this.name] = this.value || '';
    }
    });
    return o;
    }


$('#ok').on('click',function() {
		//layer.alert("Connection error");  //弹框
		//JSON.stringify($('#basicInfoForm').serialize()),

    if (!$("#signupForm").valid()) {
        return false; //验证不通过，不允许提交
    }

		var jsonStr = JSON.stringify($("#signupForm").serializeObject()); //json字符串
		$.ajax({
			type : "put",
			url : share+"/irobotweb/sys/robot/update",
			data :jsonStr,// 你的formid
			async : false,
			dataType:"json",
            contentType:"application/json; charset=utf-8",
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			},
			error : function(request) {
				parent.layer.alert("Connection error");
			},
			success : function(data) {
				console.log(data,'asjgakjsdgq增加激活返回的code码')
				if(data.code == 200){
					layer.alert("激活成功");
					window.parent.location.href = "./RobotManage.html"
				}
			}
		});
	})

//  点击取消  返回主页面
$('#danger').on('click',function(){
	window.parent.location.href="./RobotManage.html"
});


function validateRule(){
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
		onfocusout: function(element) { $(element).valid(); },
		rules : {
            deviceNo : {
				required : true
			},
			agree : "required"
		},
		messages : {
            deviceNo : {
				required : icon + "请输入机器人SN码"
			}
			
		}
	})
}

