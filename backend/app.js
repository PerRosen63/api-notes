var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var documentsRouter = require('./routes/documents');

var app = express();

app.locals.con = mysql.createConnection({ 
    host: 'localhost',
    port: '8889',
    user: 'perfed23',
    password:'perfed23', 
    database: 'notespress' 
});


app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/documents', documentsRouter);

module.exports = app; 
