var isAuthenticated = require("../../config/middleware/isAuthenticated");
var axios = require('axios');

module.exports = (app)=> {
      //This is the homepage route, from here the user signs-up or logs-in to proceed to the app
      app.get("/", (req, res)=> {
        if(req.user){
          res.redirect("/members");
        }
        res.render("homepage");
      });

    app.get("/signup", (req,res)=> {
        if(req.user){
            res.redirect("/members");
        }
        res.render('signup');
        
    });
    app.get("/login", (req, res)=> {
        // If the user already has an account send them to the members page
        if (req.user) {
          res.redirect("/members");
        }
        res.render("login");
      });
       //Members is a route where all the pages that require authentication will start with 
        //ex. the accounts of the user will be viewed through "/members/:id" or something of that sort
    app.get("/members", isAuthenticated, (req, res)=>{
        res.render("musiciansList");
    });

    app.get("/members/:id", isAuthenticated, (req, res)=> {
      res.render("detailedAccount");
    });
    app.get('members/:id/edit', isAuthenticated, (req, res)=> {
      res.render("detailedAccountEdit");
    });

}