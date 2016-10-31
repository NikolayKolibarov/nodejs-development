let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    commentSchema = new Schema({
        content: String,
        date: {
            type: Date,
            default: Date.now
        }
    }),
    todoSchema = new Schema({
        title: String,
        description: String,
        image_path: String,
        state: String,
        date: {
            type: Date,
            default: Date.now
        },
        comments: [commentSchema]

    });

module.exports = mongoose.model('Todo', todoSchema);