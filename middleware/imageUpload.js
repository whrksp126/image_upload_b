// npm i multer (대표적인 이미지 업로드 라이브러리)
const multer = require('multer');
// npm i uuid (고유한 id를 생성해줌), v4버전을 사용하고 이를 uuid라는 이름으로 사용한다.
const {v4:uuid} = require('uuid')
// npm i mime-types (파일타입을 자동으로 지정해줌)
const mime = require('mime-types')

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

module.exports = { upload };