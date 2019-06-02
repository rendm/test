$(document).ready(function () {
    var editid = sessionStorage.getItem("editid")
//   /irobotweb/sys/task/query/ids
// /irobotweb/sys/task/query/ids
 console.log(editid)
 setTimeout(function(e){
    $.ajax({
        url: share+'/irobotweb/sys/taskserial/query/ids?taskserialid='+editid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function(data){
            var showdata = data.data;
            console.log(showdata,'详情内容')
            //$('#developerName option').attr('selected', false)
            //$("#developerName option:contains('2')").attr("selected","selected");
            //开发者   developername
            //店铺  shopname
            //任务序列名称 taskSerialName
            //任务序列优先级 proprity
            //任务描述
            //任务执行序列
            console.log(showdata.shopname,'店铺mingc1')
            console.log(showdata.developername,'开发者名称')
            //开发者
            $('#developerName option').attr('selected', false)
            $("#developerName option:contains('"+showdata.developername+"')").attr("selected","selected");
            //店铺
            $('#shopName option').attr('selected', false)
            $("#shopName option:contains('"+showdata.shopname+"')").attr("selected","selected");
            //任务序列名称
            $("#taskSerialName").val(showdata.taskSerialName)
            //任务序列优先级
            $('#proprity option').attr('selected', false)
            $("#proprity option:contains('"+showdata.proprity+"')").attr("selected","selected");
             //任务序列描述
             $("#username").val(showdata.remark)
             var lis = '';
             showdata.taskSerialDetailsDOList.forEach(function(items,index){
                lis +='<li taskModeId="'+items.taskModeId+'">'+items.taskModeName+'</li>'
             })
             $("#foo").html(lis)
            // var developerNameoption = '<option value="0">'+showdata.developerName+'</option>'
            // $("#developerName").html(developerNameoption);
            // var shopNameoption = '<option value="0">'+showdata.shopName+'</option>'
            // $("#shopName").html(shopNameoption);
            // $("#taskSerialName").val(showdata.taskSerialName);
            // var proprityoption = '<option value="0">'+showdata.proprity+'</option>'
            // $("#proprity").html(proprityoption);
            //  taskSerialName
        },
        error: function (request){
            layer.alert("Connection error");
        },
    });
   
 },0)
   
});
var idshow = sessionStorage.getItem("editid")
//开发者
$.ajax({
    url: share+'/irobotweb/sys/user/query/developer',
    type: "get",
    dataType: "json",
    //cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function(json){
        console.log(json,'开发者name')
        var op = '';
        json.forEach(function(item){
            console.log(item.name)
            op +='<option value="'+item.developerid+'">'+item.name+'</option>';
        })
        $("#developerName").html(op)
    }
})
//店铺
$.ajax({
    url: share+'/irobotweb/sys/user/query/shop',
    type: "get",
    dataType: "json",
    //cache: false,
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    },
    success: function(json){
        console.log(json,'店铺shopName')
        var oph = '';
        json.forEach(function(item){
            console.log(item.shopName)
            oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
        })
        $("#shopName").html(oph)
    }
})

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
        // var oph = '';
        // json.forEach(function(item){
        //     console.log(item.shopName)
        //     oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
        // })
        // $("#shopName").html(oph)
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
  function changesSave(arr){
    var jsonstring = {
        "taskSerialId":idshow,
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
    $.ajax({ 
        type: "put",
        url: share + "/irobotweb/sys/taskserial/update",
        data:jsonStr,// 你的formid//所有input框 里面的值
        crossDomain: true,
         dataType:"json",
         contentType:"application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },

        error: function (request) {
            parent.layer.alert("Connection error");
        },
        success: function (data){
            console.log(data, 'ajax的请求保存返回')
            if(data.code==200){
                //parent.location.reload(); 
            }else{
                
            }
        }
    });
  }
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
    changesSave(arr)
    e.preventDefault()
})


// code:500
// data:null
// msg:"JSON parse error: Unrecognized token 'shopid': was expecting ('true', 'false' or 'null'); nested exception is com.fasterxml.jackson.core.JsonParseException: Unrecognized token 'shopid': was expecting ('true', 'false' or 'null')↵ at [Source: (PushbackInputStream); line: 1, column: 8]"
// status:"500"