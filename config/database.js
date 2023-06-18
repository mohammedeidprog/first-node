const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.set("strictQuery", true);
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
