var isAuthenticated = require("../../config/middleware/isAuthenticated");
const db = require("../../models");

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


    //Naz: This is the new edit route which is used to edit the personal information of the user
    //This route retrieves values from UserAccount table and fills the form fields in through the HTML input value attribute 
    //To update the info in the database a user will send a POST request which is going to be stored in the apiRoutes folder
    app.get('/members/edit/:id', isAuthenticated, (req, res)=> {
      db.UserAccount.findOne({
        Where: {id: req.user.id}
      }).then(userInfo=> {
        const usersAccount = {
          nickname: userInfo.dataValues.nickname,
          avatar: userInfo.dataValues.avatar,
          description: userInfo.dataValues.description,
          city: userInfo.dataValues.city,
          province: userInfo.dataValues.province,
          zip: userInfo.dataValues.zip
        }
        console.log(usersAccount);
        res.render("detailedAccountEdit", usersAccount);
      })
      
      
    });

}