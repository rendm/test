//random  随机播放
var random=0;
var editnumbet=0;//编辑数据
//子列表增加数据  确定
var cronSubJobDOList=[];
var tempArr = [];
// 点击编辑小icon
var editicondata;



$().ready(function() {
    initialize();
    //时间插件初始化
    initializetime();

    validateRule();
    initdata();
    // $("#signupForm").validate();
});


// 初始化样式
function initialize(){
    //$("#con_ar-conter-centre").hide() //编辑新建
    $("#timing-task-content_show").hide() //详情
    $(".title-icon").hide() //编辑删除icon
    //  $("#type-time").hide(); //时钟
}

//初始化时间
function initializetime(){
    // 初始化开始时间
    let startClock = $('.clockpicker.start').clockpicker()
    startClock.find('input').change(function(){ judgeStart()});
    // 初始化开始时间
    let endClock = $('.clockpicker.end').clockpicker()
    endClock.find('input').change(function () { judgeEnd()});
}


//jq校验input框
function validateRule() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#timingaddForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            scheme:{
                required: true //方案名称
            },
            robot_na:{
                required: true //方案名称
            }
        },
        messages: {
            scheme:{
                required: icon + "请输入方案名称"
            },
            robot_na:{
                required: icon + "请选择机器人"
            }
        }
    })
}


function validateRule2() {
    var icon = "<i class='fa fa-times-circle'></i> ";
    return $("#timingaddForm").validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            scheme:{
                required: true //方案名称
            },
            robot_na:{
                required: true //方案名称
            }
        },
        messages: {
            scheme:{
                required: icon + "请输入方案名称"
            },
            robot_na:{
                required: icon + "请选择机器人"
            }
        }
    })
}

function save()
{
    if (validateRule2().form())
    {
        var chk_value ='';//定义一个数组
        $("input[name='weeks']:checked").each(function(){//遍历每一个名字为interest的复选框，其中选中的执行函数
            chk_value +=$(this).val()+',';//将选中的值添加到数组chk_value中
        });
        if (chk_value.length==0 || chk_value==undefined)
        {
            layer.msg("请选择星期");
            return;
        }
        chk_value =chk_value.substring(0,chk_value.length-1);
        jsondata.weeks=chk_value;//周几
        jsondata.cronname=$("#scheme").val();//方案名称
        jsondata.cronSubJobDOList=cronSubJobDOList;

        // var overallSavejson = {
        // //     "cronSubJobDOList":cronSubJobDOList ,
        // //     "cronname": $("#scheme").val(),  //方案名称
        // //     "hardware": $("#robot_na").find("option:selected").attr('hardwearNo'), //硬件地址
        // //     "mapid": sessionStorage.getItem('TaskSetMapId'),
        // //     // "mapname": $("#robot_na").find("option:selected").attr('mapname'),
        // //     "robotid": $("#robot_na").find("option:selected").attr('value'),
        // //     "robotname": $("#robot_na").find("option:selected").text(),
        // //     "weeks":chk_value ,//周几
        // // }

        $.ajax({
            url : share+"/irobotweb/sys/cronjob/update",
            type: "POST",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(jsondata),
            success : function(data){
                console.log(data,'修改参数返回')
                if(data.code==200 || data.code==0){
                    //parent.layer.msg("定时任务添加成功");
                    layer.confirm('修改成功', {
                        btn: ['确定', '取消']
                    }, function () {
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //执行关闭
                        window.parent.reloadtimeingtask();
                        // window.parent.location.reload();
                    })
                }
            },
            error : function(request){

            }
        });
    }

}

//  点击timingdataadd增加    定时数据列表增加
$("#timingdataadd").on('click',function(){

    initadd();
    $(".list-ul-lis").removeClass('list-ul-lisbg')
})

function initadd()
{
    random=0;
    html ='<i class="fa fa-random"></i>' +
        '<small>随机播放</small>';

    $("#irandom").html(html);
    $("#con_ar-conter-centre").show();

    $("#timing-task-content_show").hide(); //详情
    $(".title-icon").hide(); //编辑删除icon
    $('.title-text').text('新建');
    $("#timing-task_details").html('');
    $("#type-time").show();
    $('.clockpicker.start').find('input').val("00:00");
    $('.clockpicker.end').find('input').val("00:00") ;
    $("li.listlibg").toggleClass('listlibg');
}


$("#listliedit").on('click',function(){
    console.log(cronSubJobDOList,'数据')
    var resourceNamehtmlm='';
    // console.log(editicondata,'当前编辑数据'+editicondata.taskserialtype+'数据很多type'+editicondata.cronSubSubJobDOList)
    editnumbet=1;
    $('.title-text').text('编辑');
    $("#con_ar-conter-centre").show() //编辑新建
    $("#timing-task-content_show").hide() //详情
    $(".title-icon").hide()
    $("#type-time").show()
    //[value='+editicondata.taskserialtype+']
    //$('#selecttype-task option')[1].attr('selected','selected')
    var resourceName = editicondata.cronSubSubJobDOList;
    for(var i = 0;i<resourceName.length;i++){
        resourceNamehtmlm +=' <div class="ne_content">'+
            '<span class="ne-lo">'+
            '<small class ="index">'+(i+1)+'</small>'+
            '<small class="resourceni" taskid="'+resourceName[i].taskserialid+'">'+resourceName[i].taskserialname+'</small>'+
            '</span>'+
            '<span class="ne-rt">'+
            '<small ><img class="icon-shang" src="../../../static/img/icon_上移_pre.png" alt=""></small>'+
            '<small ><img class="icon-xia" src="../../../static/img/icon_下移_pre.png" alt=""></small>'+
            '<small ><img class="icon-del" src="../../../static/img/icon_删除_pre.png" alt=""></small>'+
            '</span>'+
            '</div>'
    }
    $('#selecttype-task').val(editicondata.taskserialtype)//任务类型下拉列表
    // console.log(resourceNamehtmlm,'查看页面元素')
    $("#timing-task_details").html(resourceNamehtmlm);
})

//新建添加
function newconstruction(){
    var sixoo=[];
    console.log(cronSubJobDOList,'cronSubJobDOList','right小小的')
    console.log('确定')
    var cronSubSubJobDOList = [];
    var ss =[];
    //'<small class="resourceni" taskid="'+ids[i]+'">'+resourceName[i]+'</small>'+
    for(var i = 0;i<$(".ne_content").length;i++){
        var sm= {
            "taskserialid":$(".ne_content").eq(i).find(".resourceni").attr('taskid'),
            "taskserialname": $(".ne_content").eq(i).find(".resourceni").text(),
            "idx":1,
        }
        ss.push(sm);
        console.log(i,ss)
    }
    console.log(ss,'smsmsmsm')
    cronSubSubJobDOList = ss;
    console.log(cronSubSubJobDOList,'cronSubSubJobDOList列表')
    var dometext = $(".ne_content");
    var cDlist = {
        "cronSubSubJobDOList": cronSubSubJobDOList,
        "cronsubjobname":$("#selecttype-task").find("option:selected").text(),
        "endtime": et,
        "starttime": st,
        "taskserialtype":$('#selecttype-task').val(),
        "taskserialtypename": $("#selecttype-task").find("option:selected").text(),
        "playMode": random  //随机播放
    }
    sixoo.push(cDlist)
    cronSubJobDOList.push(cDlist)
    console.log(sixoo,'确定里面添加')
    console.log('查看数据对不对的',cronSubJobDOList)
    for(var i = 0;i<sixoo.length;i++){
        let domString ='<li class="list-ul-lis">'+
            '<span class="ti-li-ti"><em></em> <span class="mainbody">'+sixoo[i].starttime+'-'+sixoo[i].endtime+'</span></span>'+
            '<span class="contenttitle">'+sixoo[i].taskserialtypename+'</span>'+
            '</li>';
       
        tempArr.push([
            +new Date('0 '+sixoo[i].starttime+':00'),
            +new Date('0 '+sixoo[i].endtime+':00')
        ])
        $("#timingullist").append(domString)

    }
}
//修改编辑
function editAgain(){
    
   
    var ss =[];
    //'<small class="resourceni" taskid="'+ids[i]+'">'+resourceName[i]+'</small>'+
    for(var i = 0;i<$(".ne_content").length;i++){
        var sm= {
            "taskserialid":$(".ne_content").eq(i).find(".resourceni").attr('taskid'),
            "taskserialname": $(".ne_content").eq(i).find(".resourceni").text(),
        }
        ss.push(sm);
    }

    editicondata.cronSubSubJobDOList=ss; //子列表
    editicondata.playMode = random;    //是否随机播放

    let st = $('.clockpicker.start').find('input').val();
    let et = $('.clockpicker.end').find('input').val();
    //var time =$(".list-ul-lisbg").find(".mainbody").text();
    editicondata.starttime=st;
    editicondata.endtime =et;
    editicondata.taskserialtypename=$("#selecttype-task").find("option:selected").text();
    $(".list-ul-lisbg").find(".contenttitle").text($("#selecttype-task").find("option:selected").text())
    $(".list-ul-lisbg").find(".mainbody").text(st+'-'+et);

    editnumbet=0;
}
//点击右边确定
$("#confirm").on('click',function(){

    let st = $('.clockpicker.start').find('input').val();
    let et = $('.clockpicker.end').find('input').val();


    if($(".ne_content").length==0){
        layer.msg("请选择要执行的任务");
        return;
    }
    console.log(st+'开始时间',et+'结束时间')
    if(st == undefined || et == undefined){
        layer.msg("请选择时间");
        return;
    }
    if(!compareTime(st,et)){
        layer.msg("时间有冲突，请重新选择时间");
        return;
    }

    if ($('.clockpicker.start').find('input').hasClass('isRepeat') ||
        $('.clockpicker.end').find('input').hasClass('isRepeat')
    )
    {
        layer.msg("时间有冲突，请重新选择时间");
        return;
    }

    if( editnumbet ==0){
        console.log('新建进来的页面')
        newconstruction()
    }else if(editnumbet ==1){
        console.log('编辑进来的页面')
        editAgain()
    }

    initadd();

// $('.clockpicker.start').find('input').val("00:00")//开始时间初始化
// $('.clockpicker.end').find('input').val("00:00")//结束时间初始化
// $("#con_ar-conter-centre").hide()//定时列表内容清空
    $('#selecttype-task').val("ad_task")//任务类型下拉列表初始化
})
//子列表增加数据  取消
$("#danger").on('click',function(){
    console.log('取消')
    $("#type-time").hide(); //时钟
    $("#con_ar-conter-centre").hide(); //编辑广告列表
})
//  通过类型添加类型列表
$(".i_s").on('click',function(){
    $("#timing-task_details").html('');

    $("#absoluteTable").bootstrapTable('destroy');
    absoluteload()
    $("#absolute-list").show()
})

$("#selecttype-task").on('change',function(){
    var selectvaule =$("#selecttype-task").find("option:selected").text();
    var html;
    if (selectvaule == "ex_task" )
    {
        html="";
    }

    if (selectvaule == "ad_task" )
    {

    }

    if (selectvaule == "wlcm_task" )
    {

    }

    $("#timing-task_details").html("");
})
//  弹层小叉
$("#span-hide").on('click',function(){
    $("#absolute-list").hide()
})
//弹层取消
$("#absolute-cf").on('click',function(){
    $("#absolute-list").hide()
})
//  弹出来的列表
// var
function absoluteload(){
    // console.log($('#selecttype-task').val(),'xianshi1显示')
    $('#absoluteTable').bootstrapTable( {
        ajaxOptions: {
            xhrFields: {        //跨域
                withCredentials: true
            },
            crossDomain: true,
            jsonp: "callback",
            jsonpCallback: "success_jsonpCallback",

        },
        type : "GET",
        url: share+'/irobotweb/sys/robottask/query/list',
        iconSize: 'outline',
        toolbar: '#exampleToolbar',
        striped: true, // 设置为true会有隔行变色效果
        dataType: "jsonp", // 服务器返回的数据类型
        pagination: true, // 设置为true会在底部显示分页条
        singleSelect: false, // 设置为true将禁止多选
        pageSize: 10, // 如果设置了分页，每页数据条数
        pageNumber: 1, // 如果设置了分布，首页页码
        pageList: [10, 25, 50, 100],
        queryParamsType: '',
        sidePagination: "server", // 设置在哪里进行分页，可选值为"client" 或者
        paginationLoop: false,
        paginationPreText:"上一页",
        paginationNextText:"下一页",
        paginationShowPageGo: false, //显示跳转
        showJumpto: false,
        height: $(window).height()-400,
        queryParams: function (params){
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.pageSize,     //页面大小
                page: params.pageNumber,   //页码
                //排序列名
                sortOrder: 'asc',
                taskType:$('#selecttype-task').val()
            };
            return temp;
        },
        // //请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数如果
        // queryParamsType = 'limit' ,返回参数必须包含
        // limit, offset, search, sort, order 否则, 需要包含:
        // pageSize, pageNumber, searchText, sortName,
        // sortOrder.
        // 返回false将会终止请求
        columns: [
            {
                checkbox: true
            },
            {
                align: 'center',
                title: '序号',// 列标题
                formatter: function (value, row, index) {
                    var pageSize = $('#absoluteTable').bootstrapTable('getOptions').pageSize;     //通过table的#id 得到每页多少条
                    var pageNumber = $('#absoluteTable').bootstrapTable('getOptions').pageNumber; //通过table的#id 得到当前第几页
                    return pageSize * (pageNumber - 1) + index + 1;    // 返回每条的序号： 每页条数 *（当前页 - 1 ）+ 序号
                }
            },
            {
                field: 'taskName',
                align: 'center',
                title: ''
            },]


    });
    $(".fixed-table-pagination").remove()
    $(".clearfix").remove()

}
//弹框数据点击确定
$('#absolute-cc').on('click', function (){
    var resourceNamehtmlm='';
    var rows = $('#absoluteTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
    if (rows.length == 0){
        layer.msg("请选择要播放的数据");
        return;
    }
    layer.confirm("确认要播放选中的'" + rows.length + "'条数据吗?", {
        btn: ['确定', '取消']
        // 按钮
    }, function () {
        var ids = new Array();
        var resourceName = new Array();
        var nums = $(".ne_content").length;
        var dnumber;

        // 遍历所有选择的行数据，取每条数据对应的ID
        $.each(rows, function (i, row){
            ids[i] = row['id'];
            resourceName[i] = row['taskName'];
        });
        console.log(ids,'ids')
        for(var i = 0;i<resourceName.length;i++){
            if(nums<9){
                dnumber = "0"+(i+1);
            }else if(nums>=9){
                dnumber = i+1;
            }
            resourceNamehtmlm +=' <div class="ne_content">'+
                '<span class="ne-lo">'+
                '<small class ="index">'+(i+1)+'</small>'+
                '<small class="resourceni" taskid="'+ids[i]+'">'+resourceName[i]+'</small>'+
                '</span>'+
                '<span class="ne-rt">'+
                '<small ><img class="icon-shang" src="../../../static/img/icon_上移_pre.png" alt=""></small>'+
                '<small ><img class="icon-xia" src="../../../static/img/icon_下移_pre.png" alt=""></small>'+
                '<small ><img class="icon-del" src="../../../static/img/icon_删除_pre.png" alt=""></small>'+
                '</span>'+
                '</div>'
        }
        $("#timing-task_details").html(resourceNamehtmlm);
        layer.closeAll('dialog');
        $("#absolute-list").hide()
    }, function(){
        console.log('定时123')
    });
})
//onmousedown和onmouseup
$(document).click(function (e) {     // 设置背景色
    // icon 删除 _pre
    if($(e.target).attr('class')=='icon-del'){
        var partentsDiv = $(e.target).parents('.ne_content');
        $(e.target).attr('src','../../../static/img/icon_删除_pre.png');
        // $(e.target).parent().parent().parent().find(".icon-del").attr('src','../../../static/img/icon_删除.png');
        //var index = partentsDiv.find(".index").html();
        var nextall =partentsDiv.nextAll();
        if (nextall!==undefined)
        {
            nextall.each(function(){
                var thisindex =$(this).find(".index").html();
                $(this).find(".index").html(parseInt(thisindex)-1);
            });



        }

        partentsDiv.remove();


    }else if($(e.target).attr('class')=='icon-xia'){ //icon 下
        console.log('下')
       
        var partentsDiv = $(e.target).parents('.ne_content');
        var index = partentsDiv.find(".index").html();


        var next = partentsDiv.next();
        var nextindex =next.find(".index").html();

        if(next.html() !== undefined){
            partentsDiv.find(".index").html(nextindex);
            next.find(".index").html(index);

            next.fadeOut('slow',function(){
                $(this).after(partentsDiv);
            }).fadeIn()
        }
    }else if($(e.target).attr('class')=='icon-shang'){ // icon 上
        console.log('上')
     
        var parentDiv = $(e.target).parents('.ne_content');
        var prev = parentDiv.prev();

        var index = parentDiv.find(".index").html();
        var previndex =prev.find(".index").html();


        if(prev.html() !== undefined){
            parentDiv.find(".index").html(previndex);
            prev.find(".index").html(index);

            prev.fadeOut('slow',function () {
                $(this).before(parentDiv)
            }).fadeIn()
        }
    }else if($(e.target).attr('class') == 'contenttitle'){
        $("#type-time").hide()
        $(e.target).parents(".list-ul-lis").addClass('list-ul-lisbg')
        $(e.target).parents(".list-ul-lis").siblings().removeClass('list-ul-lisbg')
        console.log($(e.target).parent().parent().parent().siblings(),'大火球')
        $("#con_ar-conter-centre").hide() //编辑新建
        $("#timing-task-content_show").show() //详情       
        $(".title-icon").show()
        $('.title-text').text('详情')
        var bdj=$(e.target).parents(".list-ul-lis").find('.mainbody').text().split('-')[0];                 
        console.log(bdj,'嘻嘻基金',cronSubJobDOList)
        $('.show-list_content').html('')
        for(var i= 0;i<cronSubJobDOList.length;i++){
            console.log(cronSubJobDOList[i].starttime)
            if(cronSubJobDOList[i].starttime == bdj){
                console.log('a啊哈')
                $('#ttable').text(cronSubJobDOList[i].starttime+"-"+cronSubJobDOList[i].endtime)
                if (cronSubJobDOList[i].playMode=="1")
                {
                    var  html1 ='<i class="fa fa-reorder"></i>' +
                        '<small>顺序播放</small>';
                    $("#show-random_btn").html(html1);

                }
                if (cronSubJobDOList[i].playMode=="0")
                {
                    var html2 ='<i class="fa fa-random"></i>' +
                        '<small>随机播放</small>';
                    $("#show-random_btn").html(html2);

                }

                //cronSubSubJobDOList
                var dt =cronSubJobDOList[i].cronSubSubJobDOList;
                $('.clockpicker.start').find('input').val(cronSubJobDOList[i].starttime)//开始时间初始化
                $('.clockpicker.end').find('input').val(cronSubJobDOList[i].endtime)
                st = cronSubJobDOList[i].starttime;//开始时间
                et=cronSubJobDOList[i].endtime;//结束时间
                editicondata = cronSubJobDOList[i];//编辑icon点击数据
                var jnus ;
                for(var j = 0;j<dt.length;j++){
                    if(dt.length>=9){
                        jnus = j+1;
                    }else if(dt.length<9){
                        jnus =(j+1);
                    }
                    let adlist ='<div class="show-list_content-li">'+
                        '<span>'+jnus+'</span>'+
                        '<span>'+dt[j].taskserialname+'</span>'+
                        '</div>';
                    $('.show-list_content').append(adlist)
                }

            }
        }
    }
})



// 判断时间是否重叠
function judgeTime(){
    judgeStart()
    judgeEnd()
}

function judgeStart(){
    console.log(tempArr,'所有时间数组')
    let startDom = $('.clockpicker.start').find('input')
    let endDom = $('.clockpicker.end').find('input')
    startDom.removeClass('isRepeat')
    endDom.removeClass('isRepeat')
    st =startDom.val();
    et = endDom.val();
    if(!compareTime(st,et))
    {
        startDom.addClass('isRepeat')
        return;
    }


     var snumbertime =new Date('0 '+st+':00');
    var  enumbertime = new Date('0 '+et+':00');

    var time =$(".list-ul-lisbg").find(".mainbody").text();
    console.log(time,'time')
    var starttime=null;
    var endtime=null;
    if (time!=null && typeof(time)!="undefined")
    {

        starttime=time.split("-")[0];
        endtime =time.split("-")[1];
    }


    for(var i= 0;i<cronSubJobDOList.length;i++) {

        var st1 = cronSubJobDOList[i].starttime;
        var et1 = cronSubJobDOList[i].endtime;

        if (st1 != undefined) {

            st1 =  new Date('0 '+st1+':00');
            et1 =  new Date('0 '+et1+':00');

            if (snumbertime > st1 && snumbertime < et1) {
                startDom.addClass('isRepeat');
            }

            if (enumbertime > st1 && enumbertime < et1) {
                endDom.addClass('isRepeat');
            }
            if (snumbertime <= st1 && enumbertime >= et1) {
                endDom.addClass('isRepeat');
            }
        }
    }
}
function judgeEnd(){
    let endDom = $('.clockpicker.end').find('input')
    let startDom = $('.clockpicker.start').find('input')

    st =startDom.val();
    et = endDom.val();
    startDom.removeClass('isRepeat');
    endDom.removeClass('isRepeat');

    var enumbertime = new Date('0 '+et+':00');
    var snumbertime =new Date('0 '+st+':00');

    if(!compareTime(st,et))
    {
        endDom.addClass('isRepeat')
        return;
    }
    var time =$(".list-ul-lisbg").find(".mainbody").text();
    var starttime=null;
    var endtime=null;

    if (time!=null  )
    {

        starttime=time.split("-")[0];
        endtime =time.split("-")[1];
    }


    for(var i= 0;i<cronSubJobDOList.length;i++) {
        var st1 = cronSubJobDOList[i].starttime;
        var et1 = cronSubJobDOList[i].endtime;

        if (st1 != undefined && st1 != starttime && et1 != endtime) {

            st1 =  new Date('0 '+st1+':00');
            et1 =  new Date('0 '+et1+':00');


            if (snumbertime > st1 && snumbertime < et1) {
                startDom.addClass('isRepeat');

            }

            if (enumbertime > st1 && enumbertime < et1) {
                endDom.addClass('isRepeat');
            }


            if (snumbertime <= st1 && enumbertime >= et1) {
                endDom.addClass('isRepeat');

            }
        }
    }

}
//修改编辑开始时间
function editjudgeStart(i){
    console.log(tempArr,'所有时间数组')
    let startDom = $('.clockpicker.start').find('input')
    let endDom = $('.clockpicker.end').find('input')
    startDom.removeClass('isRepeat')
    endDom.removeClass('isRepeat')
    st =startDom.val();//当前开始时间
    et = endDom.val();//当前结束时间
    if(!compareTime(st,et)){
        startDom.addClass('isRepeat')
        return;
    }


     var snumbertime =new Date('0 '+st+':00');
    var  enumbertime = new Date('0 '+et+':00');

    var time =$(".list-ul-lisbg").find(".mainbody").text();
    var starttime;
    var endtime;
    if (time!=null && typeof(time)!="undefined"){
        starttime=time.split("-")[0];
        endtime =time.split("-")[1];
    }


    for(var i= 0;i<cronSubJobDOList.length;i++) {

        var st1 = cronSubJobDOList[i].starttime;
        var et1 = cronSubJobDOList[i].endtime;

        if (st1 != undefined) {

            st1 =  new Date('0 '+st1+':00');
            et1 =  new Date('0 '+et1+':00');

            if (snumbertime > st1 && snumbertime < et1) {
                startDom.addClass('isRepeat');
            }

            if (enumbertime > st1 && enumbertime < et1) {
                endDom.addClass('isRepeat');
            }
            if (snumbertime <= st1 && enumbertime >= et1) {
                endDom.addClass('isRepeat');
            }
        }
    }
}
//修改编辑开始结束
function editjudgeEnd(){
    let endDom = $('.clockpicker.end').find('input')
    let startDom = $('.clockpicker.start').find('input')

    st =startDom.val();
    et = endDom.val();
    startDom.removeClass('isRepeat');
    endDom.removeClass('isRepeat');

    var enumbertime = new Date('0 '+et+':00');
    var snumbertime =new Date('0 '+st+':00');

    if(!compareTime(st,et))
    {
        endDom.addClass('isRepeat')
        return;
    }
    var time =$(".listlibg").find(".ti-li-ti").text();
    var starttime=null;
    var endtime=null;

    if (time!=null  )
    {

        starttime=time.split("-")[0];
        endtime =time.split("-")[1];
    }


    for(var i= 0;i<cronSubJobDOList.length;i++) {
        var st1 = cronSubJobDOList[i].starttime;
        var et1 = cronSubJobDOList[i].endtime;

        if (st1 != undefined && st1 != starttime && et1 != endtime) {

            st1 =  new Date('0 '+st1+':00');
            et1 =  new Date('0 '+et1+':00');


            if (snumbertime > st1 && snumbertime < et1) {
                startDom.addClass('isRepeat');

            }

            if (enumbertime > st1 && enumbertime < et1) {
                endDom.addClass('isRepeat');
            }


            if (snumbertime <= st1 && enumbertime >= et1) {
                endDom.addClass('isRepeat');

            }
        }
    }

}
$("#show-random_btn").on('click',function(){ //编辑随机播放
    var html;
    if(random==0)
    {
        html ='<i class="fa fa-reorder"></i>' +
            '<small>顺序播放</small>';

        random=1;

    }else if(random==1)
    {
        html ='<i class="fa fa-random"></i>' +
            '<small>随机播放</small>';
        random=0;
    }

    $("#show-random_btn").html(html);

})


$("#irandom").on('click',function(){ //编辑随机播放
    var html;
    if(random==0)
    {
        html ='<i class="fa fa-reorder"></i>' +
            '<small>顺序播放</small>';

        random=1;

    }else if(random==1)
    {
        html ='<i class="fa fa-random"></i>' +
            '<small>随机播放</small>';
        random=0;
    }

    $("#irandom").html(html);

})


//点击icon 删除选择数据listlidel
var removelidata;
$("#listlidel").on('click',function(){
    $("#timing-task-content_show").hide(); //详情
    let leli = $('#timingullist li');
    console.log(leli.length,'左边li条数')
    for(var i=0;i<leli.length;i++){
        console.log(leli.eq(i).hasClass('listlibg'))
        if(leli.eq(i).hasClass('listlibg')){
            removelidata = i;//拿到下标
            cronSubJobDOList.splice(i,1)
            $(".listlibg").remove();//页面删除
        }
    }
})

//判断日期，时间大小
function compareTime(startTime, endTime) {
    if (startTime.length > 0 && endTime.length > 0) {


        var arrStartTime = startTime.split(":");
        var arrEndTime = endTime.split(":");

        var allStartDate = new Date(2019, 1, 1, arrStartTime[0], arrStartTime[1], 0);
        var allEndDate = new Date(2019, 1, 1, arrEndTime[0], arrEndTime[1], 0);

        if (allStartDate.getTime() >= allEndDate.getTime()) {
            //  alert("startTime不能大于endTime，不能通过");
            return false;
        } else {
            //alert("startTime小于endTime，所以通过了");
            return true;
        }
    } else {
        // alert("时间不能为空");
        return false;
    }
}


function initdata() {

    var timingeditid = sessionStorage.getItem('timingeditid');

    $.ajax({
        url : share+"/irobotweb/sys/cronjob/query/id?id="+timingeditid,
        type: "GET",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        // data : JSON.stringify(dsid),
        success : function(r){
            jsondata= r.data;
            if(r.code==200 ) {
                $("#scheme").val(jsondata.cronname);
                var options ='<option mapname="'+jsondata.mapid+'" hardwearNo="'+jsondata.hardwear+'" value="'+jsondata.robotid+'" selected>'+jsondata.robotname+'</option>';
                $("#robot_na").append(options)

                var sixoo = jsondata.cronSubJobDOList;
                cronSubJobDOList=sixoo;
                for (var i = 0; i < sixoo.length; i++) {
                    let domString = '<li class="list-ul-lis">'+
                        '<span class="ti-li-ti"><em></em> <span class="mainbody">'+sixoo[i].starttime+'-'+sixoo[i].endtime+'</span></span>'+
                        '<span class="contenttitle">'+sixoo[i].taskserialtypename+'</span>'+
                    '</li>'
                    

                    $("#timingullist").append(domString)
                    tempArr.push([
                        +new Date('0 ' + sixoo[i].starttime + ':00'),
                        +new Date('0 ' + sixoo[i].endtime + ':00')
                    ])
                }
                var weeksday = jsondata.weeks;
                for (var i = 0; i < weeksday.length; i++) {
                    $("input[name='weeks'][value='" + weeksday[i] + "']").prop("checked", true);
                }
            }else
            {
                layer.msg(jsondata.msg);
            }
        },
        error : function(request) {
        }
    });

}

