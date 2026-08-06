const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: '' });
    await conn.query('CREATE DATABASE IF NOT EXISTS `it_std6730202343`;');
    await conn.query('USE `it_std6730202343`;');
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
    await conn.query(`
      INSERT INTO \`inventory\` (\`item_id\`, \`item_name\`, \`brand\`, \`stock_quantity\`, \`price\`, \`image_url\`, \`created_at\`) VALUES
      (4, 'Sauvage Eau de Parfum 100ml', 'Dior', 12, 234.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60', '2026-07-29 18:47:58'),
      (5, 'Bleu de Chanel Eau de Parfum 100ml', 'Chanel', 10, 8000.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60', '2026-07-29 18:47:58'),
      (6, 'Black Opium Eau de Parfum 90ml', 'YSL', 15, 6900.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=60', '2026-07-29 18:47:58'),
      (8, 'Cherry Explosion EDP 100ml', 'Pop Scent', 25, 3800.00, 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&auto=format&fit=crop&q=60', '2026-08-06 13:06:47'),
      (9, 'Cyber Banana Punch 50ml', 'Pop Scent', 18, 2700.00, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60', '2026-08-06 13:06:47'),
      (10, 'Atomic Peach Fizz 90ml', 'Pop Scent', 12, 4100.00, 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&auto=format&fit=crop&q=60', '2026-08-06 13:06:47'),
      (11, 'Matcha Velvet Pop 100ml', 'Pop Scent', 30, 3200.00, 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=500&auto=format&fit=crop&q=60', '2026-08-06 13:06:47'),
      (12, 'Galactic Mint Blast 50ml', 'Pop Scent', 15, 2950.00, 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=60', '2026-08-06 13:06:47');
    `);
    const [rows] = await conn.query('SELECT * FROM inventory ORDER BY item_id ASC;');
    console.log('✅ TABLE inventory SEEDED WITH EXACT 8 ITEMS:', rows.length);
    console.log(rows.map(r => r.item_id + ': ' + r.item_name));
    await conn.end();
  } catch (e) {
    console.error('Seed error:', e.message);
  }
})();
