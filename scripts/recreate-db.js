const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '' });
    
    console.log('1. Creating database it_std6730202343...');
    await conn.query('CREATE DATABASE IF NOT EXISTS `it_std6730202343` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;');
    await conn.query('USE `it_std6730202343`;');
    
    console.log('2. Re-creating table inventory...');
    await conn.query('DROP TABLE IF EXISTS `inventory`;');
    await conn.query(`
      CREATE TABLE \`inventory\` (
        \`item_id\` int(11) NOT NULL AUTO_INCREMENT,
        \`item_name\` varchar(255) NOT NULL,
        \`brand\` varchar(100) DEFAULT NULL,
        \`stock_quantity\` int(11) DEFAULT 0,
        \`price\` decimal(10,2) DEFAULT 0.00,
        \`image_url\` text DEFAULT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (\`item_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('3. Inserting fresh sample products...');
    await conn.query(`
      INSERT INTO \`inventory\` (\`item_id\`, \`item_name\`, \`brand\`, \`stock_quantity\`, \`price\`, \`image_url\`) VALUES
      (4, 'Sauvage Eau de Parfum 100ml', 'Dior', 12, 6250.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60'),
      (5, 'Bleu de Chanel Parfum 100ml', 'Chanel', 8, 7500.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60'),
      (6, 'Black Opium Eau de Parfum 90ml', 'YSL', 15, 6900.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=60');
    `);

    console.log('4. Granting privileges to user std6730202343...');
    await conn.query("CREATE USER IF NOT EXISTS 'std6730202343'@'%' IDENTIFIED BY 'g3#Vjp8L';");
    await conn.query("GRANT ALL PRIVILEGES ON `it_std6730202343`.* TO 'std6730202343'@'%';");
    await conn.query("CREATE USER IF NOT EXISTS 'std6730202343'@'localhost' IDENTIFIED BY 'g3#Vjp8L';");
    await conn.query("GRANT ALL PRIVILEGES ON `it_std6730202343`.* TO 'std6730202343'@'localhost';");
    await conn.query("FLUSH PRIVILEGES;");

    console.log('✅ TABLE & DATABASE RECREATED SUCCESSFULLY!');
    await conn.end();
  } catch (e) {
    console.error('❌ RECREATE FAILED:', e.message);
  }
})();
