const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(
      "mongodb://meid:ERRvjTBwmqHCv5Lr@ac-xg9vuv0-shard-00-00.pn9yzom.mongodb.net:27017,ac-xg9vuv0-shard-00-01.pn9yzom.mongodb.net:27017,ac-xg9vuv0-shard-00-02.pn9yzom.mongodb.net:27017/udemy-ecommerce?ssl=true&replicaSet=atlas-pj61g9-shard-0&authSource=admin&retryWrites=true&w=majority"
    )
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    });
};

module.exports = dbConnection;
