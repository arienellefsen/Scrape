'use strict'

//Call function when scrape is clicked
$(document).on("click", "#scrape", function() {
    $.ajax({
            method: "GET",
            url: "/scrape/"
        })
        // With that done, add the note information to the page
        .done(function(data) {
            $('#myModal').modal('show');
            $('.modal-title').append('<h1>Total of recipes</h1>');
            $('.modal-body').append('<p>get total</p>');
        });
});

//save note form
$(document).on("click", "#note", function() {
    var idArticle = $(this).attr('data-id');
    console.log('btn id recipe:' + idArticle);
    $("#bodyinput").val("");
    $("#idfield").val(idArticle);
    $.ajax({
            method: "get",
            url: "/note/" + idArticle,
            data: {
                // Value taken from title input
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
            $("#bodyinput").val("");
            console.log('data: ' + data);

            if (!data.note) {
                console.log('no data');
            } else {
                // Place the title of the note in the title input
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});


//Save recipe to database
//Update status to true
$(document).on("click", "#save", function() {
    //debugger;
    var idArticle = $(this).attr('data-id');
    console.log('btn id arieen: ' + idArticle);
    $.ajax({
            method: "POST",
            url: "/recipes/" + idArticle,
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

            $('#myModal').modal('show');
            $('.modal-title').append('<h1>Recipe has been saved!</h1>');

        });
});

//Save note to database
$(document).on("click", "#saveNote", function() {
    //debugger;
    var fieldId = $('#idfield').val();
    $.ajax({
            method: "POST",
            url: "/note-save/" + fieldId,
            data: {
                // Value taken from title input
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            // Log the response
            console.log(data);
            //$("#titleinput").val("");
            // $("#bodyinput").val("");
            $('#status').text('Note saved!');
        });
});

//Delete note
$(document).on("click", "#delete", function() {
    //debugger;
    var idField = $("#idfield").val();
    console.log(idField);
    var idArticleId = $(this).idField;
    $("#titleinput").val("");
    $("#bodyinput").val("");

    $.ajax({
            method: "POST",
            url: "/articles/remove/" + idField,
            data: {
                id: idField
            }
        })
        .done(function(data) {
            // Log the response
            console.log(data);
            $("#titleinput").val("");
            $("#bodyinput").val("");
            $('#status').text('Deleted!');
        });
});