

$().ready(function() {



    $('#d_developer').hide();
    $('#d_customer').hide();
    $('#role_desc').hide();

    var html =load_position();
    $("#signupForm").prepend(html);


    validateRule();
});

$.validator.setDefaults({
	submitHandler : function(){

	    var position = $('#positionid').children("option:selected").val();

	    if("subdeveloepr" ==position ||"shopmanager"== position || "subshopmanager"==position )
        {
            if($("#developerid").attr("genid")==null || $("#developerid").attr("genid")==''){

                var errorhtml ='<label id="developerid-error" class="error" for="developerid"><i class="fa fa-times-circle"></i> 请选择所属开发者</label>';
                $("#developerid-error").remove() ;
                $("#developerinput").append(errorhtml) ;
                return;
            }
        }

        if ("subshopmanager"==position)
        {
            if($("#customerid").attr("genid")==null || $("#customerid").attr("genid")==''){

                var errorhtml ='<label id="customerid-error" class="error" for="customerid"><i class="fa fa-times-circle"></i> 请选择所属用户</label>';
                $("#customerid-error").remove() ;
                $("#customerinput").append(errorhtml) ;
                return;
            }
        }



		save();
	}
});

//显示开发者账号的信息
function showDevelopers() {
    establish('',$('.rele1'),0);
}

//显示用户账号的信息
function showCustomers() {
    var developerid_selected=$('.rele1').attr('genid');

    //alert('选中的开发者账号='+developerid_selected);
    establish(developerid_selected,$('.rele1-c'),1);
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
};

//保存方法
function save() {
//var jsonObj = $("#form").serializeObject();  //json对象
    var add_obj=$('#signupForm').serializeObject();
    add_obj.developerid=$('.rele1').attr('genid');  //开发者
    add_obj.shopmanagerid=$('#customerid').attr('genid');  //用户账号

    var jsonStr = JSON.stringify(add_obj);  //json字符串
    console.info('用户信息保存');
    console.info(jsonStr);

	//Content type '' not supported
	$.ajax({
		cache : true,
		type : "POST",
		url : share+"/irobotweb/sys/user/add",
		data :jsonStr,
		dataType:"json",
		contentType:"application/json; charset=utf-8",
		async : false,
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		error : function(request) {
			parent.layer.alert("Connection error");
		},
		success : function(data) {
			//console.log(data);
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

}

//验证方法
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
        onfocusout: function(element) { $(element).valid(); },
		rules : {
			name : {
                required : true,
                maxlength:20
			},
			username : {
				required : true,
				minlength : 2,
				remote : {
					url : share+"/irobotweb/sys/user/query/exist", // 后台处理程序
					type : "post", // 数据发送方式
					dataType : "json", // 接受数据格式
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					data : { // 要传递的数据
						username : function() {  //用户名教研
							return $("#username").val();
						}
					}
				}
			},
			password : {
				required : true,
				minlength : 6
			},
			pwd : {
				required : true,
				minlength : 6,
				equalTo : "#password"
			},

            position : {
                required : true,
            },

			email : {
				required : true,
				email : true,
                remote: {
                    url: share + "/irobotweb/sys/user/query/exist", // 后台处理程序
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "post", // 数据发送方式
                    dataType: "json",
                    data: { // 要传递的数据
                        email: function () {
                            //var data = JSON.stringify($("#email").serializeObject())
                            var data = $("#email").val();
                            return data
                        }
                    }
                }
			},
            mobile : {
                required: true,
                minlength: 11,
                isMobile: true,
                remote: {
                    url: share+"/irobotweb/sys/user/query/exist", // 后台处理程序
                    type: "post", // 数据发送方式
					dataType: "json", // 接受数据格式
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
                    data: { // 要传递的数据
                        mobile: function () {  //手机号校验
                            return $("#mobile").val();
                        }
                    }
                }
            },
			topic : {
				required : "#newsletter:checked",
				minlength : 2
			},
            roleId : {
                required : true,
            },
            companyName : {
                maxlength:20
			},
			agree : "required"
		},
		messages : {

			name : {
                required : icon + "请输入姓名",
                maxlength:icon + "姓名不能多于20个字符"
			},
			username : {
				required : icon + "请输入您的用户名",
				minlength : icon + "用户名必须两个字符以上",
				remote : icon + "用户名已经存在"
			},
			password : {
				required : icon + "请输入您的密码",
				minlength : icon + "密码必须6个字符以上"
			},
			pwd : {
				required : icon + "请再次输入密码",
				minlength : icon + "密码必须6个字符以上",
				equalTo : icon + "两次输入的密码不一致"
			},
            position : {
                required : icon + "请选择身份",
            },

			email : {
                required: icon + "请输入邮箱",
                email: icon + "请输入正确的邮箱格式",
                remote: icon + "邮箱已经存在"
            },

            mobile: {
                required: icon + "请输入您的手机号",
                minlength: icon + "不能小于11个字符",
                isMobile: icon + "请正确填写手机号码",
                remote: icon + "手机号已经存在"

            },
            roleId : {
                required : icon + "请选择角色",
            },
            companyName : {
                maxlength:icon + "企业名不能多于20个字",
			},
		}
	})
}

//手机号码验证
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");





//如果是子开发者，则显示文字说明



//开发者账号选择后触发
$(document).on("change","#developerid",function(){

    var developerid =$("#developerid").attr("genid");

    $("#developerid-error").remove();

    $("#customerid").val("");
    $("#customerid").attr("genid","");

    loadRoleByDev(developerid);


});

$(document).on("change","#customerid",function(){

    var developerid =$("#customerid").attr("genid");

    $("#customerid-error").remove();



    loadRoleByDev(developerid);


});



//加载身份数据
let load_position =function() {
    var html ="";

    $.ajax({
        url: share+'/irobotweb/sys/user/query/positions',
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
                var op = '<option value="">--请选择身份--</option>';
                json.data.forEach(function(item){

                    op +='<option value="'+item.position+'">'+item.positionname+'</option>';
                });

                html =html + '<div class="form-group"><label class="col-sm-3 control-label">身份：</label>' +
                    '<div class="col-sm-8">' +
                    '<select id="positionid" name="position" class="form-control"  >' +
                    op+
                    '</select>' +
                    '</div></div>';
                return ;
            }

        }
    });

    return html;
}

//身份选择触发后，根据条件加载角色数据
let load_role =function(position,developerid) {

    //alert(share+'/irobotweb/sys/user/query/roles');
    //alert('position='+position+',developerid='+developerid);

    var html ='<option value="">--请选择角色--</option>';
    var reqdata ={
        "position":position,
        "developerid":developerid
    };

    $.ajax({
        url: share+'/irobotweb/sys/user/query/roles',
        type: "get",
        async : false,
        data:reqdata,
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {

            console.info('加载的角色信息json');
            console.info(json);

            if(json.code==200)
            {
                if(json.data!=null){
                    var op = '';
                    json.data.forEach(function(item){

                        op +='<option value="'+item.roleId+'">'+item.roleName+'</option>';
                    });

                    html =html+op;
                    //console.info('html');
                    //console.info(html);
                    return html;
                }
            }
        }
    });

    return html;
}

//选了开发者账号后加载角色信息
function loadRoleByDev(developerid) {

    var position = $('#positionid').children("option:selected").val();
    var data_roles=load_role(position,developerid);
    $('#role').empty();
    $('#role').append(data_roles);
}

//身份变更
$(document).on("change","#positionid",function(){
    var selected = $(this).children("option:selected").val();
    loadByIdentity(selected);
    var user =$.user();
    if(user.developerid!=null && user.developerid!="")
    {

        $("#developerid").attr("genid",user.developerid);
        $('#d_developer').hide();
    }

    if(user.shopmanagerid!=null && user.shopmanagerid!="")
    {

        $("#customerid").attr("genid",user.shopmanagerid);
        $('#d_customer').hide();
    }




});

//根据身份选中的值加载不同的角色
function loadByIdentity(identity) {

   var  developerid =$("#developerid").attr("genid");
    var data_roles=load_role(identity,developerid);
    $('#role').empty();
    $('#role').append(data_roles);



    if("admin"==identity || "developer"==identity || ""==identity){

        $('#d_developer').hide();
        $('#d_customer').hide();

    }else{
        $('#d_developer').show();

        if("subshopmanager"==identity){
            $('#d_customer').show();
            $('#d_developer').hide();

        }else{
            $('#d_customer').hide();
        }
    }


    if("subdeveloper"==identity ){
        $('#role_desc').show();
    }


}


//点击取消
$("#btn-cancel").on('click',function(){
    console.log('取消')
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})
