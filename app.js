var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Deps
const dotenv = require('dotenv').config({ path: "./src/config/config.env" })
const cors = require('cors');

// Router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
const urlRouter = require('./routes/urlRoute');

var app = express();

// <===============view engine setup===============>
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// <===============================================>

// <===================Defaults===================>
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// <===============================================>

// <============ START Handle CORS ===================>
const corsConfig0 = { credentials: true, origin: true, };
const corsConfig1 = { credentials: true, origin: "*", };
app.use(cors(corsConfig0));
// <============= END Handle CORS ====================>

// <============= DATABASE CONNECTION ================>
const connectDatabase = require('./src/config/database');
connectDatabase();
// <==================================================>


app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/url', urlRouter);



// <===============ERROR 404==========================>

// catch 404 and forward to error handler
app.use(function (req, res, next) { next(createError(404)); });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// <=================================================>

module.exports = app;
