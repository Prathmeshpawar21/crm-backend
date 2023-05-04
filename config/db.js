const { MongoClient } = require("mongodb");

class MongoConnection {
  static async connect() {
    if (this.connection) return this.connection;
    try {
      this.connection = new MongoClient(process.env.MONGO_URI);
      this.connection
        .connect()
        .then((value) => {
          console.log("Connected to MongoClient");
        })
        .catch((error) => {
          console.log("Error connecting to MongoClient: " + error);
        });
    } catch (err) {
      console.error(err);
    }
    return this.connection;
  }
}

// const connect = async () => {
//   try {
//     const connection = await MongoClient.connect(process.env.MONGO_URI);
//     console.log("Mongo connection established");
//   } catch (error) {
//     console.log(error);
//   }
// };

module.exports = MongoConnection;
