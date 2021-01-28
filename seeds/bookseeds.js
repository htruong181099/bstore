const db= require("../models");
const Category = require("../models/category.model");
const Book = db.book;


/*
arr=[{
    "title": "Thám Tử Lừng Danh Conan Tập 77 (Tái Bản 2019)",
    "isbn": "8935244815184",
    "author": "Gosho Aoyama",
    "publisher": "NXB Kim Đồng",
    "price": 20000,
    "saleprice": 17200,
    "quantity": 10,
    "category": ["Thiếu nhi", "Manga", "Trinh Thám"],
    "tags": ["conan","manga","truyện","nhật","bản","tuổi","trẻ"]
},
{
    "title": "Và Từ Hôm Ấy, Lá Thu Vẫn Tiếp Tục Rơi",
    "isbn": "9786049894060",
    "author": "Hà Minh Quang",
    "publisher": "NXB Hội Nhà Văn",
    "price": 90000,
    "saleprice": 72000,
    "quantity": 5,
    "category": ["Tiểu thuyết"],
    "tags": ["xuân","thu","tuổi","trẻ","tình","yêu"]
},
{
    "title": "Thám Tử Lừng Danh Conan Tập 78 (Tái Bản 2019)",
    "isbn": "8935244815191",
    "author": "Gosho Aoyama",
    "publisher": "NXB Kim Đồng",
    "price": 20000,
    "saleprice": 17200,
    "quantity": 10,
    "category": ["Thiếu nhi", "Manga", "Trinh Thám"],
    "tags": ["conan","manga","truyện","nhật","bản","tuổi","trẻ"]
},
{
    "title": "English Grammar in Use Book w Ans",
    "isbn": "9781108430425",
    "author": "Raymond Murphy",
    "publisher": "Cambridge University",
    "price": 178000,
    "saleprice": 151300,
    "quantity": 4,
    "category": ["Ngoại ngữ"],
    "tags": ["học","tiếng","anh","ngôn","ngữ","pháp","english"]
},
{
    "title": "New Cutting Edge Intermediate Students’ Book",
    "isbn": "9780582825178",
    "author": "Sarah Cunningham",
    "publisher": "Pearson",
    "price": 115000,
    "saleprice": 109200,
    "quantity": 6,
    "category": ["Ngoại ngữ"],
    "tags": ["học","tiếng","anh","ngôn","ngữ","pháp","english"]
},
{
    "title": "Putin Logic Của Quyền Lực",
    "isbn": "8935086844274",
    "author": "Hubert Seipel",
    "publisher": "NXB Tổng Hợp TPHCM",
    "price": 138000,
    "saleprice": 93840,
    "quantity": 5,
    "category": ["Chính trị"],
    "tags": ["nga","putin","tổng","thống"]
},
{
    "title": "Nhà Giả Kim (Tái Bản 2017)",
    "isbn": "8935235213746",
    "author": "Paulo Coelho",
    "publisher": "NXB Văn Học",
    "price": 69000,
    "saleprice": 55200,
    "quantity": 12,
    "category": ["Tiểu thuyết"],
    "tags": ["phiêu","lưu","con","người"]
    
},
{
    "title": "Trump: How to Get Rich",
    "isbn": "9780345481030",
    "author": "Donald J Trump",
    "publisher": "Random House",
    "price": 144000,
    "saleprice": 122400,
    "quantity": 12,
    "category": ["Kinh tế", "Chính trị", "Kỹ năng sống"],
    "tags": ["mỹ","donald","trump","tổng","thống","giàu"]
},
{
    "title": "Khu Vườn Ngôn Từ",
    "isbn": "8936048123468",
    "author": "Shinkai Makoto",
    "publisher": "IPM",
    "price": 95000,
    "saleprice": 71000,
    "quantity": 17,
    "category": ["Tiểu thuyết", "Ngôn Tình"],
    "tags": ["light","novel","nhật","bản","tình","yêu"]
},
{
    "title": "Đừng Lựa Chọn An Nhàn Khi Còn Trẻ (Tái Bản 2020)",
    "isbn": "8936186543326",
    "author": "Cảnh Thiên",
    "publisher": "NXB Thế Giới",
    "price": 81000,
    "saleprice": 59500,
    "quantity": 8,
    "category": ["Kỹ năng sống"],
    "tags": ["tuổi","trẻ","cuộc","sống","ước","mơ"]
},
{
    "title": "Tuổi Trẻ Đáng Giá Bao Nhiêu? (Tái Bản 2018)",
    "isbn": "8935235219892",
    "author": "Rosie Nguyễn",
    "publisher": "NXB Hội Nhà Văn",
    "price": 80000,
    "saleprice": 66400,
    "quantity": 26,
    "category": ["Kỹ năng sống"],
    "tags": ["tuổi","trẻ","cuộc","sống","ước","mơ"]
}
]
*/

arr = [
    {
        "title": "Doraemon - Chú Mèo Máy Đến Từ Tương Lai Tập 36",
        "isbn": "8935244813999",
        "author": "Fujiko F Fujio",
        "publisher": "NXB Kim Đồng",
        "price": 18000,
        "saleprice": 15800,
        "quantity": 10,
        "category": [
            "Thiếu nhi",
            "Manga"
        ],
        "tags": [
            "doraemon",
            "doremon",
            "nobita",
            "bảo",
            "bối",
            "truyện",
            "tranh",
            "anime",
            "nhật",
            "bản"
        ]
    },
    {
        "title": "Số đỏ",
        "isbn": "8936158590198",
        "author": "Vũ Trọng Phụng",
        "publisher": "NXB Văn Học",
        "price": 98000,
        "saleprice": 68600,
        "quantity": 7,
        "category": [
            "Tiểu thuyết"
        ],
        "tags": [
            "văn",
            "học",
            "việt",
            "nam",
            "cuộc",
            "sống",
            "xã",
            "hội",
            "xuân",
            "tóc",
            "đỏ"
        ]
    },
    {
        "title": "Tắt đèn",
        "isbn": "8936158590105",
        "author": "Ngô tất tố",
        "publisher": "NXB Văn Học",
        "price": 89000,
        "saleprice": 62300,
        "quantity": 20,
        "category": [
            "Tiểu thuyết"
        ],
        "tags": [
            "văn",
            "học",
            "việt",
            "nam",
            "cuộc",
            "sống",
            "xã",
            "hội",
            "nông",
            "dân",
            "thực",
            "dân",
            "pháp",
            "chị",
            "dậu",
            "phụ",
            "nữ"
        ]
    },
    {
        "title": "Hồ Chí Minh - Nhật Ký Trong Tù",
        "isbn": "8936067594621",
        "author": "Hồ Chí Minh",
        "publisher": "NXB Văn Học",
        "price": 38000,
        "saleprice": 25500,
        "quantity": 17,
        "category": [
            "Thơ, Ca Dao, Tục Ngữ, Thành Ngữ"
        ],
        "tags": [
            "văn",
            "học",
            "việt",
            "nam",
            "cách",
            "mạng",
            "bác",
            "hồ",
            "tự",
            "sự",
            "chữ",
            "hán"
        ]
    },
    {
        "title": "Thơ Xuân Diệu",
        "isbn": "8935095627370",
        "author": "Xuân Diệu",
        "publisher": "NXB Văn Học",
        "price": 38000,
        "saleprice": 25500,
        "quantity": 17,
        "category": [
            "Thơ, Ca Dao, Tục Ngữ, Thành Ngữ"
        ],
        "tags": [
            "văn",
            "học",
            "việt",
            "nam",
            "trữ",
            "tình",
            "thơ",
            "mới",
            "cách",
            "mạng"
        ]
    },
    {
        "title": "Lão Hạc",
        "isbn": "9786049541582",
        "author": "Nam Cao",
        "publisher": "NXB Văn Học",
        "price": 41000,
        "saleprice": 41000,
        "quantity": 1,
        "category": [
            "Truyện Ngắn"
        ],
        "tags": [
            "văn",
            "học",
            "tản",
            "văn",
            "việt",
            "nam",
            "xã",
            "hội",
            "nông",
            "dân",
            "nghèo"
        ]
    },
    {
        "title": "Đôi Mắt",
        "isbn": "8935236417945",
        "author": "Nam Cao",
        "publisher": "NXB Văn Học",
        "price": 70000,
        "saleprice": 56000,
        "quantity": 11,
        "category": [
            "Tiểu thuyết",
            "Truyện Ngắn"
        ],
        "tags": [
            "văn",
            "học",
            "việt",
            "nam",
            "cách",
            "nhìn",
            "cuộc",
            "sống"
        ]
    },
    {
        "title": "Đừng Lựa Chọn An Nhàn Khi Còn Trẻ (Tái Bản 2020)",
        "isbn": "8936186543326",
        "author": "Cảnh Thiên",
        "publisher": "NXB Thế Giới",
        "price": 81000,
        "saleprice": 59500,
        "quantity": 8,
        "category": [
            "Kỹ năng sống"
        ],
        "tags": [
            "tuổi",
            "trẻ",
            "cuộc",
            "sống",
            "ước",
            "mơ"
        ]
    },
    {
        "title": "Tuổi Trẻ Đáng Giá Bao Nhiêu? (Tái Bản 2018)",
        "isbn": "8935235219892",
        "author": "Rosie Nguyễn",
        "publisher": "NXB Hội Nhà Văn",
        "price": 80000,
        "saleprice": 66400,
        "quantity": 26,
        "category": [
            "Kỹ năng sống"
        ],
        "tags": [
            "tuổi",
            "trẻ",
            "cuộc",
            "sống",
            "ước",
            "mơ"
        ]
    },
    {
        "title": "Trump: How to Get Rich",
        "isbn": "9780345481030",
        "author": "Donald J Trump",
        "publisher": "Random House",
        "price": 144000,
        "saleprice": 122400,
        "quantity": 12,
        "category": [
            "Chính trị",
            "Kỹ năng sống",
            "Kinh tế"
        ],
        "tags": [
            "mỹ",
            "donald",
            "trump",
            "tổng",
            "thống",
            "giàu"
        ]
    },
    {
        "title": "Khu Vườn Ngôn Từ",
        "isbn": "8936048123468",
        "author": "Shinkai Makoto",
        "publisher": "IPM",
        "price": 95000,
        "saleprice": 71000,
        "quantity": 17,
        "category": [
            "Tiểu thuyết",
            "Ngôn Tình"
        ],
        "tags": [
            "light",
            "novel",
            "nhật",
            "bản",
            "tình",
            "yêu"
        ]
    },
    {
        "title": "Putin Logic Của Quyền Lực",
        "isbn": "8935086844274",
        "author": "Hubert Seipel",
        "publisher": "NXB Tổng Hợp TPHCM",
        "price": 138000,
        "saleprice": 93840,
        "quantity": 5,
        "category": [
            "Chính trị"
        ],
        "tags": [
            "nga",
            "putin",
            "tổng",
            "thống"
        ]
    },
    {
        "title": "Nhà Giả Kim (Tái Bản 2017)",
        "isbn": "8935235213746",
        "author": "Paulo Coelho",
        "publisher": "NXB Văn Học",
        "price": 69000,
        "saleprice": 55200,
        "quantity": 12,
        "category": [
            "Tiểu thuyết"
        ],
        "tags": [
            "phiêu",
            "lưu",
            "con",
            "người"
        ]
    },
    {
        "title": "New Cutting Edge Intermediate Students’ Book",
        "isbn": "9780582825178",
        "author": "Sarah Cunningham",
        "publisher": "Pearson",
        "price": 115000,
        "saleprice": 109200,
        "quantity": 6,
        "category": [
            "Ngoại ngữ"
        ],
        "tags": [
            "học",
            "tiếng",
            "anh",
            "ngôn",
            "ngữ",
            "pháp",
            "english"
        ]
    },
    {
        "title": "English Grammar in Use Book w Ans",
        "isbn": "9781108430425",
        "author": "Raymond Murphy",
        "publisher": "Cambridge University",
        "price": 178000,
        "saleprice": 151300,
        "quantity": 4,
        "category": [
            "Ngoại ngữ"
        ],
        "tags": [
            "học",
            "tiếng",
            "anh",
            "ngôn",
            "ngữ",
            "pháp",
            "english"
        ]
    },
    {
        "title": "Thám Tử Lừng Danh Conan Tập 78 (Tái Bản 2019)",
        "isbn": "8935244815191",
        "author": "Gosho Aoyama",
        "publisher": "NXB Kim Đồng",
        "price": 20000,
        "saleprice": 17200,
        "quantity": 10,
        "category": [
            "Trinh Thám",
            "Thiếu nhi",
            "Manga"
        ],
        "tags": [
            "conan",
            "manga",
            "truyện",
            "nhật",
            "bản",
            "tuổi",
            "trẻ"
        ]
    },
    {
        "title": "Và Từ Hôm Ấy, Lá Thu Vẫn Tiếp Tục Rơi",
        "isbn": "9786049894060",
        "author": "Hà Minh Quang",
        "publisher": "NXB Hội Nhà Văn",
        "price": 90000,
        "saleprice": 72000,
        "quantity": 5,
        "category": [
            "Tiểu thuyết"
        ],
        "tags": [
            "xuân",
            "thu",
            "tuổi",
            "trẻ",
            "tình",
            "yêu"
        ]
    },
    {
        "title": "Thám Tử Lừng Danh Conan Tập 77 (Tái Bản 2019)",
        "isbn": "8935244815184",
        "author": "Gosho Aoyama",
        "publisher": "NXB Kim Đồng",
        "price": 20000,
        "saleprice": 17200,
        "quantity": 10,
        "category": [
            "Trinh Thám",
            "Thiếu nhi",
            "Manga"
        ],
        "tags": [
            "conan",
            "manga",
            "truyện",
            "nhật",
            "bản",
            "tuổi",
            "trẻ"
        ]
    }
]

module.exports = ()=>{
    arr.forEach(async (e)=>{
        let bk = new Book({
                "title": e.title,
                "isbn": e.isbn,
                "author": e.author,
                "publisher": e.publisher,
                "price": e.price,
                "saleprice": e.saleprice,
                "quantity": e.quantity,
                "tags": e.tags
        });
        await Category.find({
            name: {$in : e.category}
        },(err,docs)=>{
            console.log(docs);
            if(err){
                return res.status(500).send({
                    message: err
                })
            }
            bk.category = docs.map(doc=>{
                console.log(doc);
                return doc._id
            })
        })
        bk.save(err=>{
            if(err)
            console.log(err)
        });
    })
}