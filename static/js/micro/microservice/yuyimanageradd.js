

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



$("#btn").on('click',function(e){
    var add_info=$("#signupForm").serializeObject();

    var jsonStr = JSON.stringify(add_info); //json字符串

    $.ajax({
        type : "put",
        url : share+"/irobotweb/speech/voicedb/add",
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
            console.log(data,'增加之后返回的字段')
            if (data.code == 200) {
                layer.alert("添加成功！")
                window.parent.location.href = "./yuyimanager.html";
            }

        }
    });
    e.preventDefault()
})
