// npm i dotenv (.env 파일을 불러와서 내부 변수를 사용할 수 있게 함)
require('dotenv').config();
// npm i express
const express = require('express');
// npm i mongoose (mongoDB 관리용)
const mongoose = require('mongoose')

const { imageRouter } = require('./routes/imageRouter');
const { userRouter } = require('./routes/userRouter');
const app = express();

const { MONGO_URI, PORT} = process.env

// 인증 미들웨어 호출
const {authenticate} =  require("./middleware/authentication")

// mongoose.connect를 이용해서 mongoose를 연결해준다.
// mongoose database 생성시 만든 UserName과 passWord를 입력한다.
// process.env.MONGO_URI는 .env 파일에 선언해 둔 변수로 암호화해야하는 키 값을 저장해두고 호출하여 사용한다.
mongoose.connect(MONGO_URI,
  // 다양한 옵션으로 db의 각 버전차이를 보완한다.(나는 해당없어서 주석함)
  // { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
)
.then(()=> {
  console.log("MongoDB Connected.")

  // db 연결 후 서버가 시작되도록 함
      
  // 외부 입력(클라이언트)으로도 이미지가 보이게하기
  app.use("/uploads", express.static('uploads'));
  // 서버에서 응답 받은 res를 보고 json형식으로 만들어 req.body에 저장해준다.
  app.use(express.json());

  // 인증을 위해서는 express.json() 다음에 진행을 해야한다.(순서가 중요)
  app.use(authenticate)

  // /images 경로로 실행된 값들을 모두 imageRouter로 전송하라
  app.use("/images", imageRouter)
  // /users 경로로 실행된 값들을 모두 userRouter로 전송하라
  app.use("/users", userRouter)

  app.listen(PORT, () => console.log('Express server listening on PORT ' + PORT));
})
.catch((err)=> console.log(err))

