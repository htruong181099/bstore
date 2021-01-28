const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null,'./public/uploads');
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + file.originalname);
    }
})

const fileExtension = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        return cb(null,true)
    }
    req.fileValidationError = "Forbidden extension";
    return cb(null, false, req.fileValidationError)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5 // Limit 5 MB
    },
    fileFilter: fileExtension
})

// const uploadCover = upload.single('cover');


module.exports = upload; 