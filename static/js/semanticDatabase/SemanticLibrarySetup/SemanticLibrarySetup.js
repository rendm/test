$("#add").on('click',function(){
    layer.open({
		type:2,
		title:"创建语义库",
        area: ['1000px', '750px'],
		content:"./add.html"
	})
})
$("#augmentbtn").on('click',function(){
    layer.open({
		type:2,
		title:"添加",
        area: ['1000px', '750px'],
		content:"./add.html"
	})
})
$(document).on('click',function(e){
	if($(e.target).parent().attr('class') == 'lookshowdd' || $(e.target).attr('class') == 'lookshowdd'){
		
		if($(e.target).parent().attr('class') == 'lookshowdd'){
			var ids = $(e.target).parent().attr('ids');
		}else if($(e.target).attr('class') == 'lookshowdd'){
			var ids = $(e.target).attr('ids');
		}
		sessionStorage.setItem('semanticid',ids)
		layer.open({
			type:2,
			title:"详情",
			area: ['1000px', '750px'],
			content:"./show.html"
		})
	}else if($(e.target).parent().attr('class') == 'delll' || $(e.target).attr('class') == 'delll'){
		if($(e.target).parent().attr('class') == 'delll'){
			var iddel = $(e.target).parent().attr('ids');
		}else if($(e.target).attr('class') == 'delll'){
			var iddel = $(e.target).attr('ids');
		}
		layer.confirm('确定要删除选中的记录？', {
			btn : [ '确定', '取消' ]
		}, function() {
			$.ajax({
				url : share+"irobotweb/speech/voicedb/delete?id="+iddel,
				type : "delete",
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				success : function(r) {
					if (r.code == 0 || r.code == 200) {
						window.location.reload();
					} else {
						layer.msg(r.msg);
					}
				}
			});
		})
	}
})


//初始化列表
$.ajax({
	url: share+'irobotweb/speech/voicedb/list',
	type: "get",
		dataType: "jsonp",
	// contentType:"application/json; charset=utf-8",
	//cache: false,
	jsonp: "callback", 
	jsonpCallback: "success_jsonpCallback",
	crossDomain: true,
	xhrFields: {
		withCredentials: true
	},

	success: function(json){
		var database =  json.rows;
		if(database.length==0){
			$("#detailsCircumscribe").hide()//有数据
			$("#EmptyData-center").show()//没数据
			return ;
		}else{
			$("#detailsCircumscribe").show()//有数据
			$("#EmptyData-center").hide()//没数据
		}
		var voicohtml=''
		for(var i=0;i<database.length;i++){
			var data = database[i];
			console.log(data)
			var number;
			
			voicohtml +='<div class="lump">'+
			'<div class="lump-top">'+
				'<b>'+data.voicedbname+'</b>'+
				'<span>'+
					'<span class="lookshowdd" ids="'+data.id+'"><small class="iconfont icon-chakan"></small>查看</span>'+
					'<span class="delll" ids="'+data.id+'"><small class="iconfont icon-shanchu"></small>删除</span>'+
				'</span>'+
			'</div>'+
			'<div class="lump-content">'+
				'<div class="describe">'+
					'<p>描述:'+data.remark+'</p>'+
				'</div>'+
				// '<span class="footer">'+
				// 	'共'+
				// 	'<span class="number-fo">999</span>'+
				// 	'条'+
				// '</span>'+
			'</div>'+
		'</div>'
		}
		$("#centerconter").html(voicohtml)
	}
})
