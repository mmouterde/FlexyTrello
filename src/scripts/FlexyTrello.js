$(".list-card:first").waitUntilExists(initFlexyTrello,true);

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

    //PROD $.get("chrome-extension://pggiemacedhgohmpcgdpceckeicjlgfn/style/override.css", callback);
    //DEV 
    $.get("chrome-extension://odcejgfkabanfoikamfpcdpcpoepkmfj/style/override.css", callback);

    function callback(data) {
        addCSSStyleSheet(strReplace(data));
        addUI();
        restoreState();
    }

    function addUI() {
        //Add a collapse button
        headers.prepend("<a href='#' class='x-btn-collapse icon-sm'>-</a>");
        //Add an expand button
        headers.prepend("<a href='#' class='x-btn-expand icon-sm'>+</a>");

        //Collapse Button click handler
        $(".x-btn-collapse").on("click", function (elem) {
            $(elem.currentTarget).parent().parent().addClass("x-collapsed");
        });

        //Expand button click handler
        $(".x-btn-expand").on("click", function (elem) {
            $(elem.currentTarget).parent().parent().removeClass("x-collapsed");
        });
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

    function restoreState() {
        chrome.extension.sendMessage({
            command: 'getBoardId',
            id: findFirstCardId()
        }, function (data) {
            if (data.idBoard !== undefined) {
                chrome.extension.sendMessage({
                    command: 'getBoardDetail',
                    id: data.idBoard
                }, function (data) {
                    console.log(data.lists);
                });
            }
        });
    }

    function findFirstCardId() {
        return $('a.list-card-title:first').attr('href').split('/')[2];
    }
}
