import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DATABASE_URL!);
const clientPromise = client.connect();

export default clientPromise;
