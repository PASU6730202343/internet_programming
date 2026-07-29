const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
    });
    
    await conn.query("CREATE USER IF NOT EXISTS 'std6730202343'@'%' IDENTIFIED BY 'g3#Vjp8L';");
    await conn.query("GRANT ALL PRIVILEGES ON it_std6730202343.* TO 'std6730202343'@'%';");
    await conn.query("CREATE USER IF NOT EXISTS 'std6730202343'@'localhost' IDENTIFIED BY 'g3#Vjp8L';");
    await conn.query("GRANT ALL PRIVILEGES ON it_std6730202343.* TO 'std6730202343'@'localhost';");
    await conn.query("FLUSH PRIVILEGES;");
    
    console.log('✅ User std6730202343 successfully created in XAMPP MySQL!');
    conn.end();
  } catch (e) {
    console.error('User setup error:', e.message);
  }
})();
