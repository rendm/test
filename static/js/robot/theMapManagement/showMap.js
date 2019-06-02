$().ready(function() {

    var mapid=getQueryString('mapid');
    var type=getQueryString('type');
    //alert(mapid);

    $.ajax({
        url: share+'/irobotweb/sys/map/get?mapid='+mapid,
        crossDomain: true,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data){
            console.log(data,'这是显示的')
            var datajson = data.data;

            if(type==0){
                document.getElementById('mapfile').setAttribute('src', 'data:image/png;base64,' + datajson.mapfile);
            }else{
                document.getElementById('mapfile').setAttribute('src', 'data:image/png;base64,' + datajson.showMapFile);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        }
    });

});

//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}