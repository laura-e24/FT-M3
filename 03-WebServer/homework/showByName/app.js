var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor

http.createServer((req, res) => {

   const images = [
      'arcoiris_doge',
      'badboy_doge',
      'code_doge',
      'resaca_doge',
      'retrato_doge',
      'sexy_doge',
   ]

   images.forEach(i => {
      if (req.url === '/') {
         res.writeHead(200, { 'Content-Type':'text/plan' })
         res.end('Todo joya');
      }
  
    
      else if (req.url === `/${i}`) {
         res.writeHead(200, { 'Content-Type':'image/jpg' })
         var html = fs.readFileSync(__dirname + `/images/${i}.jpg`)
      
         res.end(html);
      }

      else {
         res.writeHead(404);
         res.end();
         return;
      }
  })
}).listen(8000);