
   if (window.top !== window.self) {
    window.top.location = window.location;
} 
    
    $(document).ready(function (){
        $("#login").on('click', function (){
            $("#signupForm").submit();
        });
        validateRule();
    });

    $.validator.setDefaults({  
        submitHandler: function (){  
            login();
        }
    });

    function iFrameHeight() {
           var ifm= document.getElementById("iframepage");       
           var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;         
          if(ifm != null && subWeb != null) {            
                 ifm.height = subWeb.body.scrollHeight+100;          
                 ifm.width = subWeb.body.scrollWidth;      
             }     
     }
    var counterror = 1;
    var verifyCode
    function login(){
        if (counterror > 3) {
            $("#imageDiv").show();
            var code = $('#imageCode').val();
            if (verifyCode) {
                var res = verifyCode.validate(document.getElementById("imageCode").value);
                if (code == null || code == ''){
                    parent.layer.msg("请输入验证码");
                    return;
                }
                if (res) {

                }
                else {
                    parent.layer.msg("验证码错误");
                    $('#imageCode').val('');
                    return;
                }
            } else {
                verifyCode = new GVerify("v_container");
            }
        }
        $.ajax({
            type: "POST",
            url: share+'/login',
            data: $('#signupForm').serialize(),
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (r) {
                //console.log(r,'login登录页面')
                if (r.code == 200) {
                    // var index = layer.load(1, {
                    //     shade: [0.1, '#fff'] //0.1透明度的白色背景
                    // });
                    parent.location.href = '/index.html';
                    // $(window).attr('location','./index')
                } else {
                    counterror++;
                    layer.msg(r.msg);
                }
            },
        });
    }

    function validateRule() {
        var icon = "<i class='fa fa-times-circle'></i> ";
        $("#signupForm").validate({
            onfocusout: function (element) {
                $(element).valid();
            },
            rules: {
                username: {
                    required: true,
                    isMobile: true,
                },
                password: {
                    required: true
                }
            },
            messages: {
                username: {
                    required: icon + "请输入您的用户名",
                    isMobile: icon + "请输入正确的手机号或邮箱",
                },
                password: {
                    required: icon + "请输入您的密码",
                }
            }
        })

    }

    /**登录：回车键登录*/
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            validateRule();
        }
    });

    //手机号码验证
    jQuery.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
            // /^[1][3,4,5,7,8][0-9]{9}$/  
        var mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return this.optional(element) || (mail.test(value) || mobile.test(value));
    }, "请正确输入手机号或邮箱");