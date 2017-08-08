var Article = require("../models/Article.js");
var Note = require("../models/Note.js");
var cheerio = require("cheerio");
var request = require('request');

// Routes
// =============================================================
module.exports = function(app) {
    //Route Home
    app.get("/", function(req, res) {
        res.render('index');
    });

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

                console.log("$$$$$$$$$$$$" + result.title + "$$$$$$$$$$$$");
                console.log("######" + result.image + "#####");
                console.log("######" + result.caption + "#####");
                console.log("@@@@@" + result.link + "@@@@");

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
        res.redirect("/articles");
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {
        // Find all notes in the note collection with our Note model
        Article.find({}, function(err, data) {
            if (err) return handleError(err);
            articlesResult = {
                data: data
            }
            res.render('articles', articlesResult);
        })
    });

    // Create a new note or replace an existing note
    app.post("/articles/:id", function(req, res) {
        var newNote = new Note(req.body);
        console.log(req.body);
        newNote.save(function(err, doc) {
            if (err) {
                console.log('error saving db');
            } else {
                Article.findOneAndUpdate({
                        _id: req.params.id
                    }, {
                        note: doc._id
                    })
                    .exec(function(err, doc) {
                        if (err) return handleError(err);
                        res.send(doc);
                    });
            }
        });
    });

    // This will grab an article by it's ObjectId
    app.get("/articles/:id", function(req, res) {
        var idArticleId = req.params.id;
        Article
            .findOne({
                _id: idArticleId
            })
            .populate("note")
            .exec(function(err, doc) {
                if (err) {
                    console.log('error find this id: ' + idArticleId);
                } else {
                    res.json(doc);
                    console.log('doc');
                }
            });
    });

    // This will remove an note by it's ObjectId
    app.post("/articles/remove/:id", function(req, res) {
        var idArticleId = req.params.id;
        // find the user with id 4
        Article.
        findByIdAndRemove(idArticleId, function(err) {
            if (err) throw err;
            // we have deleted the user
            console.log('User deleted!');
        });
    });

};