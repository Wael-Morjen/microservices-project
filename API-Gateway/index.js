const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// define routes and their ports 
const routes = {
    '/patients': 'http://localhost:5001',
    '/appointements': 'http://localhost:5002',
    '/doctors': 'http://localhost:5000'
};

// create a proxy for each route 
const app = express();
for(const route in routes){
    const target = routes[route];
    app.use(route, createProxyMiddleware({target}));
}

// start the proxy
const PORT = 5003;
app.listen(PORT, () => {
    console.log(`Api-gateway server listening on port ${PORT}`);
}
);
