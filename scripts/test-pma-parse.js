const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

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

    const sqlParams = new URLSearchParams();
    sqlParams.append('db', 'it_std6730202343');
    sqlParams.append('table', 'inventory');
    sqlParams.append('token', sessionToken);
    sqlParams.append('sql_query', 'SELECT * FROM inventory ORDER BY item_id DESC LIMIT 100');

    const sqlRes = await fetch('http://119.59.102.161/nindamdb/index.php?route=/database/sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': sessionCookieHeader
      },
      body: sqlParams.toString()
    });

    const sqlHtml = await sqlRes.text();
    
    // Parse using JSDOM
    const dom = new JSDOM(sqlHtml);
    const document = dom.window.document;
    const table = document.querySelector('table.table_results');
    
    if (!table) {
      console.log('No table found in HTML response');
      return;
    }
    
    const headers = Array.from(table.querySelectorAll('thead th[data-column]')).map(th => th.textContent.trim());
    console.log("Headers:", headers);
    
    const rows = [];
    const trs = table.querySelectorAll('tbody tr');
    trs.forEach(tr => {
      const tds = tr.querySelectorAll('td.text-nowrap, td.data');
      if (tds.length === 0) return;
      
      const rowData = {};
      let colIdx = 0;
      
      // Some tds might have classes like text-nowrap, we need to extract actual values
      tds.forEach((td, idx) => {
        // Exclude checkbox and edit/delete icons which usually don't have data-column or are empty
        if (td.classList.contains('text-center') && td.querySelector('input[type=checkbox]')) return;
        
        // Find the actual text content inside spans if any
        let val = td.textContent.trim();
        // PMA often outputs NULL as <i>NULL</i>
        if (td.querySelector('i') && td.querySelector('i').textContent === 'NULL') val = null;
        
        if (headers[colIdx]) {
           rowData[headers[colIdx]] = val;
           colIdx++;
        }
      });
      if (Object.keys(rowData).length > 0) {
        rows.push(rowData);
      }
    });
    
    console.log("Parsed Rows:", rows.slice(0, 2));

  } catch (err) {
    console.error(err);
  }
})();
