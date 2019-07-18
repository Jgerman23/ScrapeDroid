$.getJSON("/display-saved", function (data) {
    for (var i = 0; i < data.length; i++) { 
        $(".containers").append("<p>" + data[i].title + "</p>" + "<p id='scrapedLink'>" + data[i].link + "</p>" + "<p id='scrapedSum'>" + data[i].summary + "</p>");
        $(".containers").append("<button data-id='" + data[i]._id + "' type='button' class='btn btn-info' id='addNotebtn'>Add A Note</button>" + "<hr />")
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
            $("#notes").append("<h2>" + data.title + "</h2>");            
            $("#notes").append("<input id='titleinput' name='title' >");            
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");            
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            $("#notes").append("<button data-id='" + data._id + "' id='deleteNoteButton'>Delete Note</button>");

            if (data.note) {                
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

$(document).on("click", "#deleteNoteButton", function(){
    console.log("CLICKED");
    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/delete-note/" + thisID,
        data: {
            title: $("#titleinput").val(),            
            body: $("#bodyinput").val()
        }
    })
        .then(function (data){
            console.log(data);
        })
})


