$.getJSON("/articles", function (data) {
    
    for (var i = 0; i < data.length; i++) {
        if (!data[i].title) {
            $("#explainDiv").show();
        } else {
            $("#explainDiv").hide();
            $(".container").append("<p class='linkTitle'>" + data[i].title + "</p>" + "<a id='scrapedLink' href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a>" + "<p id='scrapedSum'>" + data[i].summary + "</p>");
            $(".container").append("<button id='" + data[i]._id + "' type='button' class='saveButton btn btn-info' >Save</button>" + "<hr />")
        }
    }

});




$(document).on("click", '.saveButton', function () {
    var articleId = $(this).attr('id');
    console.log("Article ID: " + articleId);

    $.ajax({
        type: "PUT",
        url: "/save-article/" + articleId,
    }).then(function (response) {
        console.log(JSON.stringify(response));

    });
});


