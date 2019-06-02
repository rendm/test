$(document).ready(function () {
    var showid = sessionStorage.getItem("showid")
//   /irobotweb/sys/task/query/ids
// /irobotweb/sys/task/query/ids
 console.log(showid)
 setTimeout(function(e){
    $.ajax({
        url: share+'/irobotweb/sys/taskserial/query/ids?taskserialid='+showid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function(data){
            var showdata = data.data;
            console.log(showdata,'详情内容任务序列')
            //$('#developerName option').attr('selected', false)
            //$("#developerName option:contains('2')").attr("selected","selected");
            //开发者   developername
            //店铺  shopname
            //任务序列名称 taskSerialName
            //任务序列优先级 proprity
            //任务描述  remark
            //任务执行序列  list
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
            //任务执行序列    taskSerialDetailsDOList
           
            var ps = '';
            var spans ='';
            showdata.taskSerialDetailsDOList.forEach(function(items,index){
                if(index==showdata.taskSerialDetailsDOList.length-1){
                    spans='<p class="text">'+items.taskModeName+'</p>'
                }else{
                    ps +=' <p class="text">'+items.taskModeName+'</p>'+
                    '<div class="imgs">'+
                        '<span class="iconfont icon-xiangxiajiantou"></span>'+
                    '</div>'
                }
                
            })
            $("#execution-s").html(ps+spans)
        },
        error: function (request){
            layer.alert("Connection error");
        },
    });
  
 },0)
   
});

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
        // var oph = '';
        // json.forEach(function(item){
        //     console.log(item.shopName)
        //     oph +='<option value="'+item.shopId+'">'+item.shopName+'</option>';
        // })
        // $("#shopName").html(oph)
    }
})


// createTime
// :
// "2019-01-02 10:25:28"
// createUserId
// :
// null
// createUserName
// :
// null
// developerid
// :
// null
// developername
// :
// null
// genid
// :
// null
// proprity
// :
// null
// remark
// :
// null
// remark0
// :
// null
// remark1
// :
// null
// remark2
// :
// null
// remark3
// :
// null
// remark4
// :
// null
// robotId
// :
// null
// robothardwareno
// :
// null
// robotname
// :
// null
// shopid
// :
// null
// shopname
// :
// null
// status
// :
// null
// taskSerialDetailsDOList
// :
// Array(4)
// taskSerialId
// :
// 9
// taskSerialName
// :
// "123"
// updateTime
// :
// null
// updateUserId
// :
// null
// updateUserName
// :
// null