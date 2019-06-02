// 全局对象（插件，顺序绘制的插件）
var DATAarraylist;
var DATA = {}
function setDATA() {
  DATA = {
    // 绘制功能对象
    drawCanvas: {
      list: [],
      drawOk: false,
      start: function(drawEnd) {
        if (!this.list || !Array.isArray(this.list) || !this.list.length) return
        this.drawOk = false // 开始绘制前，设置变量bool值，标记还没有绘制完成
        begin(0, this)
        function begin(index, _this) {
          _this.list[index].draw(function() {
            if (++index < _this.list.length) begin(index, _this)
            else {
              // 记录绘制完成了
              _this.drawOk = true
              drawEnd() // 执行绘制完成的回调函数
            }
          })
        }
      }, 
      // 便利判断点中的是哪个
      judge: function(clickPosition){
          console.log(clickPosition,'clickPositionclickPositionclickPosition')
        let getIndex = undefined
        for (let length = this.list.length, i = length - 1; i >= 0; i--){
          let onClick = this.list[i].clickJudge(this, clickPosition)
          if (onClick) {
            getIndex = i
            break
          }
        }
        if (getIndex !== undefined) {
          console.log('点中了第 ' + (getIndex + 1) + ' 个')
          alert('点中了第 ' + (getIndex + 1) + ' 个')
        }
        else console.log('都没点中')
      },
      computedRotate: function(drawConfig, clickPosition){
        // 没有旋转，直接返回鼠标点击真实坐标
        let PI = Math.PI
        if (!drawConfig.rotate) return clickPosition
        // 开始计算以下计算，使用数学中的坐标系，向上为y轴正方向，向右为x轴正方向
        // 图形旋转的角度（使用数学中的旋转计数法），顺时针
        let rotate = -drawConfig.rotate
        let click_x = clickPosition.x, click_y = -clickPosition.y
        // 计算旋转中心
        let center_x = drawConfig.x + drawConfig.w / 2
        let center_y = -(drawConfig.y + drawConfig.h / 2)
        // 计算点击位置距离旋转中心的相对坐标
        let clickCoord_x = click_x - center_x
        let clickCoord_y = click_y - center_y
        // 点击点和旋转中心直线距离
        let space = Math.abs(Math.pow(Math.pow(clickCoord_x, 2) + Math.pow(clickCoord_y, 2), 1 / 2))
        // 点击位置距离圆心(旋转中心的角度)
        let clickAngle = Math.asin(clickCoord_y / space)
        if (clickAngle > 0 && clickCoord_x < 0) clickAngle = PI - clickAngle
        if (clickAngle < 0 && clickCoord_x < 0) clickAngle = -PI - clickAngle
        // console.log('点击位置距离圆心(旋转中心的角度)', clickAngle)
        // 点击的位置，需要逆着图形旋转，计算相对于圆心的角度
        let shouldAngle = clickAngle - rotate
        while (shouldAngle < -PI) {
          shouldAngle += 2 * PI
        }
        while (shouldAngle > PI){
          shouldAngle -= 2 * PI
        }
        let should_x = space * Math.cos(shouldAngle) // 旋转后的点击坐标(相对于旋转中心)
        let should_y = space * Math.sin(shouldAngle) // 旋转后的点击坐标(相对于旋转中心)
        // 转换为canvas坐标
        let should_click_x = should_x + center_x // 旋转后的点击坐标
        let should_click_y = -(should_y + center_y) // 旋转后的点击坐标
        console.log(should_click_x,should_click_y,'旋转后的坐标点击')
        return {x: should_click_x, y: should_click_y}
      }
    },
  }
}

// 初始化方法
function init() {
  var unifywidth=$("#base-img").width();
  var unifyheight=$("#base-img").height();
  var dom = $('#canvas');
  dom.width(unifywidth);
  dom.height(unifyheight)
  DATA.canvas = {
    dom: dom,
  }
  var ctx = dom[0].getContext('2d')
  //#base-img
  console.log(dom.width(),dom.height(),'宽高')
  DATA.ctx = ctx
  // 添加顺序绘制的数组，会按顺序一个一个绘制
  DATA.drawCanvas.list = [
  {
      drawConfig: {
        imgUrl: '../../../static/img/robotoper/机器人头像.png',
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        // rotate: 45 * Math.PI / 180,
      },
      draw: function(next) {
        let drawConfig = this.drawConfig
        getImage(drawConfig.imgUrl, function(img) {
          console.log('绘制第1个')
          rotateDraw(ctx, img, drawConfig)
          next()
        })
      },
      clickJudge: function(drawCanvas, clickPosition) {
        // clickPosition 是当前鼠标点击的位置信息
        let x = clickPosition.x, y = clickPosition.y // 鼠标点击的位置
        console.log(x,y,'鼠标点击的位置')
        if (this.drawConfig.rotate) { // 旋转了
          let realPosition = drawCanvas.computedRotate(this.drawConfig, clickPosition)
          
          x = realPosition.x
          y = realPosition.y
        }
        let onclick = false // 是否点击上了，默认没有
        let picPosition = {
          x_start: this.drawConfig.x,
          y_start: this.drawConfig.y,
          x_end: this.drawConfig.x + this.drawConfig.w,
          y_end: this.drawConfig.y + this.drawConfig.h,
        }
        if (x >= picPosition.x_start
          && x <= picPosition.x_end
          && y >= picPosition.y_start
          && y <= picPosition.y_end ) {
          onclick = true
        }
        return onclick
      },
    },
    {
      drawConfig: {
        imgUrl: '../../../static/img/robotoper/机器人头像.png',
        x: 30,
        y: 60,
        w: 50,
        h: 50,
        rotate: -100 * Math.PI / 180,
      },
      draw: function(next) {
        let drawConfig = this.drawConfig
        getImage(drawConfig.imgUrl, function(img) {
          console.log('绘制第2个')
          rotateDraw(ctx, img, drawConfig)
          next()
        })
      },
      clickJudge: function(drawCanvas, clickPosition) {
        // clickPosition 是当前鼠标点击的位置信息
        let x = clickPosition.x, y = clickPosition.y // 鼠标点击的位置
        if (this.drawConfig.rotate) { // 旋转了
          let realPosition = drawCanvas.computedRotate(this.drawConfig, clickPosition)
          x = realPosition.x
          y = realPosition.y
        }
        let onclick = false // 是否点击上了，默认没有
        let picPosition = {
          x_start: this.drawConfig.x,
          y_start: this.drawConfig.y,
          x_end: this.drawConfig.x + this.drawConfig.w,
          y_end: this.drawConfig.y + this.drawConfig.h,
        }
        if (x >= picPosition.x_start
          && x <= picPosition.x_end
          && y >= picPosition.y_start
          && y <= picPosition.y_end ) {
          onclick = true
        }
        return onclick
      },
    },
    {
      drawConfig: {
        imgUrl: '../../../static/img/robotoper/机器人头像.png',
        x: 70,
        y: 50,
        w: 50,
        h: 50,
        rotate: -60 * Math.PI / 180,
      },
      draw: function(next) {
        let drawConfig = this.drawConfig
        getImage(drawConfig.imgUrl, function(img) {
          console.log('绘制第3个')
          rotateDraw(ctx, img, drawConfig)
          next()
        })
      },
      clickJudge: function(drawCanvas, clickPosition) {
        // clickPosition 是当前鼠标点击的位置信息
        let x = clickPosition.x, y = clickPosition.y // 鼠标点击的位置
        if (this.drawConfig.rotate) { // 旋转了
          let realPosition = drawCanvas.computedRotate(this.drawConfig, clickPosition)
          x = realPosition.x
          y = realPosition.y
        }
        let onclick = false // 是否点击上了，默认没有
        let picPosition = {
          x_start: this.drawConfig.x,
          y_start: this.drawConfig.y,
          x_end: this.drawConfig.x + this.drawConfig.w,
          y_end: this.drawConfig.y + this.drawConfig.h,
        }
        if (x >= picPosition.x_start
          && x <= picPosition.x_end
          && y >= picPosition.y_start
          && y <= picPosition.y_end ) {
          onclick = true
        }
        return onclick
      },
    },
    {
      drawConfig: {
        imgUrl: '../../../static/img/robotoper/机器人头像.png',
        x: 50,
        y: 70,
        w: 50,
        h: 50,
        rotate: 60 * Math.PI / 180,
      },
      draw: function(next) {
        let drawConfig = this.drawConfig
        getImage(drawConfig.imgUrl, function(img) {
          console.log('绘制第4个')
          rotateDraw(ctx, img, drawConfig)
          $('.temp').css({
            left: 100,
            top: 300,
            width: 10,
            height: 10
          })
          $('.temp').show()
          next()
        })
      },
      clickJudge: function(drawCanvas, clickPosition) {
        // clickPosition 是当前鼠标点击的位置信息
        let x = clickPosition.x, y = clickPosition.y // 鼠标点击的位置
        if (this.drawConfig.rotate) { // 旋转了
          let realPosition = drawCanvas.computedRotate(this.drawConfig, clickPosition)
          x = realPosition.x
          y = realPosition.y
        }
        let onclick = false // 是否点击上了，默认没有
        let picPosition = {
          x_start: this.drawConfig.x,
          y_start: this.drawConfig.y,
          x_end: this.drawConfig.x + this.drawConfig.w,
          y_end: this.drawConfig.y + this.drawConfig.h,
        }
        if (x >= picPosition.x_start
          && x <= picPosition.x_end
          && y >= picPosition.y_start
          && y <= picPosition.y_end ) {
          onclick = true
        }
        return onclick
      },
    },
  ],
  // 开始按顺序绘制
  DATA.drawCanvas.start(drawEnd)
}

// 读取图片
function getImage(url, callback) {  
  var img = new Image() //创建一个Image对象，实现图片的预下载
  img.src = url
  if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
    callback(img)
    return; // 直接返回，不用再处理onload事件
  }
  img.onload = function () { //图片下载完毕时异步调用callback函数
    callback(img)
  }
}

// 渲染完成的回调函数
function drawEnd() {
  console.log('绘制完成')
}
// 绑定点击事件
$('#canvas').on('click', function(e) {
  if (DATA.drawCanvas.drawOk) { // 只有绘制完成后，才在每次点击后，开始判断点击到哪儿了
    let position = getMousePosdd(e, $(this))
    console.log(position,'查看回执到那儿')
    DATA.drawCanvas.judge(position)
  }
})
//  获取鼠标相对盒子的位置
function getMousePosdd(event, el) {
  event = event || window.event
  var pagex = event.pageX || scroll().left + event.clientX
  var pagey = event.pageY || scroll().top + event.clientY
  var divx = el.offset().left
  var divy = el.offset().top
  var targetx = pagex - divx
  var targety = pagey - divy + el.scrollTop()
  let delx = $('#canvas').width();
  let delxd = delx/2;
  let dely = $('#canvas').height();
  let delyd = dely/2;
  return { x: targetx-delxd, y: targety-delyd }
}

// 旋转绘制图片
function rotateDraw(ctx, img, drawConfig) {
  let x = drawConfig.x
  let y = drawConfig.y
  let w = drawConfig.w
  let h = drawConfig.h
  let rotate = drawConfig.rotate || 0
  let w_half = w / 2
  let h_half = h / 2
  ctx.save()
  let delx = $('#canvas').width();
  let delxd = delx/2;
  let dely = $('#canvas').height();
  let delyd = dely/2;
  ctx.translate(x , y )
  ctx.rotate(rotate)
  ctx.drawImage(img, -w_half, -h_half, w, h)
  ctx.translate(-(w_half + x), -(h_half + y))
  ctx.restore()
}

/////////////////end///////////////////////////////

var manualOperation=0;//手动控制  0关闭  1打开
//执行任务
$("#execute-task").on('click',function(){
    if($("#execute-task").attr('src') == '../../../static/img/robotoper/btn_执行任务.png'){
        // console.log('执行')
        $("#execute-task").attr('src','../../../static/img/robotoper/btn_执行任务_pre.png')
        //弹层出现
        $("#execute-pup-op").show()
    }else if($("#execute-task").attr('src') == '../../../static/img/robotoper/btn_执行任务_pre.png'){
        // console.log('不执行')
        $("#execute-task").attr('src','../../../static/img/robotoper/btn_执行任务.png')
    }
})


//执行任务弹层小叉
$("#fork-btn").on('click',function(){
    //弹层消失
    $("#execute-pup-op").hide()
    $("#execute-task").attr('src','../../../static/img/robotoper/btn_执行任务.png')
})

//替换地图按下
$("#Replace-map").on('mousedown',function(){
    $("#Replace-map").attr('src','../../../static/img/robotoper/btn_替换地图_pre.png')
    sessionStorage.setItem('changeid', robotid);
    layer.open({
        type: 2,
        title: '更换地图',
        shadeClose: false, // 点击遮罩关闭层
        area: ['1000px', '750px'],
        content: './changemap.html'  
    });
    setTimeout(function(){
        $("#Replace-map").attr('src','../../../static/img/robotoper/btn_替换地图.png')
    },2000)
})

//替换地图弹起
$("#Replace-map").on('mouseup',function(){
    $("#Replace-map").attr('src','../../../static/img/robotoper/btn_替换地图.png')
})

//限制区域按下
$("#restricted-area").on('mousedown',function(){
    $("#restricted-area").attr('src','../../../static/img/robotoper/btn_限制区域_pre.png')
})

//限制区域弹起
$("#restricted-area").on('mouseup',function(){
    $("#restricted-area").attr('src','../../../static/img/robotoper/btn_限制区域.png')
})

//立即停止
$("#immediately-stop").on('click',function(){
    if($("#immediately-stop").attr('src') == '../../../static/img/robotoper/btn_立即停止.png'){
        console.log('立即停止')
        $("#immediately-stop").attr('src','../../../static/img/robotoper/btn_立即停止_pre.png')
        var url=share+'/irobotweb/task/control/shutdowntask';
        var param={};
        param.robothadware=hardwareno;//机器人硬件地址
        param.robotid=robotid;        //机器人id
        jsonStr=JSON.stringify(param);
        $.ajax({
            url: url,
            type: "POST",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: jsonStr,
            success: function (data) {
    
                //console.info('立即停止接口返回消息');
                //console.info(data);
                if (data.code == 0) {
                    parent.layer.msg(data.msg);
                    window.location.reload();
                } else {
                    parent.layer.alert(data.msg);
                }
            },
            error: function (request){
                layer.alert("Connection error");
            }
        });
    }else if($("#immediately-stop").attr('src') == '../../../static/img/robotoper/btn_立即停止_pre.png'){
        console.log('不停止')
        $("#immediately-stop").attr('src','../../../static/img/robotoper/btn_立即停止.png')
    }
})

// //立即停止按下
// $("#immediately-stop").on('mousedown',function(){
//         $("#immediately-stop").attr('src','../../../static/img/robotoper/btn_立即停止_pre.png')
      
// })
// //立即停止弹起
// $("#immediately-stop").on('mouseup',function(){
//     $("#immediately-stop").attr('src','../../../static/img/robotoper/btn_立即停止.png')
// })
//打开左侧箱   
// $("#open-leftbox").on('mousedown',function(){
//         $("#open-leftbox").attr('src','../../../static/img/robotoper/btn_左侧箱_pre.png')
// })
// $("#open-leftbox").on('mouseup',function(){
//     $("#open-leftbox").attr('src','../../../static/img/robotoper/btn_左侧箱.png')
// })

$("#open-leftbox").on('click',function(){
    if($("#open-leftbox").attr('src') == '../../../static/img/robotoper/btn_左侧箱.png'){
        // console.log('右侧箱打开')
        $("#open-leftbox").attr('src','../../../static/img/robotoper/btn_左侧箱_pre.png')
    }else if($("#open-leftbox").attr('src') == '../../../static/img/robotoper/btn_左侧箱_pre.png'){
        // console.log('右侧箱关闭')
        $("#open-leftbox").attr('src','../../../static/img/robotoper/btn_左侧箱.png')
    }
})

//打开右侧箱
$("#open-rightbox").on('click',function(){
    if($("#open-rightbox").attr('src') == '../../../static/img/robotoper/btn_右侧箱.png'){
        // console.log('右侧箱打开')
        $("#open-rightbox").attr('src','../../../static/img/robotoper/btn_右侧箱_pre.png')
    }else if($("#open-rightbox").attr('src') == '../../../static/img/robotoper/btn_右侧箱_pre.png'){
        // console.log('右侧箱关闭')
        $("#open-rightbox").attr('src','../../../static/img/robotoper/btn_右侧箱.png')
    }
})


// $("#open-rightbox").on('mousedown',function(){
//     $("#open-rightbox").attr('src','../../../static/img/robotoper/btn_右侧箱_pre.png')
// })
// $("#open-rightbox").on('mouseup',function(){
//     $("#open-rightbox").attr('src','../../../static/img/robotoper/btn_右侧箱.png')
// })
//立即回充
// $("#immediately-recharge").on('click',function(){
//     if($("#immediately-recharge").attr('src') == '../../../static/img/robotoper/btn_立即回充.png'){
//         // console.log('立即回充')
//         $("#immediately-recharge").attr('src','../../../static/img/robotoper/btn_立即回充_pre.png')
//     }else if($("#immediately-recharge").attr('src') == '../../../static/img/robotoper/btn_立即回充_pre.png'){
//         // console.log('不立即回充')
//         $("#immediately-recharge").attr('src','../../../static/img/robotoper/btn_立即回充.png')
//     }
// })



//立即回充按下
$("#immediately-recharge").on('mousedown',function(){ 
    $("#immediately-recharge").attr('src','../../../static/img/robotoper/btn_立即回充_pre.png')
    var url=share+'/irobotweb/task/control/charingtask';
    var param={};
    param.hardwareno=hardwareno;//机器人硬件地址
    param.name=robotid;        //机器人id
    jsonStr=JSON.stringify(param);
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {
            // console.info('充电接口返回消息');
            // console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        }
    });
})

// //立即回充弹起
$("#immediately-recharge").on('mouseup',function(){
    $("#immediately-recharge").attr('src','../../../static/img/robotoper/btn_立即回充.png')
})

//手动控制开关
$("#shift-knob").on('click',function(){
    if($("#shift-knob").attr('src') == '../../../static/img/robotoper/开.png'){
        //console.log('立即回充')
        $("#shift-knob").attr('src','../../../static/img/robotoper/关.png')
        manualOperation=0;
        $('.po-di span').css('cursor','default');
        //console.log(manualOperation)

    }else if($("#shift-knob").attr('src') == '../../../static/img/robotoper/关.png'){
        //console.log('补立即回充')
        $("#shift-knob").attr('src','../../../static/img/robotoper/开.png')
        manualOperation=1;
        //console.log(manualOperation)

       $('.po-di span').css('cursor','pointer');

        layer.confirm('打开手动控制将会停止机器人当前执行的任务', {
            btn: ['确定', '取消']
        }, function () {
           // console.log('哈哈')
           // console.log('哒哒')
           
           var url=share+'/irobotweb/task/control/shutdowntask';
           //alert(robotid);
           //alert(hardwareno);
           //console.info('taskDOList');
           //console.info(taskDOList);
              //"taskSerialId": 0,
               //"taskType": "string",
               //"taskTypeName": "string",
               //"taskname": "string",
               //"timeout": "string",
               //"updateTime": "string",
               //"updateUserId": "string",
               //updateUserName: "string"
           var param={};
           param.robothadware=hardwareno;//机器人硬件地址
           param.robotid=robotid;        //机器人id
           jsonStr=JSON.stringify(param);
           $.ajax({
               url: url,
               type: "POST",
               crossDomain: true,
               xhrFields: {
                   withCredentials: true
               },
               dataType: "json",
               contentType: "application/json; charset=utf-8",
               data: jsonStr,
               success: function (data) {
                   //console.info('立即停止接口返回消息');
                   //console.info(data);
                   if (data.code == 0) {
                       parent.layer.msg(data.msg);
                       window.location.reload();
                   } else {
                       parent.layer.alert(data.msg);
                   }
               },
               error: function (request){
                   layer.alert("Connection error");
               }
           });
           $("#immediately-stop").attr('src','../../../static/img/robotoper/btn_立即停止_pre.png')
           layer.close(layer.index);//关闭弹窗
        });
    }
})


//方向上
$(".advance").on('mousedown',function(){
    if(manualOperation == 1){
        $(this).toggleClass('bg-border').siblings().removeClass('bg-border');
        $(this).css({
            "border-right-color": "transparent",
            "border-bottom-color": "transparent"  
        })
        triggermove("up");
    }
  
})
$(".advance").on('mouseup',function(){
    if(manualOperation == 1){
        $(this).removeClass('bg-border');
        holdUp();
    }
})

//方向下按下
$(".retreat").on('mousedown',function(){
    if(manualOperation == 1){
        $(this).toggleClass('bg-border').siblings().removeClass('bg-border')
        $(this).css({
            "border-left-color": "transparent",
            "border-top-color": "transparent"
        })
        triggermove("down");
    }
   
})

//方向下弹起
$(".retreat").on('mouseup',function(){
    if(manualOperation == 1){
        $(this).removeClass('bg-border')
        holdUp();
    }
})

//方向左按下
$(".releft").on('mousedown',function(){
    if(manualOperation == 1){
        $(this).toggleClass('bg-border').siblings().removeClass('bg-border')
        $(this).css({
            "border-right-color": "transparent",
            "border-top-color": "transparent"
        })
        
        triggermove("left");
    }
    
})

//方向左弹起
$(".releft").on('mouseup',function(){
    if(manualOperation == 1){
        $(this).removeClass('bg-border')
         holdUp();
    }
   
})

//方向右按下
$(".reright").on('mousedown',function(){
    if(manualOperation == 1){
        $(this).toggleClass('bg-border').siblings().removeClass('bg-border')
        $(this).css({
            "border-left-color": "transparent",
            "border-bottom-color": "transparent"
        })
        triggermove("right");
    }
})

//方向右弹起
$(".reright").on('mouseup',function(){
    if(manualOperation == 1){
        $(this).removeClass('bg-border')
        holdUp();
    }
   
})

//放大按钮按下
$(".img-plus-btn").on('mousedown',function(){
    // console.log('放大按钮按下')
    $(".img-plus-btn img").attr('src','../../../static/img/robotoper/放大_pre.png');
})

//放大按钮弹起
$(".img-plus-btn").on('mouseup',function(){
    // console.log('放大按钮弹起')
    $(".img-plus-btn img").attr('src','../../../static/img/robotoper/放大.png');

    // alert(222);
     //debugger

    if ($('#base-img').width() > 680) {
        layer.msg('已放大至最大尺寸!');
        return;
    }

    var offs = $("#base-img").offset();
    console.info('offset-left=' + offs.left + ',offset-top=' + offs.top);
    var width_new = $('#base-img').width() + sizeX;
    var height_new = $('#base-img').height() + sizeY;

    $('#base-img').width(width_new);
    $('#base-img').height(height_new);
    $("#base-img").offset(function (n, c) {
        newPos = new Object();

        newPos.left = c.left - moveX;
        newPos.top = c.top - moveY;
        //console.info('newPos.left=' + newPos.left);
        //console.info('newPos.top=' + newPos.top);
        return newPos;
    });

    $('#canvas').width(width_new);
    $('#canvas').height(height_new);
    $("#canvas").offset(function (n, c) {
        newPos = new Object();

        newPos.left = c.left - moveX;
        newPos.top = c.top - moveY;
        return newPos;
    });

})

//缩小按钮按下
$(".img-minus-btn").on('mousedown',function(){
    //
    $(".img-minus-btn img").attr('src','../../../static/img/robotoper/缩小_pre.png')
    // console.log('缩小按钮按下')
})

//缩小弹起
$(".img-minus-btn").on('mouseup',function(){
    // console.log('缩小按钮弹起')
    $(".img-minus-btn img").attr('src','../../../static/img/robotoper/缩小.png');

    if ($('#base-img').width() < 500) {
        layer.msg('已缩小至最小尺寸!');
        return;
    }
    //var offs = $("#base-img").offset();
    //console.info('offset-left=' + offs.left + ',offset-top=' + offs.top);
    //alert($('#base-img').width());
    //alert(sizeX);alert(sizeY);

    var width_new = $('#base-img').width() - sizeX;
    var height_new = $('#base-img').height() - sizeY;

    $('#base-img').width(width_new);
    $('#base-img').height(height_new);

    $("#base-img").offset(function (n, c) {
        newPos = new Object();

        newPos.left = c.left + moveX;
        newPos.top = c.top + moveY;
        //console.info('newPos.left=' + newPos.left);
        //console.info('newPos.top=' + newPos.top);
        return newPos;
    });

    $('#canvas').width(width_new);
    $('#canvas').height(height_new);

    $("#canvas").offset(function (n, c) {
        newPos = new Object();
        newPos.left = c.left + moveX;
        newPos.top = c.top + moveY;
        return newPos;
    });

    //alert('缩小后宽度='+$('#base-img').width());




})
//var wlcm_task_arr={},ex_task_arr={},sending_task_arr={},ad_task_arr={};//迎宾  定点讲解  送物  广告

//广告展示
$("#ad-task").on('click',function(){
    $("#pup-op-content-titleri").html('')
    // console.log('广告展示')
    $("#ad-task").toggleClass('taskbg').siblings().removeClass('taskbg')
    // <p>
    //     <span class="perna">广告展示</span>
    //     <span class="perna-btn">
    //         <span class="perna-show"></span> 
    //         <span onclick="taskExecute('+wlcm_task_arr[i].id+','+"'wlcm_task'"+')" class="perna-execute">立即执行</span>
    //     </span>
    // </p>
    //#pup-op-content-titleri
    if(ad_task_arr!=null && ad_task_arr.length>0){
        var ad_taskhtml='';
        for(var i=0;i<ad_task_arr.length;i++){
              ad_taskhtml +='<p>'+
                    '<span class="perna">'+ad_task_arr[i].taskName+'</span>'+
                    '<span class="perna-btn">'+
                        '<span class="perna-show"></span> '+
                        '<span onclick="taskExecute('+ad_task_arr[i].id+','+"'ad_task'"+')" class="perna-execute">立即执行</span>'+
                    '</span>'+
                '</p>'
        }
        $("#pup-op-content-titleri").html(ad_taskhtml)
    }
})

//迎宾任务
$("#usher-task").on('click',function(){
    $("#pup-op-content-titleri").html('')
    // console.log('迎宾任务')
    $("#usher-task").toggleClass('taskbg').siblings().removeClass('taskbg')
    if(wlcm_task_arr!=null && wlcm_task_arr.length>0){
        var wlcm_taskhtml='';
        for(var i=0;i<wlcm_task_arr.length;i++){
              wlcm_taskhtml +='<p>'+
                    '<span class="perna">'+wlcm_task_arr[i].taskName+'</span>'+
                    '<span class="perna-btn">'+
                        '<span class="perna-show"></span> '+
                        '<span onclick="taskExecute('+wlcm_task_arr[i].id+','+"'wlcm_task'"+')" class="perna-execute">立即执行</span>'+
                    '</span>'+
                '</p>'
        }
        $("#pup-op-content-titleri").html(wlcm_taskhtml)
    }
})

//定点讲解  
$("#explain-task").on('click',function(){
    $("#pup-op-content-titleri").html('')
    // console.log('定点讲解')
    $("#explain-task").toggleClass('taskbg').siblings().removeClass('taskbg');
    if(ex_task_arr!=null && ex_task_arr.length>0){
        var ex_taskhtml='';
        for(var i=0;i<ex_task_arr.length;i++){
              ex_taskhtml +='<p>'+
                    '<span class="perna">'+ex_task_arr[i].taskName+'</span>'+
                    '<span class="perna-btn">'+
                        '<span class="perna-show"></span> '+
                        '<span onclick="taskExecute('+ex_task_arr[i].id+','+"'ex_task'"+')" class="perna-execute">立即执行</span>'+
                    '</span>'+
                '</p>'
        }
        $("#pup-op-content-titleri").html(ex_taskhtml)
    }
})

//送物任务
$("#give-task").on('click',function(){
    $("#pup-op-content-titleri").html('')
    // console.log('送物任务')
    $("#give-task").toggleClass('taskbg').siblings().removeClass('taskbg')
    if(sending_task_arr!=null && sending_task_arr.length>0){
        var sending_taskhtml='';
        for(var i=0;i<sending_task_arr.length;i++){
              sending_taskhtml +='<p>'+
                    '<span class="perna">'+sending_task_arr[i].taskName+'</span>'+
                    '<span class="perna-btn">'+
                        '<span class="perna-show"></span> '+
                        '<span onclick="taskExecute('+sending_task_arr[i].id+','+"'sending_task'"+')" class="perna-execute">立即执行</span>'+
                    '</span>'+
                '</p>'
        }
        $("#pup-op-content-titleri").html(sending_taskhtml)
    }
})

//点击返回
$("#box-ri-top-re").on('click',function(){
    sessionStorage.setItem('robotOperation_back',1);
    var href=window.location.href;
    var href_back=href.replace('robot/RobotOperation/','').replace('ControlNew','index');
     window.location.href=href_back;

})

//点击立即执行
$(".perna-btn").on('click',function(){
    // console.log($(this))
})

//点击光晕
function getMousePos(event) {
    var e = event || window.event;
    return {'x':e.clientX,'y':e.clientY}
  }
  $("#box-ri-con-img").on('click',function(){
      //quack  addClass  removeClass
      $(".quack").removeClass("click");
      let position = getMousePos();
      $(".quack").css({
          'top':position.y+"px",
          "left":position.x + 'px'
      })
      setTimeout(function(){
        $(".quack").addClass('click')
      }, 0);
  })
  var highlight_show = {
    charge_gray_highlight:0,//充电点 
    usher_gray_highlight:0,//迎宾点 
    send_gray_highlight:0,//送物点
    fetch_gray_highlight:0,//取物点
    general_gray_highlight:0 //普通点
  }
  //充电点 #charge-gray_highlight
  $("#charge-gray_highlight").on('click',function(){
    console.log('充电点')    
    if($("#charge-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_充电点.png'){
        $("#charge-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_充电点_灰.png')
        highlight_show.charge_gray_highlight=1;
        initmap(robotid);
    }else if($("#charge-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_充电点_灰.png'){
        $("#charge-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_充电点.png')
        highlight_show.charge_gray_highlight=0;
        initmap(robotid);
    }
  })
  //迎宾点 #usher-gray_highlight
  $("#usher-gray_highlight").on('click',function(){
    console.log('迎宾点')
    if($("#usher-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_迎宾点.png'){
       $("#usher-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_迎宾点_灰.png')
        highlight_show.usher_gray_highlight=0;
        initmap(robotid);
    }else if($("#usher-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_迎宾点_灰.png'){
        $("#usher-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_迎宾点.png')
        highlight_show.usher_gray_highlight=1;
        initmap(robotid);
    }
  })
  //送物点 #send-gray_highlight
  $("#send-gray_highlight").on('click',function(){
    console.log('送物点')
    if($("#send-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_送物点.png'){
        $("#send-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_送物点_灰.png')
        highlight_show.send_gray_highlight=0;
        initmap(robotid);
    }else if($("#send-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_送物点_灰.png'){
        $("#send-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_送物点.png')
        highlight_show.send_gray_highlight=1;
        initmap(robotid);
    }
  })
  //取物点 #fetch-gray_highlight
  $("#fetch-gray_highlight").on('click',function(){
    console.log('取物点')
    if($("#fetch-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_取物点.png'){
        $("#fetch-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_取物点_灰.png')
        highlight_show.fetch_gray_highlight=0;
        initmap(robotid);
    }else if($("#fetch-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_取物点_灰.png'){
       $("#fetch-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_取物点.png')
        highlight_show.fetch_gray_highlight=1;
        initmap(robotid);
    }
  })
  //普通点 #general-gray_highlight
  $("#general-gray_highlight").on('click',function(){ 
    console.log('普通点')
    if($("#general-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_普通点.png'){
        $("#general-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_普通点_灰.png')
        highlight_show.general_gray_highlight=0;
        initmap(robotid);
    }else if($("#general-gray_highlight").attr('src') == '../../../static/img/robotoper/icon_左_普通点_灰.png'){
         $("#general-gray_highlight").attr('src','../../../static/img/robotoper/icon_左_普通点.png')
        highlight_show.general_gray_highlight=1;
        initmap(robotid);
    }
  })  
//当前任务鼠标划入
  $("#currenttaskname").on('mouseover',function(){
      console.log('鼠标划入')
      $("#suspensionab").show()
  })
//当前任务鼠标划出
$("#currenttaskname").on('mouseout',function(){
    console.log('鼠标划出')
    $("#suspensionab").hide()
})
//////////////////////////////////////////////////////复制js////////////////////////////////////////////////////////////////////////

var robotid = sessionStorage.getItem('controlidnew');;
var hardwareno;
var mapid;
var taskDOList;
var left_click_x,left_click_y,dot_arr,mapfile,mapfile_width,mapfile_height,robot_x,robot_y,zoom_ratio;
var canvas=document.getElementById("canvas");//获取画布
var canvas_draw;
var sizeX = 0, sizeY = 0, moveX = 0, moveY = 0;

var color_arr = ['Red','Brown','LimeGreen',
                 'CornflowerBlue','Crimson','DarkCyan',
                 'DarkGoldenRod','DarkGreen','DarkSalmon',
                 'DarkSeaGreen','DeepPink','DodgerBlue',
                 'ForestGreen','Fuchsia','GreenYellow',
                 'IndianRed','Chocolate'];

var color_arr_new = ['DarkCyan','#00CCFF','Fuchsia','blue','IndianRed','#ff0000']; //依次为 迎宾点 取物点 送物点 普通点 充电点


var config = {
    //width: 600,        // 设置canvas的宽
    //height: 700,        // 设置canvas的高
    //imgSrc: 'data:image/png;base64,' + mapfile,    // 图片路径
    imgSrc:'',
    maxScale: 4.0,        // 最大放大倍数
    minScale: 0.1,        // 最小放大倍数
    step: 0.1            // 每次放大、缩小 倍数的变化值
};

var imgStatus = {
    'scale': 1.0,
    'rotate': 0
};
//初始化
$(function(){
    $('#btnSmall').hide();
    var robotName =sessionStorage.getItem('robotName');
    $('#s-robotid').text('ID:'+robotid);
    if(robotName!=null && robotName!=''){
        $('#s-robotname').text('名称:'+robotName);
    }
    initmap(robotid);
    $('.po-di span').css('cursor','default');//默认是关
    $('#poI-coordinate').hide();
    $('#drawmap-main').hide();
    //计算地图每次缩放的幅度及偏移量begin
    var proportion = 1;
    //debugger
    var window_width = $(window).width();
    var window_height = $(window).height();
    var img_width = $('#base-img').width();
    var img_height = $('#base-img').height();

    if (window_width / img_width < window_height / img_height)
        proportion = $(window).width() / img_width;
    else
        proportion = $(window).height() / img_height;

    var back_width = $('#base-img').width() * proportion;
    var back_height = $('#base-img').height() * proportion;
    //放大缩小操作时的尺寸变化
    sizeX = Math.round(back_width / 10);//94.9
    sizeY = Math.round(back_height / 10);//94.9

    //放大缩小操作时的位置变化
    moveX = Math.round(sizeX / 2);//47.45
    moveY = Math.round(sizeY / 2);//47.45
    //计算地图每次缩放的幅度及偏移量end


    //canvas绘图begin
    // config.imgSrc=mapfile;
    // config.width=mapfile_width;
    // config.height=mapfile_height;
    // console.info('mapfile='+mapfile);
    // console.info('mapfile_width='+mapfile_width);
    // console.info('mapfile_height='+mapfile_height);
    //drawCanvasImg(1);
    //canvas绘图end

    // $('#base-img').smartZoom({ 'containerClass': 'zoomableContainer' });
    // $('.zoomableContainer').attr('style','left:-205px');
    // $('#btnBig,#btnSmall').bind("click", zoomButtonClickHandler);
    // alert($('.zoomableContainer').attr('style'));

    $('[name="status"]').bootstrapSwitch({
        onText: "开",
        offText: "关",
        onColor: "success",
        offColor: "warning",
        size: "mini",
        handleWidth: 50,
        labelWidth:20,
        onInit:function (event, state){
            //state=true;
            //alert(state);
            //console.info('state');console.info(state.currentTarget);
           //alert($(state.currentTarget).val());
        },
        onSwitchChange: function (event, state) {
            if (state == true) {
                //alert(555);
                //console.info('$(this)'); console.info($(this));
                $(this).val("1");
            } else {
                //alert(666);
                $(this).val("2");
            }
        }
    })

     setDATA() // 配置全局对象
     init()

});
var openflag=true;

//绘制canvas图片
function  drawCanvasImg(r) {13861325072

    //debugger
    var config1 = {
        //width: 600,        // 设置canvas的宽
        //height: 700,        // 设置canvas的高
        imgSrc:'',
        imgSrc: 'data:image/png;base64,' + mapfile,    // 图片路径
        width: mapfile_width,        // 设置canvas的宽
        height: mapfile_height,        // 设置canvas的高
        maxScale: 4.0,        // 最大放大倍数
        minScale: 0.1,        // 最小放大倍数
        step: 0.1            // 每次放大、缩小 倍数的变化值
    };

    var imgStatus1 = {
        'scale': 1.0,
        'rotate': 0
    };

    var x=mapfile_width;
    var y=mapfile_height;
    var img = new Image();
    //img.src = config.imgSrc;
    img.src = 'data:image/png;base64,' + mapfile;



    img.onload=function () {
        //alert('图片加载');

        //debugger
        var ctx=$('#canvas')[0].getContext("2d");

        lastStatus = {
            "imgX": -1 * img.width / 2,
            "imgY": -1 * img.height / 2,
            'mouseX': 0,
            'mouseY': 0,
            'translateX': canvas.width / 2,
            'translateY': canvas.height / 2,
            'scale': 1.0,
            'rotate': 0
        };

        var imgX = lastStatus.imgX - (x - lastStatus.translateX) / lastStatus.scale;
        var imgY = lastStatus.imgY - (y - lastStatus.translateY) / lastStatus.scale;
        //alert(canvas.width+','+canvas.height);
        ctx.beginPath();
        
        ctx.globalCompositeOperation="destination-over";//点位显示，有点重叠，是效果最好的一种
    

        ctx.clearRect(0, 0, x, y);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(imgStatus.rotate * Math.PI / 180);
        ctx.scale(imgStatus.scale, imgStatus.scale);
        ctx.drawImage(img, imgX-(x/2), imgY-(y/2), img.width, img.height);
        ctx.restore();

        lastStatus = {
            'imgX': imgX,
            'imgY': imgY,
            'translateX': x,
            'translateY': y,
            'scale': imgStatus.scale,
            'rotate': imgStatus.rotate
        };
    };
}

//放大/缩小的方法
function zoomButtonClickHandler(e) {
    //alert(555);
    var scaleToAdd = 0.8;

    if (e.target.id == 'btnSmall')
    {
        $('#btnSmall').hide(); $('#btnBig').show();
        zoom_ratio+=0.02228;
        scaleToAdd = -scaleToAdd;
    }else{
        $('#btnSmall').show(); $('#btnBig').hide();
        zoom_ratio-=0.02228;
    }

    //alert(scaleToAdd);

    //alert(zoom_ratio);
    $('#base-img').smartZoom('zoom', scaleToAdd);
    initmap(robotid);
    //drawRobotPosition(canvas_draw,robot_x,robot_y);//resolution_ratio  分辨率系数
}

//根据mapid获取坐标信息
function getMapCoordinate() {
    console.info('taskDOList');console.info(taskDOList);
    if(!$.isEm(taskDOList)){
        mapid=taskDOList.mapId;       //地图id
        console.log(mapid,'机器人id')
        if(!$.isEm(mapid)){
            var url=share +'irobotweb/sys/mappoi/query/mapids?mapid='+mapid;
            $.ajax({
                url:url,
                crossDomain: true,
                type: "get",
                async:false,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    // console.info('坐标信息');
                    // console.info(data);
                    dot_arr=data.data;//获取固定点的数组
                    console.log(dot_arr,'当前点位数据')
                    if(dot_arr!=null && dot_arr.length>0){
                        for(var i=0;i<dot_arr.length;i++){
                            var x=parseFloat(dot_arr[i].x);
                            var y=parseFloat(dot_arr[i].y);
                            //console.info('x='+x+',y='+y);
                            drawDot(canvas_draw,x,y,dot_arr[i].poiName,dot_arr[i].poiType);
                        }
                    }
                },
                error: function (request) {
                    layer.alert("Connection error");
                },
            });
        }
    }
}

//根据数据库中的固定点坐标来绘制点的位置
function drawDotByDb() {
    console.log(dot_arr,'当前所有点位数据')
    if(dot_arr!=null && dot_arr.length>0){
        for(var i=0;i<dot_arr.length;i++){
            var x=parseFloat(dot_arr[i].x);
            var y=parseFloat(dot_arr[i].y);
            //console.info('x='+x+',y='+y);
            drawDot(canvas_draw,x,y,dot_arr[i].poiName,dot_arr[i].poiType);
        }
    }
}

$(".poi").on('click', function (){

    if (mapid!=null ){
        if (openflag){
            $.ajax({
                url: share + '/irobotweb/sys/mappoi/query/mapids?mapid=' + mapid,
                type: "get",
                cache: false,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (json){
                    if (json.code==200){
                        var html="";
                        $.each(json.data,function(n,value) {
                            //alert(n+' '+value.poiName);
                            html =html + '<p><small>' +value.poiName+'</small>';
                            html =html + '<span><small>X:' +value.x +'</small>';
                            html =html + '<small>Y:' +value.y +'</small>';
                            html =html + '<small>Yaw:' +value.yaw +'</small></span></p>';
                            // $("#poI-coordinate").toggle();
                        });
                        //$("#poI-coordinate").html(html);
                        openflag=false;
                    }

                }
            });
        }else
        {
            $("#poI-coordinate").html("");
            openflag=true;

        }


    }

});

$('.set-item').click(function () {
    //alert(333);
    $('#poI-coordinate').show();
});

$('#poI-coordinate p').click(function () {
    //alert(666);
    $('#poI-coordinate').hide();
});

//左键事件
function clickLeft(e) {
    e.preventDefault();
    e.stopPropagation();
    left_click_x=$("#messagex").html();
    left_click_y=$("#messagey").html();
     var dot_clicked=cal_left_menu(left_click_x,left_click_y);

    if(dot_clicked!=null && dot_clicked!=undefined){
        console.log('909090')
    }
    $("#right-hand").css({
        "display": "none"
    });
}

//根据左键点击的坐标计算是否显示左键处理菜单
function cal_left_menu(left_click_x,left_click_y) {

   if(dot_arr!=null && dot_arr.length>0){
      var dot_clicked;

      for(var i=0;i<dot_arr.length;i++){
          if(dot_arr[i].poiName=='充电点'){

          }

          var abs_x=Math.abs(parseFloat(dot_arr[i].x)-left_click_x);
          var abs_y=Math.abs(parseFloat(dot_arr[i].y)-left_click_y);
          if(dot_arr[i].poiName=='充电点'){
              //console.info('abs_x='+abs_x+',abs_y='+abs_y);
          }

          if(abs_x<=0.38 && abs_y<=0.38){ //使用0.4也可以
              dot_clicked=dot_arr[i];
              break;
          }
      }
      return dot_clicked;
   }
}



//页面头部-删除点位-最新
$('#delPoint').click(function () {
    //alert(666);
    var pointId=$("#right-hand").attr('pointId');
    if(pointId!=null && pointId!=''){
        layer.confirm('确定要删除该点位？', {
            btn: ['确定', '取消']
        }, function () {
            var url=share+"/irobotweb/sys/mappoi/delete?id="+pointId;

            $.ajax({
                url: url,
                type: "DELETE",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {

                    //console.info('删除返回消息');console.info(data);

                    if (data.code == 200) {

                        parent.layer.alert('删除成功',function () {
                            //window.location.reload();
                            window.location.href = "./ControlNew.html";
                        });

                    } else {
                        layer.msg(data.msg);
                    }
                }
            });
        });
    }
});

//页面头部-编辑点位-最新
$('#editPoint').click(function () {
    sessionStorage.setItem('poiId',$("#left-hand").attr('pointId'));
    sessionStorage.setItem('poiName',$("#left-hand").attr('poiName'));
    sessionStorage.setItem('poiType',$("#left-hand").attr('poiType'));
    sessionStorage.setItem('poiX',$("#left-hand").attr('poiX'));
    sessionStorage.setItem('poiY',$("#left-hand").attr('poiY'));
    sessionStorage.setItem('poiYaw',$("#left-hand").attr('poiYaw'));
    sessionStorage.setItem('mapId',$("#left-hand").attr('mapId'));

    layer.open({
        type: 2,
        title: '编辑点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '400px'],
        content: './edit.html'  // iframe的url
    });
});

//左键菜单-编辑
$('.edit-point').click(function () {
    //alert('编辑');

    //$("#left-hand")
    //attr('pointId',dot_clicked.id).attr('poiName',dot_clicked.poiName).attr('poiType',dot_clicked.poiType);
    sessionStorage.setItem('poiId',$("#left-hand").attr('pointId'));
    sessionStorage.setItem('poiName',$("#left-hand").attr('poiName'));
    sessionStorage.setItem('poiType',$("#left-hand").attr('poiType'));
    sessionStorage.setItem('poiX',$("#left-hand").attr('poiX'));
    sessionStorage.setItem('poiY',$("#left-hand").attr('poiY'));
    sessionStorage.setItem('poiYaw',$("#left-hand").attr('poiYaw'));
    sessionStorage.setItem('mapId',$("#left-hand").attr('mapId'));

    layer.open({
        type: 2,
        title: '编辑点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '400px'],
        content: './edit.html'  // iframe的url
    });

    $("#left-hand").css({
        "display": "none"
    });
});

//处理左键菜单和右键菜单的隐藏
$('#box-ri-con-img').click(function (e) {
    var target = $(e.target);
    //左键-删除
    if( target.is('.edit-point')){
        return;
    }
    else
    {
        //console.info(999);
        left_click_x=$("#messagex").html();
        left_click_y=$("#messagey").html();
    }

    //console.info('target');console.info(target);
    var dot_clicked=cal_left_menu(left_click_x,left_click_y);
    //console.info('点击点位的x,y坐标:x='+left_click_x+',y='+left_click_y);
    //console.info('左键选中的点555:dot_clicked');console.info(dot_clicked);

    if(!target.is('.edit-point')  && dot_clicked==undefined){
        $("#left-hand").css({
            "display": "none"
        });

        
    }

    // if(!target.is('.move') && !target.is('.set')){
    //     $("#right-hand").css({
    //         "display": "none"
    //     });
    // }

    if(dot_clicked!=null && dot_clicked!=undefined){
        // console.log('坐标点上')

        $("#right-hand .set").hide()
        $('#editPoint').show()
        $('#delPoint').show()
        //$('#delPoint').attr()

        console.log(dot_clicked.id,'dot_clicked.id')
        //alert(dot_clicked.poiName);
        //alert(dot_clicked.poiType);

        //鼠标左键点击坐标点
        // $('#s-poiName').text(dot_clicked.poiName);
        // if(dot_clicked.poiType=='wlcmpoint'){
        //     // $('#s-poiType').text('迎宾点');
        // }else if(dot_clicked.poiType=='takepoint'){
        //     // $('#s-poiType').text('取物点');
        // }else if(dot_clicked.poiType=='sendingpoint'){
        //     // $('#s-poiType').text('送物点');
        // }else if(dot_clicked.poiType=='poipoint'){
        //     // $('#s-poiType').text('普通点');
        // }else if(dot_clicked.poiType=='chargepoint'){
        //     // $('#s-poiType').text('充电点');
        // }else {
        //     // $('#s-poiType').text('普通点');
        // }

        //$('#s-poiType').text(dot_clicked.poiType);
        //alert('显示');
        $('#right-hand').show().attr('pointId',dot_clicked.id)
            .attr('poiName',dot_clicked.poiName)
            .attr('poiType',dot_clicked.poiType)
            .attr('poiX',dot_clicked.x)
            .attr('poiY',dot_clicked.y)
            .attr('poiYaw',dot_clicked.yaw)
            .attr('mapId',dot_clicked.mapId);

        // $("#left-hand").css({
        //     "display": "none",//新的文档不需要左键菜单
        //     "left": e.clientX - 380,
        //     "top": e.clientY - 55
        // }).attr('pointId',dot_clicked.id)
        //     .attr('poiName',dot_clicked.poiName)
        //     .attr('poiType',dot_clicked.poiType)
        //     .attr('poiX',dot_clicked.x)
        //     .attr('poiY',dot_clicked.y)
        //     .attr('poiYaw',dot_clicked.yaw)
        //     .attr('mapId',dot_clicked.mapId);
        
    }

    if(!target.is('#canvas')){
        $("#left-hand").css({
            "display": "none"
        });

        $("#right-hand").css({
            "display": "none"
        });
    }else{
    }
});





//绘制地图
$('.drawmap').click(function () {
    $('#drawmap-main').show();
});

//储物仓开门
$('.opendoor').click(function () {
    $('#drawmap-main').hide();
});

//储物仓关门
$('.closedoor').click(function () {
    $('#drawmap-main').hide();
});

//充电
$('.recharge').click(function () {
    $('#drawmap-main').hide();
});

//取消充电
$('.cancel-recharge').click(function () {
    $('#drawmap-main').hide();
});

$('.menu').click(function () {
    $('#drawmap-main').hide();
});

//进入页面加载数据
function initmap(robotid){
    //alert(robotid);
    //alert(share + 'irobotweb/sys/map/initrobotstatus?robotid='+robotid);
    $.ajax({
        url: share + 'irobotweb/sys/map/initrobotstatus?robotid='+robotid,
        type: "get",
        cache: false,
        async:false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (json) {
            console.log('多米数据',json)
            var data =json.data;
            if(json.code == 200){
                hardwareno=data.macaddress;//机器人硬件地址
                if(!$.isEm(data.mapDO) && !$.isEm(data.mapDO.mapId)){
                    mapid=data.mapDO.mapId;
                }else {
                    mapid=0;
                }

                taskDOList=data.mapDO;
                //batterypower  参考电量 basicStatusBase 基本状态 底盘状态 0正常/1 异常  storagestatus 储物箱状态  statusLight 状态灯信息  robotstatus 机器人状态 0 待机，1  工作中  2充电状态；3移动状态

                //console.info('taskDOList');
                //console.info(taskDOList);
                //(hardwareno,'hardwarenohardwarenohardwareno')
                //当前任务
                $("#currenttaskname").html(data.currenttaskname)
                $("#suspensionab").html(data.currenttaskname)
                //机器人名称
                var namehtml = ' <b>名称:</b><span>'+data.name+'</span>'
                $("#intro-name").html(namehtml);
                //机器人id
                var idhtml = ' <b>ID:</b><span>'+robotid+'</span>'
                $("#intro-id").html(idhtml);
                //参考电量
                $("#batterypower").html(data.batterypower+"%")
                console.log(data,'dian亮')
                //状态灯信息 background-color: rgb(0,0,0);

                $("#light").css("background-color",showRGB(data.statuslight));
                //机器人状态  机器人状态 0 待机，1  工作中  2充电状态；3移动状态
                switch (data.robotstatus) { 
                case 0:$("#robotstatus").html("待机"); 
                break; 
                case 1:$("#robotstatus").html("工作中"); 
                break; 
                case 2:$("#robotstatus").html("充电中"); 
                break; 
                case 3:$("#robotstatus").html("移动中"); 
                break;  
                }
                
                //
                //basicStatusBase 基本状态 底盘状态 0正常/1 异常
                var bsb;
                switch (data.basicStatusBase) 
                { 
                case 0:bsb="正常"; 
                break; 
                case 1:bsb="异常"; 
                break;  
                }
                $("#basicStatusBase").html(bsb)
                //base
                if(data.base == 0){
                    $("#base").attr("class","green");
                }else if(data.base == 1){
                    $("#base").attr("class","red");
                }
                //laswer 雷达
                if(data.laswer == 0){
                    $("#laswer").attr("class","green");
                }else if(data.laswer == 1){
                    $("#laswer").attr("class","red");
                }

                //odom
                if(data.odom == 0){
                    $("#odom").attr("class","green");
                }else if(data.odom == 1){
                    $("#odom").attr("class","red");
                }

                //uwb
                if(data.uwb == 0){
                    $("#uwb").attr("class","green");
                }else if(data.uwb == 1){
                    $("#uwb").attr("class","red");
                }

                //导航状态  moveStatus
                initmoveStatus(data.movestatus);
                initchargestatus(data.chargestatus);
                initlocstatus(data.locstatus);

                if(!$.isEm(data.mapDO)){
                    mapfile=data.mapDO.mapfile;
                    mapfile_width=data.mapDO.width;
                    mapfile_height=data.mapDO.height;
                    
                    //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + data.mapDO.mapfile);
                    $('#base-img').attr('src','data:image/png;base64,' + data.mapDO.mapfile);
                    
                    $("#base-img").css({
                    "width": data.mapDO.width,
                    "height": data.mapDO.height
                    });
                    
                    canvas.width = data.mapDO.width;
                    canvas.height = data.mapDO.height;
                    }

                canvas_draw= getCanvas(canvas.width,canvas.height);
                robot_x=data.x;
                robot_y=data.y;
                drawDotByDb();//绘制点位
                drawRobotPosition(canvas_draw,robot_x,robot_y);   //绘制机器人点位图
                //鼠标移动，实时显示坐标信息
                canvas.onmousemove = function (e) {
                    var location = getLocation(e.clientX, e.clientY);
                    // message.innerHTML = "x=" + location.x + " ,y=" + location.y;
                    $("#messagey").html(location.y);
                    $("#messagex").html(location.x);

                    left_click_x=$("#messagex").html();
                    left_click_y=$("#messagey").html();
                    var dot_clicked=cal_left_menu(left_click_x,left_click_y);
                    if(dot_clicked!=null && dot_clicked!=undefined){
                        $("#canvas").css('cursor','pointer');
                    }else{
                        $("#canvas").css('cursor','default');
                    }
                };

                connect(hardwareno);
            }else{
                alert('获取失败');
                alert(json.msg);
            }
        }

    });

    getMapCoordinate();//获取poi点位坐标
    
    getTasks();//获取任务信息
}

//根据mapid获取任务列表
var wlcm_task_arr={},ex_task_arr={},sending_task_arr={},ad_task_arr={};
function getTasks() {
    var url=share +'irobotweb/sys/robottask/query/mapid?mapid='+mapid;
    //alert(url);
    console.log(mapid,'当前机器人')
    $.ajax({ 
        url:url,
        crossDomain: true,
        type: "get",
        async:false,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) { 
            // console.info('任务信息');
            var task_arr=data.data;

            if(task_arr!=null){
                //过滤不同任务类型的数组
                wlcm_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType =='wlcm_task';
                });

                ex_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType =='ex_task';
                });

                sending_task_arr = task_arr.filter(function (element, index, self) {
                    return element.taskType =='sending_task';
                });

                ad_task_arr = task_arr.filter(function (element, index, self){
                    return element.taskType =='ad_task';
                });
            }

            //console.info('ex_task_arr'); console.info(ex_task_arr);
            //console.info('sending_task_arr'); console.info(sending_task_arr);
            //console.info('ad_task_arr'); console.info(ad_task_arr);

            //var add_html='';
            

            //console.info('add_html');console.info(add_html);
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
}

//任务执行
function taskExecute(taskId,taskType) {
    var title='',width='405px',height='205px';

    if(taskType=='wlcm_task'){
        //alert('迎宾任务');
        title='迎宾时间';
    }else if(taskType=='ex_task'){
        //alert('解说任务');
        title='定点讲解';
        width='475px';height='270px';
    }else if(taskType=='sending_task'){
        //alert('送物任务');
        title='送物';
    }else if(taskType=='ad_task'){
        //alert('广告任务');
        title='广告时间';
    }

    //alert(taskId);
    //alert(hardwareno);

    layer.open({
        type: 2,
        title: title,
        maxmin: true,
        shadeClose: false,
        area: [width, height],
        content: '../TaskSet/TaskExecute.html?robottaskid='+taskId+'&hardwareno='+hardwareno+'&taskType='+taskType,
        end: function () {
            //alert(666);
            //var task_set_resourceinfo = sessionStorage.getItem('task_set_resourceinfo');
            //BigSc.html(task_set_resourceinfo);
            //sessionStorage.setItem('task_set_resourceinfo', '');//获取到值以后将session清空
        }
    });
}

//获取到画布
function getCanvas(width,height) {
    var canvasDom;
    if (!canvasDom) {
        var dom = $('#canvas')[0];
        if (dom) {
            canvasDom = dom.getContext("2d");
        }
    }

    canvasDom.translate(width / 2, height / 2);
    canvasDom.clearRect(-width / 2, -height / 2, width, height);
    return canvasDom;
}

//绘制机器人的位置-水滴图
function drawRobotPosition(canvas,x,y) {
    var xd = x/0.05;
    var yd = -(y/0.05);
    var imgdd = document.getElementById("water-location");//图片信息
    canvas.beginPath();

    console.log(xd-43, yd-43,'点位')

    canvas.stroke();
}

//绘制圆点-固定点位
function drawDot(canvas,x,y,text,poiType){
    
    canvas.beginPath();
    //绘制一个点begin
    var xd = x/0.05;
    var yd = -(y/0.05);
    // console.log(poiType,text)
    var img = new Image();
    if(poiType=='wlcmpoint'){
        if(highlight_show.usher_gray_highlight == 0){
            img.src ="../../../static/img/robotoper/迎宾.png";
        }else{

        }
        
    }else if(poiType=='takepoint'){
        if(highlight_show.fetch_gray_highlight == 0){
            img.src ="../../../static/img/robotoper/取物.png";
        }else{

        }
        
    }else if(poiType=='sendingpoint'){
        if(highlight_show.send_gray_highlight ==0){
            img.src ="../../../static/img/robotoper/送物.png"
        }else{

        }
        
    }else if(poiType=='poipoint'){
        if(highlight_show.general_gray_highlight == 0){
            img.src ="../../../static/img/robotoper/普通.png"
        }else{

        }
       
    }else if(poiType=='chargepoint'){
        if(highlight_show.charge_gray_highlight ==0){
            img.src ="../../../static/img/robotoper/充电.png"
        }else{

        }
        
    }else{
        if(highlight_show.charge_gray_highlight ==0){
            img.src ="../../../static/img/robotoper/充电.png"
        }else{

        }
    }
     //28*35
    //指定图片的URL
         canvas.drawImage(img, xd-14, yd-17);
    canvas.fill();
    //绘制一个点end
}
//封装socket，让前端socket连接我node的socket，node再用socket再连接第三方的socket，最后用node把第三方的socket传过来的数据，再用socket传给我前台页面
//根据名称获取地址栏里的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//鼠标右击  触发的结果
//阻止右击事件
window.onload = function () {
    document.oncontextmenu = function (e) {
      //  var e = event || window.event;
        return false;//取消右键点击的默认事件
    }
    document.onclick = function(e){
        // ('90鼠标左击')
    }
}

//右键事件
function clickRight(e) {
    e.preventDefault();
    e.stopPropagation();

    if(e.target.id=='canvas'){
        console.log(e.clientY,'1')
        $('#editPoint').hide()
        $('#delPoint').hide()
        $("#right-hand .set").show()
        $("#right-hand").css({
            "display": "block",
            "left": e.clientX - 630,//634 
            "top": e.clientY - 100   //105
        });

        
        var xxd = e.clientX - 380 - $("#canvas").width() / 2;
        var yyd = e.clientY - 55 - $("#canvas").width() / 2;
        var locationxy  =getLocation(e.clientX,e.clientY);
        
        sessionStorage.setItem('xd', $("#X").val());
        
        sessionStorage.setItem('yd', $("#Y").val());
        sessionStorage.setItem('mapid', mapid);
    }
}

$("#box-ri-con-img").on('mousedown', function(event){

    var e = event || window.event;
    //('e.which');(e.which);
    //console.log('e.button');console.log(e.button);

    if (e.button == 2) {

        // clickRight(e);
        clickLeft(e);
        console.log('鼠标右键')
    }
    else if (e.which === 3) {
        // clickRight(e);
        clickLeft(e);
        console.log('鼠标右键')
    }

    if (e.button == 0) {
        //clickLeft(e);
        clickRight(e);
        console.log('鼠标左键')
    }
    else if (e.which === 1) {
        //clickLeft(e);
        console.log('鼠标左键')
        clickRight(e);
    }
});

//右键-移动到该点位
$(".move").on('click', function (event){
    //console.log('移动');
    $("#right-hand").css({
        "display": "none",
    });
});

//右键-设置
$(".set").on('click', function (event) {
    //console.log('设置');
    layer.open({
        type: 2,
        title: '新增点位',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content: './manual.html'  // iframe的url
    });

    $("#right-hand").css({
        "display": "none",
    });
});


//充电-调用成功
// $('.recharge').click(function (){
//     var url=share+'/irobotweb/task/control/charingtask';
//     var param={};
//     param.hardwareno=hardwareno;//机器人硬件地址
//     param.name=robotid;        //机器人id
//     jsonStr=JSON.stringify(param);
//     $.ajax({
//         url: url,
//         crossDomain: true,
//         type: "POST",
//         xhrFields: {
//             withCredentials: true
//         },
//         dataType: "json",
//         contentType: "application/json; charset=utf-8",
//         data: jsonStr,
//         success: function (data) {
//             console.info('充电接口返回消息');
//             console.info(data);

//             if (data.code == 0) {
//                 parent.layer.msg(data.msg);
//                 window.location.reload();
//             } else {
//                 parent.layer.alert(data.msg);
//             }
//         },
//         error: function (request) {
//             layer.alert("Connection error");
//         }
//     });
// });

//取消充电-暂时先调用立即停止的接口
$('.cancel-recharge').click(function () {
    var url=share+'/irobotweb/task/control/shutdowntask';

    var param={};
    param.robothadware=hardwareno;//机器人硬件地址
    param.robotid=robotid;        //机器人id
    jsonStr=JSON.stringify(param);

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {

            console.info('立即停止接口返回消息');
            console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });
});

//绘制地图接口-开始绘制地图、中断绘制地图、完成绘制地图
$('.drawmap-item').click(function () {
    //alert($(this).text());
    var draw_txt=$(this).text();
    var url='';
    var url_start=share+'/irobotweb/sys/map/startbuildmap';  //开始扫图
    var url_cancel=share+'/irobotweb/sys/map/cancelbuildmap';//中断扫图
    var url_end=share+'/irobotweb/sys/map/endbuildmap';      //完成扫图

    var param={};
    param.mapid=taskDOList.mapId;       //地图id
    param.mapname=taskDOList.mapName;   //机器人id
    param.robothadware=hardwareno;     //机器人硬件地址
    param.robotid=robotid;             //机器人id
    param.message='';             //机器人id

    //console.info('taskDOList');
    //console.info(taskDOList);

    jsonStr=JSON.stringify(param);
    //console.info('jsonStr');
    //console.info(jsonStr);

    if(draw_txt=='开始绘制地图'){
        url=share+'/irobotweb/sys/map/startbuildmap';
    }else if(draw_txt=='中断绘制地图'){
        url=share+'/irobotweb/sys/map/cancelbuildmap';

    }else if(draw_txt=='完成绘制地图'){
        url=share+'/irobotweb/sys/map/endbuildmap';
    }

    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: jsonStr,
        success: function (data) {
            console.info('绘制地图接口返回消息');
            console.info(data);

            if (data.code == 0) {
                parent.layer.msg(data.msg);
                window.location.reload();
            } else {
                parent.layer.alert(data.msg);
            }
        },
        error: function (request) {
            layer.alert("Connection error");
        },
    });

});

var stompClient = null;
var  indicator =null;

function connect(hardwareno) {
    var ctrlNodesArr = [] ////路径上报的点位
    var ctrlNodesArr2 = [] ////路径上报的点位
    var dom = $('#canvas')[0]
    var x = [], y = [];
    var socket = new SockJS(share + "/ws");
    var canvasDom;
    var reg = new RegExp(":","g");//g,表示全部替换。
    var queue1 ='/user/'+hardwareno.replace(reg,"")+'/queue/message'
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame){
        stompClient.subscribe(queue1, function (response){
            if (!canvasDom){
                if (dom) {
                    canvasDom = dom.getContext("2d");
                }
            }
            var str = JSON.parse(response.body)

            var acquirejudge = str.event;
            
            switch(acquirejudge){
                case 'getCurrentMapInfo'://  地图
                    var bodydata = str.data;
                    var img = str.data.base64;

                    //document.getElementById('base-img').setAttribute('src', 'data:image/png;base64,' + img);
                    $('#base-img').attr('src','data:image/png;base64,' + img);

                    $("#box-ri-con-img").css({
                        "width": bodydata.mapInfoBean.width,
                        "height": bodydata.mapInfoBean.height
                    });

                    $("#base-img").css({
                        "width": bodydata.mapInfoBean.width,
                        "height": bodydata.mapInfoBean.height
                    });

                    canvas.width = bodydata.mapInfoBean.width;
                    canvas.height = bodydata.mapInfoBean.height;
                    canvasDom.translate($("#canvas").width() / 2, $("#canvas").height() / 2)

                    canvasDom.stroke();
                    break;
                case 'mapNowPoint': //点位上报
                    var pos = str.data.pos;
                    var vel =str.data.vel;
                    var xd = pos.x / 0.05 - 10;
                    var yd = -(pos.y / 0.05 + 20);
                    $("#X").html(pos.x);
                    $("#Y").html(pos.y);
                    $("#Yaw").html(pos.yaw);
                    var imgdd = document.getElementById("water-location");
                    canvasDom.clearRect(-$("#canvas").width() / 2, -$("#canvas").height() / 2, $("#canvas").width(), $("#canvas").height());
                    drawDotByDb()//固定点位
                    if (ctrlNodesArr2!=null){
                        var bezier4 = new BezierMaker(dom, ctrlNodesArr2, 'blue');
                        bezier4.drawBezier();
                    }
                    canvasDom.beginPath();
                    canvasDom.strokeStyle = "transparent";
                    canvasDom.arc(pos.x / 0.05, -pos.y / 0.05, 3, 0, 2*Math.PI, true);
                    canvasDom.drawImage(imgdd, xd-35, yd-21);
                    canvasDom.stroke();
                   
                    break;
                case 'mapRealPath': //运动路径上报
                    canvasDom.strokeStyle = "pink";
                    canvasDom.fillStyle = 'red';
                    canvasDom.lineWidth = 2
                    canvasDom.beginPath();
                    for (var i = 0; i < str.data.path.length; i++) {
                        var path = str.data.path[i];
                        x.push(path.x/0.05)
                        y.push(-(path.y/0.05))
                    }

                    for (j = 0; j < x.length; j++) {
                        var obj = {
                            x: x[j],
                            y: y[j],
                        }
                        ctrlNodesArr2.push(obj)
                    }
                    
                    var bezier4 = new BezierMaker(dom, ctrlNodesArr2, 'blue');
                    bezier4.drawBezier();
                    break;
                case 'mapMoveStatus': //运动状态上报
                    initmoveStatus(str.data.status);
                    break;
                case 'mapChargeStatus': //充电状态上报
                    initchargestatus(str.data.status);
                    break;
                case 'mapBaseStatus': //底盘基本状态上报
                    var data =str.data;
                    //base
                    if(data.base == 0){
                        $("#base").attr("class","green");
                    }else if(data.base == 1){
                        $("#base").attr("class","red");
                    }
                    //laswer 雷达
                    if(data.laswer == 0){
                        $("#laswer").attr("class","green");
                    }else if(data.laswer == 1){
                        $("#laswer").attr("class","red");
                    }
                    //odom
                    if(data.odom == 0){
                        $("#odom").attr("class","green");
                    }else if(data.odom == 1){
                        $("#odom").attr("class","red");
                    }
                    //uwb
                    if(data.uwb == 0){
                        $("#uwb").attr("class","green");
                    }else if(data.uwb == 1){
                        $("#uwb").attr("class","red");
                    }
                    console.log(data,'底盘状态')
                    if(data.base ==0){
                        $("#MapBaseStatus").html('正常')
                    }else if(data.base ==1){
                        $("#MapBaseStatus").html('异常')
                    }
                    break;
                case 'mapLocalStatus': //底盘定位状态上报(代表底盘当前是否定位成功)
                    initlocstatus(str.data.statu);
                    break;
                case 'mapEmergencyButtonStatus': //底盘急停开关的状态
                    console.log('底盘急停开关的状态')
                    break; 
                case 'mapReportStatus': //底盘运行信息
                    console.log('底盘运行信息')
                    break;
                case 'MapBatteryPower': //
                    console.log('电量','opop')
                    // $("#batterypower").html(data.status+"%")
                    break;
                case 'mapRobotStatus': //
                    console.log('电量')
                    switch (data.robotstatus){ 
                    case 0:$("#robotstatus").html("大待机"); 
                    break; 
                    case 1:$("#robotstatus").html("大工作中"); 
                    break; 
                    case 2:$("#robotstatus").html("大充电中"); 
                    break; 
                    case 3:$("#robotstatus").html("大移动中"); 
                    break;  
                    }
                    
                    break;
                case 'MapStatuslightStatus': //

                    $("#light").css("background-color",showRGB(str.data.status));
                    
                    break;
            }
            
        });
    });
}

function disconnect(){
    if (stompClient != null){
        stompClient.disconnect();
    }

}

//websocked  连接上

//  鼠标按下  鼠标长按
var timeStart, timeEnd, time;//申明全局变量

//获取此刻时间
function getTimeNow(){
    var now = new Date();
    return now.getTime();
}

// 触发移动的接口函数
function triggermove(message){
    var movedata = {
        "message": message,
        "robothadware": hardwareno,       //硬件地址   mac 地址
        "robotid":robotid
    };
    stompClient.send("/app/service/web", {}, JSON.stringify(movedata));
}

//结束移动的接口函数
//up上 down下 left左 right右
//鼠标按下时触发
//可以传参数
function holdDown(message) {
    timeStart = getTimeNow();//获取鼠标按下时的时间
    //setInterval会每100毫秒执行一次
    time = setInterval(function () {
        timeEnd = getTimeNow();//也就是每100毫秒获取一次时间
        //如果此时检测到的时间与第一次获取的时间差有1000毫秒
        triggermove(message)
        if (timeEnd - timeStart > 1000) {
            clearInterval(time);//便不再继续重复此函数 （clearInterval取消周期性执行）
            triggermove(message)
        }
    }, 200);
}

//鼠标抬起
function holdUp() {
    clearInterval(time);//如果按下时间不到1000毫秒便弹起，
    triggermove("stop");
    //console.log('hhh哈哈哈')
}



//键盘控制
document.onkeydown = function (e) {
    e = window.event || e;
    if(manualOperation == 1){
        switch (e.keyCode){
            case 37: //左键
                //console.log('左');
                triggermove("left");
                break;
            case 38: //向上键
                //console.log('上');
                triggermove("up");
                break;
            case 39: //右键
                //console.log('右');
                triggermove("right");
                break;
            case 40: //向下键
                //console.log('下');
                triggermove("down");
                break;
            default:
                break;
        }
    }
}

//键盘点击
document.onkeyup = function (e) {
    e = window.event || e;
    switch (e.keyCode) {
        case 37: //左键
            //console.log('抬起左');
            holdUp();
            break;
        case 38: //向上键
            //console.log('抬起上');
            holdUp();
            break;
        case 39: //右键
            //console.log('抬起右');
            holdUp();
            break;
        case 40: //向下键
            //console.log('抬起下');
            holdUp();
            break;
        default:
            break;
    }
}

function initmoveStatus(movestatus) {
    movestatus = parseInt(movestatus);
    switch(movestatus){
        case 0:
            $("#movestatus").val('开机待命中');
            break;
        case 1:
            $("#movestatus").val('导航结束(上次失败)');
            break;
        case 2:
            $("#movestatus").val('导航结束(上次成功)');
            break;
        case 3:
            $("#movestatus").val('移动中');
            break;
        case 4:
            $("#movestatus").val('前方有障碍');
            break;
        case 5:
            $("#movestatus").val('目的地不遮挡');
            break;
        case 6:
            $("#movestatus").val('用户取消导航');
            break;
        case 7:
            $("#movestatus").val('切换新目标点');
            break;
        case 8:
            $("#movestatus").val('因异常导航失败');
            break;
        case 9:
            $("#movestatus").val('');
            break;
        case 10:
            $("#movestatus").val('脱离轨迹');
            break;
    }
}

function initchargestatus(chargestatus) {
    chargestatus=parseInt(chargestatus)
   //充电状态  chargestatus
    switch(chargestatus) {
        case 0:
            $("#chargestatus").val('正常运行(未充电)');
            break;
        case 1:
            $("#chargestatus").val('连接底座充电');
            break;
        case 2:
            $("#chargestatus").val('连接电缆充电');
            break;
        case 3:
            $("#chargestatus").val('和充电座对接');
            break;
        case 4:
            $("#chargestatus").val('脱离充电座');
            break;
        case 5:
            $("#chargestatus").val('已充满但还在链接');
            break;
    }
}

function initlocstatus(locstatus) {
    //din定位  locstatus
    locstatus =parseInt(locstatus);
    switch(locstatus) {
        case 0:
            $("#locstatus").val('定位正常');
            break;
        case 1:
            $("#locstatus").val('准备定位中');
            break;
        case 2:
            $("#locstatus").val('未构建地图');
            break;
        case 3:
            $("#locstatus").val('构建地图中');
            break;
        case 4:
            $("#locstatus").val('UWB错误');
            break;
        case 5:
            $("#locstatus").val('回环检测');
            break;
    }
}
//鼠标移动的坐标
function getLocation(x, y) {

    var bbox = canvas.getBoundingClientRect();
    //原像素
    var xd =(x - bbox.left) * (canvas.width / bbox.width);
    var yd =(y - bbox.top) * (canvas.height / bbox.height);
    //平移
    xd =xd -canvas.width/2;
    yd =yd -canvas.height/2;

        // x: (xd+10)*0.05,
        // y: (yd-20)*0.05
    //保留4位小数
    xd = String(xd*0.05).replace(/^(.*\..{4}).*$/,"$1");
    yd = String(-yd*0.05).replace(/^(.*\..{4}).*$/,"$1"); 
// console.log(xd,'x坐标',yd,'y坐标')
    return {
        x: xd,
        y: yd
    };
}

//返回
$("#backtrack").on('click', function () {

    sessionStorage.setItem('robotOperation_back',1);
    var href=window.location.href;
    var href_back=href.replace('robot/RobotOperation/','').replace('control','index');
    window.location.href=href_back;

});



//rgb转16进制
function showRGB(lightcolor) {
    console.log(lightcolor,'lightcolorlightcolorlightcolor')
    if(lightcolor !==null){
        
        hexcode = "#";
        var colors =lightcolor.split(',');
    
        for (x = 0; x < 3; x++) {
            var n = colors[x];
            if (n == "") n = "0";
            if (parseInt(n) != n) return alert("请输入数字！");
            if (n > 255) return alert("数字在0-255之间！");
            var c = "0123456789ABCDEF", b = "", a = n % 16;
            b = c.substr(a, 1);
            a = (n - a) / 16;
            hexcode += c.substr(a, 1) + b
        }
        return hexcode;
    }
}

//16进制转rgb
function showRGB2(hexcode) {

    if (hexcode.substr(0, 1) == "#") a = a.substring(1);
    var len = hexcode.length;
    if (len != 6 && len != 3)
    {
        return alert("十六进制颜色码为六位或三位！");
    }
    else if (/[^0-9a-f]/i.test(a))
    {return alert("请输入正确的十六进制颜色码！");}

    a = a.toLowerCase();
    b = new Array();
    for (x = 0; x < 3; x++) {
        b[0] = len == 6 ? a.substr(x * 2, 2) : a.substr(x * 1, 1) + a.substr(x * 1, 1);
        b[3] = "0123456789abcdef";
        b[1] = b[0].substr(0, 1);
        b[2] = b[0].substr(1, 1);
        b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
    }
    return b[20] + "," + b[21] + "," + b[22];
}



