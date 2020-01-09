const express = require('express');
const server = express();

const body_parser = require('body-parser');

const port = 4000;

const db = require('diskdb');
db.connect('./data', ['entries']);

if (!db.entries.find().length) {
   const entry = { name: "null", info: "null", id: "0", state: "todo", date: "?" };
   db.entries.save(entry);
}
console.log(db.entries.find());

// parse JSON (application/json content-type)
server.use(body_parser.json());

server.get("/", (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

server.get("/api", (req, res) => {
   res.json(db.entries.find());
});

server.get("/api/:id", (req, res) => {
   const itemId = req.params.id;
   const items = db.entries.find({ id: itemId });

   if (items.length) {
      res.json(items);
   } else {
      res.json({ message: `item ${itemId} doesn't exist` })
   }
});

server.post("/api", (req, res) => {
   const item = req.body;
   console.log('Adding new item: ', item);

   // add new item to array
   db.entries.save(item);

   // return updated list
   res.json(db.entries.find());
});

// update an item
server.put("/api/:id", (req, res) => {
   const itemId = req.params.id;
   const item = req.body;
   console.log("Editing item: ", itemId, " to be ", item);

   db.entries.update({ id: itemId }, item);

   res.json(db.entries.find());
});

// delete item from list
server.delete("/api/:id", (req, res) => {
   const itemId = req.params.id;
   console.log("Delete item with id: ", itemId);

   db.entries.remove({ id: itemId });

   res.json(db.entries.find());
});


server.listen(port, () => {
   console.log(`Server listening at ${port}`);
});