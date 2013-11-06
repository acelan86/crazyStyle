/**
 * contentscript
 * 真正能够操作页面DOM的脚本程序。
 * 该脚本监听background的指示。负责往页面插入、移除相应js/css文件。
 * 因为代码片段不利管理，采用整个文件的方式。
 * @author fedeoo <tragedymi[at]163.com>
 * @version 1.0
 */

// console.log('why???');
/* contentscript 在每个页面的独立环境执行 */
// debugger;
var CONFIG = {
    CSSMap:{
        'globalStyle': 'css/qindeoo.css',
        'foolsStyle': 'css/april-fools.css',
        'nightSkyStyle': 'css/nightsky.css'
    },
    JSMap: {
        'nightSkyStyle': 'modulejs/nightsky.js'
    }
};
/**
 * [接收消息并执行对应操作]
 * @param  {[type]} request      [消息请求正文]
 * @param  {[type]} sender       [description]
 * @param  {[type]} sendResponse [description]
 */
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    //━ ━．━\r．．\r━．
    console.debug("━ ━．━\r\t．．\r\t━．");
    if (request.type === 'system') {
        var cmd = request.cmd;
        for (var prop in cmd) {
            if (cmd.hasOwnProperty(prop)) {
                if (cmd[prop] === 'enable') {
                   CONFIG.CSSMap[prop] && addStyleFile(chrome.extension.getURL(CONFIG.CSSMap[prop]));
                   CONFIG.JSMap[prop] && addJsFile(chrome.extension.getURL(CONFIG.JSMap[prop]));
                } else if (cmd[prop] === 'disable') {
                    CONFIG.CSSMap[prop] && removeStyleFile(chrome.extension.getURL(CONFIG.CSSMap[prop]));
                    CONFIG.JSMap[prop] && removeJsFile(chrome.extension.getURL(CONFIG.JSMap[prop]));
                }
            }
        }
    } else if (request.type === 'user') {
        var cmd = request.cmd;
        cmd.styleURL && addStyleFile(cmd.styleURL);
        cmd.jsURL && addJsFile(cmd.jsURL);
    }
    
});

/**
 * [addStyleFile 在页面插入css文件，当然也可以是网络资源，如果是扩展资源需要在清单中配置]
 * @param {[String]} fileName [文件名称，包括全部路径]
 */
function addStyleFile (fileName) {
    if (document.head.querySelector('link[href="' + fileName + '"]')) {
        return ;
    }
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = fileName;
    (document.head || document.documentElement).appendChild(style);
}

/**
 * [removeStyleFile 在页面移除之前添加的css文件]
 * @param  {[String]} fileName [文件名称，包括全部路径]
 */
function removeStyleFile (fileName) {
    var style = document.head.querySelector('link[href="' + fileName + '"]');
    if (style) {
        style.remove();
    }
}

/**
 * [addJsFile 在页面插入JS文件]
 * @param {[String]} fileName [文件名称，包括全部路径]
 */
function addJsFile (fileName) {
    if (document.head.querySelector('script[src="' + fileName + '"]')) {
        return ;
    }
    var script = document.createElement("script"); 
    script.type = "text/javascript"; 
    script.charset = "utf-8";
    script.src = fileName; 
    (document.head || document.documentElement).appendChild(script); 
}
/**
 * [removeJsFile 在页面移除已插入的JS文件]
 * @param  {[type]} fileName [文件名称，包括全部路径]
 */
function removeJsFile (fileName) {
    var script = document.head.querySelector('script[src="' + fileName + '"]');
    if (script) {
        script.remove();
    }
}