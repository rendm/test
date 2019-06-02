

$(document).ready(function () {
    validateRule();
    $("#datogg").distpicker('destroy');
    $('#datogg').distpicker({
        autoSelect: false
    });

});

//页面加载方法
$(function () {

    var user=$.user();
    //需要根据当前用户的身份判断是否加载开发者和用户的选择框
    var user_position=user.position;//获取身份值
    if(user_position=='superadmin' || user_position=='admin'){
        $('#d_developer').show();
        $('#d_customer').show();
    }else if(user_position=='developer' || user_position=='subdeveloper'){
        $('#d_developer').hide();
        $('#developerid').attr('genid',user.developerid);
        $('#d_customer').show();
    }else{
        $('#d_developer').hide();
        $('#d_customer').hide();
        $('#developerid').attr('genid',user.developerid);
        //所属用户
       $('#customerid').attr('genid',user.shopmanagerid);

    }

    $('#provinceName option:first').attr('selected', 'selected');
    $('#cityName option:first').attr('selected', 'selected');
    $('#areaName option:first').attr('selected', 'selected');

    validateRule();

    var CLICKTAG = 0;

    //点击保存
    $('#base_save').on('click', function () {
        //表格验证
        if (!$("#basicInfoForm").valid()) {
            return;
        }
        if (CLICKTAG == 0) {
            CLICKTAG = 1;
            this.disabled=true;
            // 等待3s后重置按钮可用
            setTimeout(function () { CLICKTAG = 0 ; this.disabled=false;}, 3000);
        }


        var data_obj={};

        //所属开发者
        data_obj.deviceDeveloperId=$('.rele1').attr('genid');
        //所属用户
        data_obj.shopmanagerId=$('#customerid').attr('genid');


        //店铺名称
        data_obj.shopName=$('#shopName').val();
        //店铺联系人
        data_obj.shopcontacts=$('#shopcontacts').val();
        //店铺联系人手机
        data_obj.mobile=$('#mobile').val();
        //店铺联系人邮箱
        data_obj.email=$('#email').val();
        //主营业务
        data_obj.industry=$('#industry').val();
        //店铺座机
        data_obj.phone=$('#phone').val();
        //所在地区-省/市/区
        data_obj.provinceName=$('#provinceName').val();
        data_obj.cityName=$('#cityName').val();
        data_obj.areaName=$('#areaName').val();
        //  console.log('省'+data_obj.provinceName+'市'+data_obj.cityName+'区'+data_obj.areaName)
        //详细地址
        data_obj.address=$('#address').val();
        //状态
        data_obj.status=$("input[name='status']:checked").val();
        var jsonStr = JSON.stringify(data_obj);  //json字符串
        $.ajax({
            url: share+'/irobotweb/sys/shop/add',
            crossDomain: true,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            data:data_obj,
            contentType: "application/x-www-form-urlencoded",
            success: function (data){
                if (data.code == 0 || data.code ==200) {
                    parent.layer.alert(data.msg,function(){
                        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                            parent.layer.close(index);
                            window.parent.location.reload();
                    })
                   
                } else {
                    parent.layer.alert(data.msg)
                }
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
    })

    //取消
    $('#cancel').on('click',function(){
       
    })
})

//jq校验数据
function validateRule(){
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#basicInfoForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            deviceDeveloperId:{
                required: true //所属开发者必填
            },
            shopName: {
                required: true //店铺名称必填
            },

            /*shopcontacts: {
                required: true //店铺联系人必填
            },*/

            mobile: {
                minlength: 11,
                isMobile: true
            },

            phone:{
                isTel: true
            },

            email: {
                email: true,
            },

            provinceName:{
                required: true //所在省必填
            },

            cityName:{
                required: true //所在城市必填
            }
            //
            // areaName:{
            //     required: true //所在区必填
            // }
        },
        messages: {

            deviceDeveloperId:{
                required: icon + "请输入所属开发者"
            },

            shopName: {
                required: icon + "请输入店铺名称"
            },

            /*shopcontacts: {
                required: icon + "请输入店铺联系人" 
            },*/

            mobile: {
                minlength: icon + "不能小于11个字符",
                isMobile: icon + "请正确填写手机号码"
            },

            phone:{
                isTel: icon + "请正确填写座机号码"
            },

            email: {
                email: icon + "请输入正确的邮箱格式"
            },

            provinceName:{
                required: icon + "请选择所在省"
            },

            cityName:{
                required: icon + "请选择所在城市"
            }

            // areaName:{
            //     required: icon + "请选择所在区"
            // }
        }
    })
}

//手机号码验证
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");

//座机固话验证
jQuery.validator.addMethod("isPhone", function (value, element) {
    var length = value.length;
    var phone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    return this.optional(element) || (mobile.test(value));
}, "请正确填写座机号码");


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
$("#btn-cancel").on('click',function(){
    
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})