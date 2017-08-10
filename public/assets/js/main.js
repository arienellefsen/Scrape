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

//save note form
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
            $("#bodyinput").val("");
            console.log('data: ' + data);
            if (!data.note) {
                console.log('no data');
            } else {
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
            $('.modal-body').append('<p class="text-modal">Recipe has been saved!</p>');
        });
});

//Save note to database
$(document).on("click", "#saveNote", function() {
    //debugger;
    var fieldId = $('#idfield').val();
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
            // Log the response
            console.log(data);
            //$("#titleinput").val("");
            // $("#bodyinput").val("");
            $('#status').text('Note saved!');
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
            console.log(data);
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
            console.log(data);
            $("#titleinput").val("");
            $("#bodyinput").val("");
            $('#status').text('Deleted!');
        });
});