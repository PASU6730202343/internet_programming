const { spawn } = require('child_process');
const mysql = require('mysql2/promise');

async function testRealtimeTunnel() {
  console.log('1. Starting background SSH Tunnel on port 3307...');
  const tunnel = spawn('C:\\Program Files\\PuTTY\\plink.exe', [
    '-P', '2222',
    '-ssh',
    '-pw', 'g3#Vjp8L',
    '-L', '3307:127.0.0.1:3306',
    'std6730202343@119.59.102.161',
    '-N'
  ]);

  tunnel.stderr.on('data', d => console.log('Tunnel log:', d.toString().trim()));

  // Wait 3 seconds for tunnel to be established
  await new Promise(r => setTimeout(r, 3000));

  try {
    console.log('2. Connecting mysql2 to 127.0.0.1:3307...');
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'std6730202343',
      password: 'g3#Vjp8L',
      database: 'it_std6730202343'
    });

    console.log('🎉 CONNECTED SUCCESSFULLY TO REMOTE MYSQL ON 119.59.102.161!');

    console.log('3. Updating item 12 price to 12345.00 in real time on 119.59.102.161...');
    const [result] = await conn.query('UPDATE inventory SET price = 12345.00, stock_quantity = 99 WHERE item_id = 12;');
    console.log('Update Affected Rows:', result.affectedRows);

    const [rows] = await conn.query('SELECT item_id, item_name, price, stock_quantity FROM inventory WHERE item_id = 12;');
    console.log('Live Remote DB Data:', rows);

    await conn.end();
  } catch (e) {
    console.error('Connection error:', e.message);
  } finally {
    tunnel.kill();
  }
}

testRealtimeTunnel();
