const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const mongodb=require('mongodb');
// const Post=require('./models/post');
const methodOverride=require('method-override');


mongoose.connect('mongodb://localhost:27017/Insta', {
    useNewUrlParser: true,
  
    useUnifiedTopology: true,

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

const PostSchema=new mongoose.Schema({

    title: String,
    image: String,
    description: String,
    location: String,
     reviews: [
        {
            body: String,
            rating:Number
            
            
        }
    ]



})
const reviewSchema = new mongoose. Schema({
    body: String,
    rating:Number
    
});

var Review=mongoose.model('Review',reviewSchema);


var Post= mongoose.model('Post', PostSchema);
app.get('/posts',async(req,res)=>{
    const posts=await Post.find({});
    res.render('posts/index',{posts});

});

app.get('/posts/new',(req,res)=>{

    res.render('posts/new');
});
app.post('/posts/:id/reviews',async(req,res)=>{
    const post = await Post.findById(req.params.id);
    const review = new Review(req.body.review);
    post.reviews.push(review);
    await review.save();
    await post.save();
    res.redirect(`/posts/${post._id}`);

})

app.post('/posts',async(req,res)=>{
    // res.send(req.body);
    const post= new Post(req.body.post);
   
    await post.save();
    res.redirect(`/posts/${post._id}`)
})

app.get('/posts/:id',async(req,res)=>{
    const post= await Post.findById(req.params.id);
    if(!post){
        return res.redirect('/posts');

    }
    res.render('posts/show',{post});
})



app.delete('/posts/:id',async(req,res)=>{
    const{id}= req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
})






app.listen(3080, () => {
    console.log('Serving on port 3000')
})

