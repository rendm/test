

var showidc = sessionStorage.getItem('customershowid');
var customer_edit_formData = new FormData(); //定义全局的FormData对象
customer_edit_formData.append("guestId", showidc);
var shop_id='',shop_name='';

//页面加载数据
function load() {
    $.ajax({
        url: share+'/irobotweb/sys/guest/query/ids?guestid='+showidc,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            var datajson = data.data;
            if (datajson.headFeaturePath != null  && datajson.headFeaturePath != '') {
                $('#uploadImg').attr('src',datajson.headImage);
            }else {
                $('#uploadImg').attr('src','../../../static/img/defaulthead.jpg');
            }


            $("#realName").val(datajson.realName)//顾客姓名
            $("#mobile").val(datajson.mobile)//手机号

            if(datajson.gender == 0){
                // $("#gender").val('女')//性别
                $('#gende option').attr('selected', false)
                $('#gende option[value=0]').attr('selected', true)
            }else{
                //$("#gender").val('男')//性别
                $('#gende option').attr('selected', false)
                $('#gende option[value=1]').attr('selected', true)
            }

            $("#email").val(datajson.email);//邮箱
            $("#shopName").val(datajson.shopName);//所属店铺
            $("#address").val(datajson.address);//详细地址
            $("#remark").val(datajson.remark);//备注

            $("#birthday").val(datajson.birthday);//生日


            //店铺id
            shop_id=datajson.shopId;
            //店铺名称
            shop_name=datajson.shopName;


            var province =datajson.provinceName;

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



        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}


$(function () {

    //$('#uploadImg').attr('src', share + '/irobotweb/account/query/headimage');
    //$('#uploadImg').attr('src', share + '/irobotweb/account/query/checkimage?pathkey='+img_url);

    loaddate($('#customer_birthday'));//加载日期控件
    
    load();



    //上传图像
    var file = $('#file'), aim = $('#aim');
    var file_allpath = $('#file').val();

    file.on('change', function (e) {
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历  
        var name = e.currentTarget.files[0].name;
        //aim.val(name);
        dataURL = windowURL.createObjectURL(e.currentTarget.files[0]);
        $('#uploadImg').attr('src', dataURL);//为图片控件赋值
        var theFile = e.currentTarget.files[0];
        customer_edit_formData.append('avatar_file', theFile);
        //customer_edit_formData.set('avatar_file', theFile);
        //console.log(customer_edit_formData.get("avatar_file"));
    });
        //手机号码验证
        // jQuery.validator.addMethod("isMobile", function (value, element) {
        //     var length = value.length;
        //     var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        //     return this.optional(element) || (length == 11 && mobile.test(value));
        // }, "请正确填写手机号码")
        $("#base_return").on('click',function(){
            //console.log('返回')
            //Window.href='./edit.html'
            window.parent.location.href = './customerManagement.html';
        });
    });



//将日期格式转换
function getNowFormatDate(t,f) {
    var date = new Date(t);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate='';
    if(f==1) //时分秒
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    }
    else
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }

    return currentdate;
}

//手机号码验证
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");

//点击取消
$("#btn-cancel").on('click',function(){
    console.log('取消')
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})