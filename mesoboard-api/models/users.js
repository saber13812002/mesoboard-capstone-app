const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    code: String,
    email: String,
    phone: String,
    password: String,
    user_type: String,
    restaurant: String,
    first_name: String,
    last_name: String
});

mongoose.model('Users', UsersSchema);