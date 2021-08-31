const express = require('express')
const app = express()

const {ObjectId,MongoClient} = require('mongodb');
const url = 'mongodb+srv://huyduc:123@cluster0.82mff.mongodb.net/test';
//const url ='mongodb://localhost:27017';


app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))


app.post('/insert', async(req,res) => {
    const inputName = req.body.txtName;
    const inputPrice = req.body.txtPrice;
    const inputPicture = req.body.txtPricture;
    const newProduct = {name: inputName, price: inputPrice, picture: inputPicture}

    const linkImg = req.body.link;
    isEr= false;
    error={};
    if(inputPrice<10){
        error.name="sai";
        isEr=true;
    }
    if(isEr){
        res.render('index',{err:error})
    }
    else{
    const client = await MongoClient.connect(url);
    const dbo = client.db("asm2");
    await dbo.collection("products").insertOne(newProduct);
    res.redirect("/");
        
    }
})

app.post('/update',async(req,res) => {
    const inputName = req.body.txtName;
    const inputPrice = req.body.txtPrice;
    const id = req.body.txtId;
    const inputPicture = req.body.txtPicture;
    const filter = {_id: ObjectId(id)}
    
    const newValue = { $set: { name: inputName, price: inputPrice, picture: inputPicture}};
    const client = await MongoClient.connect(url);
    const dbo = client.db("asm2");
    await dbo.collection("products").updateOne(filter, newValue)
    res.redirect("/");
})

app.get('/delete',async(req,res)=>{
    const id = req.query.id;

    const client = await MongoClient.connect(url);
    const dbo = client.db("asm2");
    await dbo.collection("products").deleteOne({"_id":ObjectId(id)});
    res.redirect("/");
})

app.get('/edit',async(req,res) => {
    const id = req.query.id;

    const client = await MongoClient.connect(url);
    const dbo = client.db("asm2");
    const p = await dbo.collection("products").findOne({"_id":ObjectId(id)});
    res.render("edit",{product:p});
})

app.post('/search', async(req,res) =>{
    const inputSearch = req.body.txtSearch;
    const client = await MongoClient.connect(url);
    const dbo = client.db("asm2");
    const allProduct = await dbo.collection("products").find({name: inputSearch}).toArray();
    res.render('index',{data: allProduct})
})

app.get('/', async(req,res) => {
    const client = await MongoClient.connect(url);
    const dbo = client.db("asm2");
    const allProduct = await dbo.collection("products").find({}).toArray();
    res.render('index',{data: allProduct});
})

const PORT = process.env.PORT || 4000;
app.listen(PORT)
console.log("app is running", PORT)