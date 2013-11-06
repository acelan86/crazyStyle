(function (window) {
    var options = [];
    var bkg = chrome.extension.getBackgroundPage();
    loadOptions();
    document.querySelector('#addEffect').onclick = function () {
        var aOption = {};
        aOption.name = document.querySelector('input[name="name"]').value || '';
        aOption.match = document.querySelector('input[name="match"]').value || '';
        aOption.styleURL = document.querySelector('input[name="styleURL"]').value || '';
        aOption.jsURL = document.querySelector('input[name="jsURL"]').value || '';
        addOption(aOption);
    };
    document.querySelector('#save').onclick = function () {
        // localStorage['crazyStyle'] = JSON.stringify(options);
        bkg.settings.options =  options;
    };
    document.querySelector('#list').onclick = function (event) {
        if (event.target.classList.contains('rd')) {
            removeOption(event.target.getAttribute('data-name'));
        }
    };
    function displayTable () {
        options = options || [];
        var contents = [];
        var tbhead = '<tr><th>效果名称</th><th>匹配URL</th><th>样式URL</th><th>脚本URL</th><th>操作</th></tr>';
        var tpl = '<tr><td>#{name}</td><td>#{match}</td><td>#{styleURL}</td>'+
        '<td>#{jsURL}</td><td><a class="rd" href="javascript:void(0);"data-name="#{name}">移除</a><td></tr>';
        for (var i = options.length - 1; i >= 0; i--) {
            contents.push(format(tpl, options[i]));
        };
        document.querySelector('#list').innerHTML = tbhead + contents.join('');

        // if (document.querySelector('.rd')) {
        //     var allRds = document.querySelectorAll('.rd');
        //     for (var i = allRds.length - 1; i >= 0; i--) {
        //         allRds[i].onclick = function (event) {
        //             this.onclick = null;
        //             removeOption(this.getAttribute('data-name'));
        //         }
        //     }
        // }
    }

    function format (source, data) {
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            return data[key] || '';
        });
    }

    function loadOptions () {
        // var optionsString = bkg.settings.options;
        // options = JSON.parse(optionsString) || [];
        options = bkg.settings.options;
        displayTable();
    }

    function addOption (newOption) {
        options.push(newOption);
        displayTable();
    }

    function removeOption (name) {
        for (var i = options.length - 1; i >= 0; i--) {
            if (options[i].name == name) {
                options.splice(i, 1);
                break;
            }
        }
        displayTable();
    }
})(window);