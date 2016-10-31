let express = require('express'),
    router = express.Router(),
    todosController = require('../controllers/todosController');

router.get('/all', (req, res) => {
    todosController.allTodos(req, res);
});

router.get('/details/:id', (req, res) => {
    todosController.todoDetails(req, res);
});

router.post('/details/:id/change-state', (req, res) => {
    todosController.changeTodoState(req, res);
});

router.get('/create', (req, res) => {
    todosController.showCreateTodo(req, res);
});

router.post('/create', (req, res) => {
    todosController.createTodo(req, res);
});

router.post('/details/:id/comments/create', (req, res) => {
    todosController.createComment(req, res);
});

router.get('/stats', (req, res) => {
    todosController.stats(req, res);
});

module.exports = router;