require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
// Image upload (multer) — stores files on disk under /uploads
// and serves them statically so they can be used as image_url values
// ----------------------------------------------------
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น'));
    }
    cb(null, true);
  },
});

app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพที่อัปโหลด' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(201).json({ success: true, url: fileUrl });
  });
});

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
// Plain array by default (the shop screen's fetchProducts() expects that shape).
// Pass ?page=&limit= to get the paginated envelope instead — { data, meta } —
// same shape as the course's reference API, but with this shop's real fields.
app.get('/api/products', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const db = await getPool();
    if (!db) {
      console.warn('⚠️ Database connection is null, cannot fetch products.');
      return res.status(500).json({ error: 'Database connection failed. Please ensure DB_HOST in .env is correct and accessible.' });
    }

    const [rows] = await db.query('SELECT * FROM inventory ORDER BY item_id DESC');
    console.log(`📦 Fetched ${rows.length} items from database`);

    const wantsPagination = req.query.page !== undefined || req.query.limit !== undefined;
    if (!wantsPagination) {
      return res.json(rows);
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const total = rows.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const start = (page - 1) * limit;
    const data = rows.slice(start, start + limit);

    return res.json({
      source_id: 'pasu-shop',
      data_origin: 'mysql_inventory',
      currency: 'THB',
      data,
      meta: { page, limit, total, totalPages },
    });
  } catch (err) {
    console.warn('⚠️ GET failed:', err.message);
    return res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// 1b. GET /api/products/clusters — K-means (k=3) grouping of products by price
//
// For a single feature, optimal k-means clustering reduces to picking k-1 cut
// points along the sorted values (clusters are always contiguous ranges) — so
// instead of Lloyd's iteration (which needs random/multi-restarts to avoid
// local optima), this solves it exactly via dynamic programming, minimizing
// the same within-cluster sum-of-squares objective as sklearn's KMeans.
// `maxK` also lets the same DP pass serve the elbow curve: dp[j][n] for every
// j from 1..maxK is already computed on the way to solving for `k`, so no
// extra clustering runs are needed to plot inertia vs k.
function kmeans1D(values, k, maxK = k) {
  const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b]);
  const sorted = order.map((i) => values[i]);
  const n = sorted.length;
  const K = Math.min(Math.max(k, maxK), n);
  const targetK = Math.min(k, n);

  const prefixSum = new Array(n + 1).fill(0);
  const prefixSq = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + sorted[i];
    prefixSq[i + 1] = prefixSq[i] + sorted[i] * sorted[i];
  }
  // sum of squared distances to the mean, for sorted[l..r] inclusive
  const segmentCost = (l, r) => {
    const count = r - l + 1;
    const sum = prefixSum[r + 1] - prefixSum[l];
    const sq = prefixSq[r + 1] - prefixSq[l];
    return sq - (sum * sum) / count;
  };

  const dp = Array.from({ length: K + 1 }, () => new Array(n + 1).fill(Infinity));
  const parent = Array.from({ length: K + 1 }, () => new Array(n + 1).fill(0));
  dp[0][0] = 0;
  for (let j = 1; j <= K; j++) {
    for (let i = j; i <= n; i++) {
      for (let m = j - 1; m < i; m++) {
        if (dp[j - 1][m] === Infinity) continue;
        const candidate = dp[j - 1][m] + segmentCost(m, i - 1);
        if (candidate < dp[j][i]) {
          dp[j][i] = candidate;
          parent[j][i] = m;
        }
      }
    }
  }

  // Walk parent pointers back to recover the targetK contiguous segments
  const bounds = [];
  let i = n;
  let j = targetK;
  while (j > 0) {
    const m = parent[j][i];
    bounds.unshift([m, i - 1]);
    i = m;
    j--;
  }

  const assignments = new Array(n);
  const centroids = [];
  bounds.forEach(([l, r], clusterId) => {
    const segLen = r - l + 1;
    const mean = (prefixSum[r + 1] - prefixSum[l]) / segLen;
    centroids.push(mean);
    for (let p = l; p <= r; p++) assignments[p] = clusterId;
  });

  // Map cluster ids back from sorted position to original item order
  const assignmentsByOriginalIndex = new Array(n);
  order.forEach((originalIndex, sortedPos) => {
    assignmentsByOriginalIndex[originalIndex] = assignments[sortedPos];
  });

  // Exact within-cluster sum-of-squares for every j up to maxK — the elbow curve
  const elbow = [];
  for (let kk = 1; kk <= Math.min(maxK, n); kk++) {
    elbow.push({ k: kk, inertia: dp[kk][n] });
  }

  return { assignments: assignmentsByOriginalIndex, centroids, elbow };
}

app.get('/api/products/clusters', async (req, res) => {
  const CLUSTER_LABELS = ['budget', 'mid-range', 'premium'];
  const MAX_ELBOW_K = 9;
  const k = Math.min(Math.max(Number(req.query.k) || 3, 1), CLUSTER_LABELS.length);

  try {
    const db = await getPool();
    if (!db) {
      return res.status(500).json({ error: 'Database connection failed. Please ensure DB_HOST in .env is correct and accessible.' });
    }

    const [rows] = await db.query('SELECT * FROM inventory ORDER BY item_id DESC');
    const items = rows.filter((row) => row.price !== null && row.price !== undefined && !Number.isNaN(Number(row.price)));

    if (items.length === 0) {
      return res.json({ k, products: [], summary: [], elbow: [] });
    }

    const prices = items.map((item) => Number(item.price));
    const { assignments, centroids, elbow } = kmeans1D(prices, k, MAX_ELBOW_K);

    // kmeans1D's clusters are contiguous price ranges built left-to-right, so
    // clusterId 0 is always the lowest-price segment, clusterId 1 the next, etc.
    // — centroids come out ascending already, no re-sort needed to label them.
    const actualK = centroids.length; // may be < k if the catalog has fewer priced items than k
    const products = items.map((item, i) => ({
      ...item,
      cluster: assignments[i],
      cluster_label: CLUSTER_LABELS[assignments[i]],
    }));

    const summary = centroids.map((_, clusterId) => {
      const clusterItems = items.filter((_, i) => assignments[i] === clusterId);
      const clusterPrices = clusterItems.map((item) => Number(item.price));
      const clusterStock = clusterItems.map((item) => Number(item.stock_quantity) || 0);
      return {
        cluster: clusterId,
        cluster_label: CLUSTER_LABELS[clusterId],
        count: clusterPrices.length,
        avg_price: clusterPrices.reduce((sum, p) => sum + p, 0) / clusterPrices.length,
        min_price: Math.min(...clusterPrices),
        max_price: Math.max(...clusterPrices),
        avg_stock: clusterStock.reduce((sum, s) => sum + s, 0) / clusterStock.length,
      };
    });

    return res.json({ k: actualK, products, summary, elbow });
  } catch (err) {
    console.warn('⚠️ Clustering failed:', err.message);
    return res.status(500).json({ error: 'Clustering failed', details: err.message });
  }
});

// 2. POST /api/products
app.post('/api/products', async (req, res) => {
  const { item_name, name, price, stock_quantity, stock, brand, category, image_url, imageUrl, image_path } = req.body;

  const finalName = (item_name || name || '').trim();
  const finalPrice = price !== undefined ? Number(price) : 0;
  const finalStock = stock_quantity !== undefined ? Number(stock_quantity) : (stock !== undefined ? Number(stock) : 0);
  const finalBrand = (brand || category || '').trim();
  const finalImage = (image_url || imageUrl || '').trim();
  const finalImagePath = (image_path || '').trim();

  if (!finalName) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อสินค้า (item_name is required)' });
  }

  let insertedId = Date.now();
  try {
    const db = await getPool();
    if (db) {
      const [result] = await db.query(
        'INSERT INTO inventory (item_name, brand, stock_quantity, price, image_url, image_path) VALUES (?, ?, ?, ?, ?, ?)',
        [finalName, finalBrand, finalStock, finalPrice, finalImage, finalImagePath]
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
  const escapedImagePath = finalImagePath.replace(/'/g, "''");
  const remoteInsertSql = `INSERT INTO inventory (item_name, brand, stock_quantity, price, image_url, image_path) VALUES ('${escapedName}', '${escapedBrand}', ${finalStock}, ${finalPrice}, '${escapedImage}', '${escapedImagePath}');`;
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
      image_url: finalImage,
      image_path: finalImagePath
    }
  });
});

// 3. PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  const productId = Number(req.params.id);
  const { item_name, name, price, stock_quantity, stock, brand, category, image_url, imageUrl, image_path } = req.body;

  const finalName = (item_name || name || '').trim();
  const finalPrice = price !== undefined ? Number(price) : 0;
  const finalStock = stock_quantity !== undefined ? Number(stock_quantity) : (stock !== undefined ? Number(stock) : 0);
  const finalBrand = (brand || category || '').trim();
  const finalImage = (image_url || imageUrl || '').trim();
  const finalImagePath = (image_path || '').trim();

  if (!finalName) {
    return res.status(400).json({ error: 'กรุณาระบุชื่อสินค้า (item_name is required)' });
  }

  try {
    const db = await getPool();
    if (db) {
      await db.query(
        'UPDATE inventory SET item_name = ?, brand = ?, stock_quantity = ?, price = ?, image_url = ?, image_path = ? WHERE item_id = ?',
        [finalName, finalBrand, finalStock, finalPrice, finalImage, finalImagePath, productId]
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
  const escapedImagePath = finalImagePath.replace(/'/g, "''");
  const remoteUpdateSql = `UPDATE inventory SET item_name = '${escapedName}', brand = '${escapedBrand}', stock_quantity = ${finalStock}, price = ${finalPrice}, image_url = '${escapedImage}', image_path = '${escapedImagePath}' WHERE item_id = ${productId};`;
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
      image_url: finalImage,
      image_path: finalImagePath
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