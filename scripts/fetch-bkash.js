const https = require('https');
const fs = require('fs');

const url = 'https://bn.wikipedia.org/wiki/%E0%A6%9A%E0%A6%BF%E0%A6%A4%E0%A7%8D%E0%A6%B0:%E0%A6%AC%E0%A6%BF%E0%A6%95%E0%A6%BE%E0%A6%B6%E0%A7%8F%E0%A6%B0_%E0%A6%B2%E0%A7%8B%E0%A6%97%E0%A7%8B.svg';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/https:\/\/upload\.wikimedia\.org\/wikipedia\/bn\/[^\s"']+\.svg/gi);
    console.log('Matches:', matches);
    if (matches && matches[0]) {
      // Download the svg
      https.get(matches[0], { headers: { 'User-Agent': 'Mozilla/5.0' } }, (svgRes) => {
        let svgData = '';
        svgRes.on('data', c => svgData += c);
        svgRes.on('end', () => {
          fs.writeFileSync('public/bkash.svg', svgData);
          console.log('Saved public/bkash.svg successfully, size:', svgData.length);
        });
      });
    }
  });
}).on('error', err => console.log('Err:', err.message));
