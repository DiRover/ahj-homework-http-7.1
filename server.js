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
    "name": "Asshole",
    "status": "false",
    "description": "Maybe you a asshole",
    "created": "21.10.20 22:25"
  },
  {
    "id": "2",
    "name": "Redneck",
    "status": "true",
    "description": "Pathetic redneck",
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

app.use(async (ctx) => { 
    const { method } = ctx.request.query;
    const reqType = ctx.request.method;
    console.log(method);
    console.log(reqType);
  
    if(reqType === 'GET' && method === 'allTicket') {
      ctx.response.body = tickets;
      return;
    }
  
    if (reqType === 'POST') {
      tickets.push(ctx.request.body);
      ctx.response.body = 'New ticket was added!';
      return
    }
  
    if (reqType === 'PATCH') {
      const { id, method, name, description, status } = ctx.request.body;
      
      if (method === 'deleteTicket') {
        tickets = tickets.filter((ticket) => ticket.id !== id);
        ctx.response.body = 'Ticket was deleted!';
        return
      }
  
      if (method === 'editTicket') {
        const filtered = tickets.filter((ticket) => ticket.id === id)[0];      
        filtered.name = name;
        filtered.description = description;      
        
        ctx.response.body = {text: 'Ticket was edited!', data: filtered};
        return
      }
  
      if (method === 'checkTicket') {
        const filtered = tickets.filter((ticket) => ticket.id === id)[0];      
        
        filtered.status = JSON.parse(status);
        
        ctx.response.body = filtered.status;
        return
      }     
    }
  });
  

const server = http.createServer(app.callback()).listen(port);