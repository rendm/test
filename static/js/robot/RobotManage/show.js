//  /irobotweb/sys/robot/query/ids
var showid = sessionStorage.getItem('showid')
$.ajax({
    url: share+'/irobotweb/sys/robot/query/ids?robotid='+showid,
    crossDomain: true,
    type: "get",
    dataType: "json",
    xhrFields: {
        withCredentials: true
    },
    success: function (data) { 
       console.log(data.data)
       var showdata = data.data;
       $("#deviceNo").val(showdata.deviceNo);
       $("#robotName").val(showdata.robotName);
       $("#hardwearNo").val(showdata.hardwearNo);
       $("#typeNo").val(showdata.typeNo);
       $("#manufactureTime").val(showdata.manufactureTime);
       $("#shopName").val(showdata.shopName);
       $("#developerName").val(showdata.developerName);
       $("#remark1").val(showdata.remark1);
       $("#id").val(showid);
       //console.log(showdata.deviceNo,'硬件地址')
       console.log(showdata.robotName,'机器人名称')
       console.log(showdata.hardwearNo,'硬件地址')
       console.log(showdata.typeNo,'机器人型号')
       console.log(showdata.manufactureTime,'出场时间')
       console.log(showdata.shopName,'店铺名称')
       console.log(showdata.developerName,'开发者')
       console.log(showdata.remark,'备注')
       console.log(showid,'id')
    },
    error: function (request) {
        layer.alert("Connection error");
    },
});

// createTime
// :
// null
// createUserId
// :
// null
// createUserName
// :
// null
// developerId
// :
// null
// developerName
// :
// null
// deviceNo
// :
// "100-1003"
// hardwearNo
// :
// "03:00:00:00:00:00"
// id
// :
// "43eae0c0ddc44bddb749d1b2f43bd9f9"
// initialOperatorTime
// :
// null
// isActive
// :
// "1"
// manufacture
// :
// null
// manufactureTime
// :
// "2018-03-29 16:00:00"
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
// robotName
// :
// null
// shopId
// :
// null
// shopName
// :
// null
// snNo
// :
// null
// status
// :
// 1
// typeNo
// :
// "E3630UT"
// updateTime
// :
// null
// updateUserId
// :
// null
// updateUserName
// :
// null