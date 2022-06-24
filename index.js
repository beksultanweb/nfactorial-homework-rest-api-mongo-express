import express, { request } from "express";
import bodyParser from "body-parser";
import { connect, getDB } from "./db.js";
import { ObjectId } from "mongodb";
import "dotenv/config";
// import url from "url";
// import { encode } from "querystring";

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connect();

app.get('/', (req, res) => {
    res.status(200).send();
});

app.get('/products', async (req, res) => {

    // const db = getDB();
    // const collection = db.collection("todos");
    // const result = await collection.find({}).toArray();
    // res.send(result);

    await getDB()
    .collection('todos')
    .find({})
    // .sort("price")
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/priority', async (req, res) => {
    await getDB()
    .collection('todos')
    .find({})
    .sort("priority")
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).json(result);
    });
});

app.post('/product', (req, res) => {
    const {label, done, priority} = req.body;

    getDB()
    .collection('todos')
    .insertOne({'label': label, 'done': done, 'priority': priority}, (err) => {
        if (err) {
            res.status(500).json({ err: err });
            return;   
        }
        res.status(200).send();
    });
});


app.delete('/product/:id', (req, res) => {
    
    getDB()
    .collection('todos')
    .deleteOne({ _id: new ObjectId(req.params.id) }, (err) => {
        if (err) {
            res.status(500).json({ err: err });
            return;   
        }
        res.status(200).send();
    });
});

app.get("/search", async (req, res) => {
    // const { label }  = req.query.label;
    // let parsedQs = encode.parse(req.query);
    // console.log(req.query);

    getDB()
    .collection('todos')
    .find({'label': { $regex: req.query.label, $options: "i"}})
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        
        res.status(200).json(result);
    });    
});

app.put("/products/:id", async (req, res) => {
    const { label, done, priority } = req.body;
    const { id } = req.params;
  
    const db = getDB();
    const collection = db.collection("todos");
  
    await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          label,
          done,
          priority,
        },
      }
    );
  
    const result = {
        _id: id,
        label,
        done,
        priority,
    };
  
    res.send(result);
});

app.listen(port, () => {
    console.log('Server started!');
});

/*
Plan:
Add todo POST +
Onload get GET +
Delete todo DELETE +
Filter by search +
Change PUT +
Sort by priority 

Using MongoDB
beksultan18 log
beksultan123 pass

mongosh "mongodb+srv://cluster0.rueb5rn.mongodb.net/myFirstDatabase" --apiVersion 1 --username beksultan18
*/