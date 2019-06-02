$(document).ready(function () {  //.ready()  文档加载完执行的代码
    // $("#register").on('click', function (){
    //     // $("#signupForm").submit();
    // });
    validateRule();
});

// $.validator.setDefaults({
//     submitHandler: function () {
//         save();
//     }
// });

//var verifyCode = new GVerify("v_container");
//json格式转换
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
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

//确定注册发送请求
$("#register").on('click', function () {
    //alert($(this).attr("checked"));
    //var res = verifyCode.validate(document.getElementById("code").value);//输入验证码  input框

    var res = document.getElementById("code").value;//输入验证码  input框
    if(!$("#signupForm").valid()){
        return;
    }
    if (res) {
        $.ajax({
            type: "post",
            url: share + "/register",
            data: JSON.stringify($('#signupForm').serializeObject()),// 你的formid  json字符串版本
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            async: false,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                //console.log(data,'点击注册返回');
                if (data.code == 0 || data.code==200) {
                    layer.alert("<em style='color:red'>" + "用户注册成功！", { icon: 1 }, function () {
                        parent.location.href= share;
                    });
                } else {
                    // layer.alert("<em style='color:red'>" + ""+data.msg+"！", { icon: 1 }, function () {
                    // });
                    //layer.msg("<em style='color:red'>" + ""+data.msg+"！");
                    layer.msg(data.msg);
                }
            },
            error:function (error){

            }
        });
    } else {
        parent.layer.msg("验证码错误");
        return false;
    }
})
//表格校验
function validateRule() {  //json字符串
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            mobile: {
                required: true,
                minlength: 11,
                isMobile: true,
                remote: {
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    url: share + "/irobotweb/sys/user/query/exist", // 后台处理程序
                    dataType: "json",
                    type: "post", // 数据发送方式
                    data: { // 要传递的数据
                        mobile: function () {
                            //return JSON.stringify($("#mobile").serializeObject());
                            return $("#mobile").val();
                        }
                    }
                }
            },
            password: {
                required: true,
                minlength: 6
            },
            pwd: {
                required: true,
                minlength: 6,
                equalTo: "#password"
            },

            code: {
                required: true
            },
            email: {
                required: true,
                email: true,
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
            checkbox: {
                isSelect: true
            }

        },
        messages: {
            mobile: {
                required: icon + "请输入您的手机号",
                minlength: icon + "手机号不能少于11个字符",
                isMobile: icon + "手机号码格式不正确",
                remote: icon + "该手机号码已经存在"

            },
            password: {
                required: icon + "请输入您的密码",
                minlength: icon + "密码不能少于6个字符"
            },
            pwd: {
                required: icon + "请输入确认密码",
                minlength: icon + "密码不能少于6个字符",
                equalTo: icon + "两次输入的密码不一致"
            },
            code: {
                required: icon+'请输入验证码'
            },
            email: {
                required: icon + "请输入您的邮箱",
                email: icon + "邮箱格式不正确",
                remote: icon + "邮箱已经存在"
            },
            checkbox: {
                required: icon + "请阅读并接受《英特雷真用户服务协议》",
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

//服务条款
jQuery.validator.addMethod("isSelect", function (value, element){
        //alert('条款');
        // alert($('#checkbox').attr("checked"));
        // alert($('#checkbox').val());
        //alert($('#checkbox').is(':checked'));

    //return this.optional(element) || $(this).not(':checked')
    return element.checked;
}, " 请选择同意协议!");

// $("#agreement").on('click',function(){
//     // iframe弹层
//     window.parent.layer.open({
//         type: 2,
//         title: '英特雷真用户服务协议',  
//         maxmin: true,
//         shadeClose: false, // 点击遮罩关闭层
//         area: ['800px', '520px'],
//         content: './service.html'
//     });
//     //console.log(document.domain)
//     //http://sentsin.com

//     // layer.open({
//     //     type: 2,
//     //     title: '添加店铺',
//     //     maxmin: true,
//     //     shadeClose: false, // 点击遮罩关闭层
//     //     area: ['1400px', '700px'],
//     //     content: './add.html' 
//     // });
// })
// 协议点击
$('#agreement').on('click',function(){
    parent.layer.open({
        type: 2,
        title: '英特雷真用户服务协议',
        maxmin: true,
        shadeClose: false, // 点击遮罩关闭层
        area: ['800px', '520px'],
        content: './service.html'
    });
})

$("#login").on('click', function (){
    //$("#iframepage", parent.document).attr('src', 'logintest');
    window.location.href = "./logintest.html";
});

//发送验证码
$("#gain").on('click',function(){
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        var phone = $.trim($('#mobile').val());
        var code=$.trim($('#code').val());

        if (phone == null || phone == '') {
            layer.msg("请输入手机号");
            return false;
        } else if (!phoneReg.test(phone)) {
            layer.msg('手机号码格式不正确！');
            return false;
        } else {
            var str = {
                "mobile":$('#mobile').val()
            }
            var jsonStr = JSON.stringify(str);  //json字符串
            console.log(jsonStr,str) //url: share+"/getCode",
            $.ajax({
                type: "POST",
                url: share+"/getCode",
                data: jsonStr,// 你的formid//所有input框 里面的值
                crossDomain: true,
                dataType:"json",
                contentType: "application/json; charset=utf-8",
                xhrFields: {
                    withCredentials: true
                },
                error: function (request) {
                    parent.layer.alert("Connection error");
                },
                success: function (data) {
                    settime();
                    //console.log('发送验证码');
                    //console.log(data);
                }
            });
        }
})


var countdown = 60;
function settime() {
    var val = $('#gain');
    if (countdown == 0) {
        val.attr("disabled",false);
        val.val ("获取验证码") ;
        countdown = 60;
        return false;
    } else {
        val.attr("disabled", true);
        val.val ("重新发送(" + countdown + ")") ;
        countdown--;
    }
    setTimeout(function () {
        settime(val);
    }, 1000);
}