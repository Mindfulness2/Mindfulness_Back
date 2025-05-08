const express = require('express');
const multer = require('multer');
const cors = require('cors'); 
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 50005;
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 使用 CORS 中间件，允许所有来源访问
app.use(cors());

// 配置 Multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `audio_${timestamp}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// 处理音频文件上传
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
