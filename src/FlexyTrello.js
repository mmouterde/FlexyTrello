var flexyfn = function() {

    //Add a display-none button on each list
    $(".list-header").append("<a href='#' class='x-btn-hide icon-sm icon-close' style='float:right' onclick='close(this)'></a>");
    $(".x-btn-hide").on("click", function (elem) {
        $(elem.currentTarget).parent().parent().hide();
    });
    var listCard = $(".list-card");
    //Fix card size
    listCard.css("width", listCard.css("width"));
    //Add margin to card
    listCard.css("margin", "3px");

    //Make list resizable
    var list = $(".list");
    list.css("resize", "horizontal");
    list.css("overflow", "auto");
    //make list as flex (override 0 0 260px)
    list.css("flex", "0 0 auto");
    //make cards list as a wrapping rows
    var listCards = $(".list-cards");
    listCards.css("flex-wrap", "wrap");
    listCards.css("display", "flex");
};