const https = require('https');
https.get('https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    console.log("Total lines:", lines.length);
    console.log("Header:", lines[0]);
    console.log("Row 1:", lines[1]);
    console.log("Row 2:", lines[2]);
  });
});
