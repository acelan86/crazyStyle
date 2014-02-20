/**
 * background
 * 该文件是后台处理程序，对页签新建、更新绑定处理。初始加载处理。
 * @author fedeoo <tragedymi[at]163.com>
 * @version 1.0
 */
window.onload = function () {
    utilCPU.init();
}

var settings = {
    get options() {
      return JSON.parse(localStorage['options'] || '[]') || [];
    },
    set options(val) {
      localStorage['options'] = JSON.stringify(val);
    }
};
/**
 * @global
 * @namespace
 * @name utilCPU
 */
var utilCPU = {
    /**
     * option信息
     * @type {object}
     */
    options: {
        enable: true,
        customList: []
    },
    /**
     * [init 载入扩展，执行绑定和初始操作]
     */
    init: function () {
        this.reloadContentScript();
        this.turnon();
        chrome.tabs.onCreated.addListener(this._getTabCreatedHandler());
        chrome.tabs.onUpdated.addListener(this._getTabUpdateHandler());
        this.getRemoteData();
    },

    getRemoteData: function () {
        var xhr = new XMLHttpRequest();
        var url = 'http://www.baidu.com';
        xhr.open('GET', url);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
            }
        }
    },
    /**
     * [reloadContentScript 当重新载入扩展时，之前打开页面不存在contentScript，需要重新载入]
     */
    reloadContentScript: function () {
        chrome.tabs.query({}, function (tabs) { 
            for (var i = tabs.length - 1; i >= 0; i--) {
                chrome.tabs.executeScript(tabs[i].id, { file: "contentscript.js" }, function () {
                });
            }
        });
    },
    /**
     * [turnon 发送启用美化样式指示给全部页签]
     */
    turnon: function () {
        this.sendMessageToAllTabs({type:'system', cmd:{globalStyle: 'enable'}});
    },
    /**
     * [turnoff 发送关闭美化样式指示给全部页签]
     */
    turnoff: function () {
        this.sendMessageToAllTabs({type:'system', cmd:{globalStyle: 'disable'}});
    },

    /**
     * [_getTabCreatedHandler 创建页签时触发--这儿只处理打开的是空白页签]
     * 但是下面的代码不起作用 cry......
     */
    _getTabCreatedHandler: function () {
        /**
         * [创建页签的绑定处理函数]
         * @param  {[Tab]} tab [页签对象]
         */
        return function (tab) {
            /*
            if (/^chrome-search/.test(tab.url) || tab.title === '打开新的标签页') {//就是插入不进空白页签内
            //正常页面可能是https http file chrome://...没有一个唯一的标示符表明是空白页签
                chrome.tabs.executeScript(tab.id, { file: "contentscript.js" }, function () {
                });
                chrome.tabs.sendMessage(tab.id, {globalStyle: 'enable'}, function (response) {
                    // console.log('add Style success in tab');
                });
            }
            */
            //将百度 google首页当空白页处理
            if (tab.url === 'http://www.baidu.com/' || tab.url === 'http://www.google.com/'
                || tab.url === 'https://www.google.com/' || tab.url === 'https://www.google.com.hk/') {
                var now  = new Date();
                if (now.getHours() >= 20) {//night
                    chrome.tabs.sendMessage(tab.id, {type:'system', nightSkyStyle: 'enable'}, function (response) {
                    // console.log('add Style success in tab');
                    });
                }
            }
        };
    },

    /**
     * [_getTabUpdateHandler 页面URL变化都会触发update]
     */
    _getTabUpdateHandler: function () {
        var me = this;
        /**
         * [更新页签的绑定处理函数]
         * @param  {[Tab]} tab [页签对象]
         */
        return function (tabId, changeInfo, tab) {
            //将百度 google首页当空白页处理
            if (tab.url === 'http://www.baidu.com/' || tab.url === 'http://www.google.com/'
                || tab.url === 'https://www.google.com/' || tab.url === 'https://www.google.com.hk/') {
                var now  = new Date();
                if (now.getHours() >= 20 || now.getHours() <= 5) {//night
                    chrome.tabs.sendMessage(tab.id, { type:'system', cmd:{nightSkyStyle: 'enable'}}, function (response) {
                    // console.log('add Style success in tab');
                    });
                }
            }
            if (me.options.enable === true) {
                // chrome.tabs.executeScript(tabId, { file: "contentscript.js" }, function () {
                // });
                chrome.tabs.sendMessage(tabId, {type: 'system', cmd:{globalStyle: 'enable'}}, function (response) {
                    // console.log('add Style success in tab');
                });
            }

            var url = tab.url;
            if (settings.options) {
                var options = settings.options;
                for (var i = options.length - 1; i >= 0; i--) {
                    if (url.indexOf(options[i].match) !== -1) {
                        chrome.tabs.sendMessage(tabId, {type:'user', cmd:options[i]}, function (argument) {
                            // 
                        })
                    }
                };
            }

        };
    },

    /**
     * [sendMessageToAllTabs 给所有标签发送消息]
     * @param  {[any]} message [消息内容]
     */
    sendMessageToAllTabs: function (message) {
        chrome.tabs.query({}, function (tabs) { 
            for (var i = tabs.length - 1; i >= 0; i--) {
                chrome.tabs.sendMessage(tabs[i].id, message, function (response) {
                });
            }
        });
    },

    /**
     * [sendMessageToCurrentTab 发送到当前激活页签，多个窗口可能有多个激活页签]
     * @param  {[any]} message [消息内容]
     */
    sendMessageToCurrentTab: function (message) {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            for (var i = tabs.length - 1; i >= 0; i--) {
                chrome.tabs.sendMessage(tabs[i].id, message, function (response) {
                });
            }
        });
    },

    handlerUserSetting: function () {
        var options = settings.options;
    }
}