$(".list-card:first").waitUntilExists(initFlexyTrello, true);
function initFlexyTrello() {

    var headers = $(".list-header");
    var headerPaddingTop = cssPxToInt(headers.css("padding-top"));
    var headerPaddingBottom = cssPxToInt(headers.css("padding-bottom"));
    var headerPaddingLeft = cssPxToInt(headers.css("padding-left"));
    var headerHeight = cssPxToInt(headers.css("height"));

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

    //PROD
    $.get("chrome-extension://pggiemacedhgohmpcgdpceckeicjlgfn/style/override.css", callback);
    //DEV $.get("chrome-extension://odcejgfkabanfoikamfpcdpcpoepkmfj/style/override.css", callback);

    function callback(data) {
        addCSSStyleSheet(strReplace(data));
        getPreviousState();
    }

    function addUI() {
        //Add a collapse button
        headers.prepend("<a href='#' class='x-btn-collapse icon-sm'>-</a>");
        //Add an expand button
        headers.prepend("<a href='#' class='x-btn-expand icon-sm'>+</a>");

        //Collapse Button click handler
        $(".x-btn-collapse").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent().parent();
            collapse(listElement);
            localStorage.setItem('list_state_' + listElement.attr("id"), "true");
        });

        //Expand button click handler
        $(".x-btn-expand").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent().parent();
            expand(listElement);
            localStorage.setItem('list_state_' + listElement.attr("id"), "false");
        });

        //Add a increase width button
        $(".list").append("<a href='#' class='x-btn-step-increment'>&#8594;</a>");
        $(".x-btn-step-increment").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent();
            var step = localStorage.getItem('list_step_' + listElement.attr("id")) || 1;
            step++;
            setSizeFromStep(listElement, step);
            localStorage.setItem('list_step_' + listElement.attr("id"), step);
        });
        //Add a decrease width button
        $(".list").append("<a href='#' class='x-btn-step-decrement'>&#8592;</a>");
        $(".x-btn-step-decrement").on("click", function (elem) {
            var listElement = $(elem.currentTarget).parent();
            var step = localStorage.getItem('list_step_' + listElement.attr("id")) || 1;
            if (step) {
                step--;
                setSizeFromStep(listElement, step);
                localStorage.setItem('list_step_' + listElement.attr("id"), step);
            }
        });

    }

    function collapse(element) {
        $(element).addClass("x-collapsed");
    }

    function expand(element) {
        $(element).removeClass("x-collapsed");
    }


    function setSizeFromStep(element, step) {
        var newWidth = cssPxToInt(CSSContext.listWidth) * step - 10 * (step - 1) + 15;
        $(element).css("width", newWidth + "px");
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
            command: 'getBoardId',
            id: findFirstCardId()
        }, function (data) {
            if (data.idBoard !== undefined) {
                chrome.extension.sendMessage({
                    command: 'getBoardDetail',
                    id: data.idBoard
                }, function (data) {
                    $('.list').each(function (index, element) {
                        if (data.lists[index]) {
                            $(element).attr("id", data.lists[index].id);
                        }
                    });
                    restoreState();
                });
            }
            addUI();
        });
    }

    function restoreState() {
        $('.list').each(function (index, element) {
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

    function findFirstCardId() {
        return $('a.list-card-title:first').attr('href').split('/')[2];
    }
}

chrome.runtime.onMessage.addListener(function (message) {
    if (message.command == 'reset') {
        reset();
    }
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