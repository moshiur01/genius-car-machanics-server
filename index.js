const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
// middleware
app.use(cors());
app.use(bodyParser.json());

// declare port
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqmue.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log("connected to db");

    const database = client.db("Genius-car-mechanics");
    const servicesCollection = database.collection("services");

    // get all data api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleService = await servicesCollection.findOne(query);
      res.json(singleService);
    });

    //post api

    app.post("/services", async (req, res) => {
      const service = req.body;
      // console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    //  delete api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
// call the run function
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ulala Server");
});

app.listen(port, () => {
  console.log("ulala my port is", port);
});
