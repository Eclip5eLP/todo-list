const express = require("express");
const bodyparser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const objid = require("mongodb").ObjectID;

const port = 4000;
const dbname = "todo-list";
const uri = "mongodb://localhost/api";

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
var db, coll;

app.get('/', (req, res) => {
   res.send("API currently Online!");
});

//Get all
app.get("/api", (req, resp) => {
   coll.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(res);
      } else {
         console.log("List is empty");
      }
   });
});

//Get ID
app.get("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   coll.find({ id: parseInt(itemID) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      resp.send(res);
   });
});

//Add Item
app.post("/api", (req, resp) => {
   var item = req.body;
   console.log("Adding new Entry: ", item);
   coll.insertOne(item, (err, res) => {
      if (err) return resp.status(500).send(err);
      resp.send(res.res);
   });
});

//Update an ID
app.put("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   var item = req.body;
   console.log("Updating Entry: ", itemID, " to be ", item);

   coll.updateOne({ id: parseInt(itemID) }, item);
});

//Delete ID
app.delete("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   console.log("Deleting Entry: ", itemID);
   coll.deleteOne({ id: parseInt(itemID) });
});

app.listen(4000, () => {
   mongo.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }, (err, client) => {
      if(err) {
         throw error;
      }

      db = client.db(dbname);
      coll = db.collection("entries");
      console.log("Connected to Database");
      console.log("Server Running on port " + port);
   });
});