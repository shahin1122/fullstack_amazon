const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const MongoClient = require('mongodb').MongoClient;
const { request } = require('express');
const uri = "mongodb+srv://emazonserver:HKs7NostxB7oIENu@cluster0.rmnsf.mongodb.net/emajohnserver?retryWrites=true&w=majority";
// require('dotenv').config;
const port = 5000 ;

// use for middleware purpose we have to capture request
app.use(bodyParser.json())
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emajohnserver").collection("products");

  app.post('/addProduct' , (req , res)=>{
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products)
    .then(result =>{
      //console.log(result);
      console.log(result.inseredtCount);
      res.send(result.inseredtCount)

    })
  })
  app.get('/products' , (req, res) =>{
    productsCollection.find({})
    .toArray((err , documents )=>{
      res.send(documents)
    })
  })


  app.get('/product/:key' , (req, res) =>{
    productsCollection.find({key:req.params.key})
    .toArray((err , documents )=>{
      res.send(documents[0])
    })
  })


  app.post('/productsByKeys' , (req, res) =>{
    const productKeys = req.body;
    productsCollection.find({key:{ $in:productKeys }})
    
    .toArray((err , documents )=>{
      res.send(documents)
    })
  })
  
  
  

});

app.listen( process.env.PORT || port)


