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
            $('.modal-body').append('<p class="text-modal">Enjoy delicious recipes!!</p>');
        });
});

//get article id and populate field
$(document).on("click", "#note", function() {
    var idArticle = $(this).attr('data-id');
    $("#idfield").val(idArticle);
    $.ajax({
            method: "get",
            url: "/note/" + idArticle,
            data: {
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            var arrayNote = data[0].noteArray;
            for (var i = 0; i < arrayNote.length; i++) {
                $('#savednotes').append(arrayNote[i].body + "<button id='remove-note' data-nodeId='" + arrayNote[i]._id + "'>x</button><br>");
            }

        });
});


//Remove Note

$(document).on("click", "#remove-note", function() {
    var noteId = $(this).attr('data-nodeId');
    $.ajax({
            method: "GET",
            url: "/remove-note/" + noteId,
            data: {
                id: noteId
            }
        })
        // With that done, add the note information to the page
        .done(function(data) {
            window.location.reload();
        });
});



//Save recipe to database
//Update status to true
$(document).on("click", "#save", function() {
    //debugger;
    var idArticle = $(this).attr('data-id');
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
            $('#myModal').modal('show');
            $('.modal-body').append('<p class="text-modal">Recipe has been saved!</p>');
        });
});

//Save note to database
$(document).on("click", "#saveNote", function() {
    var fieldId = $('#idfield').val();
    console.log('id' + fieldId);
    $.ajax({
            method: "POST",
            url: "/note/" + fieldId,
            data: {
                // Value taken from title input
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .done(function(data) {
            if (data = 'null') {
                $('#title-notes').text('This recipes has notes!');
            } else {
                $('#title-notes').text('No notes yet!');
            }
            $('#status').text('Note saved!');
            window.location.reload();

        });
});


//Delete from saved 
$(document).on("click", "#removesave", function() {

    var idArticle = $(this).attr('data-id');
    $("#titleinput").val("");
    $("#bodyinput").val("");

    $.ajax({
            method: "POST",
            url: "/recipes-remove/" + idArticle,
            data: {
                id: idArticle
            }
        })
        .done(function(data) {
            // Log the response
            $("#titleinput").val("");
            $("#bodyinput").val("");
            $('#status').text('Deleted!');
        });
});


//Delete note
$(document).on("click", "#delete", function() {
    var idArticle = $(this).attr('data-id');
    $("#titleinput").val("");
    $("#bodyinput").val("");

    $.ajax({
            method: "POST",
            url: "/articles/remove/" + idArticle,
            data: {
                id: idField
            }
        })
        .done(function(data) {
            // Log the response
            $("#titleinput").val("");
            $("#bodyinput").val("");
            $('#status').text('Deleted!');
        });
});