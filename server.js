const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'assets')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/images/');  // Đặt thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);  // Lấy đuôi ảnh gốc
        cb(null, file.originalname);  // Giữ nguyên tên gốc của ảnh (bao gồm đuôi)
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
    fileFilter(req, file, cb) {
        const fileExtension = path.extname(file.originalname);
        if (!['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension)) {
            return cb(new Error('Chỉ hỗ trợ ảnh .jpg, .jpeg, .png, .gif.'));
        }
        cb(null, true);
    },
});

// Serve the markdown editor page
app.get('/', (req, res) => {
    res.render('index');
});

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'Không có tệp ảnh được tải lên' });
    }
    res.json({ message: 'Ảnh đã được upload thành công', path: req.file.path });
});

// Start the server
app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});
