
$().ready(function () {
    //var personalAuthDO = [[${personalAuthDO}]];
//http://192.168.1.11:9090/irobotweb/account/getPersonalAuthDO
    $.ajax({
            url: share+'/irobotweb/account/getPersonalAuthDO',
            type: "get",
            dataType: "json",
            cache: false,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                
            },
            success: function (json) {
                var personalAuthDO = json;

                if (personalAuthDO != null) {

                    if (personalAuthDO.isCheck == "Y" && personalAuthDO.isPass == "N") {

                        $("#textmsg").html("您提交的证件未通过审核，请联系管理员查看原因，或重新上传。");
                    }else {
                        $("#name").attr("value", personalAuthDO.realName);
                        var cardType = personalAuthDO.cardtype; 
                        if (cardType==1){
                            $("option[value='1']").attr("selected",true);
                        }
                        $("#number").attr("value", personalAuthDO.cardnumber);
                        $(":input").attr("disabled", "disabled");
                        $(":input").addClass("mydisabled");
                        $("#uploadimage").css("display", "none");
                        $('#d-ex').css("display", "none");
                        $("#buttons").css("display", "none");

                        if(personalAuthDO.isCheck=="N"){
                            $("#textmsg").html("您已提交了个人验证信息，我们将在1~2个工作日内对您的身份进行审核，请耐心等待。");
                        }else{
                            if(personalAuthDO.isPass=="Y"){
                                $("#textmsg").html("您已通过个人实名认证。");
                                $("#textmsg").css("color","green");
                                $('#d-ex').css("display", "none");
                            }   
                        }
                    }
                }
            }
        });

    hiddenimg1();
    hiddenimg2();
});

var prefix = "irobotweb/account";
var idCardFormData = new FormData();//身份证FormData
var frontnum =0;//证件正面
var reverse= 0;//正面反面
$(document).ready(function () {
    $("#auth").on('click', function () {
        // $("#signupForm").submit();
    });
    validateRule();
});

$.validator.setDefaults({
    submitHandler: function () {
        auth();
    }
});

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

//提交认证
function auth() {
    //验证附近是否上传
    var is_files_select=idCardFormData.get('files');
    if(is_files_select==null || is_files_select==''){
        parent.layer.msg('请上传完整的附件!');
        return;
    }
    if(frontnum !==1 || reverse !==1){
        layer.msg('请上传完整的附件!');
        return;
    }
    var jsonStr = JSON.stringify($("#authForm").serializeObject());
    //var formData = new FormData();
    //var files = $("input[name='files']");

    //$("input[name='files']").each(function (j, item) {
    //});

    //formData.append('authDO', new Blob([jsonStr],
        //{
            //type: "application/json"
       // }
    //));

    idCardFormData.append("realName", $("#name").val());    //姓名
    idCardFormData.append("cardnumber", $("#number").val());//证件号码
    idCardFormData.append("cardtype", $("#type").val());    //证件类型
    //console.log(idCardFormData,'chuanshudeshuju1')
    $.ajax({
        url: share+prefix+"/upload/personalauth",
        crossDomain: true,
        contentType: false,
        processData: false,
        async: false,
        type: "POST",
        dataType: 'JSON',
        //contentType: "multipart/form-data",
            xhrFields: {
                withCredentials: true
            },
        data: idCardFormData,//FormData数据
        success: function (data) {
            //alert(data.code);
            if (data.code==0) { layer.alert("<em style='color:red'>" + "提交审核成功！", {icon: 1}, function () {
                    window.location.reload(); //刷新页面
                })
            } else {
                window.location.reload(); //刷新页面
                //alert(data.msg);
            }
        }
    });

}

//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#authForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            realName: {
                required: true,
            },
            cardtype: {
                required: true,
            },
            cardnumber: {
                required: true,
                checkIdcard: true
            }

        },
        messages: {
            realName: {
                required: icon + "请输入身份证姓名",

            },
            cardtype: {
                required: icon + "请选择证件类型",

            },
            cardnumber: {
                required: icon + "请输入身份证号码",
                checkIdcard: icon + "请输入合法的身份证号码",
            }
        }
    })
}
//身份证正面 选择后触发
function changepic(){
    $("#prompt3").css("display", "none");
    var reads = new FileReader();
    f = document.getElementById('file').files[0];
    //alert(idCardFormData);
    //debugger
    idCardFormData.append('files',f);//追加至FormData
    reads.readAsDataURL(f);
    reads.onload = function (e) {
        //alert(222);
        document.getElementById('img3').src = this.result;
        $("#img3").css("display", "block");
        parent.layer.msg("添加成功");
        frontnum = 1;
    };
}
//身份证背面 选择后触发
function changepic2(){
    $("#prompt32").css("display", "none");
    var reads = new FileReader();
    f = document.getElementById('file2').files[0];
    idCardFormData.append('files', f);//追加至FormData
    reads.readAsDataURL(f);
    reads.onload = function (e){
        document.getElementById('img32').src = this.result;
        $("#img32").css("display", "block");
        parent.layer.msg("添加成功");
        reverse = 1;
    }
}

function showImg1(argument){
    
    $("#img3").css("display", "none");
    $("#prompt3").css("display", "block");
}

function showImg2(argument) {
    
    $("#img32").css("display", "none");
    $("#prompt32").css("display", "block");
}

function hiddenimg1(){

    var src = $("#img3").attr("src");
    if (src != "#"){
        $("#img3").css("display", "block");
        $("#prompt3").css("display", "none");
    }

}

function hiddenimg2() {
    var src = $("#img32").attr("src");
    if (src != "#") {
        $("#img32").css("display", "block");
        $("#prompt32").css("display", "none");
    }
}

var showErrMsg = "请输入合法的身份证！";
jQuery.validator.addMethod("checkIdcard", function (value, element, param) {
    var idcard = value;
    if (idcard == "") {
        return true;
    }
    var regex1 = /^[1-9][0-7]\d{4}((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))\d{3}(\d|X|x)?$/;

    /*身份号码位数及格式检验*/
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                var regex2 = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
            } else {
                var regex2 = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
            }
            if (regex2.test(idcard))
                return true;
            else
                return false;
            break;
        case 18:
            if (regex1.test(idcard)) {
                var S = (parseInt(idcard[0]) + parseInt(idcard[10])) * 7 + (parseInt(idcard[1]) + parseInt(idcard[11])) * 9 + (parseInt(idcard[2]) + parseInt(idcard[12])) * 10 + (parseInt(idcard[3]) + parseInt(idcard[13])) * 5 + (parseInt(idcard[4]) + parseInt(idcard[14])) * 8 + (parseInt(idcard[5]) + parseInt(idcard[15])) * 4 + (parseInt(idcard[6]) + parseInt(idcard[16])) * 2 + parseInt(idcard[7]) * 1 + parseInt(idcard[8]) * 6 + parseInt(idcard[9]) * 3;
                var Y = S % 11;
                var M = "F";
                var JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                /*判断校验位*/
                if (M == idcard[17].toUpperCase()) {
                    //alert(Errors[0]+"18");
                    return true;
                } else {
                    //alert(Errors[3]);
                    //showErrMsg = Errors[3];
                    return false;
                }
            } else {
                return false;
            }
            break;
        default:
            //alert(Errors[1]);
            //showErrMsg = Errors[1];
            return false;
    }
}, jQuery.validator.format(showErrMsg));

$(".btn-cancel").on('click',function(){
    //alert(555);
    //身份正正面
    $("#prompt3").css("display", "block");
    document.getElementById('img3').src = '../../static/img/idcard_0.png';
    $("#img3").css("display", "none");

    //身份证背面
    $("#prompt32").css("display", "block");
    document.getElementById('img32').src ='../../static/img/idcard_1.png';
    $("#img32").css("display", "none");
    idCardFormData=new FormData();
})