const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gw9bu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect();
        const groceryCollection = client.db('groceryInventory').collection('groceries');

        //load all grocery items
        app.get('/groceries', async (req, res) => {
            const query = {};
            const cursor = groceryCollection.find(query);
            const groceries = await cursor.toArray();
            res.send(groceries);
        });

        //load item by id
        app.get('/groceries/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const grocery = await groceryCollection.findOne(query);
            res.send(grocery);
        });

        //add product
        app.post('/product', async (req, res) => {

            const newProduct = req.body;
            const result = await groceryCollection.insertOne(newProduct);
            res.send(result);
        })

    }
    finally {

    }
}



run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running grocery server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})