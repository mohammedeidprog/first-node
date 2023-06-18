const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log(`Database connected: ${conn.connection.host}`);
    });
};

module.exports = dbConnection;
