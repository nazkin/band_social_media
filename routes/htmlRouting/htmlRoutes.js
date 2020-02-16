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
      //NAZ: Retrieving all of the musicians from our database to then display them
      //*************************************************************/
      db.UserAccount.findAll({})
      .then(users=> {
        const usersArray=[];
        users.forEach(value=> {
          if(value.dataValues.UserId != req.user.id){
            usersArray.push(value.dataValues);
          } 
          });
        console.log(usersArray);
        //Creating an object to pass information to handlebars
        const musiciansObject = {
          musicians: [...usersArray]
        }
        res.render("musiciansList", musiciansObject);
      }).catch(err=> console.log(err));     
      //*************************************************************/
    });
    
    app.get("/members/:id", isAuthenticated, (req, res)=> {
      res.render("detailedAccount");
    });

    //Naz: This is the new edit route which is used to edit the personal information of the user
    //This route retrieves values from UserAccount table and fills the form fields in through the HTML input value attribute 
    //To update the info in the database a user will send a POST request which is going to be stored in the apiRoutes folder
    //**************************************************************************************/

    app.get('/members/edit/:id', isAuthenticated, (req, res)=> {
      db.UserAccount.findOne({
        where: {UserId: req.user.id}
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
    //************************************************************************************************ */

      //Naz: This is a get route that will retrieve the musicians information once the "explore" button is clicked
      //This is where the user will be able to explore in more detail the profile of the musician 
      //This is also where the user will be able to place a message to the musician being looked at 
      //"userId" will represent the primaryKey of the userAccount table
      //**************************************************************************************/
      app.get("/members/explore/:usersId",isAuthenticated, (req, res)=> {
        db.UserAccount.findOne({
          where:{id: req.params.usersId}
        }).then(accountInfo=> {
          const account = accountInfo.dataValues;
          res.render("musicianExplore", account);
        }).catch(err=> console.log(err));
      
      });
  
      //**************************************************************************************/
      //Naz: This route allows the logged in user to check his messages
      //**************************************************************************************/
      app.get("/members/messages/:id", isAuthenticated, (req, res)=> {
        db.UserMessages.findAll({
          where:{UserId: req.params.id}
        }).then(msgs=>{
          //Making sure that the array returned can be used as a handlebars object
          const msgArray=[];
          msgs.forEach(msg=> msgArray.push(msg.dataValues));
          const userMsgs = {
            messages: [...msgArray]
          }
          res.render("userMessages", userMsgs);
        }).catch(err=> console.log(err));
        
      });

      //**************************************************************************************/
  }


