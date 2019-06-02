// 以下为官方示例
$().ready(function() {

    var html =load_position();
    $("#signupForm").prepend(html);
    load();
    showChildDeveloperDesc();
    validateRule();
});

//页面数据加载
function load(){
    var userkey = sessionStorage.getItem('usereditid');
    //alert(userkey);
    $("#userId").val(userkey);
    //alert(share+'/irobotweb/sys/user/edit/'+userkey);
    $.ajax({
        url: share+'/irobotweb/sys/user/edit/'+userkey,
        type: "get",
        dataType: "json",
        async:false,
        cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            //console.log(json,'具体获取');
            var sixs = JSON.parse(json[0]);
            console.log('用户的详细信息');
            console.log(sixs);
            $('#name').val(sixs.name);
            $('#username').val(sixs.username);
            $('#email').val(sixs.email);
            $('#mobile').val(sixs.mobile);
            //显示身份 positionid
            $('#positionid').val(sixs.position);

            //根据身份显示开发者账号控件是否显示
            if("superadmin"==sixs.position ||"admin"==sixs.position || "developer"==sixs.position){
                $('#d_developer').hide();
                $('#d_customer').hide();
            }else{
                $('#d_developer').show();
                if("subshopmanager"==sixs.position){
                    $('#d_customer').show();
                }else{
                    $('#d_customer').hide();
                }
            }

            //企业名称
            $('#companyname').val(sixs.companyName);
            //开发者账号
            $('#developerid').val(sixs.developerName);
            //用户账号
            $('#customerid').val(sixs.cuserName);

            // $("#yhh").text(sixs.roleName)
            //console.log(sixs.roleName,'角色显示');
            //$("#role option:contains('"+sixs.roleName+"')").attr("selected","selected");
            loadRoleNew(sixs.position,sixs.developerid,sixs.roleName);//加载角色使用新方法

            $("#med").text(sixs.deptName);
            if(sixs.status == 0){ //禁用
                $("#forbidden").attr("checked",'checked');
            }else if(sixs.status == 1){  //正常
                $("#normal").attr("checked",'checked');
            }
        }

    });
}

//角色加载的最新方法
function loadRoleNew(position,developerid,rolename) {
    //console.info('角色加载的最新方法');
    //console.info(position);
    //console.info(developerid);
    //console.info(rolename);
    var data_roles=load_role(position,developerid);
    console.info('获取到的角色');
    console.info(data_roles);
    $('#role').append(data_roles);
    $("#role option:contains('"+rolename+"')").attr("selected","selected");
}


//加载身份数据
let load_position =function() {
    var html ="";

    $.ajax({
        url: share+'/irobotweb/sys/user/query/allpositions',
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

                    op +='<option value="'+item.position+'">'+item.positionname+'</option>';
                });

                html =html + '<div class="form-group"><label class="col-sm-3 control-label">身份：</label>' +
                    '<div class="col-sm-8">' +
                    '<select id="positionid" name="positionid" class="form-control"  disabled>' +
                    op+
                    '</select>' +
                    '</div></div>';
                return ;
            }

        }
    });

    return html;
};

//显示开发者账号的信息
function showDevelopers() {
    establish('',$('.rele1'),0);
}

//显示用户账号的信息
function showCustomers() {
    var developerid_selected=$('.rele1').attr('genid');
    establish(developerid_selected,$('.rele1-c'),1);
}

//身份选择触发后，根据条件加载角色数据
let load_role =function(position,developerid) {

    //alert(share+'/irobotweb/sys/user/query/roles');
    //alert('position='+position+',developerid='+developerid);


    var html ="";
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

            //console.info('json');
            //console.info(json);

            if(json.code==200)
            {
                if(json.data!=null){
                    var op = '';
                    json.data.forEach(function(item){

                        op +='<option value="'+item.roleId+'">'+item.roleName+'</option>';
                    });

                    html =op;
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
    //alert('回调成功!');
    //(developerid);
    var position = $('#positionid').children("option:selected").val();
    var data_roles=load_role(position,developerid);
    console.info('加载角色1');
    console.info(data_roles);
    $('#role').append(data_roles);
}



//如果是子开发者，则显示文字说明
function showChildDeveloperDesc() {

    if("subdeveloper"==identity ){
        $('#role_desc').show();
    }
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
$("#editsave").on('click',function(e){
    console.log(34666)
    if(!$("#signupForm").valid()){
        return;
    }
    // if($("#name").val() == ''){
    //    $("#name").addClass('error')
    // }
    console.log(12666)
    // $("#roleId").val($("#role").val());
    var jsonStr = JSON.stringify($('#signupForm').serializeObject());  //json字符串
    $.ajax({
        type : "POST",
        url :share+"/irobotweb/sys/user/update",
        data : jsonStr,
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        crossDomain: true,
        async:false,
        xhrFields: {
            withCredentials: true
        },
        error : function(request){
            alert("Connection error");
        },
        success : function(data) {

            console.log(data,'编辑保存返回的数据');

            if (data.code == 0 || data.code == 200) {
                parent.layer.alert("编辑成功",function(){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                    window.parent.location.reload();
                });

            } else {
                layer.msg(data.msg);
            }

        }
    });
    e.preventDefault();
})

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

function setCheckedRoles() {
	var roleIds = $("#roleIds").val();
	//alert(roleIds);
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

function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function(element) { $(element).valid(); },
        rules : {
            name : {
                required : true,
                maxlength:20
            },


            roleId : {
                required : true,
            }
        },
        messages : {

            name : {
                required : icon + "请输入姓名",
                maxlength:icon + "姓名不能多于20个字符"
            },

            roleId : {
                required : icon + "请选择角色",
            }
        }
    })
}

//手机号码验证
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");

var userkey = sessionStorage.getItem('usereditid');
//alert(userkey);
$("#userId").val(userkey);


//页面数据加载
setTimeout(function(){

},0);
//http://192.168.1.11:9090/irobotweb/sys/dept/getDepts  //开发者



//点击取消
$("#btn-cancel").on('click',function(){
    console.log('取消')
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})

