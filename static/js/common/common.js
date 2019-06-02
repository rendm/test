//所属开发者下拉框加载
/**
 * 开发者列表
 */

/**
 * 用户信息
 * @returns {any}
 */


$.extend({
    user : function() {
        var userJsonStr = sessionStorage.getItem('user');
        var user = JSON.parse(userJsonStr);
        //console.log('御魂身份')
        return user;
    },
    load_developer :function() {
        var html ="";
        var userJsonStr = sessionStorage.getItem('user');
        var user = JSON.parse(userJsonStr);
        var op = '';
        if("admin"==user.position ||"superadmin"==user.position)
        {
            $.ajax({
                url: share+'/irobotweb/sys/user/query/developer',
                type: "get",
                async : false,
                dataType: "json",
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (json) {
                    var op = '';
                    json.forEach(function(item){
                        op +='<option value="'+item.genid+'">'+item.name+'</option>';
                    });
                     
                     html =html + '<div class="form-group"><label class="col-sm-3 control-label">所属开发者：</label>' +
                    '<div class="col-sm-8">' +
                    '<select id="developerid" name="developerid" class="form-control"  >' +
                    op+  
                    '</select>' +
                    '</div></div>';         
                    return ;
                }
            });

        }else
        {
            html =html + '<div class="form-group" hidden><label class="col-sm-3 control-label ">所属开发者：</label>' +
            '<div class="col-sm-8">' +
            '<select id="developerid" name="developerid" class="form-control"  >' +
               '<option value="'+user.developerid+'">'+user.developerid +'</option>'
            '</select>' +
            '</div></div>';      

        }
    
   
    return html;
   },
    isEm:function (v) {
        if(v==0 || v=='' || v==null || v==undefined)return true;
        else return false;
    }
  
});








/*
* 替换字符串中所有符合的字符
* @param ASource 源字符串
* @param AFindText 待替换字符
* @param ARepText 替换后字符
* @return
*/
jQuery.mReplaceAll = function (ASource,AFindText, ARepText) {
    var raRegExp = new RegExp(AFindText, "g");
    return ASource.replace(raRegExp, ARepText);
};

/*
* 判断object是否空，未定义或null
* @param object
* @return
*/
jQuery.mIsNull = function (obj) {
    if (obj == "" || typeof(obj) == "undefined" || obj == null) {
        return true;
    }
    else {
        return false;
    }
};

/*
* 获取URL参数
* @param name 参数
* @return
*/
jQuery.mGetUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};