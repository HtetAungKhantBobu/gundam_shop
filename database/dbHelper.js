const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/expressDB";

function db_connect() {
    return mongoose.connect(uri);
}

mongoose.connection.on("connected", () => {
    console.log("Connected to databse");
});

mongoose.connection.on("error", (err) => {
    console.log("You fucked up, you uselses piece of sandwich.")
    console.log(err);
});

module.exports.db_connect = db_connect;
