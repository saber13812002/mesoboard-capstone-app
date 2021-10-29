const mongoose = require('mongoose');

const PermissionsSchema = new mongoose.Schema({
    code: String,
    email: String,
    phone: String,
    permission_type: String,
    restaurant: String,
    last_update: Date
});

mongoose.model('Permissions', PermissionsSchema);