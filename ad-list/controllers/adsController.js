let mongoose = require('mongoose'),
    Ad = require('../models/Ad'),
    path = require('path');

function allAds(req, res) {
    Ad.find({}).sort({date: -1}).exec((err, ads) => {
        res.render('ad-all', {title: `All Ads`, ads: ads});
    });
}

function adDetails(req, res) {
    let id = req.params.id;

    Ad.findById(id, (err, ad) => {
        let isVip = false;

        if (ad.badge == 'VIP') {
            isVip = true;
        }

        res.render('ad-details', {
            title: ad.title + ' Details',
            ad: ad,
            isVip: isVip,
            errors: req.session.errors
        });

    });
}

function changeAdBadge(req, res) {
    let id = req.params.id;

    Ad.findById(id, (err, ad) => {
        if (ad.badge == 'Standard') {
            ad.badge = 'VIP'
        } else if (ad.badge == 'VIP') {
            ad.badge = 'Standard';
        }

        ad.save();

        res.redirect('/ads/details/' + id);
    });
}

function showCreateAd(req, res) {
    res.render('ad-create', {title: 'Create Ad'});
}

function createAd(req, res) {
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

        return res.render('ad-create', {errors: req.session.errors});
    }

    let ad = new Ad({title: title, description: description, badge: 'Standard'});

    if (image.name != '') {
        let ext = path.extname(image.name);
        let randomName = _generateRandomString() + ext;
        ad.image_path = randomName;

        image.mv('public/img/uploads/' + randomName, (err) => {
            if (err) {
                console.log(err);
            }

        });

    }

    ad.save();

    res.redirect('/ads/all')

}

function createComment(req, res) {
    let errors = [];

    let id = req.params.id;
    let content = req.body.comment;

    if (!content) {
        errors.push({message: 'The comment cannot be empty.'});
        req.session.errors = errors;

        return res.redirect('/ads/details/' + id);
    }

    let comment = {};
    comment.content = content;

    Ad.findById(id, (err, ad) => {
        if (err) {
            console.log(err);
            res.sendStatus(404);
        }

        ad.comments.push(comment);
        ad.save();

        res.redirect('/ads/details/' + id);


    });
}

function stats(req, res) {
    if (req.headers.authorization === 'Admin') {

        Ad.find({}).exec((err, ads) => {
            let adsCount = ads.length;
            let commentsCount = 0;

            for (let ad of ads) {
                commentsCount += ad.comments.length;
            }

            res.render('ad-stats', {title: 'Stats', adsCount: adsCount, commentsCount: commentsCount });

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
    allAds,
    adDetails,
    changeAdBadge,
    showCreateAd,
    createAd,
    createComment,
    stats
};
