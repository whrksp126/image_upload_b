const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  // unique: true는 동일한 username이 있으면 error 출력함
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
},{timestamps: true}
)

module.exports = mongoose.model('user', UserSchema)
