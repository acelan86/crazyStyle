(function (window) {
    var domContent = [];
    domContent.push(
        '<div id="sky">',
            '<div id="stars"></div>',
            '<div id="twinkling"></div>',
            '<div id="clouds"></div>',
        '</div>');
    document.body.innerHTML = domContent.join('') +  document.body.innerHTML;

    ////百度搜索框 kw 谷歌gbqfq 不知道变不变
    var searchInput = document.querySelector('#kw') || document.querySelector('#gbqfq') || null;
    if (searchInput) {
        searchInput.oninput = function (event) {
            if (event.target.value === '天黑了') {
                var musicContent = [];
                musicContent.push(
                    '<div class="wrapper" style="position:absolute;z-index:3;left:50%;margin-left:-150px;">',
                        '<audio src="http://fedeoo.github.io/images/lonely.mp3" controls autoplay loop> ',
                        '</audio>',
                    '</div>');
                musicContent.join('')
                document.body.innerHTML = musicContent.join('') + document.body.innerHTML;
            }
        };
    }
})(window);