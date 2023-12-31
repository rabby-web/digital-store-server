const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.gnm5d1v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // connect
    const productCollection = client.db("productDB").collection("products");
    const cartCollection = client.db("productDB").collection("carts");

    // post
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.send(result);
    });
    // add carts
    app.post("/carts", async (req, res) => {
      const carts = req.body;
      delete carts._id;
      const result = await cartCollection.insertOne(carts);
      console.log(result);
      res.send(result);
    });
    // get carts
    app.get("/carts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
    // delete one cart
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await cartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // get single data for update
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // update single data
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;

      const filter = {
        _id: new ObjectId(id),
      };
      const options = { upsert: true };
      const updatedData = {
        $set: {
          image: product.image,
          name: product.name,
          type: product.type,
          price: product.price,
          brand: product.optionBrand,
          rating: product.rating,
          description: product.description,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedData,
        options
      );
      res.send(result);
    });

    // red
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Technology and Electronics");
});

app.listen(port, () => {
  console.log(`Technology and Electronics Port Running Now ${port}`);
});
