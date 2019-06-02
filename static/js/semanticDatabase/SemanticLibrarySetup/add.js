// $("#save").on('click',function(){
//     var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
//     parent.layer.close(index);
// })



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



$("#save").on('click',function(e){
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
            if (data.code == 200  ||data.code ==0) {
                // window.parent.location.reload();
                parent.layer.alert("添加成功",function(){
                    // var index = parent.layer.getFrameIndex(window.name);
                    // parent.layer.close(index);
                    window.parent.location.reload();
                });
            }

        }
    });
    e.preventDefault()
})

//点击取消
$("#btn-cancel").on('click',function(){
    console.log('取消')
    //关闭ifram弹层
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
})
