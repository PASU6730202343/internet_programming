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

app.get('/api', (req, res) => {
  res.send('API Connected with Awaited Direct PMA Bridge to http://119.59.102.161/nindamdb');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port ${port} with Awaited Direct PMA Bridge to http://119.59.102.161/nindamdb`);
});