const db = require("../models");
const Category = db.category;

let categories = [
    "Truyện Ngắn", "Tiểu thuyết", "Thơ, Ca Dao, Tục Ngữ, Thành Ngữ",
    "Ngôn Tình", "Trinh Thám",
    "Tâm lý", "Kỹ năng sống",
    "Kinh tế", "Chính trị", "Xã hội",
    "Khoa học", "Nghệ thuật",
    "Khoa học viễn tưởng",
    "Lịch sử", "Địa lý",
    "Thiếu nhi",
    "Manga", "Comic",
    "Tiểu sử", "Hồi ký",
    "Sách giáo khoa", 
    "Sách tham khảo",
    "Ngoại ngữ",
]

module.exports = () =>{
    categories.forEach(e=>{
        let category = new Category({name:e});
        category.save((err)=>{
            if(err)
            console.log(err);
        })
    })
}
