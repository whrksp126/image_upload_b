// express 라이브러리에서 Router 함수를 호출해 사용한다.
const {Router} = require('express');
const imageRouter = Router();
// models 폴더에 image.js 파일 내부에 export한 mongoose.model("image", ImageSchema)가 저장됨
// const Image = mongoose.model("image")
// const Image = mongoose.model("image") === const Image = require('./models/image')
const Image = require('../models/image');
const { upload } = require('../middleware/imageUpload')


// image를 업로드 하는 api
// /upload url로 post가 왔을 때 함수를 실행함
// upload.single('imageTest')는 함수 upload를 이용하여 해당 메소드인 single(사진을 한장만 보내겠다.)을 이용하고, 
// 변수 명으로(post할 때 key 값으로 사용) imageTest를 사용하겠다.
imageRouter.post('/images', upload.single('image'), async (req, res) => {
  // 모델에 대한 새로은 인스턴스를 만듬
  const image = await new Image({
    key : req.file.filename, originalFileName: req.file.originalname
  }).save();
  // image 전송 후 생선된 key, originalFileNamem, _id 등을 네트워크 프리뷰 등에서 확인할 수 있게함
  res.json(image);
})
// db에서 Image 모델안에 있는 모든 데이터를 불러옴
imageRouter.get("/images", async (req, res) => {
  const images = await Image.find()
  res.json(images)
})

module.exports = {imageRouter}