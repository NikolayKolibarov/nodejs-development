let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    commentSchema = new Schema({
        content: String,
        date: {
            type: Date,
            default: Date.now
        }
    }),
    adSchema = new Schema({
        title: String,
        description: String,
        image_path: String,
        badge: String,
        date: {
            type: Date,
            default: Date.now
        },
        comments: [commentSchema]

    });

module.exports = mongoose.model('Ad', adSchema);