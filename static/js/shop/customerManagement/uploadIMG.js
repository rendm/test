var file = $('#file'),  aim = $('#aim');
           
file.on('change', function( e ){
	//e.currentTarget.files 是一个数组，如果支持多个文件，则需要遍历
	var name = e.currentTarget.files[0].name;
	aim.val( name );
	var theFile =  this.files[0];
	var name =   theFile.name;
	var formData = new FormData();
	formData['myfile']= theFile;
})

//资源上传按钮 获取当前的上传信息
$("#btn_upload").on('click', function () {
    //alert(window.parent.location.href);
    //window.parent.location.href = './uploadIMG.html'
    //alert(666);
    //window.close();
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
})


function wqe  (){
	$.ajax({
		type: 'POST',
		data: {
			
		},
		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		url: share+"/irobotweb/sys/guest/upload/list",
		success: function (r) {
			if (r.code == 0) {
				layer.msg(r.msg);
				window.location.reload()
			} else {
				layer.msg(r.msg);
			}
		}
	});
}