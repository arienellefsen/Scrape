// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
    // title is a required string
    title: {
        type: String,
        required: true
    },
    // link is a required string
    link: {
        type: String
    },
    image: {
        type: String
    },
    caption: {
        type: String
    },
    // This only saves one note's ObjectId, ref refers to the Note model

    //create a note array
    noteArray: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    status: {
        type: Boolean,
        default: false
    }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;