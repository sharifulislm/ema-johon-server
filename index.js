const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const { query } = require('express');
const port = process.env.PORT || 5000;
const app = express();

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ugji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){

    try{
        await client.connect();
        const productCollection = client.db('emajohn').collection('product');

        app.get('/product', async(req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const Query = {};
            const cursor = productCollection.find(Query);
            let products;
            if(page || size){
            products = await cursor.skip(page*size).limit(size).toArray();
            }else{
                products = await cursor.toArray();
            }
      
            res.send(products);
        });

        app.get('/productCount', async(req,res) => {

            const count = await productCollection.estimatedDocumentCount();
            res.send({count});
        });
        // use post to get products by id 
        app.post('/productBykeys', async(req,res) =>{
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = {_id: {$in: ids}}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
            console.log(keys);
        })


    }
    finally{

    }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('john is runing and waiting for ema')

});




app.listen(port, () => {
    console.log('john is runing on port ', port);
});