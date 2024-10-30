import multer from 'multer';
import path from 'path'

const storage = multer.memoryStorage(); 
const upload = multer({ storage }).single('image');

export default upload