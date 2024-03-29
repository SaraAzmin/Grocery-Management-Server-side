const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middleware
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gw9bu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const groceryCollection = client
      .db("groceryInventory")
      .collection("groceries");

    //load all grocery items
    app.get("/groceries", async (req, res) => {
      const query = {};
      const cursor = groceryCollection.find(query);
      const groceries = await cursor.toArray();
      res.send(groceries);
    });

    //load item by id
    app.get("/groceries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const grocery = await groceryCollection.findOne(query);
      res.send(grocery);
    });

    //add product
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await groceryCollection.insertOne(newProduct);
      res.send(result);
    });

    //delete product by id
    app.delete("/groceries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await groceryCollection.deleteOne(query);
      res.send(result);
    });

    //update quantity
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;

      const result = await groceryCollection.findOne({
        _id: ObjectId(id),
      });

      const updatedProduct = req.body;

      let quantity = updatedProduct.newQuantity;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: quantity,
        },
      };
      const result2 = await groceryCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result2);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running grocery server");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
