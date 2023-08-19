const express=require("express");
const User=require("../model/user");
const passport=require("passport");
require("../Config/strategy")(passport);
const mongoose=require("mongoose");
const crypto=require("crypto");


const moment=require("moment");
const multer=require("multer");
const router=express.Router();
const cloudinary=require("cloudinary").v2

router.get("/",(req,res)=>{
    res.render("login.ejs");
 
 });
 router.get("/login",(req,res)=>{
     res.render("login");
 });
 
 router.post("/login",(req,res,next)=>{
         try{
            console.log(req.body.email)
          var username=req.body.email;
         var password=req.body.password;
         console.log("1")
         if(username==='' || username ===null){
             req.flash("error_msg","Enter username");
             res.redirect("/login");
             res.end();
         }
         else if(password==="" || password===null){
             req.flash("error_msg","Password missing");
             res.redirect("/login");
             res.end();
             
         }
         else{
            console.log('2')
         next();
     }
 }catch(err){
     console.log(err);
 }
 },(req,res,next)=>{
    console.log("3")
     passport.authenticate('local',{
         successRedirect:'/dashboard',
         failureRedirect:"/login",
         failureFlash:true
     })
     (req,res,next)
 })
 
 router.get("/signup",(req,res)=>{
     res.render("singup");
 })
 router.post("/signup",async(req,res)=>{
     try{
     const {email,password}=req.body;
     if(email==='' || email===null){
         req.flash("error_msg","Username required*");
         res.redirect("/signup");
         return res.end();
     }
     if(password==='' || password===null){
         req.flash("error_msg","Enter a password");
         res.redirect("/signup");
         return res.end();
     }
     await User.findOne({email:email}).then((user)=>{
         if(user){
             req.flash("error_msg","Username already taken");
         res.redirect("/signup");
         return res.end();
         }
         if(!user){
             User.insertMany({email,password}).then((user)=>{
                 if(user){
                     req.flash("success_msg","You are now registered!");
                     res.redirect("/login");
                     return res.end();
                 }
             })
         }
     })
     }
     catch(err){
         console.log(err);
     }
 })

 router.post("/add_post", async (req, res) => {
    try {
        var current_time = moment();
         var  text=crypto.randomBytes(16);
           text=text.toString();
        const date = current_time.format('YYYY-MM-DD HH:mm:ss');
        const title = req.body.title; // Use req.body.title
        const desc = req.body.desc;   // Use req.body.desc
        const data = {id:text, title: title, desc: desc, date: date };

        User.findById(req.user).then(async (user) => {
            if (user) {
                User.updateOne(
                    { _id: req.user },
                    { $push: { blogs: data } }
                ).then(user=>{
                    if(user){
                        res.redirect("/dashboard");
                    }
                    else{
                        res.redirect("/login")
                    }
                })
            }
        });
    } catch (err) {
        console.log(err);
    }
});

const logoutMiddleware = (req, res, next) => {
    req.logout(()=>{
        req.flash("success_msg","Successfully Logged Out")
        res.redirect('/login');
    });
    // Redirect user to login page after logging out
  }



  router.get('/logout', logoutMiddleware);
 router.get("/dashboard",(req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    }
    else{
        req.flash("error_msg","Please logged in");
        res.redirect("/login");
    }
},async (req,res)=>{
    try{
   const data=await User.findById(req.user).then((user)=>{
        if(user){
            res.sendStatus=200;
            res.render('dashboard',{
                user:user,
            })
        }
        else{
            res.redirect("/login");
            res.end();
        }
   }).catch(err=>{
    console.log(err);
    res.sendStatus=404;
   //render error template;
   })
}catch(err){
    console.log(err);
    //template render for 500 err;
}
})


module.exports = router;