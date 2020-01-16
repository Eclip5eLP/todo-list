const express = require("express");
const bodyparser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const objid = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");

const port = 4000;
const dbname = "todo-list";
const uri = "mongodb://localhost/api";

var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
var db, lists, users, entries;

function randString() {
   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

app.get('/', (req, res) => {
   res.send("API currently Online!");
});

//Check Login Success
app.post("/api/login", (req, resp) => {
   var usr = req.body;
   var name = usr.name;
   var pass = usr.pass;
   console.log("Login attempt: " + name);
   users.find({ username: name }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         console.log(res);
         bcrypt.compare(pass, res[0].password, (err, f) => {
            if (f) {
               console.log("Login succeeded with: " + f);
               var str = randString();
               users.updateOne({ username: name, password: res[0].password }, { $set: { apikey: str } });
               resp.send({key: str});
            } else {
               console.log("Login failed with: " + f);
               resp.send("false");
            }
         });
      } else {
         resp.send("false");
      }
   });
});

//Check Login Success with API Key
app.post("/api/login/key", (req, resp) => {
   var usr = req.body;
   var name = usr.name;
   var key = usr.apikey;
   users.find({ username: name, apikey: key }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(true);
      } else {
         console.log("No Users found");
         resp.send("[]");
      }
   });
});

//Get all Entries
app.get("/api/entries", (req, resp) => {
   entries.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(res);
      } else {
         console.log("No Entries found");
         resp.send("[]");
      }
   });
});

//Get all Lists
app.get("/api/lists", (req, resp) => {
   lists.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(res);
      } else {
         console.log("No Lists found");
         resp.send("[]");
      }
   });
});

//Get all Users
app.get("/api/users", (req, resp) => {
   users.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(res);
      } else {
         console.log("No Users found");
         resp.send("[]");
      }
   });
});

//Get a List by ID
app.get("/api/lists/o/:id", (req, resp) => {
   var id = req.params.id;
   lists.find({ id: parseInt(id) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      resp.send(res);
   });
});

//Get an Entry by ID
app.get("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   entries.find({ id: parseInt(itemID) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      resp.send(res);
   });
});

//Get All Lists of User
app.get("/api/u/:user", (req, resp) => {
   var user = req.params.user;
   lists.find({ users: { $in: [ user ] } }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(res);
      } else {
         console.log("No Lists found");
         resp.send("[]");
      }
   });
});

//Add an Entry
app.post("/api/lists/a/:id", (req, resp) => {
   var id = req.params.id;
   var item = req.body;
   console.log("Adding new Entry to List: ", id, " ", item);
   entries.insertOne(item, (err, res) => {
      if (err) return resp.status(500).send(err);
      resp.send(res.res);
   });
});

//Add a User
app.post("/api/users", (req, resp) => {
   var item = req.body;
   bcrypt.hash(item.password, 10, (err, hash) => {
      item.password = hash;
      console.log("Adding new User: ", item);
      users.insertOne(item, (err, res) => {
      if (err) return resp.status(500).send(err);
         resp.send(res.res);
      });
   })
});

//Add a List
app.post("/api/lists", (req, resp) => {
   var item = req.body;
   console.log("Adding new List: ", item);
   lists.insertOne(item, (err, res) => {
      if (err) {
         resp.send("[]");
         return resp.status(500).send(err);
      }
      resp.send(res.res);
   });
});

//Get Entries of List
app.get("/api/lists/e/:id", (req, resp) => {
   var id = req.params.id;
   entries.find({ list: parseInt(id) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         resp.send(res);
      } else {
         console.log("No Entries found");
         resp.send("[]");
      }
   });
});

//Update an Entry by ID
app.put("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   var item = req.body;
   delete item._id;
   console.log("Updating Entry: ", itemID, " to be ", item);

   entries.updateOne({ id: parseInt(itemID) }, { $set: item });
});

//Update a User by ID
app.put("/api/users/:id", (req, resp) => {
   var id = req.params.id;
   var item = req.body;
   delete item._id;
   console.log("Updating User: ", id, " to be ", item);

   users.updateOne({ id: parseInt(itemID) }, { $set: item });
});

//Update a List by ID
app.put("/api/lists/u/:id", (req, resp) => {
   var item = req.body;
   var id = req.params.id;
   delete item._id;
   console.log("Updating List: ", id, " to be ", item);

   lists.updateOne({ id: parseInt(id) }, { $set: item });
});

//Delete a List by ID
app.delete("/api/lists/r/:id", (req, resp) => {
   var id = req.params.id;
   console.log("Deleting List: ", id);
   lists.deleteOne({ id: parseInt(id) });
});

//Delete an Entry by ID
app.delete("/api/:id", (req, resp) => {
   var id = req.params.id;
   console.log("Deleting Entry: ", id);
   entries.deleteOne({ id: parseInt(id) });
});

//Delete a user by ID
app.delete("/api/users/:id", (req, resp) => {
   var id = req.params.id;
   console.log("Deleting User: ", id);
   users.deleteOne({ id: parseInt(id) });
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
      entries = db.collection("entries");
      users = db.collection("users");
      lists = db.collection("lists");
      console.log("Connected to Database");
      console.log("Server Running on port " + port);
   });
});