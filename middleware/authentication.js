const mongoose = require('mongoose')
const User = require('../models/User')


const authenticate = async(req, res, next) => {
  const {sessionid} = req.headers;
  // mongoose라이브러리의 isValidObjectId 함수를 이용하면 세션 id가 올바른지 아닌지 확인하고 boolean 값을 리턴한다.
  // 세션 아이디가 없거나, 세션id가 올바르지 않으면 next()를 실행하라
  if(!sessionid || !mongoose.isValidObjectId(sessionid)) return next()
    
  const user = await User.findOne({"sessions._id" : sessionid})
  // 존재하지 않는 user면 next()를 실행하라
  if(!user) return next()

  // 이부분에 보안을 강화하기 위해 로그인 1시가 후 세션id를 제거하게 하는 코드를 작성할 수 있음

  req.user = user
  return next()
}

module.exports = { authenticate }