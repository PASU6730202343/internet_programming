const fetch = require('node-fetch');

(async () => {
  try {
    console.log('1. Fetching PMA login page...');
    const getRes = await fetch('http://119.59.102.161/nindamdb/index.php');
    const getHtml = await getRes.text();
    const rawCookies = getRes.headers.raw()['set-cookie'] || [];
    const initCookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ');
    const tokenMatch = getHtml.match(/name="token" value="([^"]+)"/);
    const token = tokenMatch ? tokenMatch[1] : '';

    console.log('2. Logging in with token:', token);
    const loginParams = new URLSearchParams();
    loginParams.append('pma_username', 'std6730202343');
    loginParams.append('pma_password', 'g3#Vjp8L');
    loginParams.append('server', '1');
    loginParams.append('target', 'index.php');
    loginParams.append('token', token);

    const loginRes = await fetch('http://119.59.102.161/nindamdb/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': initCookieHeader
      },
      body: loginParams.toString()
    });

    const loginRawCookies = loginRes.headers.raw()['set-cookie'] || rawCookies;
    const sessionCookieHeader = loginRawCookies.map(c => c.split(';')[0]).join('; ');
    const loginHtml = await loginRes.text();

    const sessionTokenMatch = loginHtml.match(/name="token" value="([^"]+)"/) || loginHtml.match(/token=([a-f0-9]{32})/);
    const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : token;

    console.log('3. Executing test query SELECT * FROM inventory...');
    const sqlParams = new URLSearchParams();
    sqlParams.append('db', 'it_std6730202343');
    sqlParams.append('table', 'inventory');
    sqlParams.append('token', sessionToken);
    sqlParams.append('sql_query', 'SELECT * FROM inventory');

    const sqlRes = await fetch('http://119.59.102.161/nindamdb/index.php?route=/database/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionCookieHeader
      },
      body: sqlParams.toString()
    });

    console.log('PMA SQL STATUS:', sqlRes.status);
    const sqlHtml = await sqlRes.text();
    console.log('PMA SQL CONTAINS INVENTORY?:', sqlHtml.includes('inventory'));
  } catch (err) {
    console.error('ERROR:', err.message);
  }
})();
