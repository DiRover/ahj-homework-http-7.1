const http = require('http');


const server = http.createServer((req, res) => {
console.log(req);
res.end('server response');
});
const port = 3000;

server.listen(port, () => {
console.log(`server is listening on ${port}`);
});