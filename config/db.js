const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uu4gd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db; 

const connectDB = async () => {
  try {
    console.log(" Connecting to MongoDB...");
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log(' MongoDB Connected:', db.databaseName);
  } catch (err) {
    console.error(' MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    console.error(" Database not initialized! Call connectDB first.");
    throw new Error("Database not initialized!");
  }
  return db;
};

module.exports = { connectDB, getDB };
