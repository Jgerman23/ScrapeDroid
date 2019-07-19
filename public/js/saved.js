$.getJSON("/display-saved", function (data) {
    for (var i = 0; i < data.length; i++) {
        if(!data[i].title){
            $(".saveArticleEx").show();
        }else{
            $(".saveArticleEx").empty();            
            $("#containers").append("<h3>" + data[i].title + "</h3>" + "<a id='scrapedLink' href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a>" + "<p id='scrapedSum'>" + data[i].summary + "</p>");
            $("#containers").append("<button data-id='" + data[i]._id + "' type='button' class='btn btn-info' id='addNotebtn'>Add/Edit Notes</button>");        
            $("#containers").append("<hr />");
            
        }
    }
});

$(document).on("click", "#addNotebtn", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h4>" + data.title + "</h4>");
            $("#notes").append("<input id='titleinput' name='title' placeholder='Add Title'>" + "<br />");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>" + "<br />");
            $("#notes").append("<button class='btn btn-info' data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<button class='deleteNoteButton btn btn-info' data-article_id = '" + data._id + "' data-note_id='" + data.note._id + "'>Delete Note</button>");

            if (data.note) {
                $("#savenote").hide()
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#seeNotebtn", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h4>" + data.title + "</h4>");
            $("#notes").append("<input id='titleinput' name='title' >" + "<br />");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>" + "<br />");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<button class='deleteNoteButton' data-article_id = '" + data._id + "' data-note_id='" + data.note._id + "'>Delete Note</button>");

            if (data.note) {
                $("#savenote").hide()
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();            
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", ".deleteNoteButton", function () {
    console.log("CLICKED");
    var thisNoteID = $(this).attr("data-note_id");
    var thisArticleID = $(this).attr("data-article_id");
    console.log(thisNoteID)
    $.ajax({
        method: "DELETE",
        url: "/delete-note/" + thisArticleID + "/" + thisNoteID,
        data: {
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();    
        })
})


