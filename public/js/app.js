$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) { 
        $(".containers").append("<p>" + data[i].title + "</p>" + "<p id='scrapedLink'>" + data[i].link + "</p>" + "<p id='scrapedSum'>" + data[i].summary + "</p>");
        $(".containers").append("<button id='" + data[i]._id + "' type='button' class='saveButton' >Save</button>" + "<hr />")
    }
});




$(document).on("click", '.saveButton', function(){
    var articleId = $(this).attr('id');
    console.log("Article ID: " + articleId);

    $.ajax({
        type: "PUT",
        url: "/save-article/" + articleId,
    }).then(function(response) {
        console.log(JSON.stringify(response));
        
    });
});


