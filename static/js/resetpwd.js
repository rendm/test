
var genid;
var userJsonStr = sessionStorage.getItem('user');
var user = JSON.parse(userJsonStr);

$(document).ready(function (){
    $("#gid").val(user.genid)
    $("#notarize").on('click', function () {   //点击确定
    });
    validateRule();
});
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
    $("#notarize").on('click',function(e){
    //var jsonStr = JSON.stringify($("#signupForm").serializeObject());
    var jsonStr = {"gid":$("#gid").val(),"oldpwd":$("#oldpwd").val(),"newpwd":$("#newpwd").val()}

        if(!$("#signupForm").valid()){
            return;
        }

    $.ajax({
        url:share+'irobotweb/account/securitysetting/updatepwd/gid',
        crossDomain: true,
        method:'post',
        data:jsonStr,
        dataType:'json',
        //header:{"Access-Control-Allow-Origin":"*"},
        xhrFields: {
            withCredentials: true
        },
        success:function(res){
            if(res.code==200){
                layer.alert("<em style='color:green'>"+"重置密码成功！",function () {

                    window.open("./security_setting.html",'_self');
                })
            }
            else{
                layer.alert("<em style='color:red'>"+res.msg)
            }
        },
        error:function (data){
        }
    })
        e.preventDefault()
    })
 


//页面验证
  function validateRule() {
      var icon = "<i class='fa fa-times-circle'></i> ";
      $("#signupForm").validate({
          onfocusout: function (element) {
              $(element).valid();
          },
          rules: {
              oldpwd: {
                  required: true,
                  minlength: 6
              },
              newpwd: {
                  required: true,
                  minlength: 6,
              },
              newpwd2: {
                  required: true,
                  minlength: 6,
                  equalTo: "#newpwd"
              }
          },
          messages: {
              oldpwd: {
                  required: icon + "请输入您旧的密码",
                  minlength: icon + "密码不能少于6个字符"
              },
              newpwd: {
                  required: icon + "请输入新密码",
                  minlength: icon + "密码不能少于6个字符",

              },
              newpwd2: {
                  required: icon + "请输入确认密码",
                  minlength: icon + "密码不能少于6个字符",
                  equalTo: icon + "两次输入的密码不一致"
              }
          }
      })
  }