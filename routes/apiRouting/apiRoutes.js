const db = require("../../models");
const passport = require("../../config/passport");
const multer = require('multer');
const path = require('path');
//Naz: *****************************************Multer Set-Up*******************************
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}
//*********************************************************************************************


module.exports = function(app) {
 
  app.post("/api/login", passport.authenticate("local",
   {
     successRedirect: "/members",
     failureRedirect: "/"
   }
    ), function(req, res) {
    
    res.json(true);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // When returning the promise I used code 307 which moves the resources of HTTP request to another URI
  // This means that even when i sign the user up he is authenticated to move to another page via /api/login route
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });
  app.post('/api/account/:id', (req, res)=> {
    console.log(req.body);
    db.UserAccount.create({
      nickname: req.body.nickname,
      avatar: req.body.avatar,
      description: req.body.description,
      city: req.body.city,
      province: req.body.province,
      zip: req.body.zip,
      UserId: req.params.id
    }).then(()=> {
      res.redirect('/members');
    }).catch(err=> console.log(err));
  });

  // Michael: adding band account post request to the DB
  //#######################################################################

  app.post('/api/band/:id', (req, res)=> {
    console.log(req.body);
    db.Bands.create({
      bandname: req.body.bandname,
      avatar: req.body.avatar,
      members: req.body.members,
      songs: req.body.songs,
      neededTalents: req.body.neededTalents,
      location: req.body.location,
      UserId: req.params.id
    }).then(()=> {
      res.redirect('/members');
    }).catch(err=> console.log(err));
  });

  //********************************************************************************************* */
  //NAZ: This route below is responsible for updating the users personal account
  //In more detail I am Updating information that is located in the UserAccount
  //where the foreign key is equivalent to the active users id stored in the URL
  app.post('/members/edit/:id', (req, res)=> {
    db.UserAccount.update({
      nickname: req.body.nickname,
      avatar: req.body.avatar,
      description: req.body.description,
      city: req.body.city,
      province: req.body.province,
      zip: req.body.zip, 
    }, {where: {UserId: req.params.id}})
      .then(rowsUpdated=> {
        console.log(`You successfully updated ${rowsUpdated} account sections`);
        res.redirect('/members');
      }).catch(err=> console.log(err));
  });
//********************************************************************************************* */

//********************************************************************************************* */
//Naz: This is a POST route that stores messages sent to a particular musician by the user
//In this case usersId is linked to the foreignKey which specifies musicians id in the Users table
app.post('/members/explore/message/:usersId', (req,res)=> {
  db.UserMessages.create({
    sentBy: req.body.email,
    message: req.body.message,
    UserId: req.params.usersId
  }).then(message => {
    console.log('Message successfully sent to user');
    res.redirect('/members');
  }).catch(err=> console.log(err));
});
//********************************************************************************************* */

//********************************************************************************************* */
//Naz: The route below is used to reply to a users messages where the "id" being the primary key of the Users table
// representing the User who is being replied to 
app.post("/members/messages/reply/:id", (req,res)=> {
  db.UserMessages.create({
    sentBy: req.body.email,
    message: req.body.message, 
    UserId: req.params.id
  }).then(message => {
    console.log('Successfully replied to user');
    res.redirect('/members');
  }).catch(err=> console.log(err));
});

//This post allows to upload a band photo and store the name of our file in the database
app.post('/upload/band/:id', (req, res)=> {
  upload(req,res, (err)=> {
    if(err){
      console.log(err);
      res.redirect('/members');
    }else{
      db.BandPhoto.create({
        filename: req.file.filename,
        UserId: req.params.id
      }).then(message => {
        console.log(message);
        res.redirect('/members/self/'+req.params.id);
      });
    }
  });
});

//********************************************************************************************* */

//*******************************DELETE ROUTES***************************************************

//Naz:Below is a delete route for messages
  app.get("/members/messages/delete/:messageId", (req,res)=> {
    db.UserMessages.destroy({
      where: {id: req.params.messageId}
    }).then(()=>{
      console.log("message deleted successfully");
      res.redirect(`/members/messages/${req.user.id}`);
    })
      .catch(err=> console.log(err));
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

};