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
    "name": "Test ticket 1",
    "status": false,
    "description": "This is test ticket 1 description",
    "created": "21.10.2020 22:25"
  },
  {
    "id": "2",
    "name": "Test ticket 2",
    "status": false,
    "description": "This is test ticket 2 description",
    "created": "21.10.2020 22:25"
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

    //добавил чтобы сервер работал на herocu
    if (ctx.request.method === 'OPTIONS') {
        ctx.response.set({...headers});
    }

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

  
    if(reqType === 'GET' && method === 'allTicket') {
      ctx.response.body = tickets;
      return;
    }
  
    if (reqType === 'POST') {
      //tickets.push(ctx.request.body);
      const reqBody = {};
      const date = new Date();
      const time = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
      reqBody['id'] = uuid.v1();
      reqBody['name'] = ctx.request.body.name;
      reqBody['status'] = false;
      reqBody['description'] = ctx.request.body.description;
      reqBody['created'] = time;
      tickets.push(reqBody);
      ctx.response.body = 'New ticket was added!';
      ctx.response.body = tickets;
      console.log(tickets);
      return
    }
  
    if (reqType === 'PATCH') {
      //при помощи деструктуризации записываем в переменные пришедший запрос
      const { id, method, name, description, status } = ctx.request.body;

      if (method === 'deleteTicket') {
        tickets = tickets.filter((ticket) => ticket.id !== id);
        ctx.response.body = 'Ticket was deleted!';
        ctx.response.body = tickets;
        return
      }
  
      if (method === 'editTicket') {
        //const filtered = tickets.filter((ticket) => ticket.id === id)[0];      
        //filtered.name = name;
        //filtered.description = description;
        tickets = tickets.map((ticket) => {
          if (ticket.id === id) {
            ticket.name = name;
            ticket.description = description;
          };
          return ticket;
        })      
        ctx.response.body = tickets;
        return
      }
  
      if (method === 'checkTicket') {
        tickets = tickets.map((ticket) => {
          if (ticket.id === id) {
            ticket.status = status;
          };
          return ticket;
        })      
        ctx.response.body = tickets;
        return
        
        
        //const filtered = tickets.filter((ticket) => ticket.id === id)[0];      
        
        //filtered.status = JSON.parse(status);
        
        //ctx.response.body = filtered.status;
        return
      }     
    }
  });
  
const server = http.createServer(app.callback()).listen(port);