const mongoose = require('mongoose');

const TokensSchema = new mongoose.Schema({
  token_str: String,
  user_id: mongoose.ObjectId,
  salt: String,
  expiration_date: String
});

mongoose.model('Tokens', TokensSchema);