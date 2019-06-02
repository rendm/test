
$().ready(function () {

    //  share+"/irobotweb/sys/resource/query/getresource/"+src
    var content ;
    var  type =sessionStorage.getItem('type');
    var httpurl =sessionStorage.getItem('url');

    if(type == "0"){
        content = '<img src="'+httpurl+ '" alt="" draggable="false">';
    }else if(type == "1"){
        content = '<embed  src="'+httpurl+ '" />';
    }else if(type == "2"){
        content ='<video src="'+httpurl+ '" controls="controls"> </video>'
    }else if(type == "3"){
        content =' <span>其他</span>'
    }

    $("#showimg").append(content)

});


