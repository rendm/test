
		$(document).ready(function() {
			validateRule();
			//setCheckedRoles();
		});
		$.validator.setDefaults({
			submitHandler : function() {
				update();
			}
        });

        //console.log(share+"irobotweb/sys/user/update/resetpwd");
        var userpwdid = sessionStorage.getItem('userresetpwdid');
        var userresetpwdname = sessionStorage.getItem('userresetpwdname');
        $('#userName').val(userresetpwdname);

		function update() {
			//console.log($("#pwd").val());
			$.ajax({
				type : "POST",
				url : share+"irobotweb/sys/user/update/adminresetpwd",
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				data :{
					"userDO.userId":userpwdid,
					"pwdNew":$("#pwd").val(),
					"pwdOld":$("#password").val()
				} ,// 你的formid
				error : function(request) {
					parent.layer.msg("系统错误，联系管理员");
				},
				success : function(data) {
                    console.log(data,'阿第克')
					if (data.code == 0 || data.code == 0) {
						parent.layer.alert("修改密码成功",function(){
							var index = parent.layer.getFrameIndex(window.name);
							parent.layer.close(index);
							window.parent.location.reload();
						});
						// parent.layer.msg(data.msg);
						// window.parent.location.reload()
						// var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
						// parent.layer.close(index);

					} else {
						parent.layer.msg(data.msg);
					}
				}
			});

		}

		function validateRule(){
			var icon = "<i class='fa fa-times-circle'></i> ";
			$("#signupForm").validate({
                onfocusout: function(element) { $(element).valid();},
				rules : {
                    pwdNew : {
                        required : true,  
                        minlength : 6
                    },
                    pwd : {
                        required : true,
                        minlength : 6,
                        equalTo : "#password"
                    },
				},
				messages : {
                    pwdNew : {
                        required : icon + "请输入您的密码",
                        minlength : icon + "密码必须6个字符以上"
                    },
                    pwd : {
                        required : icon + "请再次输入密码",
                        minlength : icon + "密码必须6个字符以上",
                        equalTo : icon + "两次输入的密码不一致"
                    },
				}
			})
		}