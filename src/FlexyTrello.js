var flexyfn = function() {

    var cssPxToInt = function (cssValue){
        if(cssValue)
            return parseInt(cssValue.substr(0,cssValue.indexOf("p")))
        else
            return 0;
    }

    var headers =  $(".list-header");
    var list = $(".list");

    //All list have the same width. save computed width that fit screen
    var listWidth_bk = list.css("width");
    var headerWidth_bk = headers.css("width");
    var listReducedWidth = cssPxToInt(headers.css("height"))+cssPxToInt(headers.css("padding-top"))+cssPxToInt(headers.css("padding-bottom"))+cssPxToInt(list.css("padding-top"))+cssPxToInt(list.css("padding-bottom"));

    //Add a collapse button
    headers.prepend("<a href='#' class='x-btn-collapse icon-sm' style='float:right'>-</a>");
    //Add an expand button
    headers.prepend("<a href='#' class='x-btn-expand icon-sm' style='float:right;'>+</a>");
    //Hide the expand button by default
    headers.children(".x-btn-expand").hide();

    //Collapse Button click handler
    $(".x-btn-collapse").on("click", function (elem) {
        //Get the list element
        var list = $(elem.currentTarget).parent().parent();

        //Remove the resize grabber & scrollbar
        list.css("resize", "none");
        list.css("overflow", "visible");

        //Toggle expand/collapse buttons
        list.find(".x-btn-expand").show();
        list.find(".x-btn-collapse").hide();

        //hide list content (except header) & trello list context menu
        var toHide = list.find(":not(.list-header-name, .list-header, .x-btn-expand,:hidden)");
        toHide.addClass("x-hidden");
        toHide.hide();

        //Transform to make like collapsed
        var header = list.find(".list-header");
        header.css("transform","translateY("+(cssPxToInt(listWidth_bk)-cssPxToInt(header.css("padding-left")))+"px) rotate(-90deg)");
        header.css("width",headerWidth_bk);

        list.css("max-width",listReducedWidth);
        list.css("height",listWidth_bk);
    });

    //Expand button click handler
    $(".x-btn-expand").on("click", function (elem) {
        //Get the list element
        var list = $(elem.currentTarget).parent().parent();

        //restore the resize grabber & scrollbar
        list.css("resize", "horizontal");
        list.css("overflow", "");
        list.css("overflow-x", "hidden");

        //Toggle expand/collapse buttons
        list.find(".x-btn-expand").hide();
        list.find(".x-btn-collapse").show();

        //show list content (except header) & trello list context menu
        list.find(".x-hidden").show();

        //Transform to make like collapsed
        var header = list.find(".list-header");
        header.css("transform","");
        header.css("width","");

        //restore dimensions
        list.css("max-width","");
        list.css("height","");
    });

    //Make add list trello button shrinkable
    $(".add-list").css("flex-shrink","1");

    //Get list cards
    var listCard = $(".list-card");
    //Fix card size to make it wrappable
    listCard.css("width", listCard.css("width"));
    //Add margin to card to separated columns
    listCard.css("margin", "3px");

    //Make list resizable
    list.css("resize", "horizontal");
    //hide horizontal scrollbar
    list.css("overflow-x", "hidden");
    //Add "Add a card" margin to make the resize grabber draggable (overlapped otherwise)
    $(".open-card-composer").css("margin-right","20px");
    //make list as flex (override 0 0 260px)
    list.css("flex", "0 0 auto");

    //make cards list as a wrapping rows
    var listCards = $(".list-cards");
    listCards.css("flex-wrap", "wrap");
    listCards.css("display", "flex");
};
