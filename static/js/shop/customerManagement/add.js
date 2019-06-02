$(document).ready(function () {


    loaddate($('#customer_birthday'));//加载日期控件

    $("#datogg").distpicker('destroy');
    $('#datogg').distpicker({
        autoSelect: false
    });


    validateRule();

});


var CLICKTAG = 0;

//店铺管理-顾客管理
$(function () {



    //点击保存

    $('#base_save').on('click', function () {

        if($(".shopinfo-c").val()==null || $(".shopinfo-c").val()==''){


            var errorhtml ='<label id="shopName-error" class="error" for="shopName"><i class="fa fa-times-circle"></i> 请选择店铺</label>';
            $("#shopName-error").remove() ;
            $("#shopline").append(errorhtml) ;
            return;
        }

        if (!$("#basicInfoFormadd").valid()) {
            return;
        }

        var obj = document.getElementById("file");

        var theFile = obj.files[0];

        if(theFile==null || theFile==''){
            var errorhtml ='<label id="file-error" class="error" for="file"><i class="fa fa-times-circle"></i> 请选择头像</label>';
            $("#file-error").remove() ;
            $("#uploadbtn").append(errorhtml) ;
            return;
        }



        if (CLICKTAG == 0) {
            CLICKTAG = 1;
            this.disabled=true;
            // 等待3s后重置按钮可用
            setTimeout(function () {
                CLICKTAG = 0 ;
                this.disabled=false;
                console.log("取消禁用");

            }, 3000);
        }




        var resource_formData = new FormData();


        resource_formData.append('avatar_file', theFile);

        //顾客姓名
        resource_formData.append("realName", $("#realName").val());
        //性别
        resource_formData.append("gender", $("#gende option:selected").val());

        resource_formData.append("shopId", $('#shopName').attr('genid'));
        resource_formData.append("shopName", $(".shopinfo-c").val());
        //手机
        resource_formData.append("mobile", $("#mobile").val());
        //邮箱
        resource_formData.append("email", $("#email").val());
        //所在地区-省份
        resource_formData.append("provinceName", $("#provinceName").val());
        //所在地区-城市
        resource_formData.append("cityName", $("#cityName").val());
        //所在地区-市区
        resource_formData.append("areaName", $("#areaName").val());
        //详细地址
        resource_formData.append("address", $("#address").val());
        //备注
        resource_formData.append("remark", $("#remark").val());
        //生日
        //var t_str=$("#customer_birthday").find("input").val();
        var customer_birthday = getdatetime($("#customer_birthday"),0);
        resource_formData.append("birthday", customer_birthday);

        $.ajax({
            cache: true,
            url: share + '/irobotweb/sys/guest/add',
            crossDomain: true,
            type: "POST",
            contentType: false,
            processData: false,
            async: false,
            dataType: 'JSON',
            xhrFields: {
                withCredentials: true
            },
            data: resource_formData,
            success: function (data) {
                console.info(resource_formData);
                console.log('保存返回的信息',data);
                //console.info(data);
                if (data.code == 0) {
                    parent.layer.msg(data.msg);
                    //window.parent.location.reload();
                } else {
                    //parent.layer.alert(data.msg);
                    parent.layer.alert(data.msg,function () {
                        window.parent.location.reload();
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                    });
                }
            },
            error: function (request) {
                layer.alert("Connection error");
            },
        });
    })

    //跳转到上传图片页面
    $('#test-upload-normal').on('click', function () {
        parent.layer.open({
            type: 2,
            title: '修改头像',
            fixed: false, //不固定
            maxmin: true,
            shadeClose: true,//是否模态窗口显示
            area: ['800px', '600px'],
            content: './uploadIMG.html'
        });
    })

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

        // var theFile = e.currentTarget.files[0];
        // resource_formData.append('avatar_file', theFile);
    });

    //返回
    $("#base_return").on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        parent.layer.close(index);
    })

    //显示店铺信息
    $('#s-shop').click(function () {

        establish('',$('.shopinfo-c'),0);


    });

//点击取消
    $("#btn-cancel").on('click',function(){
        console.log('取消')
        //关闭ifram弹层
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    })

});


//将日期格式转换
function getNowFormatDate1(t,f) {
    var date = new Date(t);
    console.info('初始时间');
    console.info(date);
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

        var str_date=date.getFullYear() + seperator1 + month + seperator1 + strDate;
        str_date = str_date.replace(/-/g, '/');

        var date=new Date(str_date);

        currentdate=date.setDate(date.getDate() + 1);
        console.info('转对象后');
        console.info(currentdate);
    }

    return currentdate;
}

//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";

    $("#basicInfoFormadd").validate({
        onfocusout: function(element) { $(element).valid(); },
        rules : {
            realName : {
                required : true
            },

            shopName : {
                required : true,
            },

            email : {
                email : true,
            },

            mobile : {
                minlength: 11,
                isMobile: true,
            },
            file: {
                required: true,
                checkSize: 3 * 1024 * 1024
            }
        },
        messages : {

            shopName:{
                required: icon + "请选择店铺"
            },

            realName:{
                required: icon + "请输入顾客姓名"
            },

            email : {
                email: icon + "请输入正确的邮箱格式"
            },

            mobile: {
                minlength: icon + "不能小于11个字符",
                isMobile: icon + "请正确填写手机号码",
            },
            file: {
                required: icon + "请上传头像",
            }

        }
    })
}

//手机号码验证
jQuery.validator.addMethod("isMobile", function (value, element){
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");


jQuery.validator.addMethod("checkSize", function (value, element, param) {
    var fileSize = element.files[0].size;
    if (fileSize > param) {
        return false;
    } else {
        return true;
    }
}, "请上传大小在3M一下的文件");



    