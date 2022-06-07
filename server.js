// npm i dotenv (.env 파일을 불러와서 내부 변수를 사용할 수 있게 함)
require('dotenv').config();
// npm i express
const express = require('express');
// npm i multer (대표적인 이미지 업로드 라이브러리)
const multer = require('multer');
// npm i uuid (고유한 id를 생성해줌), v4버전을 사용하고 이를 uuid라는 이름으로 사용한다.
const {v4:uuid} = require('uuid')
// npm i mime-types (파일타입을 자동으로 지정해줌)
const mime = require('mime-types')
// npm i mongoose (mongoDB 관리용)
const mongoose = require('mongoose')
// models 폴더에 image.js 파일 내부에 export한 mongoose.model("image", ImageSchema)가 저장됨
// const Image = mongoose.model("image")
// const Image = mongoose.model("image") === const Image = require('./models/image')
const Image = require('./models/image')

// multer.diskStorage를 이용하면 파일 저장과정을 제어할 수 있게된다.
const storage = multer.diskStorage({
  // destination은 어디에 저장할지 결정함
  destination: (req, file, cb) => cb(null, "./uploads"),
  // filename은 어떤 이름으로 저장할지 결정함
  // 파일명을 uuid를 이용해 고유하게 만들고, mime-types 라이브러리에 extenstion 메소드를 이용해 파일타입을 찾아 파일명에 저장함
  filename: (req, file, cb) => 
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`)
})

// upload된 이미지를 어디에 저정할지 dest로 지정한다(코드를 입력하면 폴더가 자동생성됨).
// const upload는 함수로 app.post로 이미지를 보내면 req에 담겨서 보내지는되, 이를 사용자가 확인하기 위해 폴더에 저장해주는 역할을 한다.
// const upload = multer({dest:"uploads"});

// fileFilter를 이용하여 이미지파일만 받을 수 있게하고, 용량제한 등을 할 수 있다.
const upload = multer({storage, fileFilter: (req, file, cd) =>{
  // 콜백(cd())이 받는 인자 첫번째는 오류, 두번째는 Boolean이다(true면 저장됨, false면 저장안됨)
  // 전송할 이미지파일의 file.mometype이 png,jpg,jpeg인 경우 참.
  if(["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)){
    cd(null, true)
  } else {
    cd(new Error('Invalid file type'), false)
  }},
  // 파일용량 제한 
  limits: {
    fileSize: 1024 * 1024 * 5, // 5메가바이트(MB)
  } 

});

const app = express();
const PORT = 5000;

// mongodb id, password,
// admin
// UZEoJTjBAgWxcBtq

// mongoose.connect를 이용해서 mongoose를 연결해준다.
// mongoose database 생성시 만든 UserName과 passWord를 입력한다.
// process.env.MONGO_URI는 .env 파일에 선언해 둔 변수로 암호화해야하는 키 값을 저장해두고 호출하여 사용한다.
mongoose.connect(process.env.MONGO_URI,
  // 다양한 옵션으로 db의 각 버전차이를 보완한다.(나는 해당없어서 주석함)
  // { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
)
.then(()=> {
  console.log("MongoDB Connected.")

  // db 연결 후 서버가 시작되도록 함
      
  // 외부 입력(클라이언트)으로도 이미지가 보이게하기
  app.use("/uploads", express.static('uploads'));

  // image를 업로드 하는 api
  // /upload url로 post가 왔을 때 함수를 실행함
  // upload.single('imageTest')는 함수 upload를 이용하여 해당 메소드인 single(사진을 한장만 보내겠다.)을 이용하고, 
  // 변수 명으로(post할 때 key 값으로 사용) imageTest를 사용하겠다.
  app.post('/images', upload.single('image'), async (req, res) => {
    // 모델에 대한 새로은 인스턴스를 만듬
    const image = await new Image({
      key : req.file.filename, originalFileName: req.file.originalname
    }).save();
    // image 전송 후 생선된 key, originalFileNamem, _id 등을 네트워크 프리뷰 등에서 확인할 수 있게함
    res.json(image);
  })
  // db에서 Image 모델안에 있는 모든 데이터를 불러옴
  app.get("/images", async (req, res) => {
    const images = await Image.find()
    res.json(images)
  })
  app.listen(PORT, () => console.log('Express server listening on PORT ' + PORT));
})
.catch((err)=> console.log(err))

