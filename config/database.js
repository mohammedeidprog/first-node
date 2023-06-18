const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect("", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    });
};

module.exports = dbConnection;
