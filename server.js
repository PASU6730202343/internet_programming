require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3034;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----------------------------------------------------
// 1. Connection Pool targeting Localhost MySQL
// ----------------------------------------------------
let pool = null;

async function getPool() {
  if (pool) return pool;

  const credentials = [
    {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'std6730202343',
      password: process.env.DB_PASSWORD || 'g3#Vjp8L',
      database: process.env.DB_NAME || 'it_std6730202343',
      port: Number(process.env.DB_PORT) || 3306
    },
    {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: process.env.DB_NAME || 'it_std6730202343',
      port: 3306
    }
  ];

  for (const cred of credentials) {
    try {
      const p = mysql.createPool({
        ...cred,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: "+07:00"
      });
      const conn = await p.getConnection();
      console.log(`✅ Connected to Localhost MySQL [${cred.user}@${cred.host}] Database: ${cred.database}`);
      conn.release();
      pool = p;
      return pool;
    } catch (err) {
      // Silently fail if local DB is offline
    }
  }

  return null;
}

// ----------------------------------------------------
// 2. Direct phpMyAdmin HTTP SQL Bridge for Remote 119.59.102.161/nindamdb
// ----------------------------------------------------
const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const { JSDOM } = require('jsdom');

const executeRemotePmaSql = async (sqlQuery) => {
  try {
    console.log(`🚀 Executing Live Remote SQL on http://119.59.102.161/nindamdb: [${sqlQuery}]`);
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar, withCredentials: true }));

    // Step 1: GET phpMyAdmin login page to retrieve token and start session
    const getRes = await client.get('http://119.59.102.161/nindamdb/index.php');
    const dom1 = new JSDOM(getRes.data);
    const token = dom1.window.document.querySelector('input[name="token"]').value;

    // Step 2: Login as std6730202343
    const loginParams = new URLSearchParams();
    loginParams.append('pma_username', 'std6730202343');
    loginParams.append('pma_password', 'g3#Vjp8L');
    loginParams.append('server', '1');
    loginParams.append('target', 'index.php');
    loginParams.append('token', token);

    const loginRes = await client.post('http://119.59.102.161/nindamdb/index.php', loginParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const dom2 = new JSDOM(loginRes.data);
    const sessionTokenInput = dom2.window.document.querySelector('input[name="token"]');
    const sessionToken = sessionTokenInput ? sessionTokenInput.value : token;

    // Step 3: Execute SQL Query on database it_std6730202343 via route=/database/sql
    const sqlParams = new URLSearchParams();
    sqlParams.append('db', 'it_std6730202343');
    sqlParams.append('table', 'inventory');
    sqlParams.append('token', sessionToken);
    sqlParams.append('sql_query', sqlQuery);

    const sqlRes = await client.post('http://119.59.102.161/nindamdb/index.php?route=/database/sql', sqlParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log(`🌐 Live PMA Database SQL Executed on http://119.59.102.161/nindamdb -> Status: ${sqlRes.status}`);
  } catch (err) {
    console.warn('⚠️ Remote PMA Bridge execution warning:', err.message);
  }
};

// Fallback functions for product.json removed

// 1. GET /api/products
app.get('/api/products', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const db = await getPool();
    if (db) {
      const [rows] = await db.query('SELECT * FROM inventory ORDER BY item_id DESC');
      console.log(`📦 Fetched ${rows.length} items from database`);
      return res.json(rows);
    } else {
      console.warn('⚠️ Database connection is null, cannot fetch products.');
      return res.status(500).json({ error: 'Database connection failed. Please ensure DB_HOST in .env is correct and accessible.' });
    }
  } catch (err) {
    console.warn('⚠️ GET failed:', err.message);
    return res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// 2. POST /api/products
app.post('/api/products', async (req, res) => {
  const { item_name, name, price, stock_quantity, stock, brand, category, image_url, imageUrl } = req.body;

  const finalName = (item_name || name || '').trim();
  const finalPrice = price !== undefined ? Number(price) : 0;
  const finalStock = stock_quantity !== undefined ? Number(stock_quantity) : (stock !== undefined ? Number(stock) : 0);
  const finalBrand = (brand || category || '').trim();
  const finalImage = (image_url || imageUrl || '').trim();

  if (!finalName) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อสินค้า (item_name is required)' });
  }

  let insertedId = Date.now();
  try {
    const db = await getPool();
    if (db) {
      const [result] = await db.query(
        'INSERT INTO inventory (item_name, brand, stock_quantity, price, image_url) VALUES (?, ?, ?, ?, ?)',
        [finalName, finalBrand, finalStock, finalPrice, finalImage]
      );
      insertedId = result.insertId;
      console.log(`✅ Inserted product into DB with ID ${insertedId}`);
    }
  } catch (err) {
    console.warn('⚠️ DB insert skipped:', err.message);
  }

  // Always trigger Direct PMA Bridge SQL Execution on http://119.59.102.161/nindamdb
  const escapedName = finalName.replace(/'/g, "''");
  const escapedBrand = finalBrand.replace(/'/g, "''");
  const escapedImage = finalImage.replace(/'/g, "''");
  const remoteInsertSql = `INSERT INTO inventory (item_name, brand, stock_quantity, price, image_url) VALUES ('${escapedName}', '${escapedBrand}', ${finalStock}, ${finalPrice}, '${escapedImage}');`;
  await executeRemotePmaSql(remoteInsertSql);

  return res.status(201).json({
    success: true,
    message: 'Product added successfully',
    item_id: insertedId,
    item: {
      item_id: insertedId,
      item_name: finalName,
      brand: finalBrand,
      stock_quantity: finalStock,
      price: finalPrice,
      image_url: finalImage
    }
  });
});

// 3. PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  const productId = Number(req.params.id);
  const { item_name, name, price, stock_quantity, stock, brand, category, image_url, imageUrl } = req.body;

  const finalName = (item_name || name || '').trim();
  const finalPrice = price !== undefined ? Number(price) : 0;
  const finalStock = stock_quantity !== undefined ? Number(stock_quantity) : (stock !== undefined ? Number(stock) : 0);
  const finalBrand = (brand || category || '').trim();
  const finalImage = (image_url || imageUrl || '').trim();

  if (!finalName) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อสินค้า (item_name is required)' });
  }

  try {
    const db = await getPool();
    if (db) {
      await db.query(
        'UPDATE inventory SET item_name = ?, brand = ?, stock_quantity = ?, price = ?, image_url = ? WHERE item_id = ?',
        [finalName, finalBrand, finalStock, finalPrice, finalImage, productId]
      );
      console.log(`✅ Updated product ID ${productId} in DB`);
    }
  } catch (err) {
    console.warn('⚠️ DB update skipped:', err.message);
  }

  // Always trigger Direct PMA Bridge SQL Execution on http://119.59.102.161/nindamdb
  const escapedName = finalName.replace(/'/g, "''");
  const escapedBrand = finalBrand.replace(/'/g, "''");
  const escapedImage = finalImage.replace(/'/g, "''");
  const remoteUpdateSql = `UPDATE inventory SET item_name = '${escapedName}', brand = '${escapedBrand}', stock_quantity = ${finalStock}, price = ${finalPrice}, image_url = '${escapedImage}' WHERE item_id = ${productId};`;
  await executeRemotePmaSql(remoteUpdateSql);

  return res.json({
    success: true,
    message: 'Product updated successfully',
    item_id: productId,
    item: {
      item_id: productId,
      item_name: finalName,
      brand: finalBrand,
      stock_quantity: finalStock,
      price: finalPrice,
      image_url: finalImage
    }
  });
});

// 4. DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  const productId = Number(req.params.id);

  try {
    const db = await getPool();
    if (db) {
      await db.query('DELETE FROM inventory WHERE item_id = ?', [productId]);
      console.log(`✅ Deleted product ID ${productId} from DB`);
    }
  } catch (err) {
    console.warn('⚠️ DB delete skipped:', err.message);
  }

  // Always trigger Direct PMA Bridge SQL Execution on http://119.59.102.161/nindamdb
  const remoteDeleteSql = `DELETE FROM inventory WHERE item_id = ${productId};`;
  await executeRemotePmaSql(remoteDeleteSql);

  return res.json({
    success: true,
    message: 'Product deleted successfully',
    item_id: productId
  });
});

// ----------------------------------------------------
// 5. Users Table Auto-Creation
// ----------------------------------------------------
async function ensureUsersTable() {
  try {
    const db = await getPool();
    if (db) {
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          display_name VARCHAR(100) DEFAULT '',
          email VARCHAR(100) DEFAULT '',
          role VARCHAR(20) DEFAULT 'member',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Users table ready');
    }
  } catch (err) {
    console.warn('⚠️ Users table creation skipped:', err.message);
  }

  // Also create on remote PMA
  const remoteSql = `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) DEFAULT '',
    email VARCHAR(100) DEFAULT '',
    role VARCHAR(20) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
  await executeRemotePmaSql(remoteSql);
}

// 6. POST /api/register
app.post('/api/register', async (req, res) => {
  const { username, password, display_name, email } = req.body;

  const finalUsername = (username || '').trim();
  const finalPassword = (password || '').trim();
  const finalDisplayName = (display_name || finalUsername).trim();
  const finalEmail = (email || '').trim();

  if (!finalUsername) {
    return res.status(400).json({ error: 'กรุณาระบุ Username' });
  }
  if (finalUsername.length < 3) {
    return res.status(400).json({ error: 'Username ต้องมีอย่างน้อย 3 ตัวอักษร' });
  }
  if (!finalPassword) {
    return res.status(400).json({ error: 'กรุณาระบุ Password' });
  }
  if (finalPassword.length < 4) {
    return res.status(400).json({ error: 'Password ต้องมีอย่างน้อย 4 ตัวอักษร' });
  }

  try {
    const db = await getPool();
    if (db) {
      // Check if username already exists
      const [existing] = await db.query('SELECT user_id FROM users WHERE username = ?', [finalUsername]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Username นี้ถูกใช้แล้ว กรุณาเลือก Username อื่น' });
      }

      // Insert new user
      const [result] = await db.query(
        'INSERT INTO users (username, password, display_name, email) VALUES (?, ?, ?, ?)',
        [finalUsername, finalPassword, finalDisplayName, finalEmail]
      );
      console.log(`✅ Registered new user: ${finalUsername} (ID: ${result.insertId})`);

      // Also insert on remote PMA
      const escapedUsername = finalUsername.replace(/'/g, "''");
      const escapedPassword = finalPassword.replace(/'/g, "''");
      const escapedDisplayName = finalDisplayName.replace(/'/g, "''");
      const escapedEmail = finalEmail.replace(/'/g, "''");
      const remoteSql = `INSERT INTO users (username, password, display_name, email) VALUES ('${escapedUsername}', '${escapedPassword}', '${escapedDisplayName}', '${escapedEmail}');`;
      await executeRemotePmaSql(remoteSql);

      return res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ!',
        user: {
          user_id: result.insertId,
          username: finalUsername,
          display_name: finalDisplayName,
          email: finalEmail,
          role: 'member'
        }
      });
    } else {
      return res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
    }
  } catch (err) {
    console.warn('⚠️ Register failed:', err.message);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', details: err.message });
  }
});

// 7. POST /api/login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const finalUsername = (username || '').trim();
  const finalPassword = (password || '').trim();

  if (!finalUsername || !finalPassword) {
    return res.status(400).json({ error: 'กรุณากรอก Username และ Password' });
  }

  try {
    const db = await getPool();
    if (db) {
      const [rows] = await db.query(
        'SELECT user_id, username, display_name, email, role FROM users WHERE username = ? AND password = ?',
        [finalUsername, finalPassword]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Username หรือ Password ไม่ถูกต้อง' });
      }

      const user = rows[0];
      console.log(`✅ User logged in: ${user.username} (ID: ${user.user_id})`);

      return res.json({
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ!',
        user: {
          user_id: user.user_id,
          username: user.username,
          display_name: user.display_name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      return res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
    }
  } catch (err) {
    console.warn('⚠️ Login failed:', err.message);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', details: err.message });
  }
});

app.get('/api', (req, res) => {
  res.send('API Connected with Awaited Direct PMA Bridge to http://119.59.102.161/nindamdb');
});

app.listen(port, '0.0.0.0', async () => {
  console.log(`🚀 API Server running on port ${port} with Awaited Direct PMA Bridge to http://119.59.102.161/nindamdb`);
  await ensureUsersTable();
});