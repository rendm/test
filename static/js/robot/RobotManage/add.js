

$(function () {
    load_shop();
    load_developer();



   //取消按钮点击
    $('#adddanger').on('click', function () {
        //window.parent.location.href = "./RobotManage.html";
        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        parent.layer.close(index);
    });

    //返回
    $("#base_return").on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
        parent.layer.close(index);
    })







    validateRule();

});


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

//确定按钮点击
$("#addok").on('click',function(e){

    //alert($("#manufactureTime").data("datetimepicker").getDate());
    //alert($("#manufactureTime").find("input").val());
    //console.log('你好这里是增加提交键');

    if (!$("#signupFormadd").valid()) {
        return false; //验证不通过，不允许提交
    }

    var t_str=$("#manufactureTime").find("input").val();
    var add_info=$("#signupFormadd").serializeObject();
    var t_hsm=getNowFormatDate(t_str,1);
    add_info.manufactureTime=t_hsm;

    add_obj.developerid=$('.rele1').attr('genid');  //开发者
    add_obj.shopmanagerid=$('#customerid').attr('genid');  //用户账号

    add_info.isActive=0;      //是否激活默认为未激活

    var jsonStr = JSON.stringify(add_info); //json字符串

    //var jsonStr = JSON.stringify($("#signupFormadd").serializeObject()); //json字符串
    //console.log('机器人设置页面取值');
    //console.log(jsonStr);

    $.ajax({
        type : "post",
        url : share+"/irobotweb/sys/robot/add",
        data :jsonStr,// 你的formid
        crossDomain: true,
        async:false,
        dataType:"json",
        contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        error : function(request) {
            parent.layer.alert("Connection error");
        },
        success : function(data) {
            //console.log(data,'增加之后返回的字段');
    		if (data.code == 200) {
                //layer.alert("添加成功！")
                //window.parent.location.href = "./RobotManage.html"
    		}

            if(data.code == 200){
                parent.layer.alert("添加成功",function () {
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
});

//取消按钮点击
$('#adddanger').on('click', function () {
    //window.parent.location.href = "./RobotManage.html";
    var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    parent.layer.close(index);
});

//alert(share+'/irobotweb/sys/user/query/shop');


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
            //json.forEach(function(item){
                //op +='<option value="'+item.developerid+'">'+item.name+'</option>';
            //});
            $("#developerId").append(op);
        }
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
            //json.forEach(function(item){
                //oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
            //});
            $("#shopId").append(oph);
        }
    });
}


//验证方法
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupFormadd").validate({
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


// layer.alert("<em style='color:red'>" + "添加成功！", {icon: 1}, function () {
//     window.parent.location.reload(); //刷新页面
// })


/** 主键  id **/
// private String id;

// /**   robot_name **/
// private String robotName;

// /** 设备号  device_no **/
// private String deviceNo;

// /** 硬件地址  hardwear_no **/
// private String hardwearNo;

// /** 类型id  type_no **/
// private String typeNo;

// /** 出厂时间  manufacture_time **/
// private Date manufactureTime;

// /** 制造商  manufacture **/
// private String manufacture;

// /** 状态  status **/
// private Integer status;

// /**   initial_operator_time **/
// private Date initialOperatorTime;

// /**   sn_no **/
// private String snNo;

// /** 是否激活，0，未激活，1激活  is_active **/
// private String isActive;

// /**   developer_name **/
// private String developerName;

// /**   developer_id **/
// private String developerId;

// /**   shop_name **/
// private String shopName;

// /**   shop_id **/
// private String shopId;

// /**   create_time **/
// private Date createTime;

// /**   create_user_id **/
// private String createUserId;

// /**   create_user_name **/
// private String createUserName;

// /**   update_time **/
// private Date updateTime;

// /**   update_user_id **/
// private String updateUserId;

// /**   update_user_name **/
// private String updateUserName;