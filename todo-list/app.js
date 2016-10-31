const port = 3000;

let express = require('express'),
    app = express(),
    path = require('path'),
    hbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    fileUpload = require('express-fileupload'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    db = 'mongodb://localhost/todo-list';

mongoose.connect(db);

app.use('/public', express.static(path.join(__dirname + "/public")));
app.use('/node_modules', express.static(path.join(__dirname + "/node_modules")));
app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(fileUpload());

app.use(session({secret: 'nnk', saveUninitialized: false, resave: false}));

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'master'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home', {title: 'Home'});
});

let todos = require('./routes/todos');

app.use('/todos', todos);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});