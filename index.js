// Require or import necessary packages
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
require("dotenv").config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// create a simple get method to check server is ok or not
app.get("/", (req, res) => {
    res.send("Ema-john server is running")
})


// Setup MongoDB connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n72f5gi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// create a async function that will handle the communication with MongoDB database
const server = async() => {
    try{
        const productsCollection = client.db("ema-john").collection("products");

        app.get("/products", async(req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount()
            res.send({count , products})
        })

        app.post("/productsByIds", async(req, res) => {
            const ids = req.body;
            const objectIds = ids.map((id) => ObjectId(id))
            const query = { _id: { $in: objectIds }}
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();

            res.send(products)
        })
    }
    finally{

    }
}

// call the function above to run entire server
server().catch((error) => console.log(error))


// run the server with "listen method"
app.listen(port, () => {
    console.log("Ema-John server is running on port", port);
})