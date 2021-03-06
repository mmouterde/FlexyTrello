function initFlexyTrello() {
    var headers = $(".list-header");
    var headerPaddingTop = cssPxToInt(headers.css("padding-top"));
    var headerPaddingBottom = cssPxToInt(headers.css("padding-bottom"));
    var headerPaddingLeft = cssPxToInt(headers.css("padding-left"));
    var headerHeight = 35;

    var list = $(".list");
    var listPaddingTop = cssPxToInt(list.css("padding-top"));
    var listPaddingBottom = cssPxToInt(list.css("padding-bottom"));
    var listWidth = list.css("width");

    var CSSContext = {
        listCardWidth: $(".list-card").css("width"),
        headerTranslate: cssPxToInt(listWidth) - headerPaddingLeft,
        listReducedWidth: headerHeight + headerPaddingTop + headerPaddingBottom + listPaddingTop + listPaddingBottom,
        listWidth: listWidth,
        headerWidth: headers.css("width")
    };

    $.get("chrome-extension://" + chrome.runtime.id + "/style/override.css", callback);

    function callback(data) {
        addCSSStyleSheet(strReplace(data));
        getPreviousState();
    }

    function addUI() {

        var extrasMenu = $(".list-header-extras .list-header-extras-menu");

        //Add a collapse button
        extrasMenu.before("<a class='dark-hover x-btn x-btn-collapse icon-sm' href='#'>-</a>");
        //Add an expand button
        extrasMenu.before("<a class='dark-hover x-btn x-btn-expand icon-sm' href='#'>+</a>");

        //Collapse Button click handler
        $(".x-btn-collapse").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent().parent().parent();
            collapse(listElement);
            localStorage.setItem('list_state_' + listElement.attr("id"), "true");
        });

        //Expand button click handler
        $(".x-btn-expand").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent().parent().parent();
            expand(listElement);
            localStorage.setItem('list_state_' + listElement.attr("id"), "false");
        });

        //Add a fake content if 'add new card' is not shown the button are hidden
        list.append("<span class='placeholder'>&nbsp;</span>");

        //Add a increase width button
        list.append("<a href='#' class='x-btn-step-increment'>&#8594;</a>");
        $(".x-btn-step-increment").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent();
            var listId = listElement.attr("id");

            var step = listElement[0].step || 1;
            if (listId) {
                step = localStorage.getItem('list_step_' + listId) || 1;
            }

            step++;
            listElement[0].step = step;
            setSizeFromStep(listElement, step);
            if (listId) {
                localStorage.setItem('list_step_' + listId, step);
            }
        });
        //Add a decrease width button
        list.append("<a href='#' class='x-btn-step-decrement'>&#8592;</a>");
        $(".x-btn-step-decrement").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent();
            var listId = listElement.attr("id");

            var step = listElement[0].step || 1;
            if (listId) {
                step = localStorage.getItem('list_step_' + listId) || 1;
            }
            step--;
            setSizeFromStep(listElement, step);
            if (listId) {
                localStorage.setItem('list_step_' + listId, step);
            }
        });

    }

    function collapse(element) {
        $(element).parent().addClass("x-collapsed");
    }

    function expand(element) {
        $(element).parent().removeClass("x-collapsed");
    }


    function setSizeFromStep(element, step) {
        var scrollbarWidth = 9;
        var listWapperWidth = cssPxToInt(CSSContext.listWidth) - cssPxToInt(CSSContext.listCardWidth);
        var newWidth = (cssPxToInt(CSSContext.listCardWidth) + 6 ) * step + listWapperWidth + scrollbarWidth;
        $(element).parent().css("width", newWidth + "px");
        if (step > 1) {
            $(element).children(".x-btn-step-decrement").show();
        } else {
            $(element).children(".x-btn-step-decrement").hide();
        }
    }

    function addCSSStyleSheet(generatedCSS) {
        $(document.head).append($("<style rel='stylesheet' type='text/css'>" + generatedCSS + "</style>"));
    }

    function cssPxToInt(cssValue) {
        if (cssValue)
            return parseInt(cssValue.substr(0, cssValue.indexOf("p")));
        else
            return 0;
    }

    function strReplace(string) {
        var reg = new RegExp("{{(.*)}}", "gi");
        var result = string;
        var match;
        while ((match = reg.exec(string)) !== null) {
            result = result.replace(match[0], CSSContext[match[1]]);
        }
        return result;
    }

    function getPreviousState() {
        chrome.extension.sendMessage({
                    command: 'getBoardDetail',
                    id: document.URL.split('/')[4]
                }, function (data) {
                    $('.list').each(function (index, element) {
                        if (data.lists[index]) {
                            $(element).attr("id", data.lists[index].id);
                        }
                    });
                    restoreState();
                });
            addUI();
    }

    function restoreState() {
        list.each(function (index, element) {
            var id = $(element).attr("id");
            if (id) {
                var state = localStorage.getItem('list_state_' + id);
                if (state && state === "true") {
                    collapse(element);
                }
                var step = localStorage.getItem('list_step_' + id);
                if (step) {
                    setSizeFromStep(element, parseInt(step));
                }
            }
        });
    }
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message.command === 'reset') {
        reset();
    }
    if (message.command === 'init') {
        initOnce()
    }
    return true;
});


function reset() {
    var keysToRemove = [];
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        var key = localStorage.key(i);
        if (key.indexOf("list_") === 0) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(function (key) {
        localStorage.removeItem(key);
    });
    window.location.reload();
}


function initOnce() {
    if ($(".x-btn-step-decrement").length === 0) {
        $(".list-card:first").waitUntilExists(function () {
           setTimeout(initFlexyTrello,3000);
        }, true);
    }
}

initOnce();
