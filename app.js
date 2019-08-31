//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");	

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-adhish:test123@cluster0-aap6q.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
	title: String,
	content: String
};

const Post = mongoose.model("Post", postSchema);

const filmSchema = new mongoose.Schema({
  title: String,
  synopsis: String,
  genre: String,
  cast: String,
  rating: String,
  review: String
});

const Film = mongoose.model("Film", filmSchema);

app.route("/films")

.get(function(req, res){
  Film.find(function(err, foundFilms){
    if (!err) {
      res.render("films", {
        foundFilms: foundFilms
      });
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newFilm = new Film({
    title: req.body.title,
    synopsis: req.body.synopsis,
    title: req.body.title
  });
});

app.get("/", function(req, res){

    res.render("login")
});

app.get("/home", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
	res.render("compose");
});

app.post("/compose", function(req, res){

   const post = new Post ({
   title: req.body.postTitle,
   content: req.body.postBody
 });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){	
	
	const requestedPostId = req.params.postId;
	Post.findOne({_id: requestedPostId}, function(err, post){
     res.render("post", {
      title: post.title,
      content: post.content
   });
 });

});	

app.get("/about", function(req, res){
	res.render("about");
});

app.get("/contact", function(req, res){
	res.render("contact");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
