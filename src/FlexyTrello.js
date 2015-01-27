var flexyfn = function() {

    var headers =  $(".list-header");
    var list = $(".list");

    //All list have the same width. save computed width that fit screen
    var listWidth_bk = list.css("width");

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
        //Remove the resize grabber
        list.css("resize", "none");
        //Backup the width
        list.data("width_bk",list.css("width"));
        //Apply the original width (all collapsed list will have the same size)
        list.css("width",listWidth_bk);
        //hide list content (except header)
        list.find(".list-cards").hide();
        list.find(".open-card-composer").hide();
        //Hide collapse button
        list.find(".x-btn-collapse").hide();
        //Show expand button
        list.find(".x-btn-expand").show();
        //hide trello list context menu
        list.find(".list-header-menu-icon").hide();
        //Wrap in containter that has a limited width (which match the height before transform)
        list.wrap( "<div style='flex-shrink:0;width:"+list.css("height")+";padding-left:5px;padding-right: 15px;'></div>" );
        //Transform to make like collapsed
        list.css("transform","translateY("+listWidth_bk+") rotate(-90deg)");

    });

    //Expand button click handler
    $(".x-btn-expand").on("click", function (elem) {
        //Get the list element
        var list = $(elem.currentTarget).parent().parent();
        //Apply the resize grabber
        list.css("resize", "horizontal");
        // restore saved custom width
        list.css("width",list.data("width_bk"));
        //show list content
        list.find(".list-cards").show();
        list.find(".open-card-composer").show();
        //show collapse button
        list.find(".x-btn-collapse").show();
        //hide collapse button
        list.find(".x-btn-expand").hide();
        //show trello list context menu
        list.find(".list-header-menu-icon").show();
        //Unwrap
        list.unwrap();
        //Transform to make like expanded
        list.css("transform","translateY(0) rotate(0deg)");
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
