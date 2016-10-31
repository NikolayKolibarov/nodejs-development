let mongoose = require('mongoose'),
    Article = require('../models/Article'),
    path = require('path');

function allArticles(req, res) {
    Article.find({}).sort({date: -1}).exec((err, articles) => {
        res.render('article-all', {title: `All Articles`, articles: articles});
    });
}

function articleDetails(req, res) {
    let id = req.params.id;

    Article.findById(id, (err, article) => {

        article.views++;
        article.save();

        res.render('article-details', {
            title: article.title + ' Details',
            article: article,
            errors: req.session.errors
        });

        req.session.errors = null;
    });
}

function changeArticleState(req, res) {
    let id = req.params.id;

    Article.findById(id, (err, article) => {
        if (article.deleted) {
            article.deleted = false
        } else if (!article.deleted) {
            article.deleted = true;
        }

        article.views--;

        article.save();

        res.redirect('/articles/details/' + id);
    });
}

function showCreateArticle(req, res) {
    res.render('article-create', {title: 'Create Article'});
}

function createArticle(req, res) {
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

        return res.render('article-create', {errors: req.session.errors});
    }

    let article = new Article({title: title, description: description, deleted: false, views: 0});

    if (image.name != '') {
        let ext = path.extname(image.name)
        let randomName = _generateRandomString() + ext;
        article.image_path = randomName;

        image.mv('public/img/uploads/' + randomName, (err) => {
            if (err) {
                console.log(err);
            }

        });

    }

    article.save();

    res.redirect('/articles/all')
}

function createComment(req, res) {
    let errors = [];

    let id = req.params.id;
    let username = req.body.username;
    let content = req.body.comment;

    if (!username || !content) {

        if(!username) {
            errors.push({message: 'The username cannot be empty.'});
        }

        if(!content) {
            errors.push({message: 'The comment cannot be empty.'});
        }



        req.session.errors = errors;

        Article.findById(id, (err, article) => {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            }

            article.views--;
            article.save();

        });


        return res.redirect('/articles/details/' + id);
    }

    let comment = {};
    comment.username = username;
    comment.content = content;

    Article.findById(id, (err, article) => {
        if (err) {
            console.log(err);
            res.sendStatus(404);
        }

        article.comments.push(comment);
        article.views--;
        article.save();

        res.redirect('/articles/details/' + id);


    });
}

function stats(req, res) {
    if (req.headers.authorization === 'Admin') {

        Article.find({}).exec((err, articles) => {
            let articlesCount = articles.length;
            let commentsCount = 0;

            for (let article of articles) {
                commentsCount += article.comments.length;
            }

            res.render('article-stats', {title: 'Stats', articlesCount: articlesCount, commentsCount: commentsCount });

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
    allArticles,
    articleDetails,
    changeArticleState,
    showCreateArticle,
    createArticle,
    createComment,
    stats
};