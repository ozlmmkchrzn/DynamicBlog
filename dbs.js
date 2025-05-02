const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const conn = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName : 'myBlog'
    }).then(() => {
        console.log('DB Connected')
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = conn;
