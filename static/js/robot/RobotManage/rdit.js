var  editid = sessionStorage.getItem('editid');//点击传过来的id

//页面加载
$(function () {
    load_shop();
    load_developer();
    load_data();
    validateRule();

});

//加载页面数据
function load_data(){
    $.ajax({
        url: share+'/irobotweb/sys/robot/query/ids?robotid='+ editid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {

            console.log('机器人设置信息');
            console.log(data.data);

            var showdata = data.data;
            $("#hardwearNo").val(showdata.hardwearNo);//机器人硬件地址
            $("#robotName").val(showdata.robotName);  //机器人名称
            //$("#deviceName").val(showdata.deviceName);
            $("#typeNo").val(showdata.typeNo);       //机器人型号
            //$("#manufactureTime").val(showdata.manufactureTime);
            $("#manufactureTime").find("input").val( getNowFormatDate(showdata.manufactureTime,0));//机器人出厂日期
            $("#remark1").val(showdata.remark1);     //备注
            $("#id").val(editid);                    //机器人编号

            //alert(showdata.shopId);
            //alert(showdata.developerId);
            //alert(showdata.shopName);
            //alert(showdata.developerName);
            $("#shopId").val(showdata.shopId);          //所属店铺
            //$("#shopId option:contains('"+showdata.shopName+"')").attr("selected",true);
            $("#developerId").val(showdata.developerId);//所属开发者
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}

//店铺下拉框加载
function load_shop() {
    $.ajax({
        url: share+'/irobotweb/sys/user/query/shop',
        type: "get",
        async : false,
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            var oph = '';
            json.forEach(function(item){
                oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
            });
            $("#shopId").append(oph);
        }
    });
}

//所属开发者下拉框加载
function load_developer() {
    $.ajax({
        url: share+'/irobotweb/sys/user/query/developer',
        type: "get",
        async : false,
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            var op = '';
            json.forEach(function(item){
                op +='<option value="'+item.developerid+'">'+item.name+'</option>';
            });
            $("#developerId").append(op);
        }
    });
}

//取消按钮点击
$('#danger').on('click', function () {
    window.parent.location.href = "./RobotManage.html";
});

//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) { $(element).valid(); },
        rules: {
            robotName: {
                required: true
            },
            hardwearNo: {
                required: true
            },
            typeNo: {
                required: true
            },
            manufactureTime: {
                required: true
            },
            shopId: {
                required: true
            },
            developerId: {
                required: true
            }

        },
        messages: {
            robotName: {
                required: icon + "请输入机器人名称"
            },
            hardwearNo: {
                required: icon + "请输入机器人硬件地址",
            },
            typeNo: {
                required: icon + "请输入机器人型号",
            },
            manufactureTime: {
                required: icon + "请输入机器人出厂日期",
            },
            shopId: {
                required: icon + "请输入所属店铺",
            },
            developerId: {
                required: icon + "请输入所属开发者",
            },
            /*fileUpload: {
                required: icon + "请上传资源文件",
            },*/
        }
    })
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

//确定提交
$('#ok').on('click',function(e){
    //console.log($('#signupForm').serialize());
    //alert($("#manufactureTime").find("input").val());

    if (!$("#signupForm").valid()) {
        return false; //验证不通过，不允许提交
    }


    var t_str=$("#manufactureTime").find("input").val();
    var update_info=$("#signupForm").serializeObject();
    var t_hsm=getNowFormatDate(t_str,1);
    update_info.manufactureTime=t_hsm;
    update_info.shopName=$('#shopId option:selected').text();
    update_info.developerName=$('#developerId option:selected').text();
    update_info.id=editid;
    var jsonStr = JSON.stringify(update_info); //json字符串

    //console.info('修改的信息');
    //console.info(jsonStr);

    $.ajax({
        type : "put",
        url : share+"/irobotweb/sys/robot/update",
        data :jsonStr,
        async : false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        error : function(request) {
            parent.layer.alert("Connection error");
        },
        success : function(data) {

            if(data.code == 200){
                parent.layer.alert("修改成功",function () {
                    window.parent.location.reload();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                });
            }
            else
            {
                layer.msg(data.msg);
            }
        }
    });
    e.preventDefault()
})
