const mongoose = require('mongoose')
Schema = mongoose.Schema;
var userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: { type: String, unique: true },
    password: String,
    status: String
}, { timestamps: true })

module.exports = mongoose.model('users', userSchema)