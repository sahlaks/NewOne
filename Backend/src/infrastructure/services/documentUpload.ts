import multer from 'multer';

const documentStorage = multer.memoryStorage();
const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: (req, file, cb) => {
    // Allow PDF, DOC, and DOCX file types
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  },
}).single('document');

export default uploadDocument;