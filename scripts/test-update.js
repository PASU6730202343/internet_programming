const fetch = require('node-fetch');

(async () => {
  try {
    console.log('1. Fetching login...');
    const getRes = await fetch('http://119.59.102.161/nindamdb/index.php');
    const getHtml = await getRes.text();
    const rawCookies1 = getRes.headers.raw()['set-cookie'] || [];
    const initCookies = rawCookies1.map(c => c.split(';')[0]).join('; ');
    const tokenMatch = getHtml.match(/name="token" value="([^"]+)"/);
    const token = tokenMatch ? tokenMatch[1] : '';

    console.log('2. Logging in...');
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
        'Cookie': initCookies
      },
      body: loginParams.toString()
    });

    const rawCookies2 = loginRes.headers.raw()['set-cookie'] || [];
    const sessionCookies = rawCookies2.length > 0 ? rawCookies2.map(c => c.split(';')[0]).join('; ') : initCookies;
    const loginHtml = await loginRes.text();
    const sessionTokenMatch = loginHtml.match(/name="token" value="([^"]+)"/) || loginHtml.match(/token=([a-f0-9]{32})/);
    const sessionToken = sessionTokenMatch ? sessionTokenMatch[1] : token;

    console.log('3. Sending UPDATE...');
    const sqlParams = new URLSearchParams();
    sqlParams.append('db', 'it_std6730202343');
    sqlParams.append('table', 'inventory');
    sqlParams.append('token', sessionToken);
    sqlParams.append('sql_query', "UPDATE inventory SET price = 50000 WHERE item_id = 6;");

    const sqlRes = await fetch('http://119.59.102.161/nindamdb/index.php?route=/database/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionCookies
      },
      body: sqlParams.toString()
    });

    const sqlHtml = await sqlRes.text();
    console.log('SQL RESPONSE:', sqlHtml);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
})();
