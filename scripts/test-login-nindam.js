(async () => {
  try {
    const loginRes = await fetch('http://119.59.102.161/std6730202343/nindam/login/login_action.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'username=admin&password=admin1234',
      redirect: 'manual'
    });

    const cookie = loginRes.headers.get('set-cookie');

    const listRes = await fetch('http://119.59.102.161/std6730202343/nindam/views/list.php', {
      headers: {
        'Cookie': cookie || ''
      }
    });

    const html = await listRes.text();
    console.log('--- NINDAM PASU STORE FULL HTML ---');
    console.log(html);
  } catch (e) {
    console.error('Login error:', e);
  }
})();
