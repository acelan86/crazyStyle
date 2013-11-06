/**
 * browseraction
 * 该文件是浏览器图标js，负责下拉菜单事件绑定。
 * @author fedeoo <tragedymi[at]163.com>
 * @version 1.0
 */
window.onload = function () {
    BrowserAction.init();
}
/**
 * @global
 * @namespace
 * @name BrowserAction
 */
var BrowserAction = {
    options: {
        enable: true
    },


    init: function () {
        BrowserAction.bindEvent();
    },

    /**
     * [bindEvent 绑定下拉事件]
     */
    bindEvent: function () {
        var enableBtn = document.querySelector('.enable');
        enableBtn.onclick = BrowserAction._getEnableClickHandler(enableBtn);

        var foolsBtn = document.querySelector('.foolsBtn');
        foolsBtn.onclick = BrowserAction._getFoolsClickHandler(foolsBtn);
    },
    /**
     * [_getEnableClickHandler 点击处理事件，发送消息给contentscript]
     * @param  {[DOM]} enableBtn [页面节点]
     */
    _getEnableClickHandler: function (enableBtn) {
        var bg = chrome.extension.getBackgroundPage(); 
        return function () {
            if (bg.utilCPU.options.enable === false) {
                bg.utilCPU.options.enable = true;
                enableBtn.classList.add('active');
                bg.utilCPU.turnon();
            } else {
                bg.utilCPU.options.enable = false;
                enableBtn.classList.remove('active');
                bg.utilCPU.turnoff();
            }
        };
    },

    /**
     * [_getFoolsClickHandler 愚人节点击处理事件，发送消息给contentscript]
     * @param  {[DOM]} enableBtn [页面节点]
     */
    _getFoolsClickHandler: function (foolsBtn) {
        var bg = chrome.extension.getBackgroundPage(); 
        return function () {
            if (foolsBtn.classList.contains('active')) {
                foolsBtn.classList.remove('active');
                bg.utilCPU.sendMessageToCurrentTab({type:'system', cmd:{foolsStyle : 'disable'}});
            } else {
                foolsBtn.classList.add('active');
                bg.utilCPU.sendMessageToCurrentTab({type:'system', cmd:{foolsStyle : 'enable'}});
            }
        };
    }
}