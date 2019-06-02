var index = parent.layer.getFrameIndex(window.name);
//给父页面传值
$('.ico-list i').on('click', function(){
    console.log(parent.$('#icon'))
    parent.$('#icon').val($(this).attr('class'));
    //parent.layer.tips('Look here', '#parentIframe', {time: 5000});
    parent.layer.close(index);
});