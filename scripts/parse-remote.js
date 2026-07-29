const fetchRemoteProducts = async () => {
  try {
    const res = await fetch('http://119.59.102.161/std6730202343/lab8/views/list.php');
    const html = await res.text();
    const rows = [];
    const trRegex = /<tr>([\s\S]*?)<\/tr>/g;
    let match;
    let index = 1;
    while ((match = trRegex.exec(html)) !== null) {
      const tr = match[1];
      const imgMatch = tr.match(/src="([^"]+)"/);
      const nameMatch = tr.match(/style="text-align:left;">([\s\S]*?)<\/td>/);
      const priceMatch = tr.match(/color:#10b981;">([\s\S]*?)<\/td>/);
      const idMatch = tr.match(/id=(\d+)/);
      if (nameMatch && priceMatch) {
        rows.push({
          item_id: idMatch ? parseInt(idMatch[1]) : index++,
          item_name: nameMatch[1].trim(),
          price: parseFloat(priceMatch[1].replace(/,/g, '').trim()),
          brand: 'Database Item',
          stock_quantity: 10,
          image_url: imgMatch ? 'http://119.59.102.161/std6730202343/lab8/' + imgMatch[1].replace('../', '') : ''
        });
      }
    }
    return rows;
  } catch (err) {
    console.error('Remote fetch error:', err);
    return null;
  }
};

fetchRemoteProducts().then(rows => console.log('EXTRACTED REMOTE LIVE PRODUCTS:', JSON.stringify(rows, null, 2)));
