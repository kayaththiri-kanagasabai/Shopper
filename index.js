const port = 3001;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { type } = require('os');
const { error, log } = require('console');
// const { error } = require('console');
// const { console } = require('inspector');


//initial all the dependencies 
app.use(express.json()); //connect the json with 3001
app.use(cors());

//database connection with mongoose


//API creation
app.get("/", (req, res) => {
    res.send("Express App is running")
})
 //Image storage engine

 const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  })

//past the configuration
const upload = multer({storage:storage})

 //creating upload endpoint for images
 app.use('/images',express.static('upload/images'))


 app.post("/upload",upload.single('product'),(req,res)=>{
   res.json({
       success:1,
       image_url:`http://localhost:${port}/images/${req.file.filename}`
   })
 })

 // Schema for creating products

 const Product  = mongoose.model("Product", {
    id:{
        type:Number,
        required:true,

    },
    name:{
        type:String,
        required:true,

    },
    image:{
        type:String,
        required:true,

    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
     old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },


 })

 app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){ // i changed product as products(6.58)
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }

    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
    console.log(product);
    await product.save(); // save the mongodb
    console.log("Saved"); // if the response save the mongoose the alert message 

    res.json({
        success:true,
        name:req.body.name,
    })
 })

//creating API for deleting product

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
})

// Schema creating for  user model
 const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
 })

 // Creating endpoint for registering the user
 app.post('/signup',async(req,res)=>{ // if user already have an account
    let check = await Users.findOne({email:req.body.email});

    if(check)
    {
        return res.status(400).json({success:false,errors:"Existing user found with same email id"})
        
    }

    let cart={}; // if no, new user created
    for(let i=0; i<300; i++)
    {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
 })
 await user.save(); // save new user

 const data ={
    user:{
        id:user.id
    }
 }

 const token = jwt.sign(data,'secret_ecom');
 res.json({success:true,token});


 })
// creating endpoint for users
app.post('/login',async(req,res)=>
{ // finding the user
    let user = await Users.findOne({email:req.body.email});
    
    if(user) // if user available,compare password
    {
        const passCompare = req.body.password === user.password;
        if(passCompare)
        {
            const data ={
                user:{
                    id:user.id 
                }
            } // if the password is correct then generate the token
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});

        }
        else // if insorrect password , display the error
        {
            res.json({success:false,errors:"Wrong password"});
        }
    }
    else // if the user is not available the paticular email id , display the error message.
    {
        res.json({success:false,errors:"Wrong Email Id"})
    }
})

//creating endpoint endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection fetched");
    res.send(newcollection); 

});

//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4);

    console.log("popular in women fetched");
    res.send(popular_in_women);
})
// creating middleware to fetch user
const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({errors:"Please authenticate using valid token"});

    }
    else
    {
        try
        {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();

        }
        catch (error)
        {
            res.status(401).send({errors:"please authenticate using a valid token"})
        }
    }

}

// creating endpoint for adding products in cart data
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("added",req.body.itemId); 

  let userData = await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId] +=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Added");
})

// creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId); 
      let userData = await Users.findOne({_id:req.user.id});
      if(userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId] -=1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Removed");
})

// creating endpoint to cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
    
})



// const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://kkayaththiri:kaya@cluster0.bubcdh2.mongodb.net/shopperproject1', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     ssl: true,
//     tlsAllowInvalidCertificates: true, 
//   })

  mongoose.connect('mongodb+srv://kkayaththiri:kaya@cluster0.bubcdh2.mongodb.net/shopperproject1', {
    ssl: true,
    tlsAllowInvalidCertificates: true, 
})
  .then(() => console.log("MongoDB is connected"))
  .catch(err => console.error("MongoDB connection error:", err));
  
  app.listen(port,(error)=>{
      if(!error){
          console.log("Server running on port"+port)
      }
      else{
          console.log("Error:"+error)
      }
  })