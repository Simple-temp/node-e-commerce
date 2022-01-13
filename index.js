const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express()
app.use(cors())
app.use(bodyParser.json())


const uri = "mongodb+srv://e-commerce:e-commercepassword@cluster0.ka9ky.mongodb.net/e-commerce?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("e-commerce").collection("products");
  const orderCollection = client.db("e-commerce").collection("order");

  app.post("/postProduct",(req,res)=>{
      const product = req.body;
      collection.insertOne(product)
      .then(function(result) {
        console.log(result)
        res.send(result.insertedCount)
      })
  })

  app.post("/postOrderedProduct",(req,res)=>{
    const orderInfo = req.body;
    orderCollection.insertOne(orderInfo)
    .then(function(result) {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  app.post("/postproductByKey",(req,res)=>
  {
    const productKeys = req.body
    collection.find({ key:{$in:productKeys} })
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  app.get("/getProduct",(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get("/getSelectedProduct/:key",(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  console.log("db connect succesfully")
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(4000,console.log("successfully running port 4000"))