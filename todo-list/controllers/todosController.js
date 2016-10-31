let mongoose = require('mongoose'),
    Todo = require('../models/Todo'),
    path = require('path');

function allTodos(req, res) {
    Todo.find({}).sort({date: -1}).exec((err, todos) => {
        res.render('todo-all', {title: `All To-Dos`, todos: todos});
    });
}

function todoDetails(req, res) {
    let id = req.params.id;

    Todo.findById(id, (err, todo) => {
        let isDone = false;

        if (todo.state == 'Done') {
            isDone = true;
        }

        res.render('todo-details', {
            title: todo.title + ' Details',
            todo: todo,
            isDone: isDone,
            errors: req.session.errors
        });
    });
}

function changeTodoState(req, res) {
    let id = req.params.id;

    Todo.findById(id, (err, todo) => {
        if (todo.state == 'Pending') {
            todo.state = 'Done'
        } else if (todo.state == 'Done') {
            todo.state = 'Pending';
        }

        todo.save();

        res.redirect('/todos/details/' + id);
    });
}

function showCreateTodo(req, res) {
    res.render('todo-create', {title: 'Create Todo'});
}

function createTodo(req, res) {
    let errors = [];

    let title = req.body.title;
    let description = req.body.description;
    let image = req.files.image;

    if (!title || !description) {
        if (!title) {
            errors.push({message: 'The title is required.'});
        }

        if (!description) {
            errors.push({message: 'The description is required.'});
        }

        req.session.errors = errors;

        return res.render('todo-create', {errors: req.session.errors});
    }

    let todo = new Todo({title: title, description: description, state: 'Pending'});

    if (image.name != '') {
        let ext = path.extname(image.name)
        let randomName = _generateRandomString() + ext;
        todo.image_path = randomName;

        image.mv('public/img/uploads/' + randomName, (err) => {
            if (err) {
                console.log(err);
            }

        });

    }

    todo.save();

    res.redirect('/todos/all')
}

function createComment(req, res) {
    let errors = [];

    let id = req.params.id;
    let content = req.body.comment;

    if (!content) {
        errors.push({message: 'The comment cannot be empty.'});
        req.session.errors = errors;

        return res.redirect('/todos/details/' + id);
    }

    let comment = {};
    comment.content = content;

    Todo.findById(id, (err, todo) => {
        if (err) {
            console.log(err);
            res.sendStatus(404);
        }

        todo.comments.push(comment);
        todo.save();

        res.redirect('/todos/details/' + id);


    });
}

function stats(req, res) {
    if (req.headers.authorization === 'Admin') {

        Todo.find({}).exec((err, todos) => {
            let todosCount = todos.length;
            let commentsCount = 0;

            for (let todo of todos) {
                commentsCount += todo.comments.length;
            }

            res.render('todo-stats', {title: 'Stats', todosCount: todosCount, commentsCount: commentsCount });

        });

    } else {
        res.sendStatus(404);
    }
}

function _generateRandomString() {

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;

}

module.exports = {
    allTodos,
    todoDetails,
    changeTodoState,
    showCreateTodo,
    createTodo,
    createComment,
    stats
};