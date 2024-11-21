import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        console.log('storage');
        cb(null,  path.resolve(__dirname, '../../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadDoc = multer({ storage });

export default uploadDoc;
