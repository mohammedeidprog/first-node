const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect("", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    })
    .catch(
      Promise.reject(
        new Error(`Database connection failed ${process.env.DB_URI}`)
      )
    );
};

module.exports = dbConnection;
