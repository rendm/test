
validateRule() 
//可用任务  任务模板 
    $.ajax({
        url: share+'/irobotweb/sys/taskmodel/query/list',
        type: "get",
        dataType: "jsonp",
        jsonpCallback: "success_jsonpCallback",
        //cache: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(json){
            console.log(json.rows,'人物序列显示')
            var taskmode = json.rows;
            console.log('哈喽的呀就是')
            //taskModeId   id
            //taskName     显示的名儿
            var oph = '';
            taskmode.forEach(function(items){
                oph+='<li taskModeId="'+items.taskModeId+'" >'+items.taskName+'</li>'
            })
            $("#bar").html(oph)
        }
    })


//开发者
$.ajax({
    url: share+'/irobotweb/sys/user/query/developer',
    type: "get",
    // dataType: "json",
    // contentType:"application/json; charset=utf-8",
    //cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function(json){
        console.log(json,'开发者name')
        var op = '';
        var data = json.data;
        data.forEach(function(item){
            console.log(item.name)
            op +='<option value="'+item.developerid+'">'+item.name+'</option>';
        })
        $("#developerName").html(op)
    }
})
//
//店铺
$.ajax({
    url: share+'/irobotweb/sys/user/query/shop',
    type: "get",
    //cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function(json){
        console.log(json,'店铺shopName')
        var oph = '';
        var data = json.rows;
        data.forEach(function(item){
            oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
        })
        $("#shopName").html(oph)
    }
})
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
$("#ok").on('click',function(e){
    // /irobotweb/sys/taskserial/add
    //执行的任务
    var arr= [];
    for(var i = 0;i<$("#foo li").length;i++){
    //var textcontent = $("#foo li").eq(i).text();
    var textcontent ={
        taskIdx:i,
        taskModeId:$("#foo li").eq(i).attr("taskModeId"),
        taskModeName:$("#foo li").eq(i).text()
    }
    console.log(i);
    arr.push(textcontent)
    }
    var jsonstring = {
        "shopid":$("#shopName").val(),//店铺id
        "shopname":$("#shopName").find("option:selected").text(),//店铺name
        "developerid":$("#developerName").val(),//开发者id
        "developername":$("#developerName").find("option:selected").text(),//开发者name
        "taskSerialName":$("#taskSerialName").val(),//任务模板名称
        "proprity":$("#proprity").find("option:selected").text(),//任务类型id
        "remark":$("#username").val(),//任务序列描述
        "taskSerialDetailsDOList":arr
    }
    var jsonStr = JSON.stringify(jsonstring); //json字符串
    console.log(jsonstring,'全部数据')
    //  /irobotweb/sys/taskmodel/add
    if($("#taskSerialName").val() == '' || $("#username").val() == '')return;//
    $.ajax({
        type: "POST",
        url: share + "/irobotweb/sys/taskserial/add",
        data:jsonStr,// 你的formid//所有input框 里面的值
        crossDomain: true,
        //dataType:"json",
        contentType:"application/json; charset=utf-8",  
        xhrFields: {
            withCredentials: true
        },
        error: function (request){
            parent.layer.alert("Connection error");
        },
        success: function(data){
            console.log(data, 'ajax的请求保存返回')
            if(data.code==200){
                parent.layer.msg("添加成功");
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index);
            }else{
                
            }
        }
    });
    console.log(arr)
    e.preventDefault()
})
$("#danger").on('click',function(){
    parent.location.reload(); 
})
//任务序列校验
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            taskSerialName:{
                required: true, //任务序列名称必填
            },
            username: {
                required: true //任务描述
            },
        },
        messages: {
            taskSerialName:{
                required: icon + "请输入任务序列名称"
            },
            username: {
                required: icon + "请输入任务描述" 
            },
        }
    })
}