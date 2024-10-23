const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 9000;

// Middleware
app.use(express.json());

// Cấu hình CORS
const corsOptions = {
    origin: (origin, callback) => {
      // Cho phép tất cả các miền
      callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Hỗ trợ cookie
  };
  
  app.use(cors(corsOptions));
  
// Lấy URL backend từ biến môi trường
const BACKEND_URL = 'https://api.aiostream.app';

// Proxy cho tất cả các yêu cầu
app.use('/api/v1/*', async (req, res) => {
  const url = `${BACKEND_URL}${req.originalUrl}`; // Kết hợp BACKEND_URL và đường dẫn từ yêu cầu
  console.log('Request URL:', url); // In ra URL để kiểm tra

  try {
    const response = await axios({
      method: req.method, // Lấy phương thức HTTP từ yêu cầu
      url: url,
      data: req.body, // Chuyển body nếu có
      headers: {
        'Authorization': req.headers.authorization, // Thêm header Authorization nếu có
        // Thêm các header khác nếu cần
      },
    });
    res.status(response.status).json(response.data); // Trả về dữ liệu từ backend
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
    });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
