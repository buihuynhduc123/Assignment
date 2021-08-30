const express = require('express')
const hbs = require('hbs')

const app = express();
app.set('view engine','hbs');
hbs.registerPartials(__dirname +'/views/partials')
app.use(express.static(__dirname + '/pubic'));

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://huyduc:123@cluster0.82mff.mongodb.net/test';
app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);  
    let dbo = client.db("asm2");  
    let results = await dbo.collection("products").find({}).toArray();
    res.render('index',{model:results})
})
app.get('/insert',(req,res)=>{
    res.render('addProduct');
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/doInsert',async (req,res)=>{
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let colorInput = req.body.txtColor;
    let quantityInput = req.body.txtQuantity;
    
    let client= await MongoClient.connect(url);  
    let dbo = client.db("asm2"); 
    let newProduct = {nameProduct : nameInput, price:priceInput, color:colorInput,quantity:quantityInput};
    await dbo.collection("products").insertOne(newProduct);
   
    res.redirect('/');
})

app.get('/delete', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("asm2");
    await dbo.collection('products').deleteOne(condition)
    res.redirect('/');
})

var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Server is running!")