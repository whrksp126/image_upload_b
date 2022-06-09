const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User')
// npm i bcryptjs ( 암호화 라이브러리 )
const { hash } = require("bcryptjs")
userRouter.post('/register', async (req, res) => {
  try{
    if(req.body.password.length < 6) 
      throw new Error("비밀번호를 6자 이상으로 해주세요.")
    if(req.body.username.length < 3) 
      throw new Error("username은 3자 이상으로 해주세요.")
    // hash 함수를 이용해서 req.body.password를 암호화 해준다. 다음 인자(10)는 암호화 등급으로 숫자가 높을 수록 높은 보안이다(단 높으면 느려짐). 
    const hashedPassword = await hash(req.body.password, 10)
    
    await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword
    }).save()
    res.json({  message: "user registered" })
  }catch(err){
    res.status(400).json({  message: err.message })
  }

})

module.exports = { userRouter };


