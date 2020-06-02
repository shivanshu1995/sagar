var express = require('express')
var app = express()
const getPosts = require('./routes/appRoutes')

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use('/',express.static('views'));
app.use('/',express.static('static'));
app.use('/',getPosts);


app.listen(3000);