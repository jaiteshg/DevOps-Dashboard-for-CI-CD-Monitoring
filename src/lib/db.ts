import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL || "your-mongodb-connection-string";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// 🔹 Move this interface ABOVE its usage
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as unknown as { mongoose?: MongooseCache };

const cached: MongooseCache = globalWithMongoose.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
