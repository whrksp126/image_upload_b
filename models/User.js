const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  // unique: true는 동일한 username이 있으면 error 출력함
  username: {type: String, required: true, unique: true},
  hashedPassword: {type: String, required: true},
  // 한 유저가 다양한 환경에서 동시에 로그인할 수 있음 글서 [] 배열 형태로 작성
  // sesstions는 기본적으로 _id(세션의 고유 id)가 생성된다.
  sessions:[{
    createdAt: {type: Date, required: true},
  }]
},{timestamps: true}
)

module.exports = mongoose.model('user', UserSchema)