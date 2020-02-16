const db = require("../../models");
const passport = require("../../config/passport");


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
  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

};