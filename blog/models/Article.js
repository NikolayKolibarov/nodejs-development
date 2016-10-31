let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    commentSchema = new Schema({
        username: String,
        content: String,
        date: {
            type: Date,
            default: Date.now
        }
    }),
    articleSchema = new Schema({
        title: String,
        description: String,
        image_path: String,
        deleted: Boolean,
        views: Number,
        date: {
            type: Date,
            default: Date.now
        },
        comments: [commentSchema]

    });

module.exports = mongoose.model('Article', articleSchema);