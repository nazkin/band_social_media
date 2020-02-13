module.exports = (req, res, next)=> {
    // the user is logged in, continue with the request to the restricted route
    if(req.user) {
        return next();
    }
    //user isn't' logged in, redirect them to the login page
    return res.redirect("/");
}