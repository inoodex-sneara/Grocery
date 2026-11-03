const https = require('https');
const fs = require('fs');

const items = [
  { name: 'chicken-legs.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Uncooked_chicken_legs.jpg' },
  { name: 'chicken-breasts.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Chicken_breasts-01.jpg' },
  { name: 'kycklingfile.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Kycklingfil%C3%A9.jpg' },
  { name: 'raw-steak.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Raw_steak.jpg' },
  { name: 'brown-eggs.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Brown_eggs.jpg' },
  { name: 'eggs-carton.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Eggs_in_carton.jpg' },
  { name: '6-pack-eggs.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/6-Pack-Chicken-Eggs.jpg' },
];

function download(item) {
  return new Promise((resolve) => {
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          const file = fs.createWriteStream('public/products/' + item.name);
          res2.pipe(file);
          file.on('finish', () => { file.close(); console.log('Downloaded redirected:', item.name); resolve(); });
        });
        return;
      }
      const file = fs.createWriteStream('public/products/' + item.name);
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log('Downloaded:', item.name); resolve(); });
    }).on('error', (err) => {
      console.log('Error downloading', item.name, err.message);
      resolve();
    });
  });
}

(async () => {
  for (const item of items) {
    await download(item);
  }
})();

