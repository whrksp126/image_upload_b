// db 모델을 설정함
// 데이터 테이블을 만듬(콜렉션?)

const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  // 어떤 타이틀이 있는지 선언함 (_id를 자동으로 생성해 줌)
  {
    // key 값과, originalFileName의 type과 옵션을 작성함
    key: { type: String, required: true},
    originalFileName: { type: String, required: true}
  },
  // 옵션들을 선언할 수 있음
  // 저장이나 수정될 때 그 시간을 자동으로 저장함
  { timestamps: true }
)

// mongoose.model("image", ImageSchema)의 첫번째 인지인 image는 모델 명이고, 두번째 인자는 Schema를 입력해야 함
module.exports = mongoose.model('image', ImageSchema)