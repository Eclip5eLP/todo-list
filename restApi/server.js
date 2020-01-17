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

app.get('/api', (req, res) => {
   res.send("API currently Online!");
});

//Check Login Success
app.post("/api/login", (req, resp) => {
   var usr = req.body;
   var name = usr.name;
   var pass = usr.pass;
   log("Login attempt: " + name);
   users.find({ username: name }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         bcrypt.compare(pass, res[0].password, (err, f) => {
            if (f) {
               log("Login successfull");
               var str = randString();
               users.updateOne({ username: name, password: res[0].password }, { $set: { apikey: str } });
               resp.send({key: str});
            } else {
               log("Login failed: Passwords not matching");
               resp.send("false");
            }
         });
      } else {
         log("Login failed: User doesnt exist");
         resp.send("false");
      }
   });
});

//Check Login Success with API Key
app.post("/api/login/key", (req, resp) => {
   var usr = req.body;
   var name = usr.name;
   var key = usr.apikey;
   log("Key Login attempt: " + name);
   users.find({ username: name, apikey: key }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         log("Key Login successfull");
         resp.send(true);
      } else {
         log("Key Login failed: User doesnt exist or Key is invalid");
         resp.send("[]");
      }
   });
});

//Get all Entries
app.get("/api/entries", (req, resp) => {
   entries.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         log("All Entries requested");
         resp.send(res);
      } else {
         log("No Entries found");
         resp.send("[]");
      }
   });
});

//Get all Lists
app.get("/api/lists", (req, resp) => {
   lists.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         log("All Lists requested");
         resp.send(res);
      } else {
         log("No Lists found");
         resp.send("[]");
      }
   });
});

//Get all Users
app.get("/api/users", (req, resp) => {
   users.find({}).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         log("All Users requested");
         resp.send(res);
      } else {
         log("No Users found");
         resp.send("[]");
      }
   });
});

//Get a List by ID
app.get("/api/lists/o/:id", (req, resp) => {
   var id = req.params.id;
   lists.find({ id: parseInt(id) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      log("Requested List with ID: " + id);
      resp.send(res);
   });
});

//Get an Entry by ID
app.get("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   entries.find({ id: parseInt(itemID) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      log("Requested Entry with ID: " + itemID);
      resp.send(res);
   });
});

//Get All Lists of User
app.get("/api/u/:user", (req, resp) => {
   var user = req.params.user;
   lists.find({ users: { $in: [ user ] } }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         log("Requested all Lists of User '" + user + "'");
         resp.send(res);
      } else {
         log("No Lists found for User '" + user + "'");
         resp.send("[]");
      }
   });
});

//Add an Entry
app.post("/api/lists/a/:id", (req, resp) => {
   var id = req.params.id;
   var item = req.body;
   log("Adding new Entry to List: ", id, " ", item);
   entries.insertOne(item, (err, res) => {
      if (err) return resp.status(500).send(err);
      log("Added an Entry to List ID: " + id);
      resp.send(res.res);
   });
});

//Add a User
app.post("/api/users", (req, resp) => {
   var item = req.body;
   bcrypt.hash(item.password, 10, (err, hash) => {
      item.password = hash;
      log("Adding new User: ", item);
      users.insertOne(item, (err, res) => {
      if (err) return resp.status(500).send(err);
         log("Created a new User: " + item.username);
         resp.send(res.res);
      });
   })
});

//Add a List
app.post("/api/lists", (req, resp) => {
   var item = req.body;
   log("Adding new List: ", item);
   lists.insertOne(item, (err, res) => {
      if (err) {
         resp.send("[]");
         return resp.status(500).send(err);
      }
      log("Created a new List: " + item.name);
      resp.send(res.res);
   });
});

//Get Entries of List
app.get("/api/lists/e/:id", (req, resp) => {
   var id = req.params.id;
   entries.find({ list: parseInt(id) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      if (res.length) {
         log("Requested all Entries of List ID: " + id);
         resp.send(res);
      } else {
         log("No Entries found");
         resp.send("[]");
      }
   });
});

//Update an Entry by ID
app.put("/api/:id", (req, resp) => {
   var itemID = req.params.id;
   var item = req.body;
   delete item._id;
   log("Updated Entry: ", itemID, " to be ", item);
   entries.updateOne({ id: parseInt(itemID) }, { $set: item });
});

//Update a User by ID
app.put("/api/users/:id", (req, resp) => {
   var id = req.params.id;
   var item = req.body;
   delete item._id;
   log("Úpdated User: ", id, " to be ", item);
   users.updateOne({ id: parseInt(itemID) }, { $set: item });
});

//Update a List by ID
app.put("/api/lists/u/:id", (req, resp) => {
   var item = req.body;
   var id = req.params.id;
   delete item._id;
   log("Updated List: ", id, " to be ", item);
   lists.updateOne({ id: parseInt(id) }, { $set: item });
});

//Delete a List by ID
app.delete("/api/lists/r/:id", (req, resp) => {
   var id = req.params.id;
   log("Deleted List: " + id);
   lists.deleteOne({ id: parseInt(id) });
});

//Delete an Entry by ID
app.delete("/api/:id", (req, resp) => {
   var id = req.params.id;
   log("Deleted Entry: " + id);
   entries.deleteOne({ id: parseInt(id) });
});

//Delete a user by ID
app.delete("/api/users/:id", (req, resp) => {
   var id = req.params.id;
   log("Deleted User: " + id);
   users.deleteOne({ id: parseInt(id) });
});

//Search for Entry in List
app.get("/api/search/:id/:term", (req, resp) => {
   var id = req.params.id;
   var term = req.params.term;
   var regex = new RegExp(["", term, ""].join(""), "i");
   entries.find({ name: regex, list: parseInt(id) }).toArray((err, res) => {
      if (err) return resp.status(500).send(err);
      log("Searching for '" + term + "'");
      resp.send(res);
   });
});

function log(msg, type = "log") {
   var timestamp = "[" + getFormattedDate() + "]";
   if (type == "log") console.log(timestamp + " " + msg);
   if (type == "warn") console.warn(timestamp + " " + msg);
   if (type == "info") console.info(timestamp + " " + msg);
   if (type == "error") console.error(timestamp + " " + msg);
}

function getFormattedDate() {
   var date = new Date();
   var str = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " +  date.getHours() + ":" + date.getMinutes() + "." + date.getSeconds();
   return str;
}

//Start Server
app.listen(4000, () => {
   mongo.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
   }, (err, client) => {
      if(err) {
         throw error;
      }

      //Get main Database with underlying Collections
      db = client.db(dbname);
      entries = db.collection("entries");
      users = db.collection("users");
      lists = db.collection("lists");
      log("Connected to Database");
      log("Server Running on port " + port);
   });
});


/*
All valid API Calls

/                           Base
/api                        Base
/api/:id                    Get/Update/Remove Entry by ID
/api/u/:user                Get all Lists of User

/api/login                  Login Request
/api/login/key              Login Request via Key

/api/entries                Get all Entries

/api/lists                  Get all Lists
/api/lists/e/:id            Get all Entries of List  (Entry)
/api/lists/u/:id            Update Lists by ID       (Update)
/api/lists/r/:id            Remove Lists by ID       (Remove)
/api/lists/o/:id            Get Lists by ID          (Obtain)
/api/lists/p/:id            Parse any received Data  (Parse)
/api/lists/a/:id            Add Entry to List        (Add)

/api/search/:id/:term       Search for an Entry in current List

/api/users                  Get all/Add Users
/api/users/:id              Get/Remove User by ID

*/