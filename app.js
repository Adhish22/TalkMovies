//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");	
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const Swal = require("sweetalert2");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({secret: 'S3CR3T', saveUninitialized: false, resave: false}));
// app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-adhish:test123@cluster0-aap6q.mongodb.net/blogDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const postSchema = {
  date: String,
	title: String,
	content: String,
  image: Array
};

const Post = mongoose.model("Post", postSchema);

const filmSchema = new mongoose.Schema({
  title: String,
  synopsis: String,
  genre: Array,
  cast: String,
  rating: String,
  review: String
});

const Film = mongoose.model("Film", filmSchema);

app.route("/films")

.get(function(req, res){
  if (req.isAuthenticated()){
  Film.find(function(err, foundFilms){
    if (!err) {
      res.render("films", {
        foundFilms: foundFilms
      });
    } else {
      res.send(err);
    }
  });
} else {
    res.redirect("/login");
  } 
})

.post(function(req, res){

  const newFilm = new Film({
    title: req.body.title,
    synopsis: req.body.synopsis,
    title: req.body.title
  });
});

app.get("/", function(req, res){
    if (req.isAuthenticated()){
     Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
  });
  } else {
    res.redirect("/login");
  } 
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err){
      console.log(err);
      res.redirect("/register"); 
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/home");
      });
    }
  });
});

app.post("/login", function(req, res){
  const user =  new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err){
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/home");
      });
    }
  });
});

// app.post("/", function(req, res){


//   const user = new User({
//     username: req.body.username,
//     password: req.body.password
//   });

//   req.login(user, function(err){
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, function(){
//         res.redirect("/home");
//       });
//     }
//   });

app.get("/home", function(req, res){
  if (req.isAuthenticated()){
     Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
  });
  } else {
    res.redirect("/login");
  } 
});

app.get("/compose", function(req, res){
  if (req.isAuthenticated()){
	res.render("compose");
} else {
  res.redirect("/login");
}
});

app.post("/compose", function(req, res){

   const post = new Post ({
   date: req.body.date,
   title: req.body.postTitle,
   content: req.body.postBody,
   image: req.body.imgurl
 });

  post.save(function(err){
    if (!err){
        res.redirect("/home");
    }
  });
});

app.get("/posts/:postId", function(req, res){	
  if (req.isAuthenticated()){
	const requestedPostId = req.params.postId;
	Post.findOne({_id: requestedPostId}, function(err, post){
     res.render("post", {
      date: post.date,
      title: post.title,
      content: post.content,
      image: post.image
   });
 });
} else {
  res.redirect("/login");
}
});	

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.get("/about", function(req, res){
	res.render("about");
});

app.get("/contact", function(req, res){
	res.render("contact");
});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
