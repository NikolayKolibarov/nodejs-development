let express = require('express'),
    router = express.Router(),
    articlesController = require('../controllers/articlesController');

router.get('/all', (req, res) => {
    articlesController.allArticles(req, res);
});

router.get('/details/:id', (req, res) => {
    articlesController.articleDetails(req, res);
});

router.post('/details/:id/change-state', (req, res) => {
    articlesController.changeArticleState(req, res);
});

router.get('/create', (req, res) => {
    articlesController.showCreateArticle(req, res);
});

router.post('/create', (req, res) => {
    articlesController.createArticle(req, res);
});

router.post('/details/:id/comments/create', (req, res) => {
    articlesController.createComment(req, res);
});

router.get('/stats', (req, res) => {
    articlesController.stats(req, res);
});

module.exports = router;