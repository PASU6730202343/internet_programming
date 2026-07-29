require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// ปรับแก้ CORS เพื่อปลดล็อกให้ดึง API ผ่าน Browser ได้ไม่ติด Failed to fetch
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '5mb' }));

// MySQL Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00"
});

(async function testMySQL() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.warn('⚠️ MySQL Connection Warning:', err.message);
    console.warn('   (Will use local product.json fallback if DB is not active)');
  }
})();

// Get products (ดึงข้อมูลจากตาราง inventury น้ำหอม ใน MySQL โดยตรง)
app.get('/api/products', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    // 1. ดึงข้อมูลจากตาราง inventury (สะกดด้วย u - น้ำหอม)
    const [rows] = await pool.query('SELECT * FROM inventury ORDER BY item_id DESC');
    return res.json(rows);
  } catch (e1) {
    try {
      // 2. หากไม่มีตาราง inventury ให้ดึงจาก inventory
      const [rows] = await pool.query('SELECT * FROM inventory ORDER BY created_at DESC');
      return res.json(rows);
    } catch (e2) {
      console.warn('⚠️ Database query failed:', e2.message);
      try {
        const fs = require('fs');
        const path = require('path');
        const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, 'product.json'), 'utf8'));
        res.json(mockData);
      } catch (fallbackError) {
        res.status(500).json({ error: 'Failed to fetch products from inventury table' });
      }
    }
  }
});
app.get("/api", (req, res) => {
  res.send("API is running");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${port}`);
});