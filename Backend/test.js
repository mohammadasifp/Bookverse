import { MongoClient } from "mongodb";

const uri =
  "mongodb://mohammadasifp01:Bookverse123@cluster0-shard-00-00.5ib6y.mongodb.net:27017,cluster0-shard-00-01.5ib6y.mongodb.net:27017,cluster0-shard-00-02.5ib6y.mongodb.net:27017/?ssl=true&replicaSet=atlas-s6allf-shard-0&authSource=admin&appName=Cluster0";

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
    await client.close();
  } catch (err) {
    console.error("❌ Connection Failed");
    console.error(err);
  }
}

connectDB();