var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    expressSanitizer = require("express-sanitizer");

    // App  config
mongoose.connect("mongodb+srv://OmkarAdmin:Admin@cluster0.qgukw.mongodb.net/blog_app?retryWrites=true&w=majority" , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  })
//mongoose.connect("mongodb+srv://omkar:omkarnajan@cluster1.lik8i.mongodb.net/yelpcamp?retryWrites=true&w=majority" , { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false})

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://OmkarAdmin:Admin@cluster0.qgukw.mongodb.net/blog_app?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.set("view engine" , "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
// express sanitizer goes after body parser 
app.use(expressSanitizer());
app.use(methodOverride("_method")); 

// mongoose/model/config
var blogSchema  = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    Created:{type:Date, default:Date.now}
});
var Blog = mongoose.model("Blog" , blogSchema);
// RESTful Routes
Blog.create({
    title:"test",
    image:"https://images.unsplash.com/photo-1592657483080-26097e09020f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    body:"Hello this is a blog post!!",
}) 

app.get("/",function(req,res){
    res.redirect("/blogs");
})

// INDEX ROUTE
app.get("/blogs" ,function(req,res){
    Blog.find({} , function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs})
        }
    })
})
// NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
})
// CREATE ROUTE
app.post("/blogs" , function(req,res){
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog , function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    })
    // redirect to index
})

// Show route
app.get("/blogs/:id" , function(req,res){
    Blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:foundBlog})
        }
    })
});
// edit route
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id , function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    })
})
// update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog , function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

// delete route
app.delete("/blogs/:id" , function(req,res){
//    destroy blog
    Blog.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs")
        }
    })
    // redirect somewhere
})

app.listen(3000,function(){
    console.log("blog_app is running!!");
})