/**名称：Quartz CornExpression设计表单插件
 * 
 * @CreateBy: chngzhen@outlook.com
 * @CreateOn: 2017-08-01
 * @UpdateBy: chngzhen@outlook.com
 * @UpdateOn: 2017-12-04
 * 
 * @param json 配置信息
 * @returns {
 *      init(): 初始化CronExpression表单
 *      analysis(String): 翻译CronExpression为中文
 * }
 */
function CronExpForm(json) {
    let options={
        container:null,
        baseModifiers: [ {name:"在", value:""}, {name:"每", value:"*"}, {name:"从", value:"-"} ],
        dayMidifiers: [ {name:"在", value:""}, {name:"每", value:"*"}, {name:"从", value:"-"}, {name:"距", value:"W"}, {name:"不定", value:"?"}, {name:"最后", value:"L"} ],
        weekMidifiers: [ {name:"在", value:""}, {name:"每", value:"*"}, {name:"从", value:"-"}, {name:"第", value:"#"}, {name:"不定", value:"?"}, {name:"最后", value:"L"} ],
        submit: function() {}
    };
    $.extend(true, options, json);

    // 时间类型与中文名称的映射
    let chineseMap = {"year":"年", "month":"月", "week":"周", "day":"日", "hour":"时", "minute":"分", "second":"秒"};
    // 时间类型与修饰词组的映射
    let modifierMap = [
        {name:"year", chinese:chineseMap["year"], modifiers:options.baseModifiers},
        {name:"month", chinese:chineseMap["month"], modifiers:options.baseModifiers},
        {name:"week", chinese:chineseMap["week"], modifiers:options.weekMidifiers},
        {name:"day", chinese:chineseMap["day"], modifiers:options.dayMidifiers},
        {name:"hour", chinese:chineseMap["hour"], modifiers:options.baseModifiers},
        {name:"minute", chinese:chineseMap["minute"], modifiers:options.baseModifiers},
        {name:"second", chinese:chineseMap["second"], modifiers:options.baseModifiers}
    ];
    let $container = $(options.container);

    /**名称：初始化修饰词
     * 描述：不同的时间类型拥有不同的修饰词组，默认选择修饰词“每”（即CronExpression中的*）
     * @param name 时间单位唯一标识字符串
     * @param array 修饰词组
     * @return HTML字符串
     */
    function initModifier(name, array) {
        let result = 
            "<div style='flex:0 0 auto;margin-right:1px;'>"+
                "<select id='modifier_"+name+"' class='form-control' data-for='"+name+"'>";
        if("week"==name) {
            $.each(array, function(i, v) {
                result += "<option value='"+v.value+"' "+("?"==v.value?"selected='selected'":"")+">"+v.name+"</option>";
            });
        }else {
            $.each(array, function(i, v) {
                result += "<option value='"+v.value+"' "+("*"==v.value?"selected='selected'":"")+">"+v.name+"</option>";
            });
        }
        result +="</select>"+
            "</div>";
        return result;
    }

    /**名称：获取各个时间类型的表达式
     * @param name 时间类型标识
     * @return Cron表达式
     */
    function get(name) {
        let modifier=$("#modifier_"+name).val();
        let interval=$("#interval_"+name).val();
        switch(modifier) {
            case "":
                let timeIn = $("#timeIn_"+name).val();
                return timeIn+(""==interval?"":"/"+interval);
            case "*":
            case "?": return modifier;
            case "-":
                let startTime = $("#startTime_"+name).val();
                let endTime = $("#endTime_"+name).val();
                return startTime+"-"+endTime+(""==interval?"":"/"+interval);
            case "L":
                let timeLast = $("#timeLast_"+name).val();
                if("1"==timeLast || ""==timeLast) return modifier;
                else {
                    if("week"==name) return timeLast+modifier;
                    else return modifier+"-"+timeLast;
                }
            case "W": return $("#timeOn_"+name).val()+modifier;
            case "#": return $("#timeAt_"+name).val()+modifier+$("#num_"+name).val();
        }
    }

    let cronDiv = $("<div id='cronExpForm' style='display:flex;flex-flow:column nowrap;align-items:stretch;'></div>");

    return {
        init: function() {
            $.each(modifierMap, function(i, v) {
                let divTimeWrapper=
                    "<div id='divTimeWrapper_"+v.name+"' style='flex:0 0 auto;display:flex;align-items:center;margin-top:10px;'>"+
                        "<div id='divModifierWrapper_"+v.name+"' style='flex:0 0 auto;display:flex;align-items:center;'>"+
                            initModifier(v.name, v.modifiers)+
                        "</div>"+
                        "<div id='divInputWrapper_"+v.name+"' style='flex:1 1 auto;display:flex;align-items:center;'>"+
                            "<span>"+v.chinese+"</span>"+
                        "</div>"+
                    "</div>";
                cronDiv.append(divTimeWrapper);
            });
            cronDiv.append("<div class='row form-group'><input id='btnSubmit' type='button' value='自动生成' class='btn btn-primary pull-right'></div>");

            cronDiv.find("#divTimeWrapper_week").hide(); // 默认不指定时间-周

            cronDiv.find("select").on("change", function(e) {
                e.preventDefault();
                let $name=$(this).data("for");

                let $modifier=$(this).find("option:selected").val();
                switch($modifier) {
                    case "":
                        let result1=
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='timeIn_"+$name+"' placeholder='具体时间' class='form-control'/>"+
                            "</div>"+
                            "<span style='flex:0 0 auto;'>"+chineseMap[$name]+"&nbsp;每隔</span>"+
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='interval_"+$name+"' title='间隔时间' placeholder='间隔' class='form-control'>"+
                            "</div>"+
                            "<span style='flex:0 0 auto;'>"+chineseMap[$name]+"</span>";
                        $("#divInputWrapper_"+$name).html(result1);
                        break;
                    case "L":
                        let result2="";
                        if("week"==$name) {
                            result2=
                                "<span>一个&nbsp;周</span>"+
                                "<div style='flex:1 1 auto;'>"+
                                    "<input id='timeLast_"+$name+"' placeholder='不填默认为7，即周六' class='form-control'/>"+
                                "</div>";
                        }else {
                            result2=
                                "<span>&nbsp;第</span>"+
                                "<div style='flex:1 1 auto;'>"+
                                    "<input id='timeLast_"+$name+"' placeholder='不填默认为1，即最后一天' class='form-control'/>"+
                                "</div>"+
                                "<span>日</span>";
                        }
                        $("#divInputWrapper_"+$name).html(result2);
                        break;
                    case "#":
                        let result3=
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='num_"+$name+"' placeholder='' class='form-control'/>"+
                            "</div>"+
                            "<span style='flex:0 0 auto;'>个&nbsp;周</span>"+
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='timeAt_"+$name+"' placeholder='具体时间' class='form-control'/>"+
                            "</div>";
                        $("#divInputWrapper_"+$name).html(result3);
                        break;
                    case "W":
                        let result4=
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='timeOn_"+$name+"' placeholder='具体时间' class='form-control'/>"+
                            "</div>"+
                            "<span>"+chineseMap[$name]+"&nbsp;最近的工作日</span>";
                        $("#divInputWrapper_"+$name).html(result4);
                        break;
                    case "*":
                        $("#divInputWrapper_"+$name).html("<span>"+chineseMap[$name]+"</span>");
                        break;
                    case "-":
                        let result6 =
                            "<div style='flex:1 1 auto;margin-right:1px;'>"+
                                "<input id='startTime_"+$name+"' title='开始时间' placeholder='开始' class='form-control'>"+
                            "</div>"+
                            "<span style='flex:0 0 auto;'>"+chineseMap[$name]+"&nbsp;到&nbsp;</span>"+
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='endTime_"+$name+"' title='结束时间' placeholder='结束' class='form-control'>"+
                            "</div>"+
                            "<span style='flex:0 0 auto;'>"+chineseMap[$name]+"&nbsp;每隔</span>"+
                            "<div style='flex:1 1 auto;'>"+
                                "<input id='interval_"+$name+"' title='间隔时间' placeholder='间隔' class='form-control'>"+
                            "</div>"+
                            "<span style='flex:0 0 auto;'>"+chineseMap[$name]+"</span>";
                        $("#divInputWrapper_"+$name).html(result6);
                        break;
                    case "?":
                        $("#divTimeWrapper_"+$name+" select option[selected='selected']").removeAttr("selected");
                        $("#divTimeWrapper_"+$name+" select option[value='?']").attr("selected", true);
                        $("#divTimeWrapper_"+$name).hide();

                        let hiddenName = ("week"==$name?"day":"week");
                        $("#divTimeWrapper_"+hiddenName+" select option[selected='selected']").removeAttr("selected");
                        $("#divTimeWrapper_"+hiddenName+" select option[value='*']").attr("selected", true);
                        $("#divTimeWrapper_"+hiddenName).show();
                        break;
                }
            });

            // 提交事件
            cronDiv.find("#btnSubmit").on("click", function(e) {
                e.preventDefault();
                let result = get("second")+" "+get("minute")+" "+get("hour")+" "+get("day")+" "+
                            get("month")+" "+get("week")+" "+get("year");
                console.log(result)
                $container.hide();
                options.submit(result);
            });

            $container.append(cronDiv);
        },
        /**Cron表达式解析函数
         * 状态：已发布
         * @param cronExpression Cron表达式
         * @return 字符串，格式：*年 *月 *日(间隔n日) *时 *分 *秒
         */
        analysis: function(cronExpression) {
            let chineseArray = ["秒", "分", "时", "日", "月", "周", "年"]; // cronExpression对应的中文单位数组
            let length = chineseArray.length; // cronExpression的长度。以中文单位数组为准
            let cronArray = cronExpression.split(" "); // cronExpression表达式数组

            let results = new Array(); // 翻译结果集
            /**翻译cronExpression表达式数组
             * 1：考虑到秒、分、时、日、月、年的数字都在单位的前面，所以放在baseAnalysis里面一起处理；
             * 2：周的数字放在单位后面，在weekAnalysis中单独处理。
             * 3：翻译结果集存放的顺序：年、周、月、日、时、分、秒，需要将周放到日的位置上
             */
            $.each(cronArray, function(i, v) {
                // 1
                if(5!=i) {
                    results[length-i-1] = baseAnalysis(v).replace(/\$/g, chineseArray[i]);
                    results[length-i-1] = ""==results[length-i-1]?"":results[length-i-1]+" ";
                }
                // 2
                else {
                    results[length-i-1] = weekAnalysis(v).replace(/\$/g, chineseArray[i]);
                    results[length-i-1] = ""==results[length-i-1]?"":results[length-i-1]+" ";

                    // 3
                    // 将day of week的翻译和day of month的翻译拼接在一起，并覆盖原day of month的翻译
                    results[length-i+1] = results[length-i+1]+results[length-i-1];
                    // 清空day of week的翻译
                    results[length-i-1] = "";
                }
            })

            let result = "";
            $.each(results, function(i, v) { result+="undefined"==typeof v?"":v; });
            return result;


            function baseAnalysis(str) {
                let result = "";
                let tempArray;
                if("*"==str) result += "每$";
                else {
                    if(0<=str.indexOf("-")) {
                        tempArray = str.split("-");
                        result += "从"+tempArray[0]+"$到"+tempArray[1]+"$";
                    }else if(0<=str.indexOf("/")) {
                        tempArray = str.split("/");
                        result += tempArray[0]+"$(间隔"+tempArray[1]+"$)";
                    }else if(0<=str.indexOf(",")) {
                        $.each(str.split(","), function(i, v) { result += v+"$,"; });
                        result = result.substring(0, result.length-1);
                    }else if(0<=str.indexOf("?")) {
                    }else if(0<=str.indexOf("L")) {
                        tempArray = str.split("L");
                        if(""==tempArray[0]) result += "最后一$";
                        else result += "最后一个"+tempArray[0]+"$";
                    }else if(0<=str.indexOf("W")) {
                        tempArray = str.split("W");
                        result += tempArray[0]+"$最近的一周";
                    }else {
                        result += str+"$";
                    }
                }
                return result;
            }

            function weekAnalysis(str) {
                let result = "";
                let tempArray;
                if("*"==str) result += "每日";
                else {
                    if(0<=str.indexOf("-")) {
                        tempArray = str.split("-");
                        result += "从$"+tempArray[0]+"到$"+tempArray[1];
                    }else if(0<=str.indexOf("/")) {
                        tempArray = str.split("/");
                        result += "$"+tempArray[0]+"(间隔"+tempArray[1]+"天)";
                    }else if(0<=str.indexOf(",")) {
                        $.each(str.split(","), function(i, v) { result += "$"+v+","; });
                        result = result.substring(0, result.length-1);
                    }else if(0<=str.indexOf("?")) {
                    }else if(0<=str.indexOf("L")) {
                        tempArray = str.split("L");
                        result += "最后一个$"+tempArray[0];
                    }else if(0<=str.indexOf("#")) {
                        tempArray = str.split("#");
                        result += "第"+tempArray[1]+"个$"+tempArray[0];
                    }else result += "$"+str;
                }
                return result;
            }
        }
    };
}




