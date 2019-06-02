
$(document).ready(function () {
    validateRule();
});

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


$(function () {

    var editid = sessionStorage.getItem('shopeditid');
    var deviceDeveloperId='',shopmanagerId='',shopId='';

    //保存按钮
    $('#base_save').on('click', function () {
        
        if (!$("#basicInfoForm").valid()) {
            return;
        }

        //console.info('编辑页面保存的数据');
        //console.info($('#basicInfoForm').serialize());

        var data_obj={};

        //add_obj.developerid=$('.rele1').attr('genid');  //开发者
        //add_obj.shopid=$('#customerid').attr('genid');  //用户账号

        //所属开发者
        data_obj.deviceDeveloperId=deviceDeveloperId;
        //所属用户
        data_obj.shopmanagerId=shopmanagerId;
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
        //详细地址
        data_obj.address=$('#address').val();
        //状态
        data_obj.status=$("input[name='status']:checked").val();
        //主键shopId
        data_obj.shopId=shopId;

        //console.info('编辑页面保存的数据1');
        //console.info(data_obj);
        $.ajax({
            url: share + '/irobotweb/sys/shop/update',
            crossDomain: true,
            type: "PUT",
            xhrFields: {
                withCredentials: true
            },
            data: data_obj,    //$('#basicInfoForm').serialize(),
            success: function (data) {
                if (data.code == 200 || data.code == 0) {
                    parent.layer.msg("修改成功");
                    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                    parent.layer.close(index);

                    window.parent.refresh();



                } else {
                    parent.layer.alert(data.msg);
                }
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
    });
    //数据详情
    $.ajax({
        url: share + '/irobotweb/sys/shop/query/ids?shopid=' + editid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },

        success: function (data) {

            console.info('店铺编辑页面的数据');
            console.info(data.data);

            $("#shopName").val(data.data.shopName);
            $("#shopcontacts").val(data.data.shopcontacts);
            $("#mobile").val(data.data.mobile);
            $("#phone").val(data.data.phone);

            $("#address").val(data.data.address);          
            $("#industry").val(data.data.industry);
            $("#email").val(data.data.email);
            //$("#provinceName").val(data.data.provinceName);
            //$("#cityName").val(data.data.cityName);
            //$("#areaName").val(data.data.areaName);  

            var province =data.data.provinceName;

            if (province!=null && province.length>0 )
            {
                $("#datogg").distpicker('destroy');
                $('#datogg').distpicker({          //再初始化
                    province: data.data.provinceName,
                    city: data.data.cityName,
                    district: data.data.areaName
                });
            }

            else {
                $("#datogg").distpicker('destroy');
                $('#datogg').distpicker({
                    autoSelect: false
                });


            }


            $("#deviceDeveloperId").val(data.data.deviceDeveloperId);
            $("#parentShopId").val(data.data.parentShopId);
            $("#shopId").val(data.data.shopId);
            shopId=data.data.shopId;
            $("#shopmanagerId").val(data.data.shopmanagerId);

            if (data.data.status == true) {
                $("#delFlag1").attr("checked", 'checked');
            } else {
                $("#delFlag2").attr("checked", 'checked');
            }

            if(data.data.status == 0){ //禁用
                $("#forbidden").attr("checked",'checked');
            }else if(data.data.status == 1){  //正常
                $("#normal").attr("checked",'checked');
            }

            //所属开发者
            $('#developerid').val(data.data.developerName);
            deviceDeveloperId=data.data.deviceDeveloperId;
            //所属用户
            $('#customerid').val(data.data.shopuserName);
            shopmanagerId=data.data.shopmanagerId;

        },
    });

    /*("#cancel").on('click', function () {
        window.parent.location.reload();
    })*/
})
$("#btn-cancel").on('click',function(){
    console.log('取消')
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})
