var express = require("express");
var session = require("express-session");
var multer = require('multer');
// Setting up port
var passport = require('./config/passport')
var PORT = process.env.PORT || 8080;

var db = require("./models");
var exphbs = require("express-handlebars");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Naz***********************************************************************************
//Setting up the multer storage and config *******************************************************

// // Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function(req, file, cb){
//     cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// // Init Upload
// const upload = multer({
//   storage: storage,
//   limits:{fileSize: 1000000},
//   fileFilter: function(req, file, cb){
//     checkFileType(file, cb);
//   }
// }).single('myImage');

// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }
// //*****************************************************************************************WS

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