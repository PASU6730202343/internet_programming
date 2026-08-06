const fetch = require('node-fetch');

(async () => {
  try {
    const getRes = await fetch('http://119.59.102.161/nindamdb/index.php');
    const getHtml = await getRes.text();
    const rawCookies = getRes.headers.raw()['set-cookie'] || [];
    const initCookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ');
    const tokenMatch = getHtml.match(/name="token" value="([^"]+)"/);
    const token = tokenMatch ? tokenMatch[1] : '';

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

    const exportParams = new URLSearchParams();
    exportParams.append('db', 'it_std6730202343');
    exportParams.append('table', 'inventory');
    exportParams.append('token', sessionToken);
    exportParams.append('what', 'json');
    exportParams.append('export_type', 'server');

    const exportRes = await fetch('http://119.59.102.161/nindamdb/export.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionCookieHeader
      },
      body: exportParams.toString()
    });

    const exportText = await exportRes.text();
    console.log("EXPORT OUTPUT:");
    console.log(exportText.substring(0, 500));
  } catch (err) {
    console.error(err);
  }
})();
