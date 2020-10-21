const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');
const app = new Koa();
const port = process.env.PORT || 7070;

let tickets = [{
    "id": "1",
    "name": "Name 1",
    "status": "false",
    "description": "Name 1 test",
    "created": "21.10.20 22:25"
  },
  {
    "id": "2",
    "name": "Name 2",
    "status": "true",
    "description": "Name 2 test",
    "created": "21.10.20 22:255"
}];

app.use(koaBody({
    urlencoded: true,
}));

app.use(async ctx => {
    const { method } = ctx.request.querystring;

    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }
});

const server = http.createServer(app.callback()).listen(port);