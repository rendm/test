//window.location.reload() 
     var UserDo;
     load();

    function load(){
       
          var userJsonStr = sessionStorage.getItem('user');
          var user = JSON.parse(userJsonStr);
                //console.log('安全设置加载的数据',user);
                //console.log(json.data);


          //u114  创建AccessKey的权限提供给开发者管理员
           if(user.roleId==2){
               $('#u114').show();
               //实名认证后 可以创建AccessKey

               if(user.isperosnalauth=='Y' || user.isenterpriseauth=='Y'){
                   $('.s-create').addClass('cursor');
               }else{
                   $('.s-create').removeClass('cursor');
               }
           }
           else{
               $('#u114').hide();
           }

            $('#uerid').val(user.genid);
            //$('#username').val(json.data.name); //改成了登录账号了

                if(user.mobile!='' && user.mobile!=null){
                    $('#username').val(user.mobile);
                }
                else{
                    $('#username').val(user.email);
                }
            var UserDo = user;
            var phone =UserDo.mobile;
            var email =UserDo.email;

            $.ajax({
                url: share+'/irobotweb/sys/userclientid/query/id/'+user.genid,
                type: "get",
                dataType: "json",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                error:function (data) {
                    $(".create").show();
                    $(".amphibious").hide();
                },
                success: function (json) {
                    //console.log('json数据',json);

                    $("#ClientId").val(json.clientId);
                    $("#ClientSecret").val(json.clientSecret);

                    // $("#ClientId").text(json.clientId);
                    // $("#ClientSecret").text(json.clientSecret);

                    //alert(111);

                    var qwee = $("#ClientSecret").val();

                    if($("#ClientSecret").val() !== ""){
                        //alert(666);
                        $("#create").hide();
                        $('.create').hide();
                        $("#userinfotwo").show();
                        $("#amphibious").show();
                        $(".amphibious").show();
                    }else{
                        $("#create").show();
                        $(".create").show();
                        $("#amphibious").hide();
                        $(".amphibious").hide();
                    }
                }
            });

        //changepwd
        var changepwdhtml = '<i class="fa fa-check-circle"></i>';
        changepwdhtml = changepwdhtml +"<span>已设置</span>";
        changepwdhtml = changepwdhtml +"<span>&nbsp;|&nbsp;</span>";
        changepwdhtml = changepwdhtml +"<span ><a style='color: blue;' href='./resetpwd.html'>修改</a></span>";
        $("#changepwd").html(changepwdhtml);

            if (phone!=null ){
                var phonetext = "您已绑定了手机"+  regMobile(phone)+"您的手机号可以直接用于登录、找回密码等。";
                $("#phone").html(phonetext);
                var phoneinnerhtml = '<i class="fa fa-check-circle"></i>';
                phoneinnerhtml = phoneinnerhtml +"<span>已绑定</span>";
                phoneinnerhtml = phoneinnerhtml +"<span>&nbsp;|&nbsp;</span>";
                phoneinnerhtml = phoneinnerhtml +"<span ><a style='color: blue;' href='./resetphone.html'>修改</a></span>";
                    $("#changephone").html(phoneinnerhtml);
            }else{
                var phonetext = "您还未绑定手机，您的手机号可以直接用于登录、找回密码等"; 
                $("#phone").html(phonetext);
                var phoneinnerhtml = '<i class="fa fa-exclamation-circle"></i>';
                phoneinnerhtml = phoneinnerhtml +"<span><a href='./resetphone.html'>未绑定</a></span>";
                phoneinnerhtml = phoneinnerhtml +"<span>&nbsp;|&nbsp;</span>";
                phoneinnerhtml = phoneinnerhtml +"<span ><a  style='color: blue;' href='./resetphone.html'>修改</a></span>";
                $("#changephone").html(phoneinnerhtml);
            }
        
        if (email!="" && email!=null && email!="null" ){
                var mailtext = "您已绑定了邮箱"+  regEmail(email)+"您的邮箱可以直接用于登录、找回密码等";
                $("#email").html(mailtext);
                var emailinnerhtml = '<i class="fa fa-check-circle"></i>';
                emailinnerhtml = emailinnerhtml +"<span>已绑定</span>";
                emailinnerhtml = emailinnerhtml +"<span>&nbsp;|&nbsp;</span>";
                emailinnerhtml = emailinnerhtml +"<span  ><a  style='color: blue;' href='./resetemail.html'>修改</a></span>";
                $("#changeemail").html(emailinnerhtml); 
                console.log(emailinnerhtml)
            }else{
                var mailtext = "您还未绑定邮箱，[您的邮箱可以直接用于登录、找回密码等]。"; 
                $("#email").html(mailtext);
                var emailinnerhtml = '<i class="fa fa-exclamation-circle"></i>';
                emailinnerhtml = emailinnerhtml +"<span><a href='./resetemail.html'>未绑定</a></span>";
                emailinnerhtml = emailinnerhtml +" <span>|</span>";
                emailinnerhtml = emailinnerhtml +"<span><a style='color: blue;' href='./resetemail.html'>&nbsp;修改</a></span>"; 
                $("#changeemail").html(emailinnerhtml); 
                //console.log(emailinnerhtml)
            }
}



   
    // 替换邮箱字符
    function regEmail(email){
        if (String(email).indexOf('@') > 0) {
            var str = email.split('@'),
                _s = '';
            if (str[0].length > 3) {
                for (var i = 0; i < str[0].length - 3; i++) {
                    _s += '*';
                }
            }
            var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
        }
        return new_email;
    }

    // 替换手机字符
    function regMobile(mobile) {
        if (mobile.length > 7) {
            var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
        }
        return new_mobile;
    }


$.ajax({
    url: share+'/irobotweb/account/getPersonalAuthDO',
    type: "get",
    cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function (json) {
        //console.log('asdgjhasdhdaga加速卡了的离开大家忽略掉阿里肯定会',json+'json');
        var personalAuthDO = json;
        if (personalAuthDO != '' && personalAuthDO != null){
            if (personalAuthDO.isCheck == "Y" && personalAuthDO.isPass == "N") {
                console.log("您提交的证件未通过审核，请联系管理员查看原因，或重新上传。");
            }else {
                if(personalAuthDO.isCheck=="N"){
                    console.log("您已提交了个人验证信息，我们将在1~2个工作日内对您的身份进行审核，请耐心等待。");
                }else{
                    if(personalAuthDO.isPass=="Y"){
                        console.log("您已通过个人实名认证。");
                    }   
                }
            }
        }else{
            console.log("请提交个人验证信息");
        }
    }
});


///创建秘钥成功
$(".create").on('click',function(){

    var userJsonStr = sessionStorage.getItem('user');
    var user = JSON.parse(userJsonStr);
    if(user.isperosnalauth!='Y' && user.isenterpriseauth!='Y'){ //认证后的用户才能创建
        return;
    }

    //  /irobotweb/sys/userclientid/add
    $.ajax({
        cache : true,
        type : "POST",
        url : share+"/irobotweb/sys/userclientid/add",
        data : {
           
        },// 你的formid
        async : false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        error : function(request) {
            parent.layer.alert("Connection error");  
        },
        success : function(data) {
            //console.log(data,'asjgakjsdgq')
            if(data.code == 0){
                //alert(333);
                parent.layer.msg(data.msg);
                $("#create").hide();
                $(".create").hide();
                $("#userinfotwo").show();

                //console.log('进入asjgakjsdgq',$("#create"))
                $("#amphibious").show();
                $(".amphibious").show();
                window.location.reload();
            }else{
                alert(555);
                parent.layer.msg(data.msg);
            }
        }
    });
});

//  /irobotweb/sys/userclientid/update  //修改// 0 启用  1 禁用
//status 禁言  del 删除 1
$("#status").on('click',function(){
    //console.log($("#status").text());
    if($("#status").text()== '禁用'){
        $.ajax({
            cache : true,
            type : "POST",
            url : share+"/irobotweb/sys/userclientid/update",
            data : {
                "status": "1",
                "delFlag": "0",
            },// 你的formid
            async : false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            error : function(request) {
                parent.layer.alert("Connection error");  
            },
            success : function(data) {
                //console.log(data,'asjgakjsdgq');
                // parent.layer.msg("更新成功");
                if(data.code == 0){
                    parent.layer.msg(data.msg);
                    $("#userinfotwo").hide()
                    $("#status").text('启用')
                    // window.location.reload()
                }else{
                    parent.layer.msg(data.msg);
                }
            }
        });
    }else{
        $.ajax({
            cache : true,
            type : "POST",
            url : share+"/irobotweb/sys/userclientid/update",
            data : {
                "status": "0",
                "delFlag": "0",
            },// 你的formid
            async : false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            error : function(request) {
                parent.layer.alert("Connection error");  
            },
            success : function(data) {

                //console.log(data,'asjgakjsdgq')
                // parent.layer.msg("更新成功");
                if(data.code == 0){
                    $("#status").text('禁用')
                    $("#userinfotwo").show()
                    parent.layer.msg(data.msg);
                    // window.location.reload()
                }else{
                    parent.layer.msg(data.msg);
                }
            }
        });
    }
   
});


$("#del").on('click',function(){
    //console.log($("#del").text())
        $.ajax({
            cache : true,
            type : "POST",
            url : share+"/irobotweb/sys/userclientid/update",
            data : {
                "delFlag": "1",
                "status": "0",
            },// 你的formid
            async : false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            error : function(request) {
                parent.layer.alert("Connection error");  
            },
            success : function(data) {
                //console.log(data,'asjgakjsdgq')
                // parent.layer.msg("更新成功");
                if(data.code == 0){
                    parent.layer.msg(data.msg);
                    $("#userinfotwo").hide();
                    $("#create").show();
                    $(".create").show();
                    $("#amphibious").hide();
                    $(".amphibious").hide();
                }else{
                    parent.layer.msg(data.msg);
                }
            }
        }); 
});


