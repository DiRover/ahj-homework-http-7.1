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
    multipart: true,
}));

//посредник обработки options запроса
app.use(async (ctx, next) => {
    //проверяем, есть ли options запрос, если нет, то переходим к другому посреднику
    const origin = ctx.request.get('Origin');

    if (!origin) {
        return await next();
    };

    const headers = { 'Access-Control-Allow-Origin': '*' };

    if (ctx.request.method !== 'OPTIONS') {
        ctx.response.body = tickets;
        ctx.response.set({...headers});
        try {
            return await next();
        } catch (e) {
            e.headers = {...e.headers, ...headers};
            throw e;
        }
    };

    if (ctx.request.get('Access-Control-Request-Method')) {
        ctx.response.set({
        ...headers,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
        ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    };

    ctx.response.status = 204; // No content

    };


    

    
    /*ctx.body = tickets;
    const { method } = ctx.request.querystring;
    switch (method) {
        case 'allTickets':
            ctx.response.body = tickets;
            return;
        // TODO: обработка остальных методов
        default:
            ctx.response.status = 404;
            return;
    }*/
});


const server = http.createServer(app.callback()).listen(port);