const mongoose = require('mongoose');
// const schema = mongoose;
const userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
});
const users = mongoose.model('users', userSchema);
module.exports = users;