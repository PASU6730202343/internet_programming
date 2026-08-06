const axios = require('axios').default;
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const { JSDOM } = require('jsdom');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

(async () => {
  try {
    console.log('1. Fetching login page...');
    const getRes = await client.get('http://119.59.102.161/nindamdb/index.php');
    const dom1 = new JSDOM(getRes.data);
    const token = dom1.window.document.querySelector('input[name="token"]').value;

    console.log('2. Logging in...');
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

    console.log('3. Executing SQL...');
    const sqlParams = new URLSearchParams();
    sqlParams.append('db', 'it_std6730202343');
    sqlParams.append('table', 'inventory');
    sqlParams.append('token', sessionToken);
    sqlParams.append('sql_query', "UPDATE inventory SET price = 88888 WHERE item_id = 6;");

    const sqlRes = await client.post('http://119.59.102.161/nindamdb/index.php?route=/database/sql', sqlParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const fs = require('fs');
    fs.writeFileSync('pma-out-update.html', sqlRes.data);
    console.log('SQL RESPONSE LENGTH:', sqlRes.data.length);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
})();
