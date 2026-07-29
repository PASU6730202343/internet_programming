let cachedSessionCookie = null;

const fetchNindamLiveInventory = async () => {
  try {
    if (!cachedSessionCookie) {
      const loginRes = await fetch('http://119.59.102.161/std6730202343/nindam/login/login_action.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'username=admin&password=admin1234',
        redirect: 'manual'
      });
      cachedSessionCookie = loginRes.headers.get('set-cookie') || '';
    }

    const listRes = await fetch('http://119.59.102.161/std6730202343/nindam/views/list.php', {
      headers: { 'Cookie': cachedSessionCookie }
    });

    const html = await listRes.text();
    const rows = [];
    const cardRegex = /<div class="product-card">([\s\S]*?)<\/div>\s*<\/div>/g;
    let match;
    while ((match = cardRegex.exec(html)) !== null) {
      const card = match[1];
      const nameMatch = card.match(/<div class="product-name">([\s\S]*?)<\/div>/);
      const priceMatch = card.match(/<div class="product-price">([\s\S]*?)</);
      const detailMatch = card.match(/<div class="product-detail">([\s\S]*?)<\/div>/);
      const imgMatch = card.match(/src="([^"]+)"/);
      const idMatch = card.match(/edit\.php\?id=(\d+)/);

      if (nameMatch) {
        rows.push({
          item_id: idMatch ? parseInt(idMatch[1]) : rows.length + 1,
          item_name: nameMatch[1].trim(),
          price: priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '').trim()) : 0,
          brand: detailMatch ? detailMatch[1].trim() : 'Inventory',
          stock_quantity: 10,
          image_url: imgMatch ? 'http://119.59.102.161/std6730202343/nindam/' + imgMatch[1].replace('../', '') : ''
        });
      }
    }
    return rows;
  } catch (err) {
    cachedSessionCookie = null;
    console.error('Nindam fetch err:', err);
    return null;
  }
};

fetchNindamLiveInventory().then(rows => console.log('EXTRACTED LIVE INVENTORY FROM NINDAMDB:', JSON.stringify(rows, null, 2)));
