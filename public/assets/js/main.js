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

    $(document).on("click", "#save", function() {
        $.ajax({
                method: "POST",
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
                $('#status').text('Saved!');
            });
    });
});