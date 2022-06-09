const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User')
// npm i bcryptjs ( 암호화 라이브러리 )
const { hash, compare } = require("bcryptjs")

// 회원가입 api
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

// 로그인 api
userRouter.post("/login", async(req, res) => {
  try{
    // User Model에서 findOne 함수를 이용해서 username이 req.body.username인 값을 찾아라.
    const user = await User.findOne({username: req.body.username})
    
    // compare()의 첫번째 인자로 입력한 패스워드, 두번째 인자로 user의 hash를  받는다.
    const isValid = await compare(req.body.password, user.hashedPassword)
    if(!isValid) throw new Error("입력하신 정보가 올바리지 않습니다.")
    res.json({message:"user validated"})
  }catch(err){
    res.status(400).json({ message: err.message})
  }
})

module.exports = { userRouter };


