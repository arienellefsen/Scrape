'use strict'

//Call function when scrape is clicked
$(document).on("click", "#scrape", function() {
    $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        // With that done, add the note information to the page
        .done(function(data) {
            alert('data');
            location.reload();
            window.location.href = "/articles";
            console.log(data);
        });
});

//save note form

$(document).on("click", "#note", function() {
    var idArticle = $(this).attr('data-id');
    console.log('btn id:' + idArticle);
    $("#titleinput").val("");
    $("#bodyinput").val("");
    $("#idfield").val(idArticle);

    $.ajax({
            method: "get",
            url: "/articles/" + idArticle,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            //console.log(data.note.title);
            // Empty the notes section\
            $("#titleinput").val("");
            $("#bodyinput").val("");

            console.log('data: ' + data);
            if (!data.note) {
                console.log('no data');
            } else {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#save", function() {
    //debugger;
    var idField = $("#idfield").val();
    console.log(idField);
    var idArticleId = $(this).idField;
    $.ajax({
            method: "POST",
            url: "/articles/" + idField,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            $("#titleinput").val("");
            $("#bodyinput").val("");
            $('#status').text('Saved!');
        });
});

//Delete note
$(document).on("click", "#delete", function() {
    //debugger;
    var idField = $("#idfield").val();
    console.log(idField);
    var idArticleId = $(this).idField;
    $.ajax({
            method: "POST",
            url: "/articles/remove/" + idField,
            data: {
                id: idField
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            location.reload();
            $("#titleinput").val("");
            $("#bodyinput").val("");
            $('#status').text('Deleted!');
        });
});