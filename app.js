var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Schema setup, that is how you want your data to look. Don't need to define 100%, it is dynamic and can be changed.
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var campground = mongoose.model("campground", campgroundSchema);


// MADE A CREATE MONGO OBJECT FOR TESTING PURPOSE.
// campground.create(
//     {
//         name: "Ladakh", 
//         image: "https://images.unsplash.com/photo-1519613144177-523dded30951?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c5e1f90b58cffd8d920f21e3a9d52d3b&auto=format&fit=crop&w=500&q=60",
//         description: "This is a hill station, which is cool most of the year."
//     }, function(err, campground){
//     if(err){
//         console.log(err);
//     } else{
//         console.log("Newly created campground");
//         console.log(campground);
//     }
// });


// USED THIS PREVIOUSLY HARDCODED JS OBJECT WHEN LEARNING WITHOUT DB.
// var campgrounds = [
//     {name: "Mahabaleshwar", image: "https://images.unsplash.com/photo-1504632348771-974e356b80af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c611850d7b8a8fb73cad8dbde80633b4&auto=format&fit=crop&w=500&q=60"},
//     {name: "Spiti", image: "https://images.unsplash.com/photo-1516394399858-ae258cf724cc?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=01bef1ef89c0277e17112687a24f49cb&auto=format&fit=crop&w=500&q=60"},
//     {name: "Ladakh", image: "https://images.unsplash.com/photo-1519613144177-523dded30951?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c5e1f90b58cffd8d920f21e3a9d52d3b&auto=format&fit=crop&w=500&q=60"}
// ];

app.get("/", function(req, res){
    res.render("home");
});




app.get("/campgrounds", function(req, res){
    // Getting all grounds from db
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});




app.post("/campgrounds", function(req,res){
    var name = req.body.name;
    var image= req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    // Create new ground and save it to db
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            // Redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});



app.get("/campgrounds/new", function(req,res){
    res.render("new");
});



// DO NOT PUT THIS BEFORE "/campgrounds/new"    OTHERWISE IT WILL TREAT THE new PART AS ID AND SHOW IS THAT PAGE INSTEAD OF new.ejs.

// Shows more info about a particular campground.
app.get("/campgrounds/:id", function(req, res){
    // Find show template with that campground.
    // Mongoose find by id
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
     
    
});


app.listen(3000, 'localhost', function(){
    console.log("Server is running");
});