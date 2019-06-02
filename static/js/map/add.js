$().ready(function () {

});

function getCheckedRoles() {
    var adIds = "";
    $("input:checkbox[name=role]:checked").each(function (i) {
        if (0 == i) {
            adIds = $(this).val();
        } else {
            adIds += ("," + $(this).val());
        }
    });
    return adIds;
}

// console.log(new FormData($('#file')[0]),'上传的文件')

$('#ok').on('click', function () {
    var file = $("#file").files;
    console.log(file)
    var formData = new FormData();
    formData.append('avatar_file', file);
    var json = {
        remark: $("#remark").val(),//备注
        mapid: 2
    };

    var jsonStr = JSON.stringify(json);


    formData.append('mapDO', new Blob([jsonStr],
        {
            type: "application/json"
        }
    ));

    console.log(formData, '上传的文件信息')
    $("#roleIds").val(getCheckedRoles());
    $.ajax({
        cache: true,
        type: "POST",
        url: share + "/irobotweb/sys/map/add",
        data: formData,// 你的formid
        async: false,
        processData: false,
        dataType: 'JSON',
        contentType: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        error: function (request) {
            parent.layer.alert("Connection error");
        },
        success: function (data) {
            console.log(data, 'asjgakjsdgq')
            if (data.code == 0) {
                parent.layer.msg("操作成功");
                window.parent.location.reload()
                var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
                parent.layer.close(index);
            } else {
                parent.layer.alert(data.msg)
            }

        }
    });

})


var file = $('#file'), aim = $('#aim');

file.on('change', function (e) {
    //e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
    var name = e.currentTarget.files[0].name;
    aim.val(name);
    var theFile = this.files[0];
    var name = theFile.name;
    var formData = new FormData();
    formData['myfile'] = theFile;
})

$('#danger').on('click', function () {
    window.parent.location.href = "./resource.html"
})


