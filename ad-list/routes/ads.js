let express = require('express'),
    router = express.Router(),
    adsController = require('../controllers/adsController');

router.get('/all', (req, res) => {
    adsController.allAds(req, res);
});

router.get('/details/:id', (req, res) => {
    adsController.adDetails(req, res);
});

router.post('/details/:id/change-badge', (req, res) => {
    adsController.changeAdBadge(req, res);
});

router.get('/create', (req, res) => {
    adsController.showCreateAd(req, res);
});

router.post('/create', (req, res) => {
    adsController.createAd(req, res);
});

router.post('/details/:id/comments/create', (req, res) => {
    adsController.createComment(req, res);
});

router.get('/stats', (req, res) => {
    adsController.stats(req, res);
});

module.exports = router;

