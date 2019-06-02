var prefix = "/irobotweb/sys/menu"
validateRule();

var pid =sessionStorage.getItem('menuaddid');
$("#parentId").val(pid)
$(function() {
	
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


$("#menusave").on('click',function(e){
	// if(){

	// }
	if(!$("#signupForm").valid()){
		return false;
		}
	// if(!$("#signupForm").valid()){
    //     console.log('验证不通过');
    //     return false;
    // }
    // else{
    //     console.log('验证通过');
    // }
	$.ajax({
		cache : true,
		type : "POST",
		url : share+prefix + "/add",
		data : $('#signupForm').serialize(),
		async : false,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		error : function(request) {
			laryer.alert("Connection error");
		},
		success : function(data) {
			console.log(data,'系统菜单')
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
	e.preventDefault()
})

function validateRule(){
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
        onfocusout: function (element) { $(element).valid(); },
		rules : {
			name : {
				required : true,
				maxLength:20
			},
			type : {
				required : true
			},
			perms: {
				maxLength:11
			},
		},
		messages : {
			name : {
				required : icon + "请输入菜单名",
				maxLength:  icon + "不能多于20个字符"
				
			},
			type : {
				required : icon + "请选择菜单类型",
			},
			perms: {
				maxLength:  icon + "不能多于11位数字"
				
			},
		}
	})
}
