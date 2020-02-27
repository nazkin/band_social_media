var express = require("express");
var session = require("express-session");
// var multer = require('multer');
// Setting up port
var passport = require('./config/passport');
var PORT = process.env.PORT || 8080;

var db = require("./models");
var exphbs = require("express-handlebars");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// for using handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("./public"));

//Using passport as configured 
app.use(session({secret: "amazingandalways awesome", resave:true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

//Middleware to pass logged in user infor in a single variable 
app.use(function(req, res, next){
  res.locals.currentUser = req.user;// This variable is passed to every rendered page in the routes
  next();
});

//Requiring routes as defined in the routes folder
require("./routes/apiRouting/apiRoutes")(app);
require("./routes/htmlRouting/htmlRoutes")(app);



db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log(`==> 🌎  Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
    });
  });