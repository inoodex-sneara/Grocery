const https = require('https');
const fs = require('fs');

const url = 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Uncooked_chicken_legs.jpg';

https.get(url, {
  headers: {
    'User-Agent': 'GrocaGroceryShop/1.0 (https://groca.example.com; admin@example.com) Node/22'
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('public/products/test-drumsticks-wiki.jpg');
    res.pipe(file);
    file.on('finish', () => console.log('Successfully downloaded test-drumsticks-wiki.jpg'));
  }
}).on('error', e => console.log(e));

