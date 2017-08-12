var Article = require("../models/Article.js");
var Note = require("../models/Note.js");
var cheerio = require("cheerio");
var request = require('request');

// Routes
// =============================================================
module.exports = function(app) {
    //Route Home

    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with request
        var url = 'http://www.foodandwine.com/slideshows/summer-salads';
        request(url, function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every h2 within an article tag, and do the following:
            $(".vertical-slide").each(function(i, element) {
                // Save an empty result object
                var result = {};
                // Add the text and href of every link, and save them as properties of the result object
                // $(this).children("a").text()
                result.title = $(this).attr("data-headline");
                result.link = $(this).children('.media-body').children('.caption').find('a').attr('href');
                result.image = $(this).children('.media-img').children('.component').attr('data-src');
                result.caption = $(this).children('.media-body').children('.caption').text();
                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);
                // Now, save that entry to the db
                entry.save(function(err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });
            });
        });
        // Tell the browser that we finished scraping the text
        res.redirect("/");
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/", function(req, res) {
        // Find all notes in the note collection with our Note model
        Article.find({
            'status': false
        }, function(err, data) {
            if (err) return handleError(err);
            articlesResult = {
                data: data
            }
            res.render('articles', articlesResult);
        })
    });

    //Route to display all the saved rescipes

    // This will get the articles we scraped from the mongoDB
    app.get("/saved", function(req, res) {
        // Find all notes in the note collection with our Note model
        Article.find({
            'status': 'true'
        }, function(err, data) {
            if (err) return handleError(err);
            recipeResult = {
                data: data
            }
            res.render('saved', recipeResult);
        })
    });


    //Add recipes to database and update status
    app.post("/recipes/:id", function(req, res) {
        Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                status: true
            })
            .exec(function(err, doc) {
                if (err) return handleError(err);
                res.send(doc);
            });
    });

    //Remove recipes from saved views and update status to false
    app.post("/recipes-remove/:id", function(req, res) {
        Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                status: false
            })
            .exec(function(err, doc) {
                if (err) return handleError(err);
                res.send(doc);
            });
    });


    //Add note to database 
    app.post("/note/:id", function(req, res) {
        var articleId = req.params.id;
        var newNote = new Note(req.body);
        var noteArray = [];
        // And save the new note the db
        newNote.save(function(error, doc) {
            //noteArray.push(doc.id);
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise
            else {

                // Use the article id to find and update it's note
                Article.findOneAndUpdate({
                            "_id": articleId
                        },

                        {
                            $push: {
                                "noteArray": doc._id
                            }
                        }, {
                            new: true
                        }
                    )
                    // Execute the above query
                    .exec(function(err, doc) {
                        console.log(doc);
                        // Log any errors
                        if (err) {
                            console.log(err);
                        } else {
                            // Or send the document to the browser
                            res.send(doc);
                        }
                    });
            }
        });

    });

    // This will grab an article by it's ObjectId
    app.get("/note/:id", function(req, res) {
        var articleId = req.params.id;
        Article.find({
                "_id": articleId
            })
            .populate("noteArray")
            .exec(function(err, docs) {
                if (!err) {
                    notesData = {
                        note: docs
                    }
                    res.json(docs);
                    //res.render('saved', notesData)
                } else {
                    res.send("Error finding article " + req.params.id);
                }
            });
    });

    // This will remove an note by it's ObjectId
    app.get("/remove-note/:id", function(req, res) {
        var noteId = req.params.id;
        console.log('noteId: ' + noteId)
            // find the user with id 4
        Note.
        findOneAndRemove({
            _id: noteId
        }, function(err) {
            if (err) throw err;
            // we have deleted the user
            console.log('note deleted!');
            res.redirect('/')
        });
    });


};