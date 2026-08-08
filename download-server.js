const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/download') {
    const filePath = path.join(__dirname, 'svg-logo-library.zip');
    const stat = fs.statSync(filePath);
    
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=svg-logo-library.zip',
      'Content-Length': stat.size
    });
    
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>SVG Logo Library Download</h1><p><a href="/download">Click here to download the zip package</a></p>');
  }
});

const port = 3002;
server.listen(port, () => {
  console.log(`Download server running at http://localhost:${port}`);
  console.log(`Download link: http://localhost:${port}/download`);
});
