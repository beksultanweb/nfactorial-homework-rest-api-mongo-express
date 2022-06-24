import { MongoClient as mongo } from "mongodb";
import "dotenv/config";

const url = process.env.MONGODB_URI || "mongodb+srv://beksultan18:beksultan123@cluster0.rueb5rn.mongodb.net/?retryWrites=true&w=majority";
let db;

const connect = () => {
    mongo.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        (err, client) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("connected!");
            db = client.db("todos");
        }
    )
}

const getDB = () => db;

export { connect, getDB };