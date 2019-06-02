

(function ($) {
    $.fn.datetimepicker.dates['zh-CN'] = {
        days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        daysMin: ['日', '一', '二', '三', '四', '五', '六'],
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        today: '今天',
        suffix: [],
        meridiem: [],
        weekStart: 1,
        format: 'yyyy-mm-dd',
        clear:'Clear'
    };
}(jQuery));

//简化时间控件
function loaddate(ele) {

    var $datetime_child='<input type="text" name="c-datetime" class="form-control" disabled/>'+
    '<span class="input-group-addon">'+
    '<span class="glyphicon glyphicon-calendar"></span>'+
        '</span>';

    ele.append($datetime_child);

    ele.datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        //defaultDate: getNowDateStr(),
        minView: "month",
        autoclose: 1,
        endDate : new Date() //设置可选的日期不超过今天
    });

    setdatetime(ele,getNowDateStr());//设置为当前日期
}

//获取日期
function getdatetime(ele,t) {
    var t_str=ele.find("input").val();
    var t_hsm = new Date(t_str);

    if(t==0){
        return t_str;//返回字符串
    }else if(t==1){
        return t_hsm;//返回日期对象
    }
}

//设置日期
function setdatetime(ele,val) {
    ele.find("input").val(getNowFormatDate(val,0));//生日
}

//将日期格式转换
function getNowFormatDate(t,f) {
    var date = new Date(t);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate='';
    if(f==1) //时分秒
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    }
    else
    {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    }

    return currentdate;
}

//获取当前日期的字符串
function getNowDateStr(){
    var date = new Date();
    var seperator1 = "-";

    var month = date.getMonth() + 1;
    var strDate = date.getDate();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate='';
    currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}














